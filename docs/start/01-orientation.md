# 01 — Orientation: Hara is a live kernel

Hara is best understood as an **embeddable kernel for live, inspectable systems**.

It has a small Lisp-shaped notation, but the notation is not the main product. The important thing is the running kernel behind it: a persistent evaluation context that can live inside a browser, a development tool, or another host and expose a system to controlled observation and change.

This manual starts from that kernel model.

By the end of this chapter, you should understand:

- what the Hara kernel owns;
- what remains the responsibility of the browser or other host;
- why Hara uses runtime-driven development rather than an IDE-first workflow;
- how inspectability changes the way systems are designed; and
- why the same model is useful to a person and to an AI agent.

## Begin with the running system

A conventional development workflow is organised around files:

```text
edit files -> build -> start program -> reproduce state -> inspect result
```

The program is usually downstream from the editor. The editor knows a great deal about source text but very little about the actual state of the system once it is running.

Hara reverses that emphasis:

```text
running system
    |
    +--> inspect state
    +--> evaluate a focused change
    +--> observe the consequence
    +--> retain the accepted change in source
```

The source still matters. It remains the durable, reviewable record of the project. But development begins with a live system that can answer questions about itself.

This is **runtime-driven development**, or **RDD**.

RDD does not mean making arbitrary changes in production. It means designing the development system so that the runtime can be observed, queried, and changed through explicit interfaces while it is alive.

## The kernel model

A Hara installation has several layers. Keeping them separate is the first step toward understanding the project.

```text
+------------------------------------------------------+
| Host                                                 |
| Browser, Chrome DevTools, VS Code, CLI, native app   |
|                                                      |
|  +------------------------------------------------+  |
|  | Hara kernel                                    |  |
|  | reader, evaluator, namespaces, Vars, values,   |  |
|  | sessions, protocols, promises, traces          |  |
|  |                                                |  |
|  |  +------------------------------------------+  |  |
|  |  | Project                                  |  |  |
|  |  | source, capabilities, extensions         |  |  |
|  |  +------------------------------------------+  |  |
|  |                                                |  |
|  |  +------------------------------------------+  |  |
|  |  | Workspace                                |  |  |
|  |  | documents, areas, nodes, links, layout  |  |  |
|  |  +------------------------------------------+  |  |
|  +------------------------------------------------+  |
+------------------------------------------------------+
```

### The host

The host supplies the environment in which the kernel runs. A browser host can supply a canvas, input events, workers, storage, and selected browser capabilities. A native host can supply files, sockets, subprocesses, or other services when the project has been granted access.

The host is not an invisible global object. Hara treats access to the host as a boundary that should be declared and inspected.

### The kernel

The kernel reads forms, evaluates them, retains definitions and runtime state, resolves namespaces, applies protocols, and reports values and errors. It provides continuity: two evaluations in the same session can refer to the same definitions and live values.

That continuity is what makes RDD possible. The kernel is not just a command-line compiler that disappears after producing an executable.

### The project

A project is the durable unit of work. It contains source plus the declarations needed to load that source in a controlled environment.

A current project normally includes:

```text
my-project/
  project.edn
  workspace.edn
  src/
    main.hal
```

`project.edn` declares source paths, an entry namespace, extensions, and requested capabilities. The project says what code belongs together and what authority it needs.

### The workspace

A workspace declares how the project is presented and connected while it is being worked on. It can describe code documents, visual areas, runtime nodes, inspectors, canvases, and links between them.

The workspace is not merely window layout. It is a readable description of how source and runtime surfaces relate.

## Hara has a notation, but it is not positioned as “another language”

You will write forms such as:

```hara
(defn total [prices]
  (reduce + 0 prices))

(total [12 18 30])
```

The Lisp notation is useful because it is compact, structural, and easy for the kernel to read as data. It supports small evaluations and precise source spans. It also gives people and agents a common representation for definitions, values, and transformations.

But learning the notation is not the same as understanding Hara.

The larger idea is:

> Put a small, controllable kernel inside the system so that the system can be worked on while it is alive.

The notation is the control surface for that kernel.

## Runtime-driven development

The normal Hara loop is:

1. **Observe** the running system.
2. **Select** the smallest relevant state, function, node, or form.
3. **Inspect** its current value and relationships.
4. **Evaluate** a focused change in the active kernel.
5. **Compare** the new behaviour with the previous behaviour.
6. **Keep** the accepted change in project source.
7. **Explain** the change through names, links, tests, or trace evidence.

This loop is intentionally smaller than edit–build–restart.

A small loop changes design habits. You are encouraged to create named values, narrow transformations, explicit effects, and visible boundaries because those are easier to inspect and replace independently.

### IDE-first and runtime-driven development

| IDE-first emphasis | Runtime-driven emphasis |
| --- | --- |
| Navigate files | Navigate the live system and its source |
| Infer runtime behaviour from code | Ask the runtime for current values and evidence |
| Rebuild a large unit | Evaluate the smallest meaningful form |
| Reproduce state after restart | Continue from the active session when appropriate |
| Debug after behaviour becomes opaque | Design state and connections to remain inspectable |
| Agent edits text and waits for CI | Agent can inspect, evaluate, compare, and then edit |

Hara can still be used from VS Code, Emacs, or another editor. The difference is that the editor is a surface around the kernel rather than the centre of the architecture.

## Inspectability is a design property

Many systems become difficult to understand because important relationships exist only implicitly:

- state is hidden inside component instances;
- events cross several callback layers;
- effects are initiated by ambient global objects;
- a visual output cannot be traced back to the value that produced it;
- the runtime cannot describe why it made a decision; or
- debugging depends on manually reconstructing a transient situation.

Hara aims to make inspectability part of the system shape.

An inspectable system should make it possible to answer questions such as:

- What values currently exist?
- Which definition produced this value?
- Which node owns this canvas or output?
- What input caused this transition?
- Which capability allowed this host effect?
- What changed between two evaluations?
- Can the relevant part be represented as data rather than a screenshot?
- Can a person and an agent refer to the same object by a stable name?

The answer will not always be a single built-in command. Inspectability comes from the combination of persistent values, named definitions, workspace links, explicit capabilities, structured errors, and optional execution traces.

## A kernel for people and agents

An AI coding agent working only through an IDE generally sees source files, terminal output, and screenshots. It must infer the live system from indirect evidence.

A kernel changes the collaboration model. The person and agent can work against the same live context:

```text
person -----------+
                  |
                  v
             Hara kernel
                  ^
                  |
agent ------------+
```

Both can ask for structured values, evaluate bounded changes, inspect errors, and retain accepted work in the project. The agent does not need a separate hidden model of the application if the application exposes its important state and relationships through the kernel.

This does not remove the need for review. It improves the evidence available for review.

A useful agent interaction should be able to say:

1. which live object it inspected;
2. what value or trace it observed;
3. which form it evaluated;
4. what changed as a result; and
5. which source change should be retained.

That is substantially clearer than “I changed several files and the screenshot looks right.”

## The browser is a first-class host

The browser is not only a deployment target. It is an environment in which the Hara kernel can be embedded next to the thing being built.

In the browser, the kernel can support a workflow where:

- the application remains open;
- source is available in the workspace;
- a form is evaluated without reloading the entire page;
- the resulting value or visual change appears immediately;
- input and canvas access are provided through declared host capabilities; and
- an agent can work through the same kernel interface rather than controlling an editor by imitation.

The [Playground](https://playground.hara-lang.org/) is the fastest way to experience this model. Hara Chrome places the shared workspace inside Chrome DevTools. Hara VS Code and the CLI connect the same development rhythm to local projects and runtime sessions.

## What Hara should own

A good Hara project gives the kernel ownership of the parts that benefit from continuity and inspection:

- domain values and rules;
- named transformations;
- state transitions;
- project namespaces;
- runtime nodes and their relationships;
- evaluation history and errors;
- capability requests; and
- optional trace evidence.

The host should own services that are genuinely host-specific:

- browser rendering primitives;
- keyboard, pointer, and touch events;
- files and sockets;
- workers and processes;
- platform APIs; and
- deployment concerns.

The boundary should be explicit enough that a reader can tell whether a form is pure kernel work or a request to the host.

## A first checkpoint

Before moving on, you should be able to explain Hara without leading with syntax:

> Hara is an embeddable live kernel. It lets a person or agent inspect and change a running system through explicit evaluations, project structure, workspace relationships, and controlled host capabilities. Source remains the durable record, but the runtime is an active participant in development.

That is the orientation for the rest of the manual.

## Next

Continue to [02 — Install](02-install.md) to choose between the browser path and a local kernel, install the runtime when needed, and verify that an evaluation reaches a working session.
