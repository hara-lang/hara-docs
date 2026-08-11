# Projects and visual workspaces

A Hara project is source you can keep, move, run, and revisit—not just a
temporary REPL session. Every current project has a required `project.edn`
and `workspace.edn`: the first declares code and capabilities, while the
second declares the editable Studio layout and runtime graph.

## Start small

```text
my-project/
  project.edn
  workspace.edn
  src/
    main.hal
```

```clojure
{:hara/type :project
 :hara/version "1.0.0"
 :project/id my-project
 :project/version "0.1.0"
 :project/source-paths ["src"]
 :project/test-paths ["test"]
 :project/extension-paths ["extensions"]
 :project/main my-project.main
 :project/capabilities #{:studio/eval}}
```

JVM-hosted projects may additionally declare Lein-style Maven coordinates,
Java boundary sources, and the explicit `:jvm/reflection` capability. The Hara
CLI then resolves, compiles, runs, and tests the project without a separate
Maven wrapper. See [Get started with the JVM](../getting-started/jvm.md).

`workspace.edn` then names `src/main.hal` as a document and places it in an
editor/output layout. Open **Starter** in [Playground](https://playground.hara-lang.org/) to inspect a
complete directly loadable pair.

Use [the Web setup](../getting-started/web.md) when the project belongs near a
browser workspace, or [the VS Code setup](../getting-started/vscode.md) when you
want a focused source-and-session workflow.

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

The browser [Playground](https://playground.hara-lang.org/) and Hara Chrome
already provide files, editor, REPL, kernel, and space controls. Visual patches
and source↔visual linking are the shared workspace direction; where a host does
not yet expose a visual editor, source and the REPL remain the stable project
representation.

### A useful working rhythm

1. Open a project or space.
2. Select the smallest form that expresses the behavior you are changing.
3. Evaluate it in the active kernel.
4. Observe its visual result or inspect its value.
5. Save the accepted change to source, then continue.

This keeps visual programming grounded: a visual representation should reveal
the program and its runtime state, while source remains readable, reviewable,
and portable.

When a visual result and source are out of sync, treat the result as stale
until it is evaluated again. Runtime state, code selection, visual selection,
and errors should always have textual labels as well as color so the workspace
works with keyboards, assistive technology, and reduced motion.

## Keep the project portable

- Keep source and project configuration under version control.
- Keep host access explicit, so the boundary between project code and browser,
  file, or runtime services remains visible.
- Treat spaces and sessions as working environments, not as the sole record of
  the project.

## Namespaces and libraries

Namespace forms declare dependencies with `:require`; runtime metadata uses
the plural `:aliases` key. Current portable libraries use `std.foundation.*`,
not the historical `std.lib.*` namespaces. Keep host authority behind an
explicit capability or extension.

## Testing and services

Put tests in `:project/test-paths`. Evaluate the changed form, run the narrow
project test, then run cross-host conformance for a portable boundary. Service
projects compose pure handlers with explicit transport providers so the same
handler stays callable from the REPL and tests.

## Publishing

Greenways Spaces is the intended destination for publishing a Hara project.
That workflow is not available yet; this publishing section
remains staged. Validate the manifest, tests, capabilities, and package identity
before handing an artifact to the publishing tools.
