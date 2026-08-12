# 07. I/O and files

I/O crosses from a Hara program into its host environment. File operations are effects, require authority, use bytes, and return promises.

The file namespace can exist even when the runtime does not grant file access.

The runnable examples on this page share one lesson session. Work from top to
bottom when an example uses an earlier definition, and reload the page to start
with a clean session. File reads and writes remain static because this browser
session does not grant or seed the file authority used by those examples.

## Learning goals

By the end of this lesson, you can:

1. Explain why file access is a capability.
2. Resolve a child path beneath an allowed root.
3. Read a file as bytes.
4. Decode file bytes as UTF-8 text.
5. Transform text without I/O.
6. Encode and write output bytes.
7. Compose file operations with promises.
8. Keep errors and cleanup at an explicit boundary.

## I/O is an effect

A pure function returns a value from its arguments:

```hara eval group=hal-intro-07
(defn normalize-line [line]
  (str/lower (str/trim line)))
```

A file operation asks the host environment to read or change an external resource:

```hara
(file/read "data/input.txt")
```

The file can change without the Hara source changing. The operation can also fail because of authority, availability, path, or host errors.

Keep pure transformation and I/O in separate functions.

## File access needs authority

The `file/` alias is available by default. Availability does not grant authority.

A file call can fail because:

- the embedding runtime does not support file I/O;
- the runtime did not grant file authority;
- the path is outside the allowed boundary;
- the file does not exist;
- the host rejects the operation.

The native CLI grants file authority explicitly with `--allow-file`. A JVM embedding grants authority through Graal `IOAccess`.

Do not treat a missing capability as a missing namespace.

## Resolve paths beneath a root

Use `file/resolve` to resolve a child path beneath a supplied root:

```hara eval group=hal-intro-07
(def project-root ".")

(def input-path
  (file/resolve project-root "data/input.txt"))

(def output-path
  (file/resolve project-root "data/output.txt"))
```

The result is a normalized path string.

Keep the root and child path separate in configuration:

```hara eval group=hal-intro-07
(def file-config
  {:file/root "."
   :file/input "data/input.txt"
   :file/output "data/output.txt"})
```

Resolve paths at the I/O boundary:

```hara eval group=hal-intro-07
(defn input-path [config]
  (file/resolve
    (:file/root config)
    (:file/input config)))
```

This makes the path authority boundary visible.

## Read a file

`file/read` returns a promise that settles with bytes:

```hara
(def input-promise
  (file/read input-path))
```

The immediate result is a promise, not file contents.

Transform the settled bytes with `promise/then`:

```hara
(def text-promise
  (promise/then
    input-promise
    (fn [input-bytes]
      (str/decode-utf8 input-bytes))))
```

The decode step belongs after the file bytes arrive.

## Inspect a result in the REPL

A Hara promise supports dereference in environments where blocking inspection is appropriate:

```hara
(deref text-promise)
```

Use blocking dereference for small REPL experiments and tests. Do not make it the default architecture for event-loop or interactive code.

Use promise composition in application code.

## Split text into lines

Keep line parsing pure:

```hara eval group=hal-intro-07
(defn text-lines [text]
  (str/split-lines text))
```

Build a line pipeline:

```hara
(defn transformed-lines [text]
  (->> (text-lines text)
       (filter non-empty-line?)
       (map normalize-line)))
```

Serialize the complete result:

```hara eval group=hal-intro-07
(defn lines->text [lines]
  (str (str/join "\n" lines) "\n"))
```

The trailing newline is an output-format decision. Keep it in the serializer.

## Transform file bytes without I/O

Create one pure bytes-to-bytes function:

```hara
(defn transform-document-bytes [input-bytes]
  (-> input-bytes
      (str/decode-utf8)
      (transformed-lines)
      (lines->text)
      (str/encode-utf8)))
```

This function can be tested with in-memory values:

```hara
(def sample-input
  (str/encode-utf8 " Alpha \n\n Beta \n"))

(str/decode-utf8
  (transform-document-bytes sample-input))
; => "alpha\nbeta\n"
```

No file authority is required for this test.

## Write a file

`file/write` accepts bytes and returns a promise:

```hara
(def output-bytes
  (str/encode-utf8 "alpha\nbeta\n"))

(def write-promise
  (file/write output-path output-bytes))
```

Do not pass a string directly. Encode the text first.

Use `promise/then` to handle successful completion:

```hara
(promise/then
  write-promise
  (fn [result]
    {:write/status :status/complete
     :write/result result}))
```

Use the actual file contract for the precise write result. Do not assume that it returns the bytes value.

## Compose read, transform, and write

Build one promise chain:

```hara
(defn transform-file [input-path output-path]
  (promise/then
    (file/read input-path)
    (fn [input-bytes]
      (file/write
        output-path
        (transform-document-bytes input-bytes)))))
```

The callback returns the write promise. Promise adoption makes the returned chain wait for the write operation.

The control flow is:

```text
read promise
-> input bytes
-> pure transformation
-> output bytes
-> write promise
-> write result
```

## Record progress in the atom

Keep state updates at the I/O boundary:

```hara
(defn start-file-run! []
  (reset! run initial-run)
  (swap! run start-run))

(defn complete-file-run! []
  (swap! run finish-run))

(defn fail-file-run! [error]
  (swap! run
    (fn [state]
      (assoc state
             :run/status :status/failed
             :run/error error))))
```

Wrap the file chain:

```hara
(defn run-file! [input-path output-path]
  (start-file-run!)
  (-> (transform-file input-path output-path)
      (promise/then
        (fn [result]
          (complete-file-run!)
          result))
      (promise/catch
        (fn [error]
          (fail-file-run! error)
          (throw error)))))
```

The pure transformation still has no knowledge of the atom.

## Cleanup with `promise/finally`

Use `promise/finally` for state or resource cleanup that must run after either outcome:

```hara
(defn run-file-with-cleanup! [input-path output-path]
  (promise/finally
    (run-file! input-path output-path)
    (fn []
      (swap! run assoc :run/current nil))))
```

Do not use `finally` to hide the original failure.

## Use a coroutine for sequential async workflow

A coroutine can express a sequence of promise waits:

```hara
(ns intro.file-workflow
  (:require [std.foundation.coroutine :as coroutine]))

(defn make-file-worker [input-path output-path]
  (coroutine/create
    (fn []
      (let [input-bytes
            (coroutine/await
              (file/read input-path))]
        (coroutine/yield
          {:phase :phase/read
           :bytes (bytes/count input-bytes)})
        (let [output-bytes
              (transform-document-bytes input-bytes)]
          (coroutine/await
            (file/write output-path output-bytes))
          {:phase :phase/complete
           :bytes (bytes/count output-bytes)})))))
```

The coroutine makes each await point explicit. The promise chain remains the simpler choice for a short read-transform-write flow.

Use the coroutine when the workflow must pause, expose intermediate values, and resume through several stages.

## File I/O is byte-oriented

The current file boundary reads and writes bytes.

This design avoids hidden text assumptions:

- a text program chooses UTF-8 decoding;
- a binary program keeps bytes;
- a protocol parser can inspect exact byte values;
- a writer chooses the serialized format before the host call.

Do not decode a binary file merely because the file API returned bytes.

## Streaming and whole-file I/O

The iterator lesson introduced demand-driven processing. The basic `file/read` operation returns the file bytes through one promise.

For a small file, whole-file processing is direct:

```text
read all bytes -> transform -> write all bytes
```

For a large or continuous source, use a provider that exposes chunks or an iterator. Keep the same design:

```text
resource-backed iterator
-> bounded transforms
-> explicit consumer
-> explicit close
```

Do not claim that whole-file `file/read` is streaming.

## Complete the course project

Create configuration:

```hara eval group=hal-intro-07
(def config
  {:file/root "."
   :file/input "data/input.txt"
   :file/output "data/output.txt"})
```

Resolve both paths:

```hara eval group=hal-intro-07
(def resolved-input
  (file/resolve
    (:file/root config)
    (:file/input config)))

(def resolved-output
  (file/resolve
    (:file/root config)
    (:file/output config)))
```

Start the operation:

```hara
(def operation
  (run-file-with-cleanup!
    resolved-input
    resolved-output))
```

Inspect the returned promise and run state:

```hara
operation
@run
```

When blocking inspection is suitable:

```hara
(deref operation)
@run
```

## Practice loop

1. Transform sample bytes without file access.
2. Predict the output text.
3. Resolve a path beneath a test root.
4. Run a read with file authority disabled and inspect the error.
5. Grant file authority in the runtime.
6. Run the file pipeline.
7. Inspect the output bytes and run state.
8. Change the pure transformation and run it again.

## Common mistakes

### Assuming namespace access grants file authority

The `file/` alias can exist while calls remain denied.

### Passing text directly to `file/write`

Encode the text as bytes.

### Decoding every file

Decode only when the file contract identifies text.

### Blocking on every promise

Use `deref` for controlled REPL or test inspection. Compose promises in application code.

### Mixing transformation with path access

Keep bytes-to-bytes or text-to-text rules pure.

### Calling whole-file reads streaming

A promise-based whole-file result is asynchronous, but it is not a chunk stream.

## Check yourself

You have completed the tutorial when you can answer these questions:

1. Why can `file/read` fail when `file/` exists?
2. What does `file/resolve` make explicit?
3. Which value type does `file/read` produce through its promise?
4. Where should UTF-8 decoding occur?
5. Why should document transformation remain pure?
6. How does a returned write promise extend a promise chain?
7. When is a coroutine clearer than a short promise chain?
8. Why is whole-file asynchronous I/O not automatically streaming?

Continue with the [language contract](../reference/l0-language.md) or [runtime libraries](../projects/index.md#namespaces-and-libraries).
