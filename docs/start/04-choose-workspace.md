# 04 — Choose a workspace: place the kernel beside the system

Choosing a Hara workspace is not primarily an editor preference. It is a decision about where the kernel should run, which host services it should be able to reach, and which live surfaces should be visible while you work.

The same project can be approached through several hosts:

- the browser Playground;
- Hara Chrome inside DevTools;
- Hara VS Code beside a local source tree;
- the terminal REPL and CLI; or
- a headless session used by another tool or agent.

The project source remains portable. What changes is the host boundary and the arrangement of the workspace around the kernel.

## Choose by the system, not by habit

A useful decision begins with the thing you are building.

| System being built | Best first workspace | Why |
| --- | --- | --- |
| A browser-resident visual system | Playground | The kernel, source, canvas, and input can stay together |
| A system that observes or controls an existing page | Hara Chrome | The kernel sits inside Chrome DevTools beside the page |
| A local multi-file project | Hara VS Code or CLI | Source control, files, tests, and named sessions are central |
| Automation or an agent-controlled runtime | Headless CLI session | The kernel can be addressed through a protocol without a terminal UI |
| Kernel or runtime implementation work | Source checkout plus CLI | Build and conformance tools are part of the task |

Do not choose VS Code merely because it is familiar if the live system exists in the browser. Do not choose the browser merely because the final product is a website if the immediate task is a native runtime test suite.

Put the kernel as close as practical to the state and effects you need to inspect.

## The workspace is more than panes

A conventional IDE layout usually records where panels happen to be placed. A Hara workspace can describe relationships among:

- source documents;
- code editor areas;
- visual canvases;
- inspectors;
- REPL and output areas;
- runtime nodes;
- links from source to nodes and outputs; and
- host-specific customisations.

A simplified browser-game workspace looks like this:

```text
src/tron.hal
     |
     v
HAL transform node
     |
     +--> source editor
     |
     +--> visual canvas
     |
     +--> keyboard and pointer input
```

The layout helps a person work. The declared links help the system remain inspectable.

When an output changes, the workspace should make it possible to identify the node and document that own it. When source is selected, the workspace should be able to reveal the relevant runtime projection.

## Browser Playground

Use [Hara Playground](https://playground.hara-lang.org/) when you want the fastest route to an embedded kernel.

The browser path is especially useful for:

- learning the RDD loop;
- visual projects;
- canvas and input experiments;
- sharing a reproducible project without local setup;
- inspecting project and workspace manifests; and
- working with an agent against a live browser-resident system.

### What the browser host provides

The host can provide capabilities such as:

- `:studio/eval`;
- `:studio/node-send`;
- `:canvas/2d`;
- `:input/keyboard`;
- `:input/pointer`;
- audio playback; and
- access to explicitly selected local files where supported.

A project requests capabilities. The host decides whether they are available and granted.

### What to inspect first

When you open a Playground project, find four things before changing code:

1. `project.edn` — what code and capabilities belong to the project;
2. `workspace.edn` — which documents, nodes, areas, and links exist;
3. the active source document — which forms define behaviour; and
4. the live output — which node currently owns the visible result.

This prevents the canvas or preview from becoming an unexplained black box.

### When the Playground is not enough

Move to a local workspace when you need:

- a larger source tree;
- Git operations as part of the immediate loop;
- native files or sockets;
- local tests and build tools;
- a persistent external agent connection; or
- kernel implementation changes.

The move should not require a new programming model. It should change the host and project storage while preserving the evaluate–inspect–keep rhythm.

## Hara Chrome

Hara Chrome places the shared Studio workspace in a Chrome DevTools panel.

Use it when the system already exists as a web page and you want the Hara kernel to live beside that page rather than in a separate editor and terminal arrangement.

Typical uses include:

- inspecting and controlling a page through explicit browser capabilities;
- connecting a Hara project to a local directory;
- working with canvas or page-related runtime state;
- evaluating changes without leaving DevTools; and
- exposing the same live context to a local protocol client when deliberately enabled.

### The important boundary

Chrome DevTools has extensive authority over the inspected page and browser environment. Hara should not convert that authority into ambient language access.

The project declares what it needs. Host namespaces such as `chrome.api` make browser-specific operations explicit. A reader should be able to distinguish ordinary Hara transformations from calls that ask Chrome to do something.

### Local project ownership

The Chrome extension can use a selected home directory as the bridge to a local source tree. Browser permission to that directory is separate from the kernel's language semantics.

Use the project directory as the durable record. IndexedDB spaces and live sessions are working environments, not the only copy of the work.

Read [Create a project with Hara Chrome](../create/chrome-project.md) for the current developer-build installation and project connection steps.

## Hara VS Code

Hara VS Code is useful when local source navigation is important but you still want the editor to be a client of a live kernel.

Use it for:

- multi-file projects;
- named namespaces and tests;
- evaluation from source selections;
- connection to isolated runtime sessions;
- local Git workflows; and
- work where a browser canvas is not the main output.

The central question is not “does Hara have syntax highlighting?” It is “which kernel session will this source selection be evaluated into, and how will the result be inspected?”

### Avoid reducing Hara to editor commands

An editor extension is useful when it preserves the kernel model:

```text
source selection
      |
      v
named kernel session
      |
      +--> structured value or error
      +--> runtime state
      +--> trace or inspector
```

It is less useful when it hides the session and acts like a conventional compile button.

Read [Create a project with Hara VS Code](../create/vscode-project.md) for the current project and session workflow.

## CLI and terminal REPL

The CLI is the most direct local host.

Use it for:

- one-shot evaluations;
- running files and standard input;
- test and build automation;
- local native capabilities;
- a persistent terminal session;
- a headless kernel; and
- protocol-based tooling.

Start the shared `ROOT` session:

```shell
hara
```

Start without a RESP listener:

```shell
hara --offline
```

Start a listener without terminal UI:

```shell
hara headless
```

A headless session is important for agent workflows because it separates the kernel from any particular human interface. The agent can connect to the runtime rather than simulate terminal keystrokes or edit a file and hope a watcher notices.

### Security of the local session

A development protocol that can evaluate forms is powerful. Keep it bound to a trusted local interface unless you have deliberately built authentication and isolation around it.

The capability boundary inside Hara does not make an exposed evaluation port safe by itself.

## One project, several surfaces

A portable project keeps the stable parts together:

```text
project.edn
workspace.edn
src/
test/
extensions/
```

The active host may add session state, local permissions, cached files, or UI layout. Those additions should not be mistaken for the project itself.

Use this division:

| Durable project record | Live workspace state |
| --- | --- |
| Source forms | Current evaluated definitions |
| Project manifest | Active kernel session |
| Workspace manifest | Selected document or node |
| Tests | Current output and errors |
| Extension descriptors | Temporary inspector state |
| Capability requests | Host grants for this run |

A restart should be able to reconstruct the intended project from the durable side. The live side exists to make development faster and clearer.

## Choose an agent working surface

An AI agent needs more than write access to the repository. For meaningful RDD, it needs a controlled path to the live kernel.

Evaluate a workspace for agent use with these questions:

1. Can the agent identify the active project and session?
2. Can it inspect values in a structured form?
3. Can it select or name the runtime object being changed?
4. Can it evaluate a bounded form without restarting the system?
5. Can it distinguish a pure evaluation from a host effect?
6. Can it compare before and after behaviour?
7. Can it retain the accepted source change?
8. Can a human review the evidence?

A browser workspace may be ideal for a visual system if the agent has a direct kernel interface. A headless local session may be better for testable domain logic. The best surface is the one that exposes the relevant system directly and safely.

## Avoid dual control planes

A project becomes confusing when two tools independently believe they own the live system.

Examples include:

- a browser kernel and a separate hot-reload server both replacing state;
- an editor session and a terminal session silently using different namespaces;
- React state and Hara state both claiming to be authoritative;
- a visual workspace graph and source files describing incompatible connections; or
- an agent editing one checkout while evaluating another.

Choose one authoritative kernel session for the current task. Make the project path, namespace, and host visible in the workspace.

When multiple clients connect, they should connect to the same named session intentionally rather than by accident.

## A workspace selection exercise

For the system you intend to build, write down:

```hara
{:system "describe the running thing"
 :kernel-host :browser
 :durable-project "path or space"
 :primary-output :canvas
 :required-capabilities #{:studio/eval :canvas/2d}
 :human-surface :playground
 :agent-surface :kernel-session}
```

Replace the example values with your own.

Then check whether every required capability belongs in the chosen host. If the system requires local files and native processes, a browser-only host may be wrong. If the system is a live canvas, a terminal-only loop may hide the most important feedback.

## Workspace checkpoint

You are ready to continue when you can explain:

- where the kernel runs;
- which project it has loaded;
- which session holds the live definitions;
- which workspace node owns the visible output;
- which host capabilities are granted; and
- how an accepted change returns to source.

## Next

Continue to [05 — Build your first project](../create/first-game.md). You will open a browser game as a live system, inspect its project and runtime graph, change one behaviour, and leave behind enough evidence that a person or agent can explain what changed.
