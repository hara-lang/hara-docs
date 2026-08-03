---
title: "Why Hara?"
hara_kernel_loading: auto
---

# Why Hara?

Hara is a small, high-performance Lisp for learning to build software from first principles.

**Simple to pick up. Fast enough to keep.**

You can learn its basic reading model in a few minutes, use it to understand the parts beneath a framework, and continue with the same language as the program becomes a real browser application, command-line tool, service, or embedded system.

This page is connected to a browser-hosted Hara kernel. Put the cursor in the form below and press `Ctrl-Enter` (or `⌘-Enter`).

```hara eval
(+ 19 23)
; => 42
```

That is the smallest useful introduction to Hara:

```text
(operation input input)
```

The operation comes first. Here, `+` receives `19` and `23` and returns `42`.

## Hara is Lisp

Hara does not disguise its Lisp foundation. It uses it to keep the language small and the structure of a program visible.

For the first part of the language, four shapes are enough:

<div class="hara-syntax-primer" role="img" aria-label="Four basic Hara reading rules">
  <div><code>(+ 1 2)</code><b>Form</b><small>Parentheses hold one computation.</small></div>
  <div><code>+ 1 2</code><b>Operation first</b><small>The first item usually says what to do.</small></div>
  <div><code>[1 2 3]</code><b>Vector</b><small>Square brackets hold ordered values.</small></div>
  <div><code>{:name "Ada"}</code><b>Map</b><small>Braces connect named facts to values.</small></div>
</div>

```hara eval
(def player
  {:name "Nova"
   :score 0})

(assoc player :score 10)
; => {:name "Nova" :score 10}
```

The same structures continue through the language. A map can represent a player, a request, a document, a configuration, or the state of a running application. A form can calculate a number, transform that state, call a function, or request an explicit host capability.

Hara source uses **HAL**, the language's EDN-compatible notation. Code is built from the same kinds of values that Hara programs already know how to inspect and transform. That is one of the reasons a small grammar can cover a great deal of ground.

## Learn the parts beneath the frameworks

Frameworks are useful, but they package together many ideas that are easier to understand separately.

Hara lets you work with those ideas directly:

- values and named data;
- functions and transformations;
- decisions and recursion;
- persistent collections;
- state that is explicitly marked;
- iteration and asynchronous work;
- effects that cross into a host environment.

These are not Hara-specific tricks. They are durable programming concepts. Learning them makes it easier to understand what a framework is doing, decide when to use one, and build the missing piece yourself when necessary.

The important continuity is that Hara is not a teaching notation you must later abandon. The first expression and the complete application use the same language and values.

## Small does not mean temporary

Hara begins with a compact reader, but the language does not stop at arithmetic and collection examples.

The language and runtime include persistent maps, vectors, sets, queues, and sorted collections; fixed, variadic, and multiple-arity functions; lexical closures; destructuring; namespaces; exceptions; protocols; multimethods; macros; lazy sequences; promises; coroutines; bytes; and explicitly mutable arrays and objects.

The boundaries remain visible as the system becomes more capable:

| Default model | Explicit boundary |
| --- | --- |
| persistent collections | mutable arrays and objects |
| immutable values | atoms for changing state |
| ordinary function calls | coroutines and promises |
| pure transformations | capability-gated host effects |

This is the sense in which Hara is simple: not because serious parts are missing, but because a small number of structures continue to compose.

For exact semantics, the [L0 language contract](../reference/l0-language.md) remains the source of truth.

## Work directly with a running program

Hara is designed around a short feedback loop:

```text
write → evaluate → inspect → change
```

Create a value, run a form, and inspect what came back. When a program needs state, make that state visible and change it through a named operation.

```hara eval
(def counter
  (atom {:value 0}))

(defn increase [state]
  (update state :value inc))

(swap! counter increase)

(deref counter)
; => {:value 1}
```

Nothing in that example requires a hidden component lifecycle. The current value is visible. The transition is a function. The change is explicit.

A live session is not a replacement for durable source. It is the place where you can test an idea against a running system, inspect the evidence, and then keep the successful definition in the project.

Read [runtime-driven development](../concepts/runtime-driven-development.md) when you are ready for the deeper kernel and session model.

## Performance is part of the language story

An approachable language is much more useful when you can keep using it after the first lesson.

Hara publishes reproducible benchmark evidence rather than asking you to accept a broad claim. Each reference run records the workload source, runtime versions, machine, preparation method, raw samples, expected checksum, and result. The complete comparison remains visible, including the runtimes that are faster.

The current language comparison covers eight checksum-verified prepared workloads across arrays, persistent data, recursion, backtracking, branching, ranges, and matrix work.

[Inspect the complete benchmark table and methodology →](https://www.hara-lang.org/benchmarks/)

The point is not that one number describes every program. It is that Hara's performance can be examined as carefully as its language semantics.

## Use the same language in several environments

You do not need to choose a deployment model before learning Hara.

Start in the browser because it removes installation from the first experience. Later, choose the runtime that fits the system:

- **Web** for a browser-hosted kernel, interactive tools, visual applications, and documentation.
- **Native** for command-line tools, services, local applications, and embedded products through the Rust runtime.
- **JVM** for Java integration, Truffle development, and Native Image deployment.

The host changes. The language, values, and core programming model stay recognisable.

## Choose the next step

The most direct route is:

1. Learn to read ordinary Hara values and forms.
2. Try them in the browser while every result is visible.
3. Combine data, rules, state, input, and rendering in one complete program.
4. Install a local runtime when a project needs files, an editor, Java, or native deployment.

<div class="hara-next-routes">
  <a href="../learn-programming/index.md"><i>02</i><span><b>Read Hara</b><small>Learn the language from first principles.</small></span></a>
  <a href="../getting-started/playground.md"><i>▶</i><span><b>Try it live</b><small>Use the browser-hosted kernel.</small></span></a>
  <a href="../create/first-game.md"><i>03</i><span><b>Build Tic Tac Toe</b><small>Create a complete program from a blank canvas.</small></span></a>
  <a href="../getting-started.md"><i>04</i><span><b>Choose your setup</b><small>Move into the CLI, web, JVM, or an editor.</small></span></a>
</div>
