# Clojure API reference

This reference is the concise lookup surface for Hara's Clojure-shaped API.
Use the guides for concepts, host runtimes, protocols, extensions, and project
workflows.

| Reference | Use it to |
| --- | --- |
| [Builtins](../builtins.md) | Find a core function, macro, or special form. |
| [Runtime libraries](runtime-libraries.md) | Find portable string, byte, promise, file, socket, block, zip, task, and test operations. |
| [Namespace catalog](namespaces.md) | Find a shipped namespace and its load mode or capability. |
| [Clojure core compatibility](clojure-core-compatibility.md) | Check deliberate compatibility and semantic differences. |

## Runtime

| Reference | Use it to |
| --- | --- |
| [Kernel architecture](runtime/kernel-architecture/index.md) | Inspect kernel and session ownership, isolation boundaries, host capabilities, and accepted architecture targets. |
| [Multi-session kernels with attachable filesystems](runtime/kernel-architecture/multi-session-kernels.md) | Confirm the target multi-session lifecycle, filesystem attachment contract, compatibility rules, browser embedding behavior, and test requirements. |
| [REPL UX](repl.md) | Confirm interactive session, history, completion, documentation, and command behavior. |
| [RESP protocol](resp-protocol.md) | Build or debug a client connection to a Hara runtime. |
| [Native runtime flavors](native-flavors.md) | Confirm provider selection, host authority, and JVM interop. |
| [Rust and WASM runtime](rust-runtime.md) | Inspect the Rust value model, host providers, target profiles, and conformance status. |

## Extensions

[Hara extensions](extensions-contract.md) starts with the application-facing
workflow. It then defines discovery, package manifests, HTA, provider
lifecycle, and installation.

## Development and APIs

The [developer guide](../development.md) covers repository changes and tests.
The [Java and Rust API guide](../javadocs.md) maps the generated implementation
references.

## Implementation notes

These pages record compatibility, porting, and measured implementation data:

- [Hara and Xtalk equivalence](xtalk-equivalence.md)
- [Clojure core compatibility](clojure-core-compatibility.md)
- [Runtime benchmarks](runtime-benchmarks.md)
- [Foundation porting](../foundation-porting.md)

For help choosing Hara from a Clojure perspective, start with the
[Clojurists guide](../start/clojure.md).
