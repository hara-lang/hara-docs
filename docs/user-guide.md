# Hara user guide

## A first program

```hara
(defn greet [name]
  (str "hello, " name))

(greet "Ada")
```

Hara uses Lisp forms: the first item is normally the operation and the remaining items are its
arguments. Vectors, maps, sets, strings, numbers, keywords, and `nil` are data values.

## Namespaces and libraries

The core is deliberately small. Every namespace receives qualified aliases for the generated
string, bytes, promise, file, socket, block, and zip libraries:

```hara
(ns app)

(str/trim "  ready  ")
(str/upper "ready")
```

Require project code or opt-in providers explicitly. Aliases are local to the declaring namespace:

```hara
(ns app.api
  (:require [studio.fs :as fs]))
```

The loader resolves project modules, packaged HAL, library providers, and extension manifests while
keeping capability grants separate. Read [Namespaces, libraries, and tests](namespaces.md), follow the
[namespace project walkthrough](walkthroughs/service-project.md), or browse the
[namespace catalog](reference/namespaces.md).

## Mutable markers

Persistent collections are the default. Use `array` and `object` when mutation is intentional:

```hara
(let [a (array 1 2 3)]
  (. a (push-last 4))
  (. a (get 3)))
```

The marker value makes the mutability boundary visible at construction time.

## Promises

Promises model native completable asynchronous work:

```hara
(deref
  (promise/then
    (promise/run (fn [] 21))
    (fn [n] (* n 2))))
```

Use `promise/catch` for recovery and `promise/finally` for cleanup. Sockets remain callback-based;
they do not grow separate socket-promise method families.

## Files, sockets, and capabilities

```hara
(do
  (require [studio.fs :as fs])
  (fs/write! "guide" "/notes.txt" "hello from Hara")
  {:content (fs/read "guide" "/notes.txt")
   :files (fs/list "guide" "/")})
```

This uses the web Studio's browser-persistent virtual filesystem. The first argument scopes files
to a space, so projects do not share paths accidentally. Native file and socket operations still
depend on capabilities granted by the embedding runtime; Hara keeps unsupported and denied errors
distinct so applications can respond correctly.

## REPL workflow

The REPL provides history, completion, multiline input, metadata docs, and slash commands. Use
`Alt-q` or `F1` on a symbol to inspect its docstring and arglists. Commands such as `/help`,
`/history`, `/clear`, `/splash`, `/ns`, and `/quit` are handled by the REPL and are not sent to the
Hara evaluator; ordinary Hara forms always go through the reader and evaluator.

## Learn the exact rules

Use the [L0 language specification](reference/l0-language.md) for semantics and the
[runtime-library contract](reference/runtime-libraries.md) for portable operations.
