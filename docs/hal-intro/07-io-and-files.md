# 07. I/O and files

I/O crosses from a Hara program into its host environment. File operations are effects, require authority, use bytes, and normally return promises.

The current native file boundary is the `File` static object. `File` is not a loadable `std.foundation.file` namespace, and seeing the object does not grant filesystem authority.

The runnable examples on this page share one lesson session. Work from top to bottom when an example uses an earlier definition, and reload the page to start with a clean session. File reads and writes remain static in the browser because this session does not grant or seed filesystem authority.

## Learning goals

By the end of this lesson, you can:

1. Distinguish a native static object from a loadable namespace.
2. Explain why file access is a capability.
3. Resolve a child path beneath an allowed root.
4. Read a file as bytes and decode text explicitly.
5. Keep transformation pure and I/O at the boundary.
6. Encode and write output bytes.
7. Compose file operations with promises or coroutines.
8. Distinguish `File` from portable `std.fs.path` operations.

## I/O is an effect

A pure function returns a value from its arguments:

```hara eval group=hal-intro-07
(defn normalize-line [line]
  (str/lower (str/trim line)))
```

A file operation asks the host environment to read or change an external resource:

```hara
(File/read "data/input.txt")
```

The file can change without the Hara source changing. The call can also fail because of authority, availability, path, or host errors.

Keep pure transformation and I/O in separate functions.

## `File` is a native static object

Older examples used a lower-case `file/` alias or required `std.foundation.file`. That child namespace is no longer current API.

Use the built-in object directly:

```hara
(File/resolve "." "data/input.txt")
(File/read "data/input.txt")
(File/write "data/output.txt" output-bytes)
```

Do not write:

```hara
(ns app
  (:require [std.foundation.file :as file]))
```

The runtime installs `File`; it is not loaded through the standard namespace mechanism.

## File access needs authority

Object availability does not grant authority. A `File` call can fail because:

- the embedding runtime does not support filesystem I/O;
- the runtime did not grant file authority;
- the path is outside the allowed boundary;
- the file does not exist;
- the host rejects the operation.

The native CLI grants file authority explicitly. Embeddings provide their own capability policy.

Do not treat a denied capability as a missing namespace or missing object.

## Native paths and portable path libraries

`File/resolve` is part of the native file boundary used by the examples in this lesson:

```hara eval group=hal-intro-07
(def project-root ".")

(def input-path
  (File/resolve project-root "data/input.txt"))

(def output-path
  (File/resolve project-root "data/output.txt"))
```

The pinned Hara revision also registers `std.fs.path` for portable path operations. Use it when your program needs portable path manipulation independently of native I/O.

A broader `std.fs` facade is still planned in the migration ledger. Do not assume it exists until it appears in the registered standard-library inventory of the Hara revision you deploy.

## Keep path configuration explicit

Keep the root and child path separate:

```hara eval group=hal-intro-07
(def file-config
  {:file/root "."
   :file/input "data/input.txt"
   :file/output "data/output.txt"})
```

Resolve paths at the I/O boundary:

```hara eval group=hal-intro-07
(defn input-path [config]
  (File/resolve
    (:file/root config)
    (:file/input config)))
```

This makes the path authority boundary visible.

## Read a file

`File/read` returns a promise that settles with bytes:

```hara
(def input-promise
  (File/read input-path))
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

Use blocking dereference for small REPL experiments and tests. Compose promises in event-loop and interactive application code.

## Keep text transformation pure

Split text into lines without performing I/O:

```hara eval group=hal-intro-07
(defn text-lines [text]
  (str/split-lines text))

(defn lines->text [lines]
  (str (str/join "\n" lines) "\n"))
```

Build a pure transformation:

```hara
(defn transformed-lines [text]
  (->> (text-lines text)
       (filter non-empty-line?)
       (map normalize-line)))

(defn transform-document-bytes [input-bytes]
  (-> input-bytes
      (str/decode-utf8)
      (transformed-lines)
      (lines->text)
      (str/encode-utf8)))
```

Test it with in-memory values:

```hara
(def sample-input
  (str/encode-utf8 " Alpha \n\n Beta \n"))

(str/decode-utf8
  (transform-document-bytes sample-input))
; => "alpha\nbeta\n"
```

No filesystem authority is required for this test.

## Write a file

`File/write` accepts bytes and returns a promise:

```hara
(def output-bytes
  (str/encode-utf8 "alpha\nbeta\n"))

(def write-promise
  (File/write output-path output-bytes))
```

Do not pass a string directly. Encode text first.

Handle successful completion with `promise/then`:

```hara
(promise/then
  write-promise
  (fn [result]
    {:write/status :status/complete
     :write/result result}))
```

Use the selected runtime's actual file contract for the precise write result. Do not assume the call returns the bytes value.

## Compose read, transform, and write

Build one promise chain:

```hara
(defn transform-file [input-path output-path]
  (promise/then
    (File/read input-path)
    (fn [input-bytes]
      (File/write
        output-path
        (transform-document-bytes input-bytes)))))
```

The callback returns the write promise. Promise adoption makes the returned chain wait for the write operation.

The control flow is:

```text
File/read promise
-> input bytes
-> pure transformation
-> output bytes
-> File/write promise
-> write result
```

## Record progress at the boundary

Keep state updates beside the effectful workflow:

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

The pure bytes transformation still has no knowledge of the atom.

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

## Sequential workflow with a coroutine

A coroutine can express several promise waits:

```hara
(ns intro.file-workflow
  (:require [std.foundation.coroutine :as coroutine]))

(defn make-file-worker [input-path output-path]
  (coroutine/create
    (fn []
      (let [input-bytes
            (coroutine/await
              (File/read input-path))]
        (coroutine/yield
          {:phase :phase/read
           :bytes (bytes/count input-bytes)})
        (let [output-bytes
              (transform-document-bytes input-bytes)]
          (coroutine/await
            (File/write output-path output-bytes))
          {:phase :phase/complete
           :bytes (bytes/count output-bytes)})))))
```

A short read-transform-write flow is usually clearer as a promise chain. Use a coroutine when the workflow must pause, expose intermediate values, and resume across several stages.

## File I/O is byte-oriented

The native boundary reads and writes bytes. This avoids hidden text assumptions:

- a text program chooses UTF-8 decoding;
- a binary program keeps bytes;
- a protocol parser can inspect exact byte values;
- a writer chooses the serialized format before the host call.

Do not decode a binary file merely because `File/read` returned bytes.

## Whole-file I/O is not streaming

The basic `File/read` operation returns the complete file bytes through one promise.

For a small file:

```text
read all bytes -> transform -> write all bytes
```

For a large or continuous source, use a provider or library that explicitly exposes chunks or an iterator. Keep resource lifetime and close behavior explicit.

Asynchronous whole-file I/O is not automatically streaming.

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
  (File/resolve
    (:file/root config)
    (:file/input config)))

(def resolved-output
  (File/resolve
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

Inspect the returned promise and run state in an environment with filesystem authority:

```hara
operation
@run
```

When blocking inspection is suitable:

```hara
(deref operation)
@run
```

## Common mistakes

### Requiring `std.foundation.file`

That namespace is retired. Use the `File` static object for the native boundary.

### Assuming object access grants authority

`File` can exist while every effectful call remains denied.

### Treating `File` as `std.fs`

`File` is native. `std.fs.path` is a registered portable path library. The broader `std.fs` facade is planned until a later inventory proves otherwise.

### Passing text directly to `File/write`

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

You have completed the tutorial when you can answer:

1. Why is `File` not a loadable Foundation child namespace?
2. Why can `File/read` fail when the `File` object exists?
3. What distinction does `std.fs.path` introduce?
4. Which value type does `File/read` produce through its promise?
5. Where should UTF-8 decoding occur?
6. Why should document transformation remain pure?
7. How does returning the write promise extend a promise chain?
8. When is a coroutine clearer than a short promise chain?
9. Why is whole-file asynchronous I/O not automatically streaming?

Continue with the [Foundation reorganization guide](../guides/foundation-reorganization-2026.md), the [language contract](../reference/l0-language.md), or the [Language API](../api/index.md).
