# Get started with the CLI

The command line is the most direct way to install Hara, evaluate a form, run a
source file, and keep a REPL open while you work. Use this path when you want a
small local setup, a scriptable workflow, or a runtime that can later be
connected to an editor.

## Install Hara

The quickest way to install Hara is with Homebrew. macOS and Linux binaries for
x86_64 and arm64 are published through the `hara-lang/tap` repository:

```shell
brew install hara-lang/tap/hara
brew install hara-lang/tap/hara-truffle
```

`hara` is the Rust runtime; `hara-truffle` is the GraalVM/Truffle native image.
You can install either or both.

Alternatively, you can use the curl installer. The installer endpoint is being
restored, so the commands below will work once the download service is back up:

```shell
curl -fsSL https://hara-lang.org/install.sh | sh -- --rust --truffle
```

Install only the Rust runtime:

```shell
curl -fsSL https://hara-lang.org/install.sh | sh -- --rust
```

Install only the Truffle native image:

```shell
curl -fsSL https://hara-lang.org/install.sh | sh -- --truffle
```

Use `HARA_INSTALL_DIR` to choose another destination, or set `HARA_VERSION` to
pin a release:

```shell
HARA_INSTALL_DIR="$HOME/bin" \
HARA_VERSION=v0.1.0 \
  curl -fsSL https://hara-lang.org/install.sh | sh -- --rust
```

Make sure the installation directory is on `PATH`, then check that the command
is available:

```shell
hara --help
```

## Evaluate one form

Run a complete Hara form with `eval`:

```shell
hara eval '(let [x 19] (+ x 23))'
```

Expected result:

```text
42
```

This is useful for shell scripts, smoke tests, and checking a small expression
without opening an interactive session. Quote the form so the shell does not
interpret its parentheses, spaces, or symbols.

Try a persistent collection:

```shell
hara eval '(assoc {:name "Hara"} :ready true)'
```

Then change one part of the form and run it again. The quickest learning loop is
predict, run, change, and explain.

## Start the REPL

Start an interactive ROOT session:

```shell
hara
```

Start the REPL without a RESP listener:

```shell
hara --offline
```

The REPL is the normal place to explore a namespace one form at a time. It
supports multiline forms, persistent history, slash and symbol completion,
inline documentation, and listener control through `/resp`.

Use the REPL for experiments, but keep durable work in `.hal` files. The live
session is feedback; the source tree remains the project record.

## Run a source file

Create `hello.hal`:

```hara
(ns hello)

(defn greeting [name]
  (str "Hello, " name))

(greeting "Hara")
```

Run it:

```shell
hara run hello.hal
```

You can also pipe source through standard input:

```shell
cat hello.hal | hara stdin
```

The stdin path is useful for editor integrations and generated source because
the source does not need to be written to a temporary file first.

## Start a project directory

A Hara project keeps executable source and workspace data together:

```text
my-project/
  project.edn
  workspace.edn
  src/
    app.hal
```

Use `.hal` for executable Hara source. `project.edn` describes project roots and
requested capabilities. `workspace.edn` describes the files, areas, nodes, and
connections used by visual workspaces.

A useful first routine is:

1. Open a terminal in the project root.
2. Start `hara` and leave the session running.
3. Edit a `.hal` file.
4. Evaluate a small form while the program remains alive.
5. Keep the useful change in source and run the file again.

## Choose a runtime deliberately

The installed `hara` Rust binary and `hara-truffle` native image expose the
same public CLI applications and route hierarchy. Choose the runtime by
executable name; commands are not silently delegated between runtimes.

The canonical project routes are grouped:

```shell
hara project check
hara project run
hara project test
```

The existing flat project verbs remain compatibility aliases during the draft
CLI contract. Package, specification, and extension operations use their own
top-level application groups.

Use the Rust runtime for a small native CLI, server work, and the runtime core
shared with WebAssembly. Use the Truffle runtime when you need the JVM provider,
Java classes, Maven-based contributor tests, or the GraalVM/Truffle host.

Portable code should not depend on a host merely because it runs on that host.
Files, sockets, Java reflection, browser APIs, and other host operations cross
explicit provider and capability boundaries.

## Connect an editor later

The CLI can remain the runtime while an editor becomes the source surface.
Hara VS Code connects to the listener exposed by the running server. Emacs can
send a region through `hara stdin`. Both approaches preserve the same project
and source files.

## Troubleshooting

If `hara` is not found, confirm the installation directory is on `PATH`:

```shell
printf '%s\n' "$PATH"
ls -la "$HOME/.local/bin"
```

If an editor cannot connect, start the ordinary `hara` command rather than
`hara --offline`, then inspect the listener status in the REPL. The standard
editor endpoint is `127.0.0.1:4164`, although a runtime or deployment may use a
different address.

If host operations return `unsupported` or `denied`, distinguish two cases:
`unsupported` means the current host has no provider for the operation;
`denied` means the provider exists but the session has not been granted the
required capability.

## Continue

Read the [language contract](../reference/l0-language.md) for the language surface, the
[kernel and REPL reference](../kernel.md#repl-workflow) for interactive behavior, and
[projects and visual workspaces](../projects/index.md) for the shared project
model.
