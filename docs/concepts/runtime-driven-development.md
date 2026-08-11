# Runtime-driven development

Runtime-driven development treats the running Hara system as a collaborator in the programming process.

In a conventional compile-run-debug loop, the runtime is mostly a destination. Source files are edited outside the program, transformed into an executable form, launched, observed, stopped, and rebuilt. Hara keeps more of that loop inside the running environment. You evaluate forms, inspect values, attach tools, update definitions, and continue working with the same live system.

## The runtime is part of the workspace

A Hara workspace is not only an editor wrapped around files. It connects source code to a runtime that can evaluate expressions and expose the resulting values.

That means the development loop can be:

1. evaluate a small form;
2. inspect the returned value;
3. update a definition;
4. send new state into the running program;
5. observe the result through text, a visualiser, audio, or another host capability.

The runtime carries useful context throughout this loop: loaded namespaces, active definitions, application state, resources, and attached host services.

## Programs grow through evaluation

You do not need to finish an entire application before asking whether one piece works. A namespace can be loaded incrementally, a function can be evaluated independently, and state can be created before the final interface exists.

```hara
(def counter (atom 0))

(swap! counter inc)

@counter
```

Each form changes or queries the live system. The result is available immediately for inspection or for another part of the workspace to consume.

## Definitions remain replaceable

During development, a definition is not treated as permanently sealed inside a build artefact. A function can be revised and evaluated again. Existing code that resolves that definition can then use the updated behaviour.

```hara
(defn greeting [name]
  (str "Hello, " name))
```

After evaluating a new version:

```hara
(defn greeting [name]
  (str "Welcome to Hara, " name "!"))
```

future calls use the replacement definition without requiring the whole runtime to be discarded.

## The host is exposed through capabilities

Runtime-driven development also changes how Hara talks to its surroundings. The browser, JVM, terminal, file system, graphics surface, audio engine, network, and other host facilities are presented as capabilities available to the running program.

A Hara program can describe what it wants to happen while a host bridge performs the environment-specific operation. For example, the program may describe a drawing, an audio graph, or a file operation without making the whole application depend directly on browser or JVM implementation details.

This creates a useful separation:

- HAL owns program state, transformations, and behaviour;
- the runtime owns evaluation, scheduling, and capability dispatch;
- the host adapter owns Web APIs, JVM calls, operating-system access, or device-specific work.

## Inspection comes before instrumentation

Because values remain available to the runtime, development tools can inspect the same structures the program uses. A visualiser does not need a separate debugging model if it can receive the actual program value. A controller can update the same atom the program observes. A trace can record evaluations and state transitions rather than reconstructing them from logs after the fact.

This makes debugging closer to exploration:

```text
source form
    ↓
evaluation
    ↓
value or state transition
    ↓
inspector, visualiser, controller, or host capability
```

## Why it matters

Runtime-driven development is useful when a program is interactive, stateful, visual, musical, connected to hardware, or otherwise difficult to understand from source text alone. It reduces the distance between an idea and an observable result.

It also gives AI tools a more precise surface to work with. An assistant can evaluate a form, inspect the returned value, compare state before and after a change, and work against a live kernel rather than guessing from static source alone.

## Relationship to live coding

### Live coding

Live coding is the interaction technique: evaluate a form and observe the
running program immediately. Runtime-driven development is the broader method:
use runtime evidence to decide what to change, preserve the accepted change in
source, and verify it at the narrowest boundary.

### One representation

Source forms, evaluated values, inspector selections, and visual projections
are handles on the same program model. A visual tool should reveal that model,
not create an incompatible project format.

Runtime-driven development provides the architecture that makes live coding possible. The runtime preserves the active program and accepts new evaluations; live coding is the practice of using that ability to change the system while it continues to run.

Continue with [Live coding](#live-coding).
