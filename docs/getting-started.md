# Install Hara and choose a workspace

The quickest path is to install the CLI, evaluate one form, and then choose the
workspace that fits what you want to make.

## Install the Hara CLI

Linux (x86_64) and macOS (arm64, x86_64):

```shell
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --rust --truffle
```

This installs `hara` and the native-image `hara-truffle` to `~/.local/bin`; neither needs a
JVM at runtime. GitHub Releases is the publishing authority for the downloaded packages and
checksums. Install only one runtime with `--rust` or `--truffle`.
Override the location with `HARA_INSTALL_DIR`, or pin a release with `HARA_VERSION=v0.1.0`.

## Evaluate a form

```shell
hara eval '(let [x 19] (+ x 23))'
```

Expected result:

```text
42
```

## Start the REPL

```shell
hara

# ROOT REPL without a RESP listener
hara --offline
```

The REPL opens with large alien-abduction Hara art, a clear-to-blue-to-black gradient, the
`Journey Within` tagline, and a spaced command menu.
It supports multiline forms, persistent history, cursor-level slash and symbol completion, inline documentation,
and RESP listener control through `/resp`. The left prompt shows only the current namespace; the
header identifies session `ROOT`, and the right prompt shows live listener status. See [`User guide`](user-guide.md) and [`REPL specification`](reference/repl.md).

## Run a file or stdin

```shell
hara run lib/examples/hello.hal
cat lib/examples/hello.hal | hara stdin
```

## Choose where to work

Every surface uses the same `.hal` source and live evaluate–inspect–keep rhythm.
Choose based on the thing you are making:

| Workspace | Best for | Start here |
| --- | --- | --- |
| Browser Playground | Trying Hara immediately and making visual browser projects | [Open Playground](https://playground.hara-lang.org/) |
| Hara Chrome | Programming a page from Chrome DevTools and using Chrome APIs | [Create a Chrome project](create/chrome-project.md) |
| Hara VS Code | Working from a local source tree with named runtime sessions | [Create a VS Code project](create/vscode-project.md) |
| CLI and REPL | Running files, automating tests, and integrating Hara with other tools | Continue below |

Projects remain portable between these surfaces. Keep `project.edn`,
`workspace.edn`, and source together; the live session is feedback, not the
only copy of the work. Read [Projects and visual workspaces](projects/index.md)
for the shared project model.

## Build the Truffle runtime from source

Contributors need JDK 21 and Maven:

```shell
java -version
mvn -version
mvn -f java/pom.xml -Ptruffle package
```

This produces `java/target/hara-truffle.jar`. From the repository root, use
the checked-in `./hara` launcher for the examples above.

## Run the JVM tests

```shell
mvn -q -f java/pom.xml test
mvn -q -f java/pom.xml -Ptruffle -Dtest=hara.truffle.HaraL0ConformanceTest test
```

For contributor workflows, test slices, native-image builds, and troubleshooting, read the
[developer guide](development.md). To build a multi-file project, continue with
[Namespaces, libraries, and tests](namespaces.md).
