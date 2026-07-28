# Namespaces, libraries, and tests

A Hara namespace gives Vars a stable name and gives source files a predictable place in a
project. The syntax is Clojure-inspired, but the loader and available libraries are Hara's own.

## Declare a namespace

Start a portable source file with `ns`:

```hara
(ns services.worker)

(def worker-name "background")
```

Definitions are Vars. Their fully qualified names are `services.worker/worker-name` and, for a
function named `process-job`, `services.worker/process-job`.

## Map names to files

The nearest `project.edn` declares source and test roots:

```clojure
{:hara/type :project
 :hara/version "1.0.0"
 :project/id services
 :project/version "0.1.0"
 :project/source-paths ["src"]
 :project/test-paths ["test"]
 :project/extension-paths ["extensions"]
 :project/main services.api
 :project/capabilities #{}}
```

Within those roots, dots become directories, hyphens become underscores, and the module extension
is `.hal`:

| Namespace | Source path |
| --- | --- |
| `services.worker` | `src/services/worker.hal` |
| `services.api-test` | `test/services/api_test.hal` |

Project loading uses file access, so the CLI needs `--allow-file` when a form requires project
source.

## Require and qualify

Use `:as` when the dependency has several public Vars:

```hara
(ns services.api
  (:require [services.worker :as worker]
            [std.lib.string :as string]))

(worker/process-job {:id 42})
(string/trim "  /status  ")
```

Use `:refer` for a small set of names that reads naturally without a qualifier:

```hara
(ns services.api-test
  (:require [services.worker :refer [worker-name]]))
```

Referred names retain the identity of the source Var; Hara does not copy their current values.
Prefer explicit lists over `:refer :all` in application code. Test namespaces commonly use
`[code.test :refer :all]` because its facts and matchers form a small testing language.

At runtime, require a project, packaged, provider-backed, or extension namespace with a quoted
symbol:

```hara
(require 'services.api)
(services.api/normalize-route "  /STATUS  ")
```

Use `{:reload true}` only during development when the source must be evaluated again:

```hara
(require 'services.api {:reload true})
```

Failed loads roll back their namespace changes. Already compiled call targets remain immutable;
newly compiled source observes the reloaded definitions.

## Built-in library aliases

Every namespace receives aliases for the generated string, bytes, promise, file, socket, block,
and zip libraries. For example, `str/trim`, `bytes/count`, and `zip/zipper` work without an explicit
`:require`. You can still require these namespaces under descriptive aliases, as the service
example does.

Use `(:config {:intrinsics ...})` to remove or rename generated aliases:

```hara
(ns compact.app
  (:config
    {:intrinsics
     {:exclude [socket]
      :alias {string text
              promise async}}}))
```

Excluding an alias does not remove core constructors such as `bytes`, and it does not revoke a host
capability. See the [namespace catalog](reference/namespaces.md) for load modes and capabilities.

## Use generated libraries

Hara keeps the referred core small. Other operations live in named libraries.
This makes each portable feature or host capability visible in the source.

The default aliases are available in every namespace:

```hara
(ns tutorial.data)

(def encoded (str/encode "Hara"))

{:size (bytes/count encoded)
 :text (str/to-lower (str/decode encoded))}
```

This form returns `{:size 4 :text "hara"}`. Strings and bytes are portable
values. The code does not use JVM interop.

The other intrinsic aliases are `promise/`, `file/`, `socket/`, `block/`, and
`zip/`. The last two libraries support source blocks and tree navigation:

```hara
(block/parse-first "(+ 1 2)")
(zip/zipper [1 [2 3]])
```

An explicit alias can clarify a dependency or replace a default name:

```hara
(ns tutorial.labels
  (:require [std.lib.string :as text]))

(text/join ", " [(text/to-upper "hara") "L0"])
```

Some provider namespaces are not injected. Require them when the program needs
them:

```hara
(ns tutorial.tasks
  (:require [std.lib.task :as task]))
```

The same rule applies to `std.lib.context`, `std.lib.handle`, and `code.test`.
The runtime installs their public Vars when it loads the namespace.

Library access and host authority are separate. The `file/` and `socket/`
aliases always exist, but the host must grant each capability:

```shell
hara --allow-file run program.hal
hara --allow-net run client.hal
```

A denied operation and an unsupported operation produce different errors. The
program can therefore handle each case directly.

## Test a namespace

Hara tests are `.hal` namespaces that use `code.test`. Facts run in a real
Hara context. They test namespace loading, aliases, values, and language
semantics together.

Place a test namespace under a test root. For example,
`test/services/api_test.hal` declares `services.api-test`:

```hara
(ns services.api-test
  (:require [code.test :refer :all]
            [services.api :as api]
            [services.worker :refer [worker-name]]))
```

Register facts with explicit expected values:

```hara
(fact "normalizes routes through a namespace alias"
  (api/normalize-route "  /STATUS  ")
  => "/status")

(fact "dispatches persistent data across namespaces"
  (api/dispatch "/jobs" {:id 42})
  => {:route "/jobs"
      :result {:worker "background"
               :job {:id 42}
               :status :processed}})
```

Run only this test namespace from the project directory:

```shell
hara --allow-file eval \
  "(require 'services.api-test) (code.test/run {:namespace \"services.api-test\"})"
```

Each successful fact has `"PASS"` in its `status` field. A namespace filter
prevents facts from another loaded module from changing the result.

Exact values are the simplest expectations. Import a matcher when a test needs
partial data or an exception:

```hara
(ns example.matchers
  (:require [code.test :refer [contains fact throws]]))

(fact "matches part of a response"
  {:status :ready :count 2}
  => (contains {:status :ready}))

(fact "captures an error"
  (/ 1 0)
  => (throws))
```

The maintained matcher and fixture examples live in
[`lib/examples/code-test`](https://github.com/hoebat/hara.lang/tree/main/lib/examples/code-test).

## Inspect what loaded

Vars retain documentation and argument metadata:

```hara
(get (meta #'services.api/dispatch) :doc)
(get (meta #'services.api/dispatch) :arglists)
```

The REPL's symbol completion and inline documentation use the same metadata. `current-symbols`
lists the symbols visible from the active namespace, including aliases and referred Vars.

Use metadata to confirm a Var instead of guessing its arity:

```hara
[(get (meta #'str/join) :doc)
 (get (meta #'str/join) :arglists)]
```

## Common loading errors

- **Cannot require missing namespace**: check `project.edn`, the source root, and the dot/hyphen path mapping.
- **Namespace source did not declare requested namespace**: make the file's `ns` name match the required symbol.
- **Namespace alias already refers to ...**: choose a distinct alias; aliases cannot silently replace one another.
- **Cannot refer missing var**: use a public Var that actually exists in the required namespace.
- **Capability denied or unsupported**: loading `std.lib.file` or `std.lib.socket` does not grant file or network authority.

Continue with the [service project walkthrough](walkthroughs/service-project.md).
Use the [namespace catalog](reference/namespaces.md) to find shipped namespace
families. Use the [runtime library contract](reference/runtime-libraries.md)
for normative operation rules.
