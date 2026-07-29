# Hara Lisp — Intro

Hara is a small Lisp for live, portable programs. This tutorial teaches the language through the values and runtime services that Hara programs use every day.

The tutorial does not assume Clojure knowledge. It starts with plain data and builds toward asynchronous file work.

## What you will learn

You will learn seven connected parts of Hara:

1. Basic data types and immutable collections.
2. Functions and atoms.
3. Iterators and streaming.
4. Coroutines and promises.
5. Mutable arrays and objects.
6. Bytes and strings.
7. I/O and files.

The order matters. Each lesson uses the terms and values introduced by the earlier lessons.

## The course project

You will build a small line-processing program.

The final program will:

1. Represent its configuration with immutable maps and vectors.
2. Use functions to transform records.
3. Store live progress in an atom.
4. stream records through iterators.
5. Coordinate work with coroutines and promises.
6. Use arrays and objects at mutable boundaries.
7. Encode text as bytes.
8. Read and write files through explicit capabilities.

The project is intentionally small. The goal is to expose the runtime model, not hide it behind a framework.

## How to use each lesson

Keep a Hara REPL open while you read.

For each example, use the same four-step loop:

1. **Predict** the result before you run the form.
2. **Run** the form in the REPL.
3. **Change** one value or operation.
4. **Explain** the new result in one sentence.

This loop turns syntax into an observable rule.

## The vocabulary

The tutorial uses one term for each concept:

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

The lessons keep these names stable. A lesson introduces a new name only when it introduces a new runtime concept.

## Hara's main boundaries

Hara makes several boundaries visible:

| Boundary | Pure side | Explicit side |
| --- | --- | --- |
| Collection updates | vectors, maps, sets, lists | `array`, `object` |
| Current state | plain immutable value | `atom` |
| Collection traversal | lazy `Seq` | one-shot iterator |
| Deferred result | immediate value | promise |
| Suspended work | normal function call | coroutine |
| Text and binary data | string | bytes |
| Program and host | pure transformation | capability-gated I/O |

These boundaries are the core of the tutorial.

## Course map

### [01. Basic data and immutable collections](01-basic-data.md)

Read numbers, booleans, strings, keywords, symbols, lists, vectors, maps, and sets. Update persistent collections without mutation.

### [02. Functions and atoms](02-functions-and-atoms.md)

Define transformations with `fn` and `defn`. Use an atom when a running program needs one replaceable value.

### [03. Iterators and streaming](03-iterators-and-streaming.md)

Build lazy pipelines. Distinguish reusable values, lazy `Seq` values, and one-shot iterators.

### [04. Coroutines and promises](04-coroutines-and-promises.md)

Represent deferred results with promises. Suspend and resume control flow with coroutines.

### [05. Array and object](05-array-and-object.md)

Use explicit mutable markers at host, protocol, and performance boundaries. Keep them separate from persistent collections.

### [06. Bytes and strings](06-bytes-and-strings.md)

Transform text with string functions. Encode and decode UTF-8. Inspect and update byte buffers.

### [07. I/O and files](07-io-and-files.md)

Resolve paths safely. Read and write bytes through promises. Understand capability grants and effect boundaries.

## What this tutorial leaves for later

This tutorial does not try to cover every Hara feature.

After the course, continue with:

- the [language guide](../user-guide.md) for namespaces and runtime basics;
- the [L0 language contract](../reference/l0-language.md) for exact semantics;
- the [runtime library contract](../reference/runtime-libraries.md) for intrinsic namespaces;
- the [namespace catalog](../reference/namespaces.md) for public libraries;
- the [project walkthrough](../walkthroughs/service-project.md) for multi-file code.

Start with [01. Basic data and immutable collections](01-basic-data.md).