# The Hara language course

This course continues from [Read Hara and build from scratch](../learn-programming/index.md). It takes the same small reading model from ordinary values into the runtime boundaries used by complete programs.

No previous Clojure knowledge is assumed. You will work with the actual Hara language and libraries rather than a reduced teaching dialect.

## What you will learn

The course develops seven connected parts of Hara:

1. Basic data types and persistent collections.
2. Functions and atoms.
3. Sequences, iterators, and streaming.
4. Coroutines and promises.
5. Explicitly mutable arrays and objects.
6. Bytes and strings.
7. Capability-gated I/O and files.

The order matters. Each lesson uses the values and boundaries introduced by the earlier lessons.

## Why these boundaries matter

Hara's simplicity comes from keeping a small set of distinctions visible as the program grows:

| Ordinary model | Explicit boundary |
| --- | --- |
| persistent vectors, maps, sets, and lists | mutable `array` and `object` values |
| plain immutable value | `atom` for current changing state |
| lazy, replayable `Seq` | one-shot iterator |
| immediate result | promise that settles later |
| normal function call | resumable coroutine |
| string | mutable bytes |
| pure transformation | host capability and I/O |

The course does not hide these distinctions behind a framework. It teaches you to recognise and use each one deliberately.

## The course project

You will build a small line-processing program.

The final program will:

1. Represent configuration with persistent maps and vectors.
2. Use functions to transform records.
3. Store live progress in an atom.
4. Stream records through sequences and iterators.
5. Coordinate work with coroutines and promises.
6. Use arrays and objects at explicit mutable boundaries.
7. Encode and decode text as bytes.
8. Read and write files through granted capabilities.

The project is intentionally compact. The goal is to expose the runtime model clearly enough that you can transfer it to a browser application, command-line tool, service, or embedded host.

## How to use each lesson

Keep a Hara REPL or the [browser Playground](../getting-started/playground.md) open while you read.

For each example, use the same loop:

1. **Predict** the result before running the form.
2. **Run** it in the live session.
3. **Change** one value or operation.
4. **Inspect** the returned value.
5. **Explain** the new result in one sentence.

This turns syntax into an observable rule and keeps the running system close to the source.

## Stable vocabulary

The course uses one term for each concept:

- A **value** is data that an expression returns.
- A **form** is Hara data that the evaluator can run.
- A **persistent collection** is an immutable collection that returns updated values.
- A **function** receives values and returns a value.
- An **atom** stores one replaceable value.
- A **Seq** is Hara's lazy, replayable sequence boundary.
- An **iterator** is a one-shot source of values.
- A **promise** represents a value that can settle later.
- A **coroutine** is a resumable computation.
- An **array** or **object** is an explicitly mutable marker value.
- **Bytes** are mutable binary storage.
- **I/O** is an effect that crosses from Hara into its host environment.

A new name appears only when the course introduces a new runtime concept.

## Course map

### [01 — Basic data and persistent collections](01-basic-data.md)

Read numbers, booleans, strings, keywords, symbols, lists, vectors, maps, and sets. Update persistent collections without mutation.

### [02 — Functions and atoms](02-functions-and-atoms.md)

Define transformations with `fn` and `defn`. Use an atom when a running program needs one replaceable value.

### [03 — Sequences, iterators, and streaming](03-iterators-and-streaming.md)

Build lazy pipelines. Distinguish reusable values, lazy `Seq` values, and one-shot iterators.

### [04 — Coroutines and promises](04-coroutines-and-promises.md)

Represent deferred results with promises. Suspend and resume control flow with coroutines.

### [05 — Arrays and objects](05-array-and-object.md)

Use explicit mutable markers at host, protocol, and performance boundaries. Keep them separate from persistent collections.

### [06 — Bytes and strings](06-bytes-and-strings.md)

Transform text with string functions. Encode and decode UTF-8. Inspect and update byte buffers.

### [07 — I/O and files](07-io-and-files.md)

Resolve paths safely. Read and write bytes through promises. Understand capability grants and effect boundaries.

## After the course

Continue according to what you want to build:

- [Build Tic Tac Toe](../create/first-game.md) for a complete visual browser program.
- [Projects and namespaces](../projects/index.md) for larger source trees.
- [Service project shape](../projects/index.md#service-project) for multi-file services.
- [Choose your Hara setup](../getting-started.md) for the CLI, web, JVM, VS Code, or Emacs.
- [L0 language contract](../reference/l0-language.md) for exact semantics.
- [Runtime libraries](../projects/index.md#namespaces-and-libraries) for portable namespaces.

Start with [01 — Basic data and persistent collections](01-basic-data.md).
