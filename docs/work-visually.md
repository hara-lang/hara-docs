# Work visually

Hara projects can be viewed through more than one surface. A source form, its
evaluated value, a visual object, and an inspector selection are different
handles on the same piece of work—not competing project formats.

## The shared workspace model

Hara workspaces use these roles:

| Area | Use it for |
| --- | --- |
| Files | Navigate project and space files. |
| Code | Read and edit source forms. |
| Visual or patch | See or compose a visual projection of program structure. |
| Inspector | Examine the selected form, object, link, or runtime value. |
| REPL and output | Evaluate a form and retain the feedback trail. |

The browser [Playground](https://playground.hara-lang.org/) and Hara Chrome already provide files, editor, REPL, kernel, and
space controls. Visual patches and source↔visual linking are the shared
workspace direction; where a host does not yet expose a visual editor, use the
source and REPL as the stable project representation.

## A useful working rhythm

1. Open a project or space.
2. Select the smallest form that expresses the behaviour you are changing.
3. Evaluate it in the active kernel.
4. Observe its visual result or inspect its value.
5. Save the accepted change to source, then continue.

This keeps visual programming grounded: a visual representation should reveal
the program and its runtime state, while source remains readable, reviewable,
and portable.

## Status matters

When a visual result and source are out of sync, treat the result as stale
until it is evaluated again. Runtime state, code selection, visual selection,
and errors should always have textual labels as well as colour so the workspace
works with keyboards, assistive technology, and reduced motion.
