# Projects and sharing

A Hara project is source you can keep, move, run, and revisit—not just a
temporary REPL session. Hara Chrome uses a chosen home directory and optional
`project.hal`; other hosts use the same idea of explicit source paths and
named namespaces.

## Start small

```text
my-project/
  project.hal
  src/
    app.hal
```

```clojure
(defproject my-project {:source-paths ["src"]})
```

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
