# Hara for Clojurists

Clojure developers already understand one of Hara’s central ideas: a program
does not have to stop before you can work on it. You can inspect a running
process, evaluate a definition, replace a function, and continue from the
current state.

Hara builds on that tradition, but gives it a different centre. It is an
**embeddable live kernel** for building, inspecting, and changing running
systems. HAL forms are how you communicate with that kernel.

It is not intended to reproduce all of Clojure on another runtime. Hara is
deliberately stripped down: small enough to embed in a browser, compile to
WebAssembly, run locally, and expose safely to tools and AI agents. Portability
keeps the kernel honest; the main idea is simplicity.

<div class="hara-clojure-flow" role="img" aria-label="Hara forms flow through the live kernel to state, values, events, effects, and hosts">
  <span>Persistent information</span><b>+</b><span>Named transformations</span><b>+</b><span>Explicit state · iterators · streams</span><b>+</b><span>Isolated runtime sessions</span>
</div>

## Begin with what you already know

The surface is deliberately familiar:

```hara
(def answer 42)

(defn add [a b]
  (+ a b))

{:name "Ada"
 :status :active}
```

So is explicitly held local state:

```hara
(def counter
  (atom {:value 0
         :updated-by nil}))

(swap! counter update :value inc)
(deref counter)
```

<div class="hara-clojure-rhythm" role="img" aria-label="Familiar Clojure interaction becomes a broader runtime interface in Hara">
  <div><i>⌘</i><b>Familiar Lisp loop</b><small>Inspect → evaluate → observe → keep.</small></div>
  <span>→</span>
  <div><i>◉</i><b>Broader kernel interface</b><small>Editors, tools, hosts, and agents can inspect the same runtime.</small></div>
</div>

The REPL is one client of the kernel, not the complete definition of the
development environment.

## Information comes first

Hara begins with persistent information. A transformation produces a new value
rather than silently changing the old one:

```hara
(def order {:id "order-42" :status :created})
(assoc order :status :submitted)
```

<div class="hara-clojure-flow hara-clojure-flow--horizontal" role="img" aria-label="Previous information passes through a named transformation to new information">
  <span>Previous information</span><b>→</b><span>Named transformation</span><b>→</b><span>New information</span>
</div>

Clojure's persistent data structures make robust systems easier to build: an
update produces a new value, leaving the previous value available for
comparison, testing, tracing, recovery, and explanation. Tools can show what
changed without reconstructing hidden mutation.

## Atoms make changing state explicit

An `atom` is a useful, familiar way to hold explicit local runtime state. Hara
does not require Clojure's full STM, refs, agents, or every concurrency
primitive before you can model a changing system.

<div class="hara-state-distinction" role="img" aria-label="An atom holds explicit state, a named transformation changes it, and inspection reveals the new value">
  <section><i>⚛</i><b>Atom</b><small>Owned changing state.</small><code>atom</code></section>
  <section><i>λ</i><b>Named transformation</b><small>A bounded update.</small><code>swap! state update …</code></section>
  <section><i>◇</i><b>Inspectable value</b><small>The new persistent information.</small><code>deref</code></section>
</div>

The aim is a direct model: state ownership is visible, transitions have names,
and values before and after an update can be inspected.

## Iterators, coroutines, and promises

Hara is iterator-first. It does not implement Clojure `ISeq`; a `Seq` is a
frozen view on an iterator. Familiar operations remain familiar:

```hara
(map inc [1 2 3])
(filter odd? [1 2 3 4 5])
(take 5 (range))
```

But a source may be a persistent collection, a lazy range, a one-pass stream,
or values produced by a coroutine. Do not assume that every source is replayable
or has the same storage and resource semantics.

<div class="hara-clojure-flow" role="img" aria-label="Iterator model from source through transformation to consumer">
  <span>Persistent collection · lazy range · stream · coroutine</span><b>↓</b><span>Iterator</span><b>↓</b><span>Map · filter · take</span><b>↓</b><span>Consumer or reduction</span>
</div>

Promises represent one eventual result; coroutines represent resumable
producers or workflows. Together they make asynchronous streaming explicit
without requiring every Clojure concurrency abstraction or a mandatory
transducer layer.

## Sessions isolate runtime worlds

A kernel can host named sessions. Each session has its own evaluation context,
namespaces, definitions, and atoms. The same namespace name can therefore have
different values in different sessions without those worlds colliding.

<div class="hara-clojure-flow" role="img" aria-label="Kernel contains isolated sessions, namespaces, vars, and values">
  <span>Hara kernel</span><b>↓</b><span>Named session</span><b>↓</b><span>Namespace</span><b>↓</b><span>Var and value</span>
</div>

Sessions solve a different problem from STM: STM coordinates shared state in
one runtime world; sessions isolate definitions and state into separate runtime
worlds.

## From REPL-driven to runtime-driven development

REPL-driven development remains valuable. Hara uses the broader term
**runtime-driven development** because several surfaces can work with the same
live system.

<div class="hara-surface-map" role="img" aria-label="Terminal REPL, source editor, runtime inspector, visual workspace, browser host, and AI agent connect to a Hara kernel">
  <div class="hara-surface-map__hosts"><span>Terminal REPL</span><span>Source editor</span><span>Runtime inspector</span><span>Visual workspace</span><span>Browser host</span><span>AI agent</span></div>
  <div class="hara-surface-map__kernel">Hara kernel<small>one live system · several clients</small></div>
</div>

A runtime-driven system makes answers visible: which state exists, which form
changed it, which value crossed a boundary, and which effect reached the host.

## Compatibility and measured comparison

Hara deliberately shares a useful Clojure-shaped core, but it is not a drop-in
JVM implementation. The current canonical inventory compares Clojure 1.12.5
with Hara's portable core plus `std.lib.foundation`:

| Group | Core entries |
|---|---:|
| Same exact name and contract | 144 |
| Same name, changed contract | 12 |
| Renamed | 1 |
| Hara-specific | 87 |
| Clojure-specific | 536 |

The changed cases are the ones worth checking while porting:

| Clojure | Hara | Practical difference |
|---|---|---|
| `map` | `map` | Direct calls on concrete collections are eager and preserve shape; curried and `seq`-wrapped calls are lazy. |
| `seq` | `seq` | Hara exposes an explicit iterator boundary rather than requiring `ISeq`. |
| `rest` | `rest` | Hara returns `nil` when no values remain; Clojure returns an empty sequence. |
| `some` | `any?` | Hara returns a Boolean existential result; Clojure returns the first truthy predicate result. |
| `let` | `let` | Both currently evaluate bindings sequentially. |
| `eval` | `eval` | Hara evaluates in the active Hara runtime context; it does not invoke the Clojure compiler. |

The complete, exhaustive contract—including all changed and runtime-drift
entries—is in [Clojure core compatibility](../reference/clojure-core-compatibility.md).

### Startup evidence

The following measured startup snapshot is useful when portability and quick
tool feedback matter. It was generated on Linux on 24 July 2026; it is
machine-specific evidence, not a performance promise or regression target.

| Runtime | p50 ms | p95 ms | Peak RSS MiB |
|---|---:|---:|---:|
| Clojure | 463.67 | 488.21 | 110.1 |
| Babashka | 12.65 | 19.39 | 36.2 |
| Hara native image | 11.98 | 15.88 | 38.3 |
| Hara Rust native | 4.73 | 8.97 | 5.0 |
| Hara WASM (Node) | 37.00 | 39.36 | 62.9 |

**Peak RSS MiB** is the maximum resident memory observed for that process.
The benchmark export also contains a `Payload MiB` field, but its artifact
collection rule is not documented with the results. It is therefore omitted
here rather than being mistaken for download, install, or memory size.

### Warm evaluation evidence

Warm measurements show the current implementation cost—not a Hara speed
claim. Values are steady milliseconds per complete evaluation; **lower is
better**. Each adapter re-reads, evaluates, and checks the same source form,
but this remains an implementation snapshot rather than a source-normalized
language shootout. Hara's Rust and WASM interpreters are presently slower than
Clojure and Babashka on these small, allocation-heavy forms, with function
calls the clearest gap:

| Workload | Clojure | Babashka | Hara Rust native | Hara WASM (Node) |
|---|---:|---:|---:|---:|
| Arithmetic | 0.892 | 0.477 | 3.655 | 4.174 |
| Function call | 0.813 | 0.227 | 29.627 | 19.903 |
| Persistent vector | 0.507 | 0.119 | 0.927 | 0.962 |
| Persistent map | 0.452 | 0.110 | 1.087 | 1.234 |
| Sequence navigation | 0.450 | 0.086 | 0.563 | 0.617 |

See [Runtime benchmarks](../reference/runtime-benchmarks.md) for the complete
workloads, first-call timings, calls per second, convergence data, and the
other runtimes.

## What carries across—and what to check

<div class="hara-portability-evidence hara-clojure-checks" role="img" aria-label="Clojure familiarity and Hara checks">
  <span><b>Forms</b><small>Familiar Lisp syntax.</small></span>
  <span><b>Persistent values</b><small>Normal application representation.</small></span>
  <span><b>Namespaces</b><small>Source and inspection boundaries.</small></span>
  <span><b>Host access</b><small>Explicit capabilities, not ambient interop.</small></span>
  <span><b>Seq</b><small>A frozen view on an iterator.</small></span>
  <span><b>Numbers</b><small>Verify numeric behaviour; ratios are not L0.</small></span>
  <span><b>Protocols</b><small>Runtime contracts, not JVM-interface requirements.</small></span>
  <span><b>Transducers</b><small>Not supported.</small></span>
</div>

The safe rule is simple: bring across the conceptual model, confirm the exact
operation, and write to Hara’s portable kernel contract.

## The mental shift

> Hara takes the live-development instincts of Lisp and treats them as the
> basis of an embeddable, inspectable kernel.

<div class="hara-clojure-flow hara-clojure-flow--horizontal" role="img" aria-label="Source explains intent, runtime shows reality, inspection connects them">
  <span>Source explains intent</span><b>→</b><span>Runtime shows reality</span><b>→</b><span>Inspection connects the two</span>
</div>

Choose a host in [On the Web](../getting-started.md), or continue with the
[browser playground](../learn-programming/index.md).
