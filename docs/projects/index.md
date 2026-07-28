# Projects and sharing

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

`workspace.edn` then names `src/main.hal` as a document and places it in an
editor/output layout. Open **Starter** in [Studio](../studio.md) to inspect a
complete directly loadable pair.

Use [Hara Chrome](../create/chrome-project.md) when the project belongs near a
browser workspace, or [Hara VS Code](../create/vscode-project.md) when you
want a focused source-and-session workflow.

## Keep the project portable

- Keep source and project configuration under version control.
- Keep host access explicit, so the boundary between project code and browser,
  file, or runtime services remains visible.
- Treat spaces and sessions as working environments, not as the sole record of
  the project.

## Share later

Greenways Spaces is the intended destination for publishing a Hara project.
That workflow is not available yet; the [publishing roadmap](publish-greenways.md)
records the future journey without pretending it can be completed today.
