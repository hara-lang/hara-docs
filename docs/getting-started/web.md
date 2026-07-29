# Get started with the Web

Use the Web path when the program lives in a browser, renders visual output, or
needs to work alongside a page. Hara's Web runtime uses the same language model
as the native CLI, but host-dependent work crosses browser and WebAssembly
provider boundaries.

This page describes the project-oriented Web path. For a zero-install first
session, use [Playground](playground.md). For a browser workspace attached to
Chrome DevTools, use Hara Chrome as described below.

## Understand the browser runtime

The Rust runtime is shared by the native CLI and the WebAssembly build. Reader,
evaluator, protocols, persistent data structures, functions, atoms, iterators,
promises, bytes, and other portable values behave consistently across those
targets. The host adapters are different.

A browser kernel normally maps to one worker and one WebAssembly instance. A
kernel can contain multiple isolated sessions. Each session owns its mutable
language state and attached capabilities, while immutable runtime
infrastructure can be shared.

The evaluator does not call browser or operating-system APIs directly. Files,
storage, networking, rendering, timers, and page access are supplied by host
providers. Unsupported operations return `unsupported`; operations that exist
but have not been granted return `denied`.

## Choose the Web surface

There are three useful browser entry points:

| Surface | Use it for |
| --- | --- |
| Playground | Trying Hara immediately without installing an editor |
| Hara Chrome | Programming a page from a Chrome DevTools panel |
| Embedded kernel | Building Hara into another Web application or workspace |

All three should use `.hal` source and the same evaluate, inspect, change, and
keep rhythm. The difference is where the kernel lives and which host
capabilities it receives.

## Create a browser project

Start with a small project directory:

```text
orbit-game/
  project.edn
  workspace.edn
  src/
    game.hal
```

`project.edn` describes source roots and requested capabilities.
`workspace.edn` describes the files, areas, nodes, visualisers, controllers, and
connections that make up the workspace. New projects use these data manifests.

Create `src/game.hal`:

```hara
(ns orbit.game)

(def player
  (atom {:x 40
         :y 30
         :score 0}))

(defn move-right [amount]
  (swap! player
         (fn [state]
           (assoc state :x (+ (get state :x) amount)))))

(move-right 2)
```

The atom is the current state. The function describes one state transition. A
browser visualiser can watch that state and render the result without changing
the language-level model.

## Load Hara Chrome

Hara Chrome currently ships as a developer build. Build it from the Hara
workspace, then:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select `extensions/hara-chrome`.
5. Open DevTools for a page.
6. Select the **hara** panel.

The panel combines a browser-resident Hara runtime, a file and space view, and a
REPL that evaluates in the active kernel.

## Connect the project directory

Inside the Hara panel:

1. Select **choose home**.
2. Grant access to the project directory.
3. Open a `.hal` source file.
4. Use **run .hal file** to load it into the active kernel.
5. Evaluate smaller forms in the Studio REPL while the project remains alive.

The browser stores Studio spaces and files locally in IndexedDB. The chosen
home directory bridges the browser workspace to the local source tree. Browser
permission controls how long that directory remains available.

Keep the source tree authoritative. IndexedDB and a running session are useful
working state, but they should not be the only copy of the project.

## Connect state to a visualiser

A useful Web project separates three concerns:

- the atom or session value that owns current state;
- a controller that proposes or applies state changes;
- a visualiser that reads state and renders an output.

For example, a controller may call `move-right`, while a canvas visualiser reads
`player` and redraws the scene. The connection is part of the workspace rather
than hidden inside a monolithic event loop.

This is also a useful way to learn evaluation. A form can be shown entering the
reader, expanding through macros, evaluating against a session, changing an
atom, triggering a watch, and finally updating a visual surface.

## Work safely with the page

Use Hara Chrome when the thing you are making lives in, observes, or controls a
browser page. The panel exposes explicit host namespaces for Chrome API work.
Treat page access and Chrome APIs as capabilities, not as ordinary portable
functions.

The optional local RESP bridge is a privileged developer tool. A local process
that connects may be able to evaluate code with the panel's granted Chrome
capabilities. Keep the listener local, understand which session is active, and
do not expose the bridge as an unauthenticated network service.

## Embed a kernel in another Web application

An embedded application owns the host boundary. It creates the worker or WASM
instance, starts a kernel, creates or selects sessions, and decides which
providers each session can use.

A sound embedding should keep these layers separate:

```text
Hara source and forms
        ↓
portable evaluator and session state
        ↓
provider interfaces
        ↓
browser storage, rendering, networking, and application APIs
```

The host should pass data through stable Hara values or explicit foreign
handles. It should not make arbitrary JavaScript objects appear to be portable
Hara collections.

## Test portability

Keep pure state transitions independent of the browser. Test those functions on
the CLI or JVM runtime, then test only the provider boundary in the browser.

A useful split is:

```hara
(ns orbit.logic)

(defn move [state dx dy]
  (-> state
      (assoc :x (+ (get state :x) dx))
      (assoc :y (+ (get state :y) dy))))
```

The browser-specific namespace can call `move`, update an atom, and render. The
logic namespace remains portable and deterministic.

## Continue

Build the [first browser game](../create/first-game.md), follow the deeper
[Hara Chrome project guide](../create/chrome-project.md), read
[projects and visual workspaces](../projects/index.md), and use the
[Rust and WASM runtime mapping](../reference/rust-runtime.md) when implementing
or embedding the browser host.
