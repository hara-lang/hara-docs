# 02 — Install: put a kernel where you work

Installing Hara means choosing where the live kernel should run.

You do not need a local installation to begin. The browser Playground already embeds a Hara kernel beside source, output, and visual surfaces. A local installation becomes useful when you want a durable source tree, terminal access, named runtime sessions, tests, automation, or a bridge from an editor or agent.

This chapter covers both paths.

## Choose the smallest useful installation

There are three useful starting points:

| Path | What runs | Use it when |
| --- | --- | --- |
| Browser Playground | A browser-resident Hara kernel | You want to understand the live workflow immediately |
| Installed CLI | A local native or Truffle kernel | You want files, a REPL, scripts, tests, or a RESP listener |
| Source checkout | The complete Hara workspace | You are contributing to the kernel, web loader, extensions, or documentation |

Start with the browser unless local ownership is part of the task. Installation should support the system you are building, not become a ceremony before you can evaluate one form.

## Path A: use the browser kernel

Open [Hara Playground](https://playground.hara-lang.org/).

Choose **Starter** for a minimal value-oriented project or **Browser Game** for a project with source, canvas output, and input capabilities.

A Playground project gives you several things at once:

- a kernel that can retain definitions and state;
- a source document;
- a workspace describing the visible areas and runtime nodes;
- a REPL or evaluation action;
- structured values and errors; and
- host capabilities appropriate to the example.

There is nothing to install because the kernel is already embedded in the host you are using.

### Verify the browser path

In the Starter project, evaluate:

```hara
(let [x 19]
  (+ x 23))
```

The result should be:

```text
42
```

The important fact is not the arithmetic. The evaluation travelled from a source or REPL surface into the active browser kernel and returned a value to the workspace.

Try a second evaluation:

```hara
(def answer 42)
```

Then evaluate:

```hara
answer
```

If the second form resolves to `42`, the session has continuity. You are not invoking an isolated calculator; you are working with a live evaluation context.

## Path B: install the CLI and local runtime

On Linux `x86_64` and macOS `arm64` or `x86_64`, run:

```shell
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --rust --truffle
```

This installs the `hara` launcher and the available native-image runtime to `~/.local/bin`. The downloaded release artifacts and checksums are published through GitHub Releases.

You can install one runtime explicitly:

```shell
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --rust
```

or:

```shell
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --truffle
```

Use `HARA_INSTALL_DIR` to choose another destination. Use `HARA_VERSION` when you need a pinned release rather than the current published version:

```shell
HARA_INSTALL_DIR="$HOME/bin" \
HARA_VERSION=v0.1.0 \
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --rust
```

### Check the executable path

After installation:

```shell
command -v hara
hara help
```

If `command -v` prints nothing, add the installation directory to your shell path. For the default location:

```shell
export PATH="$HOME/.local/bin:$PATH"
```

Put the equivalent line in the startup file for your shell after you have verified it works.

## Verify a one-shot evaluation

Run:

```shell
hara eval '(let [x 19] (+ x 23))'
```

Expected result:

```text
42
```

A one-shot evaluation is useful for scripts and health checks. It proves that the reader, evaluator, core definitions, and output path are working.

It does not yet demonstrate the main Hara workflow because the process can exit immediately after returning the value. The next step is to start a persistent session.

## Start a local kernel session

Run:

```shell
hara
```

The terminal REPL opens in the shared `ROOT` session. By default, that session is also exposed through RESP on `127.0.0.1:1311`.

This matters because the terminal is only one client of the kernel. Another tool can connect to the same session and work with the same definitions and state.

Use an offline session when you do not want a network listener:

```shell
hara --offline
```

Use a headless kernel when the listener is the primary interface:

```shell
hara headless
```

Use a remote client when a kernel is already listening elsewhere:

```shell
hara remote HOST:PORT
```

The exact authority of a session depends on the host and its launch options. Treat a RESP listener as a development interface with the ability to evaluate code. Do not expose it to an untrusted network.

## Understand what was installed

A local installation provides a kernel plus launch surfaces. It does not automatically grant every possible host service.

The portable core includes values, evaluation, namespaces, protocols, promises, and explicit runtime libraries. Files, sockets, process access, browser APIs, and extension providers sit behind host and capability boundaries.

This separation is deliberate:

```text
Hara form
   |
   v
kernel operation ----------------------> value
   |
   +--> explicit host request
             |
             +--> granted capability --> host service
             +--> denied capability  --> structured error
```

Installing the runtime therefore does not mean that arbitrary source receives ambient authority over the machine.

## Run a source file

Create `hello.hal`:

```hara
(defn greet [name]
  (str "hello, " name))

(greet "Hara")
```

Run it:

```shell
hara run hello.hal
```

You can also send source through standard input:

```shell
cat hello.hal | hara stdin
```

Files become more useful once they belong to a project with `project.edn` and `workspace.edn`. A loose file is enough to verify the runtime, but a project records source paths, capabilities, and how the work is presented.

## Path C: build the Hara workspace from source

Use this path when you are changing the kernel or its hosts rather than merely embedding it in a project.

Clone the workspace with its submodules:

```shell
git clone --recurse-submodules https://github.com/hara-lang/hara.git
cd hara
```

If you already cloned without submodules:

```shell
git submodule update --init --recursive
```

### Build the Truffle runtime

Requirements:

- JDK 21;
- Maven; and
- the normal native toolchain required by any optional native-image work.

Build:

```shell
mvn -f java/pom.xml -Ptruffle package
```

Then evaluate through the checked-in launcher:

```shell
./hara eval '(+ 19 23)'
./hara
```

### Build and test the Rust runtime

```shell
cargo test --manifest-path rust/Cargo.toml
```

The Rust workspace contains the native CLI, embedding runtime, WebAssembly builds, web loader, and in-tree WASM extensions. Use it when your work concerns browser embedding, a native host, or a new runtime integration.

### Build the Chrome extension

```shell
cd extensions/hara-chrome
npm ci
npm run build
```

The extension places the shared Hara workspace inside a Chrome DevTools panel. It is a host for the kernel, not a separate language implementation.

## Verify the installation as a live system

A complete check should include more than `hara --version`.

Use this sequence:

1. Evaluate a pure expression.
2. Define a named value.
3. Read that value in a later evaluation.
4. Produce an intentional error and inspect its source location.
5. Start the REPL or Playground and confirm that the session remains active.
6. Identify which host capabilities are available in that environment.

For example:

```hara
(def installation-check
  {:kernel :running
   :session :persistent
   :host :local})
```

Then:

```hara
(get installation-check :kernel)
```

Expected result:

```text
:running
```

## Troubleshooting

### `hara` is not found

Check the installation directory and your `PATH`:

```shell
ls -la "$HOME/.local/bin"
printf '%s\n' "$PATH"
```

Invoke the executable by its full path once before editing shell configuration:

```shell
"$HOME/.local/bin/hara" eval '(+ 1 2)'
```

### The local listener should not be running

Start with:

```shell
hara --offline
```

Use the listener only when another local tool or agent needs to connect to the session.

### A host operation is denied

A denied file, socket, process, browser, canvas, or extension operation is not necessarily an installation failure. Check the project capability declaration and the host in which the kernel is running.

A browser kernel and a native kernel intentionally expose different services.

### The browser example opens but does not render

First determine whether the source evaluated successfully. Then inspect:

- the active kernel status;
- the project capabilities;
- the workspace node that owns the canvas;
- the current output or structured error; and
- whether the example has been changed without re-evaluating its owning form.

The goal is to follow named runtime relationships rather than immediately refreshing the entire page.

## Installation checkpoint

You are ready to continue when you can answer four questions:

1. Where is the kernel running?
2. Which session are you evaluating into?
3. Which host services can that kernel access?
4. Where will accepted changes be retained?

## Next

Continue to [03 — First evaluation](03-first-evaluation.md) to work through the smallest RDD loop: evaluate a form, inspect the resulting value, change live state, and retain the change with clear evidence.
