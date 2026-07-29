# Kernel architecture

This subsection describes how a Hara runtime contains execution state, isolates sessions, and connects host capabilities.

The pages distinguish two boundaries:

- A **kernel** is the process or runtime container. In a browser, it normally maps to one worker and one WASM instance.
- A **session** is an isolated execution context inside that kernel.

A kernel can host many sessions. Each session owns its mutable language state and its attached capabilities. Sessions can share immutable runtime infrastructure without sharing definitions, tasks, files, or document state.

## Architecture references

| Reference | Use it to |
| --- | --- |
| [Multi-session kernels with attachable filesystems](multi-session-kernels.md) | Understand the target kernel/session hierarchy, filesystem attachment contract, public operations, browser embedding behavior, compatibility rules, and test requirements. |

## Status labels

Architecture pages can describe either an implemented contract or an accepted target design.

Each page states its status near the top. A target design must not be read as proof that all runtimes already implement the described behavior.

## Related references

- [RESP protocol](../../resp-protocol.md) describes the external control plane and current client session operations.
- [Rust and WASM runtime](../../rust-runtime.md) describes the Rust evaluator, provider boundary, and browser/native target mapping.
- [Runtime libraries](../../runtime-libraries.md) describes the portable `file/*`, promise, bytes, socket, and other runtime libraries.
- [Native runtime flavors](../../native-flavors.md) describes host selection and authority boundaries.
