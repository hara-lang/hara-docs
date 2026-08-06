# Hara extensions

A Hara extension is a namespace backed by a declared WASM or HTA provider. Application code uses an ordinary `:require`; it does not construct an engine or send transport messages.

```hal
(ns app
  (:require [crypto.hash.sha256 :as sha]))

(deref (sha/digest (bytes 97 98 99)))
```

Extension intent belongs in [`project.edn`](project-manifest.md) under `:project/extensions`. Package building normalizes those declarations into the generated `package.edn` inside the `.harp`.

## Direct WASM

```clojure
{:project/extensions
 {crypto.hash.sha256
  {:root "crypto/hash/sha256"
   :provider :wasm
   :abi :core.v1
   :module "sha256.wasm"
   :exports
   {"digest" {:args [:bytes]
              :returns :bytes
              :async true}}
   :capabilities #{}}}}
```

`:core.v1` supports import-free scalar exports. Compilation, instantiation, memory access, and export invocation stay behind the provider boundary.

## Stateful HTA providers

```clojure
{:project/extensions
 {ledger.noir
  {:root "ledger/noir"
   :provider :hta
   :abi :hta.v1

   :targets
   {:node
    {:module "node/worker.mjs"
     :runtime :process}

    :browser
    {:module "browser/worker.mjs"
     :runtime :web-worker}}

   :assets
   ["assets/noir-wasm.mjs"
    "assets/barretenberg.js"
    "assets/main.worker.js"]

   :exports
   {"compile" {:args [:value] :returns :value :async true}
    "prove"   {:args [:value :map] :returns :value :async true}
    "verify"  {:args [:value :value] :returns :boolean :async true}}

   :host-calls
   {"crypto.hash.sha256" ["digest"]}

   :handles
   {"circuit" {:tag noir}}

   :capabilities #{}}}}
```

HTA modules remain import-free. The host drives the exported mailbox lifecycle:

```text
Hara call -> hta_start -> task
                         |
                 hta_next_event
                    /          \
             settlement      host-call
                                 |
                         policy check
                                 |
                        hta_deliver result/error
```

The required exports are `hta_abi_version`, `hta_alloc`, `hta_dealloc`, `hta_start`, `hta_next_event`, `hta_deliver`, `hta_poll`, `hta_cancel`, `hta_drop_task`, and `hta_release`.

The host selects the target. Hara source does not branch on the host environment, and both targets expose the same Hara values, promises, errors, handles, and export signatures.

## CDN-hosted WASM

A remote artifact is declared once in `project.edn` with an HTTPS URL, exact SHA-256 digest, byte size, media type, and policy:

```clojure
{:project/remote-artifacts
 {"graph/render/graph-render.wasm"
  {:url "https://cdn.example.com/graph-render/1.2.3/graph-render.wasm"
   :sha256 "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
   :size 481920
   :media-type "application/wasm"
   :policy :mirror}}}
```

With `:mirror`, reconciliation downloads and verifies the bytes and the official release embeds them in the `.harp`. The CDN is a publication input, not a runtime dependency.

An explicitly permitted `:external` policy still resolves before runtime. The verified bytes are stored by digest, recorded in `project.lock.edn`, and loaded from the local content-addressed cache.

## Generated package declaration

The package builder emits archive-relative declarations in `package.edn`:

```clojure
{:harp/format 1
 :package {:identity "hara/graph-render"
           :version "1.2.3"}
 :extensions
 {"graph.render.native"
  {:root "graph/render"
   :provider :hta
   :abi :hta.v1
   :targets
   {:node {:module "node/worker.mjs" :runtime :process}
    :browser {:module "browser/worker.mjs" :runtime :web-worker}}
   :assets ["graph-render.wasm"]}}
 :files { ... }
 :integrity {:tree-sha256 "sha256:..."}}
```

The runtime resolves a namespace from this generated map, validates every path inside the mounted package root, selects the compatible target, and creates the namespace Vars.

## Authority and failures

Loading a package grants no authority. The host independently approves requested capabilities and host calls. The runtime keeps distinct failures for malformed declarations, missing assets, unsupported providers, ABI mismatch, denied capabilities, crashes, timeouts, cancellation, and provider errors.

Opaque handles remain provider-owned. Reading a printed handle creates inert data rather than a live capability, so source text cannot forge access to provider state.

## Package workflow

```shell
hara package check
hara --allow-process package build
hara --allow-process package test
hara package inspect build/package.harp
hara package install build/package.harp
```

`check` validates all declarations and paths. `build` executes the build declared by `project.edn`, verifies its outputs, and creates the `.harp`. `test` performs provider handshakes and declared package tests. `install` only verifies and extracts bytes; it does not execute package code or lifecycle hooks.
