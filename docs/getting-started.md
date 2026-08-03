# Choose your Hara setup

You can learn Hara before choosing a permanent toolchain.

Start in the browser for the shortest path to a running form. Move to the CLI, an editor, the JVM, or an embedded web kernel when the project needs those capabilities. The `.hal` source language and the core evaluate, inspect, change, and keep workflow remain the same.

## Recommended first route

For a first encounter with Hara, use this order:

1. Read [Why Hara?](start/orientation.md) and run the first form.
2. Continue through [Read Hara and build from scratch](learn-programming/index.md).
3. Use the [Playground](getting-started/playground.md) whenever you want a live browser session.
4. Build [Tic Tac Toe](create/first-game.md) to combine data, rules, state, input, and rendering.
5. Install or embed a runtime when your own project needs one.

This route delays setup decisions until you know what you are trying to build.

## Start without installing anything

### [Playground](getting-started/playground.md)

Use the browser-hosted kernel to evaluate forms, define functions, keep session state, and inspect returned values.

Choose this first when you want to learn the language or test an idea immediately.

### [Web](getting-started/web.md)

Build a browser project or embed the WebAssembly kernel in an existing application.

Choose this when the program itself belongs in the browser or when Hara should become a programmable part of a web product.

## Work locally

### [CLI](getting-started/cli.md)

Install Hara locally, evaluate forms, run `.hal` files, open a REPL, and work with project files and tests.

Choose this when you are ready to create a durable local project.

### [VS Code](getting-started/vscode.md)

Connect source files and editor commands to a named Hara session.

Choose this when the source tree should be the main work surface and you want evaluation close to the code.

### [Emacs](getting-started/emacs.md)

Edit `.hal` files and evaluate forms, regions, or files from Emacs.

Choose this when you want a Lisp-native editing workflow around the same Hara runtime.

## Work with Java

### [JVM](getting-started/jvm.md)

Use the Truffle runtime, Java classes, Maven projects, or JVM contributor tools. Hara can run alongside an existing Java system and can target Native Image deployment.

Choose this when Java interop or the JVM ecosystem is part of the application.

## One project, several surfaces

A normal Hara project keeps its durable source and project description together:

```text
my-project/
  project.edn
  workspace.edn
  src/
    app/
      main.hal
```

- `.hal` files contain executable source.
- `project.edn` describes source roots, dependencies, runtime expectations, and requested capabilities.
- `workspace.edn` can describe the files, areas, nodes, controllers, visualisers, and connections that form a visual workspace.

The Playground, CLI, browser, JVM, and editors are ways to reach the project. They are not separate versions of the language.

A live session is a feedback environment rather than the only copy of the work. Test a form against the running system, inspect the result, and keep successful definitions in source so the project can be reopened in a fresh session or another host.

## Choose by what the program needs

| Need | Begin with |
| --- | --- |
| Learn Hara or test one form | [Playground](getting-started/playground.md) |
| Create scripts, tests, and local files | [CLI](getting-started/cli.md) |
| Build a browser application | [Web](getting-started/web.md) |
| Integrate with Java | [JVM](getting-started/jvm.md) |
| Evaluate from a source editor | [VS Code](getting-started/vscode.md) or [Emacs](getting-started/emacs.md) |

You do not need to choose permanently. Keep pure transformations and application rules portable, then place host-specific effects behind explicit capability boundaries.

## Continue

New to the language? Continue with [Read Hara and build from scratch](learn-programming/index.md).

Ready to make something complete? Build [Tic Tac Toe](create/first-game.md).
