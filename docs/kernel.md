# Kernel

Hara is a programmable kernel that runs in the browser. HAL forms provide its
portable interface for evaluation and structured data.

## Architecture

A kernel is a runtime container; a session is an isolated execution context.
Sessions may share immutable runtime machinery but own namespaces, Vars,
modules, tasks, documents, capabilities, and filesystems.

## Sessions

Local browser sessions backed by the HARA wasm runtime. Each session carries its own state, namespace, and evaluation history.

## State transitions

Every meaningful change in a session is logged as a transition. These transitions can be replayed, verified, and shared without exposing the full session record.

## Agents

Small autonomous HARA programs that interact through the kernel. Agents can compete, mediate, or collaborate inside a shared session.

## Proofs

A lightweight proof system lets two parties verify that a session transitioned correctly without revealing the code or data that produced the transition.

## Competitions, mediation, and collaboration

The kernel provides primitives for:

- **Competitions** — agents compete in a sandboxed environment (e.g., multiplayer TRON).
- **Mediation** — a neutral party validates transitions between untrusted participants.
- **Collaboration** — multiple identities contribute to a shared session while keeping their local state consistent.

## REPL workflow

The REPL reads complete forms, evaluates them in the selected session, and
keeps errors recoverable. Completion and docs come from runtime-visible
symbols. Slash commands such as `/help`, `/status`, `/resp`, `/ns`, and `/quit`
are control messages, not Hara forms.

## RESP

RESP is the external control plane for editors and tools. Clients negotiate a
protocol, attach to a session, and send request IDs with `EVAL`, `LOAD`, `DOC`,
and `COMPLETE`. The listener is transport; mutable state belongs to the session.
