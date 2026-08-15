---
title: The August 2026 std.foundation reorganization
description: Migrate from retired Foundation child namespaces to the current portable, native, and higher-level library boundaries.
---

# The August 2026 `std.foundation` reorganization

Hara now uses a smaller, explicit Foundation boundary. This guide describes the API pinned to Hara commit `209ffd3f8ac596b02290cd73663a75f1918ff436` and explains how to migrate code written against the earlier `std.foundation.*` arrangement.

The central rule is:

> A loadable namespace, an automatic namespace alias, a native static object, and a runtime value are different things.

Older documentation sometimes flattened these categories into one list of Foundation children. The runtime and generated API manifest now keep them separate.

## Current Foundation namespaces

The current loadable Foundation family is:

```text
std.foundation
std.foundation.bytes
std.foundation.coroutine
std.foundation.pretty
std.foundation.promise
std.foundation.string
```

The root `std.foundation` namespace is the portable value layer. It owns composition, collection and sequence operations, set algebra, metadata, references, structural traversal, predicates, macros, and other language-level helpers.

The five child libraries have these default aliases:

| Namespace | Alias | Purpose |
| --- | --- | --- |
| `std.foundation.string` | `str` | strings and UTF-8 conversion |
| `std.foundation.bytes` | `bytes` | byte values and operations |
| `std.foundation.promise` | `promise` | promises and promise protocols |
| `std.foundation.coroutine` | `co` | coroutines and suspension |
| `std.foundation.pretty` | `pretty` | document and pretty rendering |

These names are loadable because they appear in Hara's registered standard-library inventory. A source file, test fixture, historical page, or runtime alias cannot add another namespace to that list.

## Native static objects

The canonical schema-v2 manifest records native static objects separately. The common runtime configuration includes objects such as:

```text
Edn
Json
Crypto
File
Socket
Host
Kernel
```

It also records lower-level objects used by the language runtime, including `Arr`, `Bits`, `Bytes`, `Coroutine`, `Document`, `Error`, `Iter`, `Maths`, `Numbers`, `Obj`, `Printer`, `Promise`, `Regex`, `Runtime`, `String`, `Test`, and `UUID`.

Their implementation identities use names such as `std.native.Edn` and `std.native.File`, but application code does not load those identities with `:require`. Use the object directly:

```hara
(Edn/read "{:enabled true}")
(Json/write {"enabled" true})
(Crypto/sha256 (str/encode-utf8 "hara"))
```

A native object being visible does not grant authority. File, socket, host, kernel, and other effectful operations remain controlled by the embedding runtime.

## Runtime-profile differences

Not every migrated facility is part of the common automatic native-object inventory.

The former `std.foundation.os` API migrates toward the runtime-provided `OS` object where that profile exposes it. Process handles are runtime values created by process operations; `Process` is not documented as a common automatic static-object alias. Treat OS and process availability as profile-specific until the cross-runtime conformance matrix for your selected Hara revision says otherwise.

This is why migration records include a direction without claiming identical Rust, JVM, and browser/Wasm availability.

## Migrating imports and calls

### EDN

Before:

```hara
(ns app.config
  (:require [std.foundation.edn :as edn]))

(edn/read source)
```

After:

```hara
(ns app.config)

(Edn/read source)
```

### JSON

Before:

```hara
(ns app.json
  (:require [std.foundation.json :as json]))

(json/write value)
```

After:

```hara
(ns app.json)

(Json/write value)
```

### Crypto

Before:

```hara
(ns app.digest
  (:require [std.foundation.crypto :as crypto]))

(crypto/sha256 bytes)
```

After:

```hara
(ns app.digest)

(Crypto/sha256 bytes)
```

Use registered `std.crypto.*` libraries for higher-level algorithms. The native object is a primitive runtime boundary, not a complete cryptography library.

### Set operations

Before:

```hara
(ns app.tags
  (:require [std.foundation.set :as set]))

(set/union left right)
```

After, using the automatically referred root operation:

```hara
(ns app.tags)

(union left right)
```

Or qualify the root explicitly:

```hara
(ns app.tags
  (:require [std.foundation :as foundation]))

(foundation/union left right)
```

The same ownership applies to `intersection`, `difference`, `subset?`, `superset?`, and `select`.

### Component lifecycle

Before:

```hara
(ns app.service
  (:require [std.foundation.component :as component]))
```

After:

```hara
(ns app.service
  (:require [std.lib.component :as component]))
```

The canonical lifecycle implementation remains `std.lib.component`; `std.foundation.component` is not a current child namespace.

### Pretty rendering

Before:

```hara
(ns app.output
  (:require [std.foundation.pretty.engine :as engine]))
```

After:

```hara
(ns app.output
  (:require [std.foundation.pretty :as pretty]))
```

`std.foundation.pretty.engine` was an implementation helper. Its internal functions are not a compatibility promise.

## Files and `std.fs`

Old material may use a lower-case `file/` alias or require `std.foundation.file`. In the pinned revision, native byte-oriented I/O belongs to the `File` static object:

```hara
(File/read path)
(File/write path bytes)
(File/resolve root child)
```

`File` being visible does not grant filesystem authority. The host decides whether a read, write, list, or deletion is allowed.

Portable filesystem work is layered separately:

- `std.fs.path` is registered for portable path operations in the pinned revision;
- the migration ledger marks a broader `std.fs` facade as planned;
- native byte-oriented I/O remains on `File` until a selected Hara revision registers and documents a portable replacement.

Do not infer that a planned namespace exists merely because it appears in a migration note.

## Complete migration table

| Former name | Status | Current direction |
| --- | --- | --- |
| `std.foundation.component` | moved | `std.lib.component` |
| `std.foundation.crypto` | moved | `Crypto`; higher-level work under registered `std.crypto.*` libraries |
| `std.foundation.edn` | moved | `Edn` |
| `std.foundation.file` | moved | `File`; portable path work under `std.fs.path`; broader `std.fs` planned |
| `std.foundation.host` | moved | `Host` |
| `std.foundation.json` | moved | `Json` |
| `std.foundation.kernel` | moved | `Kernel` |
| `std.foundation.os` | moved | runtime-provided `OS`, with profile-specific availability |
| `std.foundation.pretty.engine` | retired | public `std.foundation.pretty` API |
| `std.foundation.set` | moved | root `std.foundation` operations |
| `std.foundation.socket` | moved | `Socket` |

## Namespace configuration

Automatic aliases for the five current child libraries can be controlled through namespace configuration:

```hara
(ns app
  (:config
   {:intrinsics
    {:exclude [bytes]
     :alias {string text
             coroutine workflow}}}))
```

This changes aliases only. It does not change the public namespace inventory and does not grant host capabilities.

Native static objects are also not converted into namespaces by aliasing them. `Edn` identifies a built-in object; there is no corresponding application `:require` form.

## Reading generated API pages

The generated API index separates:

1. **Current namespaces** — derived from Hara's registered inventory and public source bindings.
2. **Historical namespace migrations** — derived from Hara's migration ledger.

A historical page is a migration destination, not evidence that the old namespace remains loadable.

Every generated page records:

- the Hara repository and immutable commit;
- the manifest schema version;
- the deterministic semantic surface digest;
- runtime-profile information supplied by the canonical manifest.

The manifest also uses repository-relative provenance paths. This allows the specs registry and documentation site to compare artifacts produced in different checkout directories without runner-specific path drift.

## Upgrade checklist

1. Remove `:require` entries for retired Foundation children.
2. Replace native-facade calls with the relevant native static object where it is part of your runtime profile.
3. Move set calls to root `std.foundation`.
4. Move component lifecycle calls to `std.lib.component`.
5. Replace pretty-engine imports with the public `std.foundation.pretty` API.
6. Use `File/...` for the pinned native I/O boundary and `std.fs.path` for registered portable path operations.
7. Check profile conformance before relying on OS, process, filesystem, network, host-call, or kernel behavior.
8. Treat planned `std.fs` or other planned surfaces as unavailable until they appear in the registered inventory of the Hara revision you deploy.
9. Regenerate API documentation from the pinned canonical manifest rather than copying binding lists into prose.

The [Language API](../api/index.md) is the source-derived current reference. Historical pages linked there are migration records rather than current namespace documentation.
