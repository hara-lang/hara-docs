# Hara CLI

The Hara CLI is the local and headless entry point to a kernel. It can run a
form or file, host a persistent session for tools, validate a project package,
and produce a deterministic archive for source and declared artifacts.

```text
source file ──┐
terminal REPL ├── Hara CLI ── Hara kernel
RESP client ──┘
```

## Run, evaluate, or read standard input

Use the native CLI for a direct value, a source file, or a pipeline:

```sh
hara eval '(+ 19 23)'
hara run src/main.hal
printf '(+ 19 23)' | hara stdin
```

With no command, `hara` starts the local REPL and exposes its shared `ROOT`
session over RESP at `127.0.0.1:1311`. Use `--offline` when that listener is
not wanted. `--root PATH` grants native file access only inside the selected
root, while `--native-sockets` enables the native socket provider.

## Work with a project

Current Hara projects use a root `project.edn` plus `workspace.edn`. The
project manifest declares source, test, extension, and artifact paths, as well
as requested capabilities. Portable Hara package coordinates live under
`:project/dependencies`; Maven libraries live separately under
`:jvm/dependencies`.

```sh
hara project new hello-hara
cd hello-hara
hara project check
hara project run
hara project test
```

The historical flat project verbs remain compatibility aliases. `hara run`
without a file therefore still evaluates the declared `:project/main`, while
`hara run FILE` is the direct file command. The grouped form removes that
ambiguity for new scripts. Project commands discover the nearest ancestor
`project.edn`, or accept `--project PATH` when the project is elsewhere.
`project test FILE` selects one test file; a directory or omitted operand
discovers every `.hal` file under `:project/test-paths`.

Dependencies are project intent, rather than evaluator input:

```sh
hara project add hara/graph@^1.2.0
hara project sync
hara project remove hara/graph
```

`add` and `remove` edit `:project/dependencies`. `sync` owns
`project.lock.edn` for portable Hara packages. A project with declared remote
Hara dependencies deliberately fails sync until the reviewed registry and
identity client can verify its release assets and signatures. The evaluator
never downloads a Hara package while resolving `require`.

On the JVM, the same `sync` command also resolves `:jvm/dependencies` through
the embedded Maven resolver. Exact Maven versions use the standard local cache;
`--offline` and `--frozen` prohibit network resolution. `project run` and
`project test` prepare that JVM graph automatically and compile declared Java
source paths. A REPL started inside the project (or with `--project PATH`) uses
the same prepared graph, so a JVM project does not need a wrapper `pom.xml`. See
[Get started with the JVM](../getting-started/jvm.md) for the manifest keys and
security boundary.

## Package source and WASM artifacts

Declare source paths and any built artifacts—such as a provider WASM module—in
`project.edn`, then build a deterministic `.harp` archive:

```sh
hara package build .
hara package inspect target/my-project-0.1.0.harp
```

The package command gathers the declared source and artifact paths, writes a
`package.edn` manifest with file hashes, and produces a repeatable archive. It
packages an already-built WASM module; the module's own toolchain remains
responsible for compiling it. See [Browser HTA](../web-specific/browser-hta.md)
for how a packaged provider is loaded in a browser worker.

## Host a headless kernel over RESP

Run a kernel with no terminal UI when another tool owns the interface:

```sh
hara --host 127.0.0.1 --port 1311 server
```

This starts a persistent `ROOT` session and RESP listener. Connect a local or
remote terminal client with:

```sh
hara remote 127.0.0.1:1311
```

The remote client evaluates each entered form in that shared session. Editors,
automation, and agents can use the same RESP contract, so they observe one
running kernel rather than separate ad-hoc REPLs. The full wire protocol is in
[Hara RESP Protocol](../reference/resp-protocol.md).

## Other useful modes

| Mode | Use |
|---|---|
| `hara repl` | Start an interactive local REPL and RESP listener. |
| `hara repl --offline` | Start the REPL without the listener. |
| `hara headless` | Compatibility alias for `server`. |
| `hara standalone` | Compatibility alias for an offline REPL. |
| `hara --history PATH` | Store REPL history at a chosen location. |
| `hara --no-color --no-splash` | Make terminal output suitable for scripts and logs. |

The CLI is one surface for the kernel. The project, values, and session model
remain the same whether they are reached from a terminal, the web, an editor,
or a RESP client.
