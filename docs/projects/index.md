# Projects, packages, and visual workspaces

> **Specification status**
>
> This page is explanatory documentation. The normative Package, Extension,
> Publishing, Foundation, Foundation Annex, and Native contracts are currently
> **draft** specifications in
> [`hara-lang/hara-specs-registry`](https://github.com/hara-lang/hara-specs-registry).
> This page was reviewed against registry revision
> [`64d81ebe5fded2809c6fc4414796a3feddf98a33`](https://github.com/hara-lang/hara-specs-registry/commit/64d81ebe5fded2809c6fc4414796a3feddf98a33).
> The generated [Language API](../api/index.md) has its own exact Hara core pin
> and describes implementation inventory rather than changing the specification.

A Hara project is source and declared intent that you can keep, move, resolve,
build, run, and revisit. It is not just a temporary REPL session, and it is not
identified by one editor's workspace layout.

## One contributor-authored manifest

`project.edn` is the single contributor-authored manifest for project identity,
dependencies, source roots, capabilities, runtime profiles, packaging, builds,
extensions, and remote artifacts.

Start with the smallest durable shape:

```text
my-project/
  project.edn
  src/
    my_project/
      main.hal
  test/
  extensions/
```

```clojure
{:hara/type :project
 :hara/version "1.1.0"
 :project/id hara.example/my-project
 :project/version "0.1.0"
 :project/source-paths ["src"]
 :project/test-paths ["test"]
 :project/extension-paths ["extensions"]
 :project/main my-project.main
 :project/capabilities #{:runtime/eval}}
```

The exact fields evolve through the draft Package specification. Keep the
manifest as EDN data: parsing it must not evaluate Hara code or grant host
authority.

Two other package documents are generated rather than maintained as parallel
authoring surfaces:

- `project.lock.edn` records exact package versions, registry revisions, source
  commits, archive digests, remote-artifact digests, and runtime-keyed resolved
  graphs.
- `package.edn` is generated inside a deterministic `.harp` archive as its
  immutable file, resource, extension, and integrity index.

Reconciliation and downloading happen before evaluation. A namespace `require`
resolves only from the already mounted local graph; it does not download code as
a side effect.

## Runtime-specific project intent

Shared Hara roots stay at the top level. JVM- or Rust-specific roots,
dependencies, native sources, and target paths belong only beneath
`:project/runtime-profiles`:

```clojure
{:project/runtime-profiles
 {:jvm {:runtime/source-paths ["src-jvm"]
        :runtime/test-paths ["test-jvm"]
        :runtime/extension-paths ["extensions-jvm"]
        :runtime/native-source-paths ["java"]
        :runtime/target-path "target/jvm"}
  :rust {:runtime/source-paths ["src-rust"]
         :runtime/test-paths ["test-rust"]
         :runtime/extension-paths ["extensions-rust"]
         :runtime/native-source-paths ["core/rust"]
         :runtime/target-path "target/rust"}}}
```

JVM commands select `:jvm` and native Rust commands select `:rust`
automatically. Build profiles under `:project/profiles` remain separate from
runtime profiles.

The removed top-level keys `:jvm/source-paths`, `:jvm/dependencies`, and
`:jvm/target-path` are invalid. Migrate them into the `:jvm` entry under
`:project/runtime-profiles`.

See [Get started with the JVM](../getting-started/jvm.md) for the JVM workflow.

## Workspaces are optional host metadata

A product or editor may keep a `workspace.edn` beside the project to describe
open documents, panes, visual nodes, controllers, visualisers, or connections.
That file is optional host-facing metadata. It is not package identity, does not
replace `project.edn`, and must not become a second place to declare package
dependencies, builds, or extensions.

The browser [Playground](https://playground.hara-lang.org/) can open projects
with visual workspace metadata. Use [the Web setup](../getting-started/web.md)
when the project belongs near a browser workspace, or
[the VS Code setup](../getting-started/vscode.md) when source and a named session
should be the primary work surface.

## Work visually

Hara projects can be viewed through more than one surface. A source form, its
evaluated value, a visual object, and an inspector selection are different
handles on the same piece of work—not competing project formats.

| Area | Use it for |
| --- | --- |
| Files | Navigate project and space files. |
| Code | Read and edit source forms. |
| Visual or patch | See or compose a visual projection of program structure. |
| Inspector | Examine the selected form, object, link, or runtime value. |
| REPL and output | Evaluate a form and retain the feedback trail. |

The Playground and Hara Chrome already provide files, editor, REPL, kernel, and
space controls. Visual patches and source↔visual linking are the shared
workspace direction; where a host does not yet expose a visual editor, source
and the REPL remain the stable project representation.

### A useful working rhythm

1. Open a project or space.
2. Select the smallest form that expresses the behavior you are changing.
3. Evaluate it in the active kernel.
4. Observe its visual result or inspect its value.
5. Save the accepted change to source, then continue.

This keeps visual programming grounded: a visual representation should reveal
the program and its runtime state, while source remains readable, reviewable,
and portable.

When a visual result and source are out of sync, treat the result as stale until
it is evaluated again. Runtime state, code selection, visual selection, and
errors should always have textual labels as well as color so the workspace works
with keyboards, assistive technology, and reduced motion.

## Foundation, native objects, and libraries

Do not treat `std.foundation.*` as the home of every portable library.
The formalised surface has three distinct roles:

- `std.foundation` is the portable root: referred bindings, builtins and
  intrinsics, aliases, portable root functions and macros, and a narrow set of
  evaluator primitives.
- The Foundation Annex enumerates the narrow qualified Foundation children. At
  the surveyed revision these are `std.foundation.bytes`,
  `std.foundation.coroutine`, `std.foundation.pretty`,
  `std.foundation.promise`, and `std.foundation.string`.
- Native capabilities are exposed through static objects such as `File`,
  `Json`, `Process`, and `Runtime`, while wider portable libraries live in
  qualified namespaces such as `std.lib.fs` and `std.lib.component`.

This means `std.lib.*` is not merely a historical namespace family. Some former
Foundation children were deliberately retired or moved as the public boundary
was formalised. Follow the generated API and migration diagnostics rather than
copying an old namespace path.

Namespace forms declare code dependencies with `:require`; runtime metadata uses
the plural `:aliases` key. Keep host authority behind an explicit capability,
native object, provider, or extension boundary.

## Extensions, capabilities, and services

Extension declarations belong under `:project/extensions` in `project.edn` and
are embedded into the generated archive index. Do not introduce another authored
extension manifest.

Keep requested capabilities minimal and explicit. Service projects should
compose pure handlers with explicit transport providers so the same handler can
be called from the REPL and tests without silently acquiring network or host
access.

## Testing and portability

Put tests in `:project/test-paths`, with runtime-only additions under the active
runtime profile. Evaluate the changed form, run the narrow project test, then run
cross-host conformance for a portable boundary.

For portable project code:

- keep source and `project.edn` under version control;
- keep host access explicit;
- treat spaces and sessions as feedback environments, not as the sole record of
  the project;
- resolve and mount the exact locked graph before evaluation; and
- preserve HAL as the portable fallback when a package also carries verified
  HIR.

## Publishing

The draft Publishing and Package specifications define a GitHub-governed,
exact-source workflow:

1. A publisher selects an exact repository commit and reads its `project.edn`.
2. The project is validated and reconciled into an exact lock.
3. The builder produces one deterministic `.harp` with a generated
   `package.edn` integrity index.
4. The accepted coordinate and version are bound immutably to the source commit,
   `project.edn` digest, archive digest, and attestation.
5. Contributor identity, repository authority, and accepted management changes
   remain auditable GitHub and protected-Git records.

These contracts are still draft, so implementation coverage may lag the full
model. The specification is the authority for the intended contract; current
CLI and registry documentation must state which parts they implement rather
than substituting a separate publishing model.
