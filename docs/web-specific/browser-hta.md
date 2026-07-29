# How Hara runs in the browser through HTA

The browser loads the Hara kernel as a WebAssembly module. A small JavaScript
host starts the kernel and connects it to the page. The host supplies the
browser services that the kernel cannot access by itself.

HTA is the **Hara Transport Adapter**. It defines how Hara communicates with a
stateful WASM module or another service. It is not a JavaScript wrapper around
each Hara function; it is a stable boundary between the Hara kernel and a
provider.

```text
web page
   │
   ▼
JavaScript host
   │
   ├── Hara WASM kernel
   │
   └── HTA context
          │
          ▼
       Web Worker
          │
          ▼
     provider WASM
```

## Load the kernel

The page first loads the Hara runtime files. The JavaScript host then creates a
kernel session. The editor, REPL, application adapter, and AI tools can send
Hara forms to this session.

```text
Hara source
    ↓
browser host
    ↓
WASM kernel
    ↓
Hara value
```

The kernel reads the source, evaluates the forms, and returns structured Hara
values. The browser host does not need to convert every form into a custom
JavaScript call: it sends source or values through the kernel interface.

## Load an HTA provider

A Hara project can include a provider under its `extensions/` directory. Its
`hara.extension.edn` descriptor declares the Hara namespace, HTA version,
browser worker, exported operations, allowed host calls, handle types, and
required assets.

A browser loader can create an HTA context with a worker and descriptor:

```javascript
const context = await loadHtaExtension({
  worker: new Worker("./hta-worker.js", { type: "module" }),
  descriptorUrl: new URL(
    "./hara.extension.edn",
    import.meta.url
  ).toString()
});
```

The loader checks the provider, module, ABI, handles, and assets before it
starts the worker. The descriptor is metadata, not executable Hara source.

## Use a Web Worker

Each browser HTA context uses a Web Worker, keeping a provider separate from
the page thread. The worker loads the provider WASM module; the provider does
not receive direct browser access.

Instead, the module exposes a small HTA mailbox:

```text
hta_start
hta_next_event
hta_deliver
hta_poll
hta_cancel
hta_drop_task
hta_release
```

The host starts a task with `hta_start`, then reads its next event with
`hta_next_event`. An event can contain a completed result, an error, a request
for a host operation, or a pending state.

The module does not need browser-specific WASM imports. The host drives it
through this exported mailbox. Browser HTA contexts wait when they have no
work—they do not run a CPU-consuming polling loop.

## Call a provider from Hara

Hara source requires the provider as a namespace, then calls an exported
operation:

```hara
(ns app.image
  (:require [image.process :as image]))

(image/resize input {:width 640})
```

```text
Hara call
    ↓
generated extension namespace
    ↓
HTA request
    ↓
Web Worker
    ↓
provider WASM
```

An HTA operation can return later, so the Hara call returns a promise:

```hara
(def resized
  (image/resize input {:width 640}))

(deref resized)
```

The kernel suspends the waiting evaluation while the browser remains
responsive. When the provider completes, HTA resumes the evaluation with the
returned value.

## Exchange Hara values

HTA uses the `HTA1` value format. It can carry the main portable Hara values:

- `nil` and booleans
- integers, strings, and bytes
- keywords and symbols
- lists, vectors, sets, and maps
- opaque handles

This removes the need for a separate JSON-shaped API for every function. A
Hara map remains a map, bytes remain bytes, and a keyword remains a keyword.

```hara
{:image-id "image-42"
 :width 640
 :height 480
 :format :rgba}
```

HTA encodes the value before it crosses the worker boundary, and the other side
decodes the same structure. Opaque handles represent resources that should not
cross that boundary as raw data, such as a GPU buffer, audio node, database
connection, or compiled model:

```text
#image[:buffer 42]
```

The provider owns the resource. Hara holds a typed reference to it.

## Interact with the browser

A WASM provider does not receive direct access to the DOM, network, storage,
or browser APIs. It requests a host operation through HTA:

```text
host call:
  service: canvas.2d
  action: draw
  args: [...]
```

The browser host checks the extension descriptor before it performs the call:

```text
provider request
      ↓
descriptor allows the call?
     / \\
   yes  no
    │    │
    ▼    ▼
browser  structured
service  error
```

The host returns the result with `hta_deliver`.

```text
provider WASM
    ↓ host-call event
HTA worker
    ↓ postMessage
browser host
    ↓ capability check
browser API
    ↓ result or error
HTA worker
    ↓ hta_deliver
provider resumes
```

Host-call failures return as structured Hara errors. They do not appear as
JavaScript exceptions thrown through the WASM module. A failed asynchronous
call rejects the matching Hara promise.

## Keep browser authority explicit

This design leaves authority with the browser host. A provider can compute
values without network access; an image provider can receive canvas access
without file access; and an AI agent can inspect application state without
permission to call every browser API.

The project declares which operations it needs. The host decides which it
grants.

```text
Hara code
    ↓
HTA provider
    ↓
declared host call
    ↓
browser capability
```
