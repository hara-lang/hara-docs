# 02 — Small, Fast, Web Native

In [Chapter 01](start/orientation.md), you opened a Hara kernel in the browser,
evaluated a form, and saved the result as source.

You can continue using Hara entirely in the browser. This chapter shows how the
same project can also be opened through the CLI, VS Code, and Chrome DevTools.
Each route is optional: choose the tools that are useful to you, or continue
directly to the next chapter.

## The project from Chapter 01

At the end of Chapter 01, your source looked like this:

```hara
(ns getting-started.main)

(defn answer []
  (+ 19 23))

(answer)
```

Evaluating the final form returned `42`.

The source does not belong to the Playground. It belongs to the project. The
Playground was simply the first host through which you accessed a Hara kernel.

<div class="hara-project-path" role="img" aria-label="Project source flows through a Hara kernel to the result 42">
  <div><i>▤</i><b>Project source</b><small>Durable `.hal` forms.</small></div><span>↓</span>
  <div><i>◉</i><b>Hara kernel</b><small>Reads and evaluates forms.</small></div><span>↓</span>
  <div><i>42</i><b>Result</b><small>Inspectable value.</small></div>
</div>

The rest of this chapter demonstrates that other Hara tools can work with the
same project.

## Choose your next step

You do not need to install every Hara tool.

<div class="hara-surface-choice">
  <a href="#install-the-cli"><i>⌘</i><span><b>CLI and REPL</b><small>Run projects locally, automate work, and evaluate from a terminal.</small></span></a>
  <a href="#use-hara-from-vs-code"><i>▤</i><span><b>VS Code</b><small>Work primarily from source files and project navigation.</small></span></a>
  <a href="#use-hara-from-chrome-devtools"><i>◫</i><span><b>Chrome DevTools</b><small>Work beside a running web page.</small></span></a>
  <a href="https://playground.hara-lang.org/"><i>▶</i><span><b>Stay in the browser</b><small>Continue immediately with the Playground.</small></span></a>
</div>

## Install the CLI

This section is optional. The CLI gives you a local Hara kernel for running
files, evaluating individual forms, using the REPL, and connecting other tools.

Install it with:

```shell
curl -fsSL https://www.hara-lang.org/install.sh | sh -- --rust
```

Confirm that it is available:

```shell
hara --version
```

Create a local project directory:

```text
getting-started/
  src/
    main.hal
```

Copy the source from Chapter 01 into `src/main.hal`, then run it:

```shell
hara run src/main.hal
```

The result should be `42`. This is the same source and the same result you saw
in the browser.

<div class="hara-host-result" role="img" aria-label="Browser and local kernels evaluate the same source to 42">
  <div><i>▶</i><b>Browser kernel</b><small>First host</small></div>
  <div class="hara-host-result__source"><b>Same source</b><small>`src/main.hal`</small></div>
  <div><i>⌘</i><b>Local kernel</b><small>CLI host</small></div>
  <div class="hara-host-result__value"><i>42</i><b>Same result</b></div>
</div>

The user interface changed. The meaning of the program did not.

### Evaluate without creating a file

The CLI can also evaluate a form directly:

```shell
hara eval '(+ 19 23)'
```

The result is again `42`.

### Open the REPL

Start an interactive local session:

```shell
hara
```

Then evaluate:

```hara
(answer)
```

Provided the source has been loaded into the session, the result is `42`. The
terminal REPL and browser editor are two interfaces to the same evaluation model.

## Use Hara from VS Code

This section is optional. Install the Hara VS Code extension and open the
`getting-started` project directory. The extension connects your source files to
a Hara kernel session; it does not replace the project with a VS Code-specific
format.

Open `src/main.hal`, evaluate `(answer)`, and inspect the result `42`.

<div class="hara-project-path hara-project-path--horizontal" role="img" aria-label="VS Code source connects to a Hara kernel session and returns 42">
  <div><i>▤</i><b>VS Code source</b><small>`src/main.hal`</small></div><span>→</span>
  <div><i>◉</i><b>Kernel session</b><small>Evaluates the project.</small></div><span>→</span>
  <div><i>42</i><b>Result</b><small>Inline evidence.</small></div>
</div>

VS Code is useful when source files, project navigation, and version control
are your main working surfaces. The live kernel remains responsible for reading
and evaluating the forms.

## Use Hara from Chrome DevTools

This section is optional. Install the Hara Chrome extension, open Chrome
DevTools, and select the Hara panel. Load the same project and evaluate
`(answer)`. The result should still be `42`.

Hara Chrome is useful when the system you want to inspect is already running as
a web page.

<div class="hara-chrome-panel" role="img" aria-label="Hara Chrome panel capabilities">
  <div><i>▤</i><b>Project source</b><small>Open the same durable forms.</small></div>
  <div><i>◉</i><b>Active kernel</b><small>Inspect the running session.</small></div>
  <div><i>◇</i><b>Runtime values</b><small>Read structured values.</small></div>
  <div><i>◫</i><b>Visual output</b><small>Observe browser-hosted effects.</small></div>
  <div><i>⌁</i><b>Granted capabilities</b><small>Use only explicit Chrome access.</small></div>
</div>

The browser console gives direct access to a JavaScript execution context. The
Hara panel provides a Hara project and kernel interface beside the page.

## One project, several surfaces

You may have completed none, one, or all of the optional sections. The
important point is not that every user should install every tool. It is that the
project is not trapped inside its first interface.

<div class="hara-surface-map" role="img" aria-label="Playground, CLI, VS Code, and Chrome DevTools connect to compatible Hara kernels">
  <div class="hara-surface-map__hosts"><span>Playground</span><span>CLI / REPL</span><span>VS Code</span><span>Chrome DevTools</span></div>
  <div class="hara-surface-map__kernel">Compatible Hara kernels<small>one project · stable evaluation model</small></div>
</div>

<div class="hara-surface-choice hara-surface-choice--compact">
  <div><i>▶</i><span><b>Playground</b><small>Begin immediately in the browser.</small></span></div>
  <div><i>⌘</i><span><b>CLI and REPL</b><small>Local execution, scripts, automation.</small></span></div>
  <div><i>▤</i><span><b>VS Code</b><small>Project source is your main surface.</small></span></div>
  <div><i>◫</i><span><b>Chrome DevTools</b><small>Work beside a running web application.</small></span></div>
</div>

You can use one surface without adopting the others.

## What this demonstrates

Running `42` in several places is not impressive by itself. What matters is the
property it begins to demonstrate:

> Hara projects have a stable execution model that is not defined by one
> editor, console, or browser interface.

<div class="hara-portability-evidence" role="img" aria-label="Portable Hara project properties">
  <span>Values</span><span>Definitions</span><span>Namespaces</span><span>State transitions</span>
  <span>Errors</span><span>Project files</span><span>Runtime inspection</span><span>Kernel behaviour</span>
</div>

As the examples become more complex, the same expectation should continue to
hold across these parts of the project. In the next chapter, you will move
beyond a fixed result and inspect a system whose state changes while it is
running.
