# Getting Started

Hara can be entered through several hosts and work surfaces. They use the same
`.hal` source language and the same live evaluate, inspect, change, and keep
workflow, but each surface provides a different set of tools and host
capabilities.

Choose the path that matches where you want to work:

| Path | Start here when you want to |
| --- | --- |
| [With the CLI](getting-started/cli.md) | install Hara locally, evaluate forms, run files, and use the REPL |
| [With the JVM](getting-started/jvm.md) | use the Truffle runtime, Java classes, Maven, or JVM contributor tools |
| [With the Web](getting-started/web.md) | build a browser project, use Hara Chrome, or embed the WASM kernel |
| [With Playground](getting-started/playground.md) | try Hara immediately with no local installation |
| [With Emacs](getting-started/emacs.md) | edit `.hal` files and evaluate regions or files from Emacs |
| [With VS Code](getting-started/vscode.md) | connect a source workspace to a running named Hara session |
| [With Greenways OS](getting-started/greenways-os.md) | use Hara as a live kernel inside an integrated visual and AI workspace |

## One project, several surfaces

A normal project keeps its source and workspace description together:

```text
my-project/
  project.edn
  workspace.edn
  src/
    app.hal
```

`project.edn` describes project roots and requested capabilities.
`workspace.edn` describes files, areas, nodes, controllers, visualisers, and
connections. Executable source uses `.hal`.

The live session is a feedback environment, not the only copy of the work. Keep
successful definitions in source so the project can be reopened from another
surface or loaded into a fresh session.

## Choose by outcome

Use Playground for the shortest first experience. Use the CLI when you need
local files, scripts, tests, or a runtime for an editor. Use the Web path when
the program lives in a browser. Use the JVM path for Java interop and Truffle
work. Use Emacs or VS Code when the source tree should be your main surface.
Use Greenways OS when the project should open as a connected workspace of
state, controllers, visualisers, host services, and AI collaborators.

You do not need to choose permanently. A well-structured Hara project can move
between these surfaces while keeping host-specific operations at explicit
provider boundaries.