# Namespace catalog

This catalog describes the public namespace families shipped by the current Truffle runtime. Use
Var metadata and the REPL for exact documentation and arglists.

## Core and intrinsic libraries

| Namespace | Default access | Purpose | Representative Vars |
| --- | --- | --- | --- |
| `std.foundation` | Core names are referred eagerly | Portable L0 functions, collections, sequences, protocols, and macros | `map`, `reduce`, `take`, `comp` |
| `std.foundation.string` | `str/` | String comparison, slicing, joining, case conversion, trimming, and UTF-8 conversion | `trim`, `join`, `to-lower`, `encode` |
| `std.foundation.bytes` | `bytes/` | Mutable byte buffers with explicit signed and unsigned conversion | `count`, `get`, `set`, `slice`, `u8` |
| `std.foundation.promise` | `promise/` | Native asynchronous settlement and composition | `new`, `from`, `all`, `then`, `catch`, `finally` |
| `std.foundation.file` | `file/` | Capability-gated path resolution and asynchronous byte I/O | `resolve`, `read`, `write` |
| `std.foundation.os` | `os/` | Capability-gated environment and process operations | `platform`, `cwd`, `spawn`, `process-wait` |
| `std.foundation.socket` | `socket/` | Capability-gated asynchronous socket operations | `connect`, `send`, `close` |
| `std.foundation.edn` | `edn/` | Restricted EDN parsing and canonical readable encoding | `read`, `write`, `pretty` |
| `std.foundation.json` | `json/` | Strict JSON parsing and encoding | `read`, `write`, `pretty` |
| `std.foundation.coroutine` | `co/` | Lua-style coroutines with bidirectional yield and promise await | `create`, `resume`, `yield`, `status`, `close`, `await` |
| `std.foundation.set` | `set/` | Portable immutable set algebra | `union`, `intersection`, `difference`, `subset?`, `select` |
| `std.pretty` | `pretty/` | Portable readable formatting | `pprint-str` |

`(ns app)` and `(ns app (:config {:intrinsics :all}))` install the same default aliases. Intrinsic
aliases can be excluded or renamed through `(:config {:intrinsics ...})` without removing their
underlying provider namespaces.

Startup namespaces also refer protocol descriptors (`ICount`, `IFn`, and the other public
`I*` values) and native-type descriptors (`Maths`, `String`, `Edn`, `Json`, and the other
`std.native.<Type>` values). These short names retain the identity and metadata of their canonical
objects in every namespace, including blank namespaces; for example,
`(= Maths std.native.Maths)` is true. The same short name is also the method
namespace alias, so native calls use `Maths/sin`, `Json/read`, and `Iter/iter-map`.

## Native JVM flavor

Portable namespaces do not expose ambient JVM interop. A namespace explicitly selects the JVM
flavor:

```hara
(ns example.jvm
  (:flavor :jvm)
  (:import [java.lang String]))
```

The provider family is:

| Namespace | Purpose |
| --- | --- |
| `hara.native.jvm` | Native values, construction, member access, and invocation |
| `hara.native.jvm.reflect` | Capability-gated reflection operations |
| `hara.native.jvm.classpath` | Capability-gated classpath operations |
| `hara.native.jvm.compiler` | Capability-gated compilation and class definition |

Selecting a flavor is local to the declaring namespace and does not grant a capability or affect
required namespaces.

## Project namespaces

Project namespaces come from `.hal` files beneath source or test roots declared by the nearest
`project.edn`. Hara resolves `services.api-test` to `services/api_test.hal`. The file must declare
the requested namespace; mismatches fail instead of installing definitions under a surprising name.

## Extension namespaces

Extension manifests declare a namespace and export map. Requiring that symbol discovers the nearest
project extension root or a packaged extension, validates its descriptor, and generates public Vars
under the declared namespace:

```hara
(ns digest.app
  (:require [crypto.hash.sha256 :as sha]))
```

The same Hara call site can bind to a supported WASM or process-backed provider. Manifest discovery,
provider availability, and capability authority are separate checks.

## Load behavior summary

| Family | Creation | File authority needed | Automatically visible |
| --- | --- | --- | --- |
| Foundation | Eager provider plus packaged HAL fallback | No | Unqualified core Vars |
| Intrinsic libraries | Generated providers | No for loading; operations may require authority | Qualified default aliases |
| Project source | `.hal` under project roots | Yes | Only after `require` or direct evaluation |
| Extensions | Validated manifest and provider artifact | Depends on provider and operation |
| Native flavor | Explicit `:flavor` clause | Depends on operation | Only in the declaring namespace |
