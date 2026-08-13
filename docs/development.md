# Hara developer guide

## Repository map

```text
core/java/                   JVM, Truffle, kernel, and Java tests
core/rust/                   native Rust, raw WASM, HBC5, and HBB2
core/lib/                    HAL libraries and tool namespaces
packaging/                   release and distribution automation
scripts/runtime/             cross-host runtime checks
../hara-specs-registry/      external normative specifications
../../website/hara-docs/     documentation source and publication owner
```

## Build and test

```shell
mvn -q -f core/java/pom.xml test
mvn -q -f core/java/pom.xml -Ptruffle package
mvn -q -f core/java/pom.xml -Ptruffle -Dtest=hara.truffle.HaraL0ConformanceTest test
cargo test --manifest-path core/rust/Cargo.toml
```

When changing a boundary, run the narrow focused suite first and then the full suite. Graal fallback
warnings are expected on ordinary JVMs without JVMCI; they are not, by themselves, test failures.

## Adding a core operation

```text
language contract -> HaraContext / AST -> focused test -> L0 corpus -> docs
```

Keep the core runtime-neutral. Host-dependent behavior belongs behind a capability or provider
interface. Do not add guest-visible JVM interop to make a library convenient.

## Adding a generated library

1. Define public names and semantics in the external specs registry.
2. Add the implementation to the runtime-generated namespace.
3. Add valid, invalid, and unsupported capability cases.
4. Add a conformance test and update the user guide.

## Adding an extension provider

```text
manifest -> validate -> provider handshake -> Hara namespace -> promise/error boundary
```

Providers must not change Hara call sites. Keep transport-specific details inside the provider and
preserve stable errors for malformed manifests, denied capabilities, timeouts, cancellation, and
crashes. See [Hara extensions](reference/extensions-contract.md).

## Documentation lessons and walkthroughs

Use the shared lesson component rather than building page-specific progress UI. It supports runnable
examples, manual guides, persistent task lists, external completion signals, sequential navigation,
and grouped-session reset. See [Author lessons and walkthroughs](guides/authoring-lessons.md).

## Documentation publication

`hara-lang/hara-docs` owns the canonical documentation origin at
`https://docs.hara-lang.org/`. A successful push to `main` validates the source,
builds the standalone MkDocs site with the pinned browser runtime and shared UI,
packages a GitHub Pages artifact, deploys it, and smoke-tests the published Little
Book. Pull requests and the `testing` branch perform the same source and build
checks without replacing production.

The website repository may link to the documentation origin and preserve legacy
`/docs/*` redirects, but it is not the publication authority. A documentation
change must not wait for a `hara-www` assembly or Netlify deployment.

Build the same standalone artifact locally with:

```shell
python -m pip install -r requirements-docs.txt
scripts/install-runtime
DISABLE_MKDOCS_2_WARNING=true mkdocs build --clean
```

The result is written to `site/`. It must contain `CNAME`, the browser kernel,
shared live-card assets, lesson assets, and every route registered by
`docs-manifest.json`.

## Java API documentation

Public Java entry points should have Javadoc describing lifecycle, ownership, thread-safety,
capabilities, and failure behavior. Add API documentation in the same change as a public surface.
Generate API docs from `core/java/pom.xml`; generated output is not a second
documentation source.

## Tracing

Run a focused JVM or Rust test, enable only the required host trace, and record
the command and runtime flavor with the result.

## XTalk equivalence

Change the language spec or seed under `core/lib`, regenerate, and run emitter
parity checks. Do not hand-edit generated target-language output.

## Foundation porting

The in-repository migration ledger is historical. Current libraries live under
`core/lib`, use `std.foundation.*`, and place normative obligations in the
external specs registry. Port one capability boundary with its conformance
evidence.

## Pull requests

Describe the runtime layer changed, the compatibility boundary, the focused tests run, and any
unsupported behavior. Keep unrelated generated files and `.orig` artifacts out of commits.
