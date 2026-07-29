# Live coding

Live coding means changing a program while it is running and observing the effect immediately.

In Hara, this is not limited to performance art or audiovisual work. It is a general development technique. You can evaluate a function, replace a definition, update application state, attach a visualiser, or send a command to a host capability without restarting the whole system.

## The edit-evaluate-observe loop

The core loop is deliberately small:

```text
edit
  ↓
evaluate
  ↓
observe
  ↓
refine
```

The important difference from a conventional rebuild cycle is that the runtime remains alive. State can persist, connected tools can remain attached, and only the part you are working on needs to change.

## Work with small forms

A live system encourages evaluation at the smallest useful scale. You can test a literal value, one expression, a function, or a namespace rather than running an entire application after every change.

```hara
(map inc [1 2 3])
```

```hara
(defn double [x]
  (* x 2))
```

```hara
(double 21)
```

Each result becomes part of the conversation between you and the runtime.

## Preserve state while changing behaviour

Live coding becomes especially useful when state is expensive or inconvenient to recreate. A game may already contain players and world state. A visual scene may already be running. A music pipeline may already have timing, instruments, and controls attached.

Hara lets you change the functions that interpret or render that state without necessarily replacing the state itself.

```hara
(def app-state
  (atom {:count 0
         :running true}))
```

You can update the rendering or event-handling definitions while `app-state` continues to hold the current session.

## Feedback can be visual, audible, or structural

The result of evaluation does not have to be printed text. A value can be routed to a visualiser, graph, drawing surface, audio pipeline, inspector, or controller.

For example:

```text
atom
  ├── inspector
  ├── chart
  ├── shader uniform
  └── audio parameter
```

A single state change can therefore be observed through several representations at once.

## Live coding is not uncontrolled mutation

A live environment still benefits from clear boundaries. Hara programs should distinguish between:

- pure transformations that can be evaluated repeatedly;
- stateful operations that intentionally change the running system;
- host effects that cross into the browser, JVM, operating system, or device;
- long-lived resources that need explicit ownership and cleanup.

This separation makes live work predictable. Re-evaluating a pure function is safe. Replacing an event handler should unregister or supersede the previous one. Starting audio or animation should have a corresponding stop operation.

## Errors stay local

A useful live-coding environment should make mistakes cheap. A failed form should report an error without destroying unrelated runtime state. You can correct the form and evaluate it again.

This supports exploratory programming: trying a transformation, inspecting a value, and revising the idea before committing it to a larger design.

## Controllers and visualisers

Hara's broader model treats controllers and visualisers as tools attached to live values.

A controller writes intentional changes into state. A visualiser reads state and gives it an appropriate form. Neither needs to own the underlying program.

```text
controller → atom → visualiser
                 ↘ program logic
```

This arrangement is the basis for visual dataflow workspaces. The live program remains authoritative, while tools provide alternate ways to manipulate and understand it.

## Live coding across hosts

The same pattern can operate in different environments:

- in the browser, evaluation can update the DOM, Canvas, WebGL, or Web Audio;
- on the JVM, it can interact with Java libraries and long-running services;
- in a terminal, it can control processes, files, and textual interfaces;
- in an editor, it can connect source forms directly to runtime values.

The host facilities differ, but the live evaluation model remains consistent.

## Relationship to unified representation

Live coding works best when code, data, state, and messages can be inspected and transformed using compatible structures. That is the role of Hara's unified representation.

Continue with [Unified representation](unified-representation.md).
