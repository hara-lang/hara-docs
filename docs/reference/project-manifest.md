# `project.edn`

`project.edn` is the only contributor-authored manifest in a Hara project. It is EDN data, not executable Hara code, so the CLI can inspect, resolve, build, and publish a project without evaluating it or granting host authority.

```text
project.edn        authored project intent
project.lock.edn   generated exact resolution
build/*.harp       generated distribution archive
  package.edn      generated immutable archive index
```

## Complete project declaration

```clojure
{:hara/type :project
 :hara/version "1.0.0"

 :project/id hara/graph-render
 :project/version "1.2.3"
 :project/main graph.render.main

 :project/source-paths ["src"]
 :project/test-paths ["test"]
 :project/extension-paths ["artifacts"]
 :project/artifact-paths ["artifacts"]
 :project/archive-root "artifacts"
 :project/capabilities #{}

 :project/dependencies
 {"hara:hara/collections" {:version "^1.4.0"}}

 :project/package
 {:license "MIT"
  :entry-points [graph.render.main]}

 :project/build
 {:adapter :command
  :command ["npm" "run" "build"]
  :working-directory "."
  :output "artifacts"}

 :project/extensions
 {graph.render.native
  {:root "graph/render"
   :provider :hta
   :abi :hta.v1
   :targets
   {:node {:module "node/worker.mjs" :runtime :process}
    :browser {:module "browser/worker.mjs" :runtime :web-worker}}
   :assets ["graph-render.wasm"]
   :exports
   {"render" {:args [:value :map]
              :returns :bytes
              :async true}}
   :capabilities #{}}}

 :project/remote-artifacts
 {"graph/render/graph-render.wasm"
  {:url "https://cdn.example.com/graph-render/1.2.3/graph-render.wasm"
   :sha256 "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
   :size 481920
   :media-type "application/wasm"
   :policy :mirror}}}
```

## Responsibilities

`project.edn` declares:

- project and package identity;
- source, test, extension, and artifact paths;
- main namespaces and runnable profiles;
- version ranges for dependencies;
- build adapters and their declared outputs;
- WASM and HTA extension namespaces;
- requested capabilities and host calls;
- digest-pinned remote artifacts;
- package licence and entry points.

A command adapter is an argument vector, not a shell string. Process-backed builds run only when the caller explicitly grants process capability.

## Reconciliation

`hara project sync` resolves package versions, registry revisions, source commits, archive hashes, and remote artifact hashes. It writes the exact graph to `project.lock.edn`.

```text
project.edn
     │
     ├── resolve package ranges
     ├── resolve remote artifact digests
     └── write exact project.lock.edn
```

Runtime loading does not perform reconciliation. A `require` searches the already mounted local graph and never downloads code.

## Building a package

`hara package build`:

1. validates `project.edn` and the resolved lock;
2. executes the declared build only when the required capability is granted;
3. compiles HAL resources to compatible HIR where requested;
4. verifies declared extension modules and assets;
5. mirrors digest-pinned remote artifacts by default;
6. creates a deterministic `.harp`;
7. generates the root `package.edn` from the exact archive entries.

The generated `package.edn` contains file hashes, namespace mappings, normalized extension declarations, compatibility data, and the tree digest. It describes what was built; it is not a second place to configure the project.

## Commands

```shell
hara project check
hara project sync
hara project run
hara project test

hara package check
hara package build
hara package test
hara package inspect build/graph-render-1.2.3.harp
hara package install build/graph-render-1.2.3.harp
hara package publish --tap hara
```
