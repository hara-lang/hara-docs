# Get started with Greenways OS

Greenways OS is the integrated workspace path: Hara runs as a programmable
kernel inside a wider environment that can provide files, visual surfaces,
controllers, services, and AI collaborators.

The important boundary is that Greenways OS is a host for Hara, not a different
Hara language. Projects still use `.hal` source, `project.edn`, and
`workspace.edn`. The host decides which capabilities a kernel session can use
and how those capabilities appear in the workspace.

> **Integration status**
>
> This page defines the intended getting-started contract for the Greenways OS
> host. Exact packaging and interface labels may change while the host is being
> integrated. The project, kernel, session, filesystem, and capability
> boundaries described here should remain stable.

## What Greenways OS adds

The CLI gives you a terminal and REPL. An editor gives you source navigation.
Greenways OS adds an environment around the running project:

- a project and filesystem surface;
- one or more Hara kernels;
- isolated named sessions inside each kernel;
- visualisers that render session values;
- controllers that submit events or state transitions;
- host services exposed through explicit capabilities;
- AI collaborators that can inspect source, propose changes, and evaluate in a
  controlled session.

The result is closer to a programmable operating workspace than a single code
editor. Hara provides the live language kernel; Greenways OS provides the host
surfaces and authority.

## Start with a normal Hara project

Create or open a project with the standard shape:

```text
my-greenways-project/
  project.edn
  workspace.edn
  src/
    app/
      main.hal
```

Executable source belongs in `.hal` files. `project.edn` declares source roots,
dependencies, runtime expectations, and requested capabilities.
`workspace.edn` declares the files, areas, nodes, visualisers, controllers, and
connections that should appear when the workspace opens.

Greenways OS should not require a second hidden copy of the project. The same
source tree should remain usable from the CLI, VS Code, Emacs, Playground, or a
browser host where the requested capabilities are available.

## Understand kernels and sessions

A **kernel** is the runtime container. In a browser it normally maps to one
worker and one WebAssembly instance. In a native host it may map to a process or
embedded runtime.

A **session** is an isolated execution context inside the kernel. Each session
owns its mutable language state, namespace definitions, tasks, attached
filesystems, and granted capabilities.

A Greenways OS workspace may use several sessions:

```text
Hara kernel
  ├── project       durable project work
  ├── scratch       temporary experiments
  ├── visualiser    restricted rendering session
  └── agent-review  isolated AI-proposed evaluation
```

Sessions can share immutable runtime infrastructure without sharing atoms,
definitions, tasks, document state, or authority.

## Attach the project filesystem

The host attaches a project directory or virtual filesystem to a session. The
attachment should have an explicit identity and permission set rather than
making the whole machine filesystem globally visible.

A typical project session needs:

- read access to project source and manifests;
- write access to the project when the user is editing;
- a temporary area for generated values or build output;
- no access to unrelated directories unless the user grants it.

A visualiser session may need read-only access or no filesystem at all. An AI
review session may receive a snapshot or branch rather than direct authority to
rewrite the working tree.

Portable `file/*` operations use the provider attached by the host. A missing
provider returns `unsupported`; insufficient authority returns `denied`.

## Start the project session

The Greenways OS host should perform these operations explicitly:

1. Create or select a Hara kernel.
2. Create a named project session.
3. Attach the project filesystem.
4. Grant only the capabilities declared and approved for the project.
5. Load the project's entry namespace or selected `.hal` file.
6. Connect workspace nodes to values and callable transitions in that session.

This sequence can be represented visually, but it should remain inspectable.
The user should be able to see which kernel and session are active and which
capabilities have been granted.

## Define state and transitions

Create `src/app/main.hal`:

```hara
(ns app.main)

(def model
  (atom {:message "Hello from Greenways OS"
         :count 0}))

(defn increase []
  (swap! model
         (fn [state]
           (assoc state
                  :count
                  (+ (get state :count) 1)))))

(defn set-message [message]
  (swap! model assoc :message message))
```

The atom is the current model. `increase` and `set-message` are named
transitions. They can be called from the REPL, a button controller, an AI tool,
or another host event without moving the rules into the UI layer.

## Connect a visualiser

A visualiser reads a value and produces a representation. It might render text,
a graph, a canvas, a table, a document view, or a domain-specific scene.

Connect the visualiser to `model` and display:

```text
message: Hello from Greenways OS
count: 0
```

Connect a controller to `increase`. When the controller fires, the session
updates `model`; the visualiser observes the new value and redraws.

The connection should be visible in `workspace.edn` or another durable project
representation. It should not exist only as an unrecorded gesture in the live
workspace.

## Use Hara as the workspace kernel

Hara is useful as a Greenways OS kernel because it can keep a program alive
while source, state, and views change independently. The host does not need to
restart the whole application for every source edit.

A live update can follow this path:

```text
source form
    ↓
reader and macroexpansion
    ↓
selected project session
    ↓
new definition or state transition
    ↓
watch or workspace connection
    ↓
visualiser redraw
```

This path can be inspected step by step. That makes the workspace suitable for
learning, debugging, AI collaboration, and visual dataflow programming.

## Work alongside AI safely

An AI collaborator should not be given one undifferentiated "control the OS"
permission. Separate its roles:

- **read source**: inspect the project and explain it;
- **propose patch**: create a diff without applying it;
- **evaluate scratch code**: run forms in an isolated session;
- **apply accepted source change**: write only after user approval;
- **operate host service**: use a narrow capability for a specific task.

A good workflow is:

1. The AI reads the relevant source and workspace declarations.
2. It proposes a source change.
3. The change is evaluated in `agent-review` or another isolated session.
4. The user inspects the value, visual result, and diff.
5. The accepted change is written to the project source.
6. The project session loads the accepted form.

This preserves the distinction between a convincing live experiment and the
versioned project record.

## Keep the host boundary explicit

Greenways OS may provide databases, identity, secrets, network services,
documents, media, sensors, or deployment tools. Hara code should access those
through named host providers rather than ambient global objects.

The project should be able to answer:

- Which session can call this service?
- Which provider implements the operation?
- Which capability granted access?
- Which Hara value or foreign handle represents the result?
- What happens when the provider is unavailable?
- Can the pure part of the code be tested without the host?

Keep host-specific code in small boundary namespaces. Keep transformations,
validation, and state rules portable where possible.

## Save the workspace as a program

A Greenways OS workspace is not merely a screen layout. It can describe an
executable dataflow program made from:

- atomic state;
- pure transformations;
- mutable transitions;
- controllers;
- visualisers;
- watches and connections;
- host capabilities;
- kernel and session selection.

Store those declarations with the project. Reopening the project should
reconstruct the workspace without depending on hidden browser state or a
specific user's session history.

## Decide what persists

Treat each layer differently:

| Layer | Persistence rule |
| --- | --- |
| `.hal` source | versioned project record |
| `project.edn` | versioned project and capability declaration |
| `workspace.edn` | versioned workspace structure |
| session definitions | temporary until kept in source |
| atom values | runtime state unless deliberately saved |
| visualiser output | derived unless exported |
| AI proposals | reviewable diff until accepted |
| filesystem attachment | host configuration, not language state |

This prevents a live workspace from hiding important state in places that
cannot be reproduced.

## Troubleshooting

When a project loads but a value is missing, confirm the active kernel, session,
namespace, and source file. A definition in `scratch` does not automatically
exist in `project`.

When a controller fires but nothing changes, inspect the target function, the
atom it updates, and the connection between that atom and the visualiser.

When a host operation fails, distinguish `unsupported` from `denied`. The first
means the host did not attach the provider; the second means the session lacks
a grant.

When an AI-generated change works only in its review session, make sure the
accepted definition was written to source and evaluated in the project session.

## Continue

Read [Kernel architecture](../reference/runtime/kernel-architecture/index.md)
for the kernel and session model,
[Multi-session kernels with attachable filesystems](../reference/runtime/kernel-architecture/multi-session-kernels.md)
for the target host contract, and
[projects and visual workspaces](../projects/index.md) for the durable workspace
model.