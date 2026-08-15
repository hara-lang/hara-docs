---
title: The August 2026 std.foundation reorganization
description: Migrate from retired Foundation child namespaces to the current portable, native, and higher-level library boundaries.
---

# The August 2026 `std.foundation` reorganization

Hara now uses a smaller, explicit Foundation boundary. This guide describes the API represented by Hara commit `ce04b2ead4e47c7c194df900f0e3c6a0982bc155` and explains how to migrate code written against the earlier `std.foundation.*` arrangement.

The central rule is:

> A loadable namespace, an automatic alias, and a native static object are different things.

Older documentation often treated all three as Foundation child namespaces. The runtime no longer does.

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

The root `std.foundation` namespace is the portable value layer. It owns functions and macros for composition, collections, sequences, set algebra, metadata, references, structural traversal, predicates, and other language-level operations.

The five child libraries have these default aliases:

| Namespace | Alias | Purpose |
| --- | --- | --- |
| `std.foundation.string` | `str` | strings and UTF-8 conversion |
| `std.foundation.bytes` | `bytes` | byte values and operations |
| `std.foundation.promise` | `promise` | promises and promise protocols |
| `std.foundation.coroutine` | `co` | coroutines and suspension |
| `std.foundation.pretty` | `pretty` | document and pretty rendering |

These names are loadable because they are present in Hara's registered standard-library inventory. A source file, test fixture, historical page, or runtime alias does not add another namespace to that list.

## Native static objects

Host-backed facilities are exposed as built-in objects such as:

```text
Edn
Json
Crypto
File
Socket
Host
Kernel
OS
Process
```

Their runtime identities use names such as `std.native.Edn` and `std.native.File`, but they are not file-backed namespaces that application code should require.

Use them directly:

```hara
(Edn/read "{:enabled true}")
(Json/write {"enabled" true})
(Crypto/sha256 (str/encode-utf8 "hara"))
(OS/platform)
```

Do not add a dependency such as `[std.native.Edn :as edn]`. Native objects are installed by the runtime rather than loaded as ordinary libraries.

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

Use the verified `std.crypto.*` libraries for higher-level algorithms. The native object is the primitive runtime boundary, not a complete cryptography library.

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

Old material may use a lower-case `file/` alias or require `std.foundation.file`. In the documented revision, current native primitives belong to the `File` static object:

```hara
(File/read path)
(File/write path bytes)
(File/resolve root child)
```

`File` being visible does not grant file authority. The embedding host still decides whether reads, writes, and other effects are allowed.

Portable filesystem work is moving into the `std.fs` layer. At the pinned revision:

- `std.fs.path` is registered for portable path operations;
- the broader `std.fs` facade should not be assumed merely because older plans name it;
- native byte-oriented I/O remains on `File` until a selected release documents a portable replacement.

This distinction matters when reading the I/O tutorial: `File/...` is a native static-object call, while `std.fs.*` names are ordinary portable libraries when present in the selected runtime.

## Complete migration table

| Former name | Status | Current direction |
| --- | --- | --- |
| `std.foundation.component` | moved | `std.lib.component` |
| `std.foundation.crypto` | moved | `Crypto`; higher-level work under `std.crypto.*` |
| `std.foundation.edn` | moved | `Edn` |
| `std.foundation.file` | moved | `File`; portable path work under `std.fs.path` and broader `std.fs` as implemented |
| `std.foundation.host` | moved | `Host` |
| `std.foundation.json` | moved | `Json` |
| `std.foundation.kernel` | moved | `Kernel` |
| `std.foundation.os` | moved | `OS` and runtime-native `Process` values |
| `std.foundation.pretty.engine` | retired | public `std.foundation.pretty` API |
| `std.foundation.set` | moved | root `std.foundation` operations |
| `std.foundation.socket` | moved | `Socket` |

Native capability availability can differ by runtime profile. In particular, OS, process, filesystem, network, host-call, and kernel operations depend on what the embedding runtime supports and authorizes.

## Namespace configuration examples

Automatic aliases for the five current child libraries can be controlled through namespace configuration:

```hara
(ns app
  (:config
   {:intrinsics
    {:exclude [bytes]
     :alias {string text
             coroutine workflow}}}))
```

This controls aliases. It does not change the public namespace inventory and does not grant host capabilities.

Native objects are also not converted into namespaces by aliasing them. `Edn` continues to identify the built-in EDN object; there is no corresponding `:require` form.

## Reading API pages

The generated API index separates:

1. **Current namespaces** — generated from Hara's registered inventory and public source bindings.
2. **Historical namespace migrations** — generated from Hara's migration ledger.

A historical page is a migration destination, not evidence that the old namespace remains loadable.

Every generated page records:

- the Hara repository and commit;
- the manifest schema version;
- the deterministic semantic surface digest;
- runtime-profile information supplied by the canonical manifest.

## Upgrade checklist

1. Remove `:require` entries for retired Foundation children.
2. Replace native-facade calls with `Edn`, `Json`, `Crypto`, `File`, `Socket`, `Host`, `Kernel`, `OS`, or `Process` as appropriate.
3. Move set calls to root `std.foundation`.
4. Move component lifecycle calls to `std.lib.component`.
5. Replace pretty-engine imports with the public `std.foundation.pretty` API.
6. Check the selected runtime profile before relying on host capabilities.
7. Treat planned `std.fs` or other higher-level surfaces as unavailable until they are registered in the Hara revision you deploy.
8. Regenerate API documentation from the pinned canonical manifest rather than copying binding lists into prose.

The [Language API](../api/index.md) is the source-derived current reference. Historical pages linked there are migration records rather than current namespace documentation.
