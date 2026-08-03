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
You do not need to choose permanently. A well-structured Hara project can move
between these surfaces while keeping host-specific operations at explicit
provider boundaries.

# On the Web

In [Why Hara?](start/orientation.md), you opened a Hara kernel in the browser,
evaluated a form, and saved the result as source.

You can continue using Hara entirely in the browser. This chapter shows how the
same project can also be opened through the CLI, VS Code, and Chrome DevTools.
Each route is optional: choose the tools that are useful to you, or continue
directly to the next chapter.

## The project from Why Hara?

At the end of Why Hara?, your source looked like this:

```hara
(ns getting-started.main)

(defn answer []
  (+ 19 23))

(answer)
```

Evaluating the final form returned `42`.

The source does not belong to the Playground. It belongs to the project. The
Playground was simply the first host through which you accessed a Hara kernel.

<div class="hara-project-path" role="img" aria-label="Project source flows through a Hara kernel to the result 42">
  <div><i>▤</i><b>Project source</b><small>Durable `.hal` forms.</small></div><span>↓</span>
  <div><i>◉</i><b>Hara kernel</b><small>Reads and evaluates forms.</small></div><span>↓</span>
  <div><i>42</i><b>Result</b><small>Inspectable value.</small></div>
</div>
