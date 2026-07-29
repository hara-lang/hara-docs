# Unified representation

Unified representation means that Hara uses compatible structural forms for code, data, state, messages, and tool descriptions.

The goal is not to pretend that every thing is identical. A function, an atom, a drawing command, and an audio graph have different meanings. The goal is to make them readable, inspectable, transformable, and transportable through a shared set of values and conventions.

## Code is structured data

HAL preserves a central idea from Lisp: source code is represented with the
same kinds of lists, symbols, numbers, strings, maps, vectors, and sets that
programs already manipulate.

```hara
(+ 1 2)
```

is both an expression and a list-shaped value that can be read, inspected, generated, or transformed before evaluation.

This makes macro expansion and evaluation visible rather than hiding them behind a separate compiler representation.

## State remains ordinary data

Application state can use the same persistent collections as ordinary values.

```hara
(def state
  (atom {:screen :home
         :volume 0.4
         :playing false}))
```

A visualiser can read this map. A controller can propose an update. A test can compare it with an expected value. A network layer can serialise it. The state does not need to be copied into a separate view-model shape merely to become observable.

## Capabilities can be described as data

Host operations can also begin as declarative values.

A program might describe a drawing, an audio pipeline, a request, or a scheduled task. The host bridge interprets that description using the facilities available in the browser, JVM, operating system, or device.

```hara
{:type :audio
 :tempo 120
 :waveform :sine
 :notes [:a3 :e4 :g4]}
```

The value is not itself sound. It is a portable, inspectable description that a compatible audio capability can realise.

## Tools share the program's values

Inspectors, controllers, visualisers, AI agents, and debuggers become easier to compose when they can work with the program's actual values.

```text
source form
    ↓
runtime value
    ├── inspector
    ├── visualiser
    ├── controller
    ├── test
    └── host capability
```

Each tool can add a different interpretation without requiring a new foundational representation.

## One value, several views

Unified representation does not require a single presentation. The same value may have many views.

A sequence of numbers could appear as:

- printed data;
- a table;
- a line chart;
- points in a shader;
- frequencies in an audio pipeline;
- input to another Hara function.

The representation stays stable while the visualiser changes.

## Controllers operate through values

A controller does not need to manipulate a hidden widget model. It can produce a value or state transition that the runtime understands.

```text
slider
   ↓
0.72
   ↓
atom update
   ├── shader brightness
   └── audio volume
```

The slider is only one possible controller. Source evaluation, MIDI, a network message, an AI tool, or another program can produce the same update.

## A common boundary for different hosts

Browser and JVM programs do not share every API, but they can share descriptions and protocols.

For example, a drawing description can remain stable while one adapter targets Canvas and another targets a desktop renderer. A file request can use the same program-facing shape while browser and native environments apply different security and storage rules.

This makes host integration explicit:

```text
HAL value → capability protocol → host adapter → host API
```

## Benefits for macros and evaluation

Because source forms remain structured values, Hara can expose the path from source to execution:

```text
text
  ↓
read form
  ↓
macro expansion
  ↓
evaluation
  ↓
runtime value
```

Each stage can be inspected or visualised. This is particularly useful for
teaching, debugging macros, and showing how the kernel evaluates HAL programs.

## Benefits for AI-assisted development

An AI system works more reliably when it can operate on explicit structures rather than infer application state from screenshots or logs alone.

With a unified representation, an assistant can receive:

- the source form being evaluated;
- the expanded form;
- the runtime result;
- the current state value;
- a capability description;
- a trace of transitions.

It can then propose a structural change and verify the result through the same runtime.

## The larger model

Unified representation ties together Hara's runtime-driven and live-coding model.

```text
code as data
     ↓
live evaluation
     ↓
runtime values
     ↓
state, tools, visualisers, and host capabilities
```

The result is not one universal object that erases all distinctions. It is a coherent language boundary that lets different parts of the system communicate without unnecessary translation layers.

Return to the [Concepts overview](index.md).
