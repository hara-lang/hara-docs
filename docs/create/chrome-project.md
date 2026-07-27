# Create a project with Hara Chrome

Hara Chrome puts the shared Studio workspace inside a Chrome DevTools panel.
It combines a browser-resident Hara runtime, a file and space view, and a REPL
that evaluates in the active kernel.

## Load the extension

The extension currently ships as a developer build. Build it from the Hara
workspace, open `chrome://extensions`, enable **Developer mode**, and use
**Load unpacked** on `extensions/hara-chrome`. Open DevTools for any page and
select the **hara** panel.

## Create a project directory

Make a directory with a project file and a source directory:

```text
orbit-game/
  project.hal
  src/
    game.hal
```

```hara
; project.hal
(defproject orbit-game {:source-paths ["src"]})
```

`project.hal` tells the panel where to resolve required namespaces. If it is
absent, the panel uses the chosen directory itself as the source path.

## Connect the panel to the project

1. Select **choose home** in the Hara panel and select `orbit-game/`.
2. Create or open a `.hal` file in the project.
3. Use **run .hal file** to load a file into the active kernel.
4. Use the Studio REPL to evaluate small changes while the file remains open.

The browser keeps Studio spaces/files locally in IndexedDB. The chosen home
directory is the bridge to your local source tree; it is remembered only while
the browser permission remains available.

## What to use it for

Use Hara Chrome when the thing you are making lives in, observes, or controls a
browser. The panel also exposes the explicit `chrome.api` host namespace for
Chrome API work. Treat the optional local RESP bridge as a privileged developer
tool: any local process that connects can evaluate code with the panel's Chrome
capabilities.

Next, build a [first browser game](first-game.md) or learn the shared
[workspace model](../work-visually.md).
