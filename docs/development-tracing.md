# Development tracing

Hara's development tracer records what the real evaluator did without changing the application
source or evaluating an expression twice. It is intended for local debugging, Studio, protocol
clients, and AI tools. It is not part of portable Hara semantics.

Trace support is omitted from normal builds. Enable it explicitly:

```shell
cargo build --manifest-path rust/Cargo.toml --features dev-trace
mvn -f java/pom.xml -Ptruffle,dev-trace package
```

The raw WASM development artifact built by `scripts/build-hara-wasm-raw` also enables the feature.
Without the Rust feature or Maven profile, the trace collector, policies, store, and protocol
surface are absent. When support is compiled in, no events are collected until a trace evaluation
or namespace policy starts a trace.

## Trace an evaluation

From Hara:

```clojure
(dev.trace/eval '(app.main/run order))
```

From the native Rust CLI:

```shell
cargo run --manifest-path rust/Cargo.toml --features dev-trace --bin hara -- \
  trace --format json '(+ 19 23)'
```

The supported CLI formats are `json`, `hara`, `ndjson`, and `text`. The Truffle CLI exposes the
same `trace --format FORMAT EXPRESSION` shape when built with `-Pdev-trace`.

The returned `hara.trace/v1` envelope contains an exact success result (or error outcome) and a
bounded trace. Events may include parser source spans, real macro-expansion steps, parent-linked
function calls, arguments and returns, resolved values, selected branches, host effects, errors,
and truncation diagnostics. A failing evaluation still stores and returns its partial trace.

## Trace future namespace calls

Tracing policy belongs to the current kernel session. It does not modify or recompile application
functions.

```clojure
(dev.trace/enable-namespace! 'app.pricing {:mode :owned})
(dev.trace/status)

;; Calls into functions defined by app.pricing are now eligible for capture.
(app.pricing/total order)

(dev.trace/disable-namespace! 'app.pricing)
```

Policy modes are:

- `:owned` — record calls owned by the selected namespace;
- `:boundary` — record the matching namespace entry call;
- `:transitive` — after entry, record synchronous descendant calls.

Policies accept bounded preview and collection limits, including `:max-events`, `:max-depth`,
`:max-value-chars`, and `:max-collection-items`. Event or depth truncation stops recording rather
than stopping application computation.

## Inspect stored traces

Each runtime session retains at most 100 completed traces:

```clojure
(dev.trace/list)
(dev.trace/get "trace-17")
(dev.trace/compare "trace-17" "trace-18")
(dev.trace/export "trace-17")
(dev.trace/delete! "trace-17")
(dev.trace/clear!)
```

The local development protocol provides corresponding `TRACE EVAL`, `TRACE LIST`, `TRACE GET`,
`TRACE COMPARE`, `TRACE DELETE`, `TRACE CLEAR`, `TRACE ENABLE`, `TRACE DISABLE`, and `TRACE STATUS`
operations. Protocol and CLI projections use the same trace record rather than running the
expression again.

Studio's Trace action renders that record as source and macro-expansion views, a call tree, a
timeline, and a linear value-flow view. Studio namespace-policy calls use the same session-local
registry as Hara and protocol clients.

## Safety and version-one limits

Value displays are bounded structural previews. Sensitive map keys such as passwords, secrets,
tokens, API keys, authorization values, and cookies are redacted; byte buffers and arbitrary host
objects are kept opaque. Traces are never exported remotely automatically.

Version one follows synchronous execution only. A scheduled callback, promise continuation,
worker message, or coroutine resumed after the originating evaluation is not appended later.
Tracing is an execution recorder, not a profiler, and timestamps should not be treated as stable
performance measurements.
