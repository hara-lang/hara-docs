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

`hara-lang/hara-docs` owns its renderer, build, and production deployment. A
successful push to `main` runs the existing content and browser-runtime checks,
builds MkDocs as a compatibility validator, then tests and builds the
self-contained Astro/Starlight application under `astro/`. Only the validated
`astro/dist/` artifact is uploaded and deployed to the dedicated Netlify project
at `https://hara-docs.netlify.app/`; MkDocs is not the published artifact.
Pull requests and the `testing` branch perform the same validation without
replacing production.

Astro is configured with `site: https://www.hara-lang.org` and `base: /docs`.
The deploy artifact is rooted at `/`, while generated canonical links,
navigation, Pagefind, CSS, JavaScript, images, live-card modules, and WASM URLs
remain below `https://www.hara-lang.org/docs/`. Origin rewrites make both
`https://hara-docs.netlify.app/` and `https://hara-docs.netlify.app/docs/`
serve the same artifact. The origin also proxies `/runtime/*` to the canonical
Hara runtime so runnable examples can be inspected there directly.

`hara-www` owns only the stable `/docs/*` 200 proxy, the public Docs link, and
the shared browser runtime. Documentation content, navigation, search, theme,
and live example publication belong here. A documentation release does not
wait for a website assembly or deployment.

Build both validation artifacts locally with:

```shell
python -m pip install -r requirements-docs.txt
scripts/install-runtime
DISABLE_MKDOCS_2_WARNING=true mkdocs build --clean --site-dir site-mkdocs

git clone https://github.com/hara-lang/visual-language \
  astro/packages/visual-language
(cd astro/packages/visual-language && git checkout a2ab66d0fde79edb1cee46b79528098b3fda68cf)
npm install --prefix astro --no-audit --no-fund
npm test --prefix astro
npm run build --prefix astro
```

The Astro result is written to `astro/dist/`. It must contain the Starlight
shell, Pagefind index, browser kernel, shared live-card assets, lesson assets,
and every route registered by `docs-manifest.json`, with no doubled
`/docs/docs/` URLs.

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
