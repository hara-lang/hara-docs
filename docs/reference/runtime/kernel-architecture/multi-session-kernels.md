# Multi-session kernels with attachable filesystems

**Status:** Target architecture contract

**Scope:** Rust native, raw/WASM, Truffle, browser embedding, documentation examples, and host filesystem providers

## Summary

A Hara kernel is a process or runtime container that owns multiple isolated sessions.

Each session owns its mutable execution state:

- namespaces and Vars;
- loaded modules and resources;
- protocol extensions;
- tasks and suspended fibers;
- document generations;
- current namespace;
- capabilities;
- project and module caches;
- one attached filesystem provider.

The kernel owns infrastructure that sessions can safely share:

- immutable runtime code;
- compiled evaluator machinery;
- registered standard-library source;
- the session registry;
- the scheduler and host-service bridge;
- provider registries.

Documentation pages create one browser kernel lazily. Each live example receives a private session by default. Examples therefore share the worker and WASM module without sharing definitions, tasks, files, input state, or canvas ownership.

An author can request a separate kernel when the example needs a stronger process, scheduler, memory, or failure boundary.

## Conceptual model

The architecture combines three established models.

### Jupyter-like browser kernel

A page communicates with a long-lived language kernel.

Normal notebook cells often share one namespace and one mutable execution history. Hara documentation embeds use separate sessions by default. One example cannot define a Var that silently appears in another example.

### Graal-context or isolate-style sessions

One runtime process hosts several isolated execution contexts.

Sessions share runtime infrastructure. They do not share mutable language state, tasks, module load state, or filesystem attachments.

### WASI-style filesystem capabilities

Filesystem access is attached authority. It is not ambient access to the host machine.

A session sees only the filesystem provider attached to that session. The provider can represent browser memory, an IndexedDB namespace, or a confined native directory.

The compact description is:

> Graal contexts with WASI-style filesystem capabilities, presented through a Jupyter-like browser kernel.

## Runtime hierarchy

A normal documentation page uses one kernel with several sessions:

```text
Page
└── Kernel worker / WASM instance
    ├── Session example-1
    │   ├── namespaces, modules, tasks, and documents
    │   └── memory filesystem A
    ├── Session example-2
    │   ├── namespaces, modules, tasks, and documents
    │   └── memory filesystem B
    └── Session tutorial
        ├── namespaces, modules, tasks, and documents
        └── persistent IndexedDB mount
```

An isolated embed moves its work into another kernel boundary:

```text
Page kernel                      Isolated kernel
└── ordinary sessions            └── private session
```

The session API remains the same in both cases. Only the containing kernel changes.

## Isolation cost model

The architecture provides two levels of isolation.

| Boundary | Shares | Isolates | Relative cost |
| --- | --- | --- | --- |
| Session isolation | Worker, WASM module, immutable runtime code, scheduler infrastructure | Namespaces, modules, protocols, tasks, documents, capabilities, filesystem, project cache | Low |
| Kernel isolation | Nothing from the page kernel except explicit messages | Worker, WASM memory, scheduler, provider registry, sessions, crashes, termination | Higher |

Use session isolation for ordinary examples, tools, REPL clients, and concurrent projects inside one runtime.

Use kernel isolation when an embed needs a separate memory budget, scheduler, failure boundary, or worker lifecycle.

## Terminology

### Kernel

A kernel is the process or runtime container.

In the browser, one kernel normally maps to one worker and one WASM instance. In native and Truffle hosts, it maps to the long-lived runtime container that owns the session registry.

The kernel is not a user namespace. It does not hold ordinary application definitions.

### Session

A session is an isolated mutable execution context inside one kernel.

A session has a stable session ID. Closing the session destroys its mutable state and attached capabilities without stopping sibling sessions.

### Filesystem provider

A filesystem provider is a host-owned implementation of the filesystem contract.

The kernel refers to the provider through an opaque provider ID. Guest code does not receive the provider object or backend credentials.

### Task

A task is scheduled or pending work that originated from one session.

Every task, callback, suspended fiber, and host call retains its originating session identity.

### Document generation

A document generation is one active compiled or evaluated document state for an editor or documentation embed.

Generations belong to a session. Replacing or closing a session releases its generations.

## Core ownership rules

The kernel and session boundaries must remain explicit.

### Kernel-owned state

The kernel owns:

- the session registry;
- immutable evaluator and runtime code;
- registered standard-library source;
- shared compiled runtime infrastructure;
- the scheduler implementation;
- host provider registries;
- the worker or process transport;
- kernel identity and lifecycle.

Kernel-owned source can be loaded by several sessions. Loading and evaluation still occur separately in each session.

### Session-owned state

Each session owns:

- lexical and top-level environments;
- namespace and Var registries;
- current namespace;
- loaded-module and loaded-resource state;
- project and module caches;
- protocol registries and extensions;
- task handles;
- fibers and coroutine state;
- pending callbacks;
- document generations;
- capability grants;
- filesystem attachment;
- session-local host handles.

No mutable object in this list can be shared implicitly between sessions.

### Shared source is not shared load state

The kernel can register one copy of standard-library source.

Two sessions can load that source independently:

```text
kernel source registry
        |
        +--> session A loads and evaluates resource
        |
        +--> session B loads and evaluates resource
```

Definitions, macros, module revisions, and load failures remain session-local.

## The `ROOT` compatibility session

`ROOT` remains the default session for compatibility.

Existing calls that do not specify a session target `ROOT`:

- HTA `eval`;
- HTA `eval-bound`;
- completion;
- resource operations;
- local REPL evaluation;
- compatible protocol operations.

`ROOT` is a normal session with a reserved ID. It does not bypass capability checks or receive access to sibling sessions.

Hosts can continue to expose only `ROOT`. Multi-session clients use the explicit session operations.

## Session lifecycle

A session moves through a small lifecycle:

```text
create
  |
  v
IDLE <---- evaluation or task completes
  |
  +----> BUSY
  |        |
  |        +----> IDLE
  |
  +----> CLOSING ----> CLOSED
```

A session is busy while it has any of the following:

- an active evaluation;
- a live task;
- a suspended fiber;
- an active document generation;
- a pending host call;
- an in-progress close or reset operation.

Hosts can expose more detailed counts through `session/info`.

## Session creation

`session/create(id)` creates a new isolated session.

Creation must:

1. validate the session ID;
2. reject a duplicate live ID;
3. allocate empty language state;
4. install the default intrinsic aliases;
5. attach the host-selected default filesystem or no filesystem;
6. register the session atomically;
7. return session information.

Creating a session must not evaluate user source.

## Session close

`session/close(id)` destroys one session without affecting siblings.

Close must:

1. stop new evaluations;
2. cancel session-owned tasks;
3. unwind or close suspended fibers;
4. reject pending host calls;
5. release document generations;
6. release session-local host handles;
7. detach the filesystem provider;
8. clear project and module caches;
9. remove the session from the registry.

A callback from a closed session must not run in another session or in `ROOT`.

Close errors must identify the session and the failed cleanup stage. Cleanup should continue where safe so one failed release does not retain unrelated state.

## Task and host-call ownership

Every task and host call carries explicit ownership metadata:

```text
{
  kernelId,
  sessionId,
  taskId
}
```

The runtime derives this metadata from the originating evaluation or task. Guest code does not choose another session ID for a host call.

The host bridge uses the metadata to route:

- filesystem operations;
- canvas commands;
- pointer and input events;
- socket callbacks;
- document updates;
- extension calls;
- task completion and errors.

This rule prevents a task from using the filesystem or canvas lease of another embed.

## Filesystem provider contract

The host supplies filesystem providers through one common interface.

The provider contract covers:

```text
resolve(root, path)
read(path)
write(path, bytes)
exists(path)
list(path)
mkdir(path)
delete(path)
```

The Rust native, raw/WASM, and Truffle hosts expose equivalent behavior and stable error categories.

The interface must preserve these rules:

- paths are normalized by the provider;
- resolution cannot escape the provider root;
- text encoding is not implicit;
- reads and writes use bytes;
- denied authority differs from unsupported behavior;
- missing paths differ from invalid paths;
- backend details do not enter Hara values.

`std.foundation.file` and the `file/*` alias route through the attached provider.

`studio.fs` remains a compatibility façade over the same provider attachment. It must not maintain a second storage model.

## Filesystem backend profiles

The host chooses the backend.

| Host profile | Provider | Lifetime | Intended use |
| --- | --- | --- | --- |
| Browser ephemeral | Memory-backed provider | Session lifetime | Ordinary examples and isolated scratch work |
| Browser persistent | Named IndexedDB provider | Browser storage lifetime | Tutorials and examples that intentionally share files |
| Native | Confined directory or embedding provider | Host-defined | CLI projects, tests, and server embeddings |
| Truffle | Context-selected provider | Context lifetime | JVM embedding with explicit authority |

Attaching a provider does not grant network, process, reflection, classpath, or other unrelated authority.

## Filesystem attachment

A session stores one opaque filesystem provider ID.

```text
session ID
   |
   +--> provider ID
            |
            +--> host-owned backend
```

The provider ID is meaningful only to the containing kernel host.

A session cannot inspect the backend implementation. It can use only the public filesystem operations.

## Filesystem reattachment

A host can replace a session filesystem through:

```text
session/attach-filesystem(sessionId, providerId)
```

Reattachment is allowed only while the session is idle.

The operation returns `SESSION_BUSY` when the session has:

- an active evaluation;
- a live or suspended task;
- an active document generation;
- a pending host call;
- cleanup already in progress.

A successful reattachment resets all session language state while preserving the session ID.

The reset includes:

- namespaces and Vars;
- current namespace;
- loaded modules and resources;
- macros and protocol extensions;
- project and module caches;
- tasks and fibers;
- document generations;
- session-local handles and capability state tied to the old provider.

Values created under the old provider do not survive the reset.

## Atomic reattachment algorithm

Reattachment must not discard a working session before the new provider is known to be valid.

Use this order:

1. Find the session.
2. Confirm that it is idle.
3. Resolve and validate the new provider ID.
4. Create fresh empty session state bound to the new provider.
5. Install required intrinsic and compatibility state.
6. Atomically replace the old session state while retaining the session ID.
7. Release the old state and detach the old provider.
8. Return the new session information.

When validation or fresh-state creation fails, the old state and provider remain active.

This makes failure atomic from the client point of view.

## Public kernel interfaces

The kernel exposes operations equivalent to the following:

| Operation | Result |
| --- | --- |
| `session/create(id)` | Create an empty isolated session. |
| `session/list` | List session IDs and summary state. |
| `session/info(id)` | Return lifecycle, task, document, capability, and filesystem information. |
| `session/attach-filesystem(id, providerId)` | Reset an idle session and attach the validated provider. |
| `session/eval(id, source)` | Evaluate source in the target session. |
| `session/eval-bound(id, source, bindings)` | Evaluate with explicit host bindings in the target session. |
| `session/complete(id, prefix)` | Complete symbols from the target session state. |
| `session/close(id)` | Cancel work and destroy the target session. |

The exact transport can use HTA, RESP, a Rust API, a Truffle API, or browser messages. The session semantics remain the same.

## Evaluation rules

`session/eval` resolves all mutable state from the selected session.

An evaluation must not read the kernel's `ROOT` environment unless the selected session is `ROOT`.

The evaluation inherits:

- the selected session namespace;
- that session's module load state;
- that session's protocol registry;
- that session's filesystem provider;
- that session's capability grants;
- the active document generation, when supplied by the embed or editor.

Any spawned task inherits the session identity automatically.

## Completion rules

Completion is session-local.

`session/complete(id, prefix)` sees:

- standard symbols available to that session;
- namespaces loaded in that session;
- Vars defined in that session;
- aliases and refers installed in that session;
- current document generation state for that session.

A definition in `example-1` must not appear in completion results for `example-2`.

## HTA compatibility

Existing HTA operations remain aliases to `ROOT`:

```text
eval(source)                 -> session/eval(ROOT, source)
eval-bound(source, bindings) -> session/eval-bound(ROOT, source, bindings)
complete(prefix)             -> session/complete(ROOT, prefix)
```

The HTA1 value encoding remains unchanged.

Browser host-call invocation metadata gains `sessionId`. The worker derives session ownership from the originating task. The value codec therefore does not need to encode session identity inside ordinary Hara values.

## RESP compatibility

RESP `SESSION ATTACH` remains client-to-session selection.

It does not mean filesystem mounting.

Filesystem attachment is a separate session operation. This distinction prevents a network client from confusing its selected execution session with the provider mounted into that session.

Existing clients that use `ROOT` continue to work.

The [RESP protocol](../../resp-protocol.md) remains the transport reference. This architecture page defines the target ownership model beneath that transport.

## Truffle mapping

In Truffle, each `Session` creates a Graal `Context` with its selected filesystem provider.

This mapping provides a direct isolation boundary for:

- namespaces and language state;
- host access;
- tasks and callbacks;
- provider selection;
- context close.

Filesystem reattachment replaces the context after the idle check.

Replacing the context naturally resets the language state and project caches. The host validates the new provider before closing the previous context so the operation remains atomic.

## Rust native and raw/WASM mapping

Rust native and raw/WASM add a kernel-level session registry matching the Truffle broker shape.

Mutable evaluator state moves into a session structure. The kernel keeps immutable runtime code and registered source.

A conceptual shape is:

```text
Kernel
├── id
├── immutable runtime and source registry
├── provider registry
├── scheduler infrastructure
└── sessions
    ├── ROOT -> SessionState
    ├── example-1 -> SessionState
    └── tutorial -> SessionState
```

The evaluator receives a session reference for every operation. Global mutable evaluator singletons are not permitted.

## Browser broker model

The browser broker distinguishes kernels from sessions.

- Creating a page kernel creates one worker and one WASM instance.
- Creating a session allocates isolated state inside that worker.
- Creating an isolated kernel creates another worker and WASM instance.

The broker maintains a host registry keyed by kernel and session identity.

Canvas, pointer, filesystem, and extension adapters remain local to the embed. Host-call metadata selects the correct adapter.

## Documentation embedding defaults

A documentation page creates one kernel lazily by default. An author can warm
the shared page kernel as soon as live examples hydrate by adding this Markdown
front matter:

```yaml
hara_kernel_loading: auto
```

Use `hara_kernel_loading: deferred` (or omit the setting) to retain first-eval
loading. `auto` starts the worker and registers its resources early; it still
creates a private session only when an individual example evaluates.

Each generated live fence or canvas stage creates a unique private session with an ephemeral memory filesystem.

The default is therefore:

```text
shared page kernel
+ private embed session
+ private memory filesystem
```

Definitions, loaded modules, tasks, documents, files, input state, and canvas leases do not leak between ordinary examples.

## Persistent documentation filesystems

An author can attach a named persistent browser filesystem:

```html
<div data-hara-filesystem="tutorial-name"></div>
```

The value selects an IndexedDB namespace.

Embeds that use the same explicit key intentionally share files. They still use separate language sessions unless the embedding contract explicitly selects the same session.

Persistent storage always requires an explicit key. An ordinary example must not persist files merely because the page was reloaded.

## Isolated documentation kernels

An author can request a separate worker and WASM instance:

```html
<div data-hara-kernel="isolated"></div>
```

The embed still creates a session through the normal session API. The session lives inside the new kernel rather than the page kernel.

Use this option for examples that test:

- worker termination;
- scheduler isolation;
- memory pressure;
- crash containment;
- kernel startup behavior;
- process-level host registration.

Do not use a separate kernel only to prevent namespace or file leakage. A private session already provides that boundary at lower cost.

## Generated Markdown behavior

Generated documentation follows these rules:

| Markup | Kernel | Session | Filesystem |
| --- | --- | --- | --- |
| No override | Shared page kernel | Unique private session | Ephemeral memory provider |
| `data-hara-filesystem="name"` | Shared page kernel | Unique private session | Named persistent IndexedDB provider |
| `data-hara-kernel="isolated"` | Dedicated kernel | Private session | Ephemeral provider unless explicitly named |
| Both attributes | Dedicated kernel | Private session | Named provider in that kernel host |

The page runtime replaces per-stage `stageKernel()` construction with a page kernel service and session-scoped host registry.

## Document and first-frame semantics

Candidate `ns+` generation remains session-local.

A form evaluation targets the active document generation owned by its embed session.

First-frame commit behavior also remains session-local:

1. create or update a candidate generation;
2. evaluate the candidate in the embed session;
3. route canvas calls through the session host registry;
4. commit the generation after the first valid frame;
5. release the prior generation for that session.

A frame from one session cannot commit or release another session's document generation.

## Generated UI identity

The generated UI displays both isolation levels.

Examples:

```text
PAGE KERNEL · SESSION board-1 · MEMORY FS
PAGE KERNEL · SESSION tutorial-2 · INDEXEDDB tutorial-name
ISOLATED KERNEL · SESSION ROOT · MEMORY FS
```

The label helps authors and users understand whether two examples share a worker, session, or filesystem.

## Required invariants

Implementations must preserve these invariants:

1. A session never resolves a Var from a sibling session.
2. A session never observes a sibling's loaded-module state.
3. A task retains its originating session for its complete lifetime.
4. A host callback cannot silently fall back to `ROOT`.
5. A filesystem provider is selected by session attachment, not by ambient host access.
6. Reattachment fails with `SESSION_BUSY` while session work remains active.
7. Failed provider validation leaves the old session state intact.
8. Successful reattachment resets mutable language state and caches.
9. Closing one session does not cancel sibling work.
10. Kernel termination closes all contained sessions.
11. Ordinary documentation embeds use one private session each.
12. Kernel isolation always creates another worker or process boundary.

## Failure boundaries

### Session failure

An evaluation error, task failure, module error, or denied filesystem call affects the originating session operation.

It does not destroy the kernel or sibling sessions.

### Session close failure

The kernel records the cleanup error and continues safe cleanup steps.

The closed session cannot accept new work.

### Kernel failure

A worker crash, fatal runtime error, or kernel termination affects every session inside that kernel.

An isolated kernel contains this failure away from the page kernel.

## Observability

Kernel and session identity must appear in diagnostics that cross the host boundary.

Useful fields include:

```text
kernelId
sessionId
taskId
documentGeneration
providerId
operation
errorCode
```

Sensitive provider details, host paths, credentials, and storage internals must remain redacted or opaque.

Tracing and task inspection should allow filtering by session.

## Test plan

### Rust raw and native

Test:

- namespace isolation;
- Var and current-namespace isolation;
- module and resource load isolation;
- protocol registry isolation;
- concurrent suspended fibers in different sessions;
- task ownership and cancellation;
- host-call session metadata;
- close cleanup;
- `ROOT` compatibility;
- filesystem attachment;
- reattachment reset;
- atomic provider-validation failure;
- `SESSION_BUSY`;
- sibling survival after close or evaluation failure.

### Truffle

Test:

- several contexts inside one broker;
- different filesystem providers per context;
- cross-session path denial;
- task and callback ownership;
- atomic context replacement on reattachment;
- project-cache and module-state reset;
- RESP compatibility;
- parity with Rust filesystem errors;
- sibling context survival after close.

### Browser broker

Test:

- several sessions inside one worker;
- independent namespace and completion state;
- isolated memory filesystems;
- named persistent mount sharing;
- session-scoped canvas routing;
- pointer and input routing;
- task completion after asynchronous host calls;
- separate-worker creation for isolated kernels;
- worker termination cleanup.

### Documentation browser tests

Place several ordinary examples and canvas stages on one page.

Verify that they use one WASM kernel but independent sessions.

Verify that the following do not leak:

- definitions;
- aliases and current namespace;
- loaded modules;
- files;
- pending input;
- task handles;
- document generations;
- canvas leases.

Then verify:

- matching `data-hara-filesystem` keys share files intentionally;
- different keys do not share files;
- `data-hara-kernel="isolated"` creates another worker;
- closing one embed leaves the other embeds active.

### Conformance and build suites

Run:

- Rust tests;
- Truffle tests;
- studio and web tests;
- browser tests;
- strict MkDocs build;
- shared session lifecycle fixtures;
- shared filesystem operation fixtures;
- cross-runtime error-code parity checks.

## Shared conformance fixture

A shared fixture should cover at least:

```text
create session
list sessions
inspect session
attach filesystem
evaluate definition
evaluate lookup
complete symbol
start task
reject busy reattachment
finish or cancel task
reattach filesystem
confirm state reset
close session
confirm sibling survival
confirm ROOT compatibility
```

Each runtime can use its native transport. The expected lifecycle and errors remain common.

## Implementation sequence

A safe implementation order is:

1. Extract mutable evaluator state into an explicit session structure.
2. Add the kernel session registry and preserve `ROOT` aliases.
3. Attach session identity to tasks, fibers, callbacks, and host calls.
4. Introduce the shared filesystem provider contract.
5. Add idle checks and atomic filesystem reattachment.
6. Map Truffle sessions to contexts and Rust sessions to `SessionState` values.
7. Update the browser broker to create one page kernel and many sessions.
8. Move documentation embeds to private sessions.
9. Add named IndexedDB providers and isolated-kernel opt-in.
10. Run shared lifecycle, filesystem, browser, and documentation conformance suites.

Do not add persistent documentation mounts before ordinary ephemeral session isolation works. Persistent storage can otherwise hide state leakage bugs.

## Assumptions

This architecture uses the following assumptions:

- Session isolation includes language state and runtime tasks, not only filesystem paths.
- Documentation embeds use one session per embed by default.
- Ordinary browser sessions receive ephemeral memory filesystems.
- Persistent browser storage requires an explicit author key.
- Matching persistent keys intentionally share files, not language state.
- Filesystem reattachment resets the session.
- Values created under the old provider do not survive reattachment.
- `ROOT` remains the backward-compatible default session.
- Session isolation shares one scheduler implementation but retains task ownership.
- Kernel isolation creates a separate worker, scheduler, memory, and failure boundary.

## Related references

- [Kernel architecture map](index.md)
- [RESP protocol](../../resp-protocol.md)
- [Rust and WASM runtime](../../rust-runtime.md)
- [Runtime libraries](../../runtime-libraries.md)
- [Native runtime flavors](../../native-flavors.md)
- [Development tracing](../../../development-tracing.md)
