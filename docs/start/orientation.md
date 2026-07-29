---
title: "Why Hara?"
hara_kernel_loading: auto
---

# Why Hara?

Start with the system, not the theory. This page is connected to a
browser-hosted Hara kernel. Put the cursor in the form below and press
`Ctrl-Enter` (or `⌘-Enter`). The result appears inline.

```hara
(+ 1 2 3)
; => 6
```

You wrote one form, evaluated it in a live runtime, and inspected the value it
returned. That small loop is the foundation of the manual:

```text
write a form → evaluate it → inspect the value
```

## Why that is useful

Modern web development is remarkably capable: React, TypeScript, browser APIs,
state libraries, build tools, and cloud platforms can produce sophisticated
applications quickly. As a project grows, though, the experience can become
increasingly indirect: edit source, wait for an update, reproduce an
interaction, inspect several tools, and infer what happened inside the running
system.

Hara offers another approach. It is not another framework intended to replace
the browser, React, or an existing frontend stack. It is a small, embeddable
kernel that can sit inside a browser, editor, application, or development
environment. The kernel gives a person—and an AI agent—a structured way to
inspect application state, evaluate a bounded change, and observe the result
while the system is running.

HAL (Hara Lisp) is an EDN-compatible, host-neutral notation and data format
for communicating with that kernel. HAL forms provide a compact, inspectable
way to ask the system questions and make bounded changes.

## HAL is how you talk to the kernel

The kernel reads HAL forms that describe computations, inspect values, and
change the running system. The notation stays portable while the kernel and
its host interfaces determine what can execute and which effects are allowed.

For now, only four rules are needed:

<div class="hara-syntax-primer" role="img" aria-label="Four basic Hara form rules">
  <div><code>(+ 1 2)</code><b>Form</b><small>Parentheses hold one computation.</small></div>
  <div><code>+ 1 2</code><b>Operation first</b><small>The first item usually says what to do.</small></div>
  <div><code>[1 2 3]</code><b>Vector</b><small>Square brackets hold an ordered collection.</small></div>
  <div><code>{:name "Ada"}</code><b>Map</b><small>Braces connect named facts to values.</small></div>
</div>

```hara
(def user {:name "Ada"
           :status :active})

(get user :name)
```

Later chapters go deeper into reading HAL forms, evaluation, macroexpansion,
and the relationship to Clojure and other Lisp traditions. For this manual,
keep the positioning simple:

> Hara is a programmable kernel. HAL forms are how you talk to it.

## Work with the running system

<div class="hara-workflow-compare" role="group" aria-label="Development workflow comparison">
  <section class="hara-workflow hara-workflow--files">
    <span class="hara-diagram-label">Files first</span>
    <ol>
      <li><i class="hara-step-picture hara-step-picture--edit" aria-hidden="true"></i><span><b>Edit</b><small>Change the durable source file.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--build" aria-hidden="true"></i><span><b>Rebuild</b><small>Turn source into a runnable version.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--reload" aria-hidden="true"></i><span><b>Reload</b><small>Replace what the running system knows.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--reproduce" aria-hidden="true"></i><span><b>Reproduce</b><small>Return to the state that proves the issue.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--infer" aria-hidden="true"></i><span><b>Infer</b><small>Work backwards to explain the result.</small></span></li>
    </ol>
  </section>
  <section class="hara-workflow hara-workflow--kernel">
    <span class="hara-diagram-label">Live system first</span>
    <ol>
      <li><i class="hara-step-picture hara-step-picture--inspect" aria-hidden="true"></i><span><b>Inspect</b><small>See the state that exists right now.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--evaluate" aria-hidden="true"></i><span><b>Evaluate</b><small>Make one bounded change or query.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--observe" aria-hidden="true"></i><span><b>Observe</b><small>Read the returned value or visible output.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--trace" aria-hidden="true"></i><span><b>Trace</b><small>Follow the calls and effects behind it.</small></span></li>
      <li><i class="hara-step-picture hara-step-picture--keep" aria-hidden="true"></i><span><b>Keep</b><small>Put the verified insight into source.</small></span></li>
    </ol>
  </section>
</div>

This is runtime-driven development. Instead of changing a representation of a
system and waiting to discover the result, you interact with the system while
it is alive. A successful experiment can then be kept in source deliberately.

The kernel is the stable part of that workflow. The host changes according to
where the interesting live state is:

<div class="hara-host-topology" role="img" aria-label="Browser, Chrome DevTools, VS Code, and CLI hosts connect to one Hara kernel">
  <div class="hara-host-topology__hosts">
    <span>Browser<br>workspace</span>
    <span>Chrome<br>panel</span>
    <span>VS Code</span>
    <span>CLI / REPL</span>
  </div>
  <div class="hara-host-topology__kernel">Hara kernel <small>running system</small></div>
</div>

The browser is a useful first host because it makes the loop immediate: there
is nothing to install, values can be rendered beside their forms, and visual
or browser-native effects can be observed where they occur.

## Web native from the start

Hara is designed to run on the web and through WebAssembly. A browser-hosted
kernel can be opened, queried, and observed without first assembling a large
local toolchain. The first form on this page demonstrates the point: what
matters is not that `(+ 1 2 3)` is small, but that it ran in the same
environment whose result you could immediately inspect.

<div class="hara-web-native-path" role="img" aria-label="A Hara form runs in a browser-hosted WebAssembly kernel and returns an inspectable value">
  <span>Hara form</span><b>→</b><span>Browser-hosted kernel</span><b>→</b><span>WebAssembly runtime</span><b>→</b><span>Inspectable value</span>
</div>

The same kernel model can later be reached from a browser workspace, Chrome
DevTools, VS Code, a command-line REPL, an embedded application, or an AI
development tool. The editor or console is a surface; the kernel is the
running environment behind it.

## Keep important application state visible

React is excellent at turning state into an interface. Hara gives you the
option to keep important application information inspectable independently of
the component that currently renders it.

```hara
(def app-state
  (atom {:user nil
         :route :home
         :documents {}
         :connection :online}))

(deref app-state)
```

<div class="hara-state-distinction hara-react-state" role="img" aria-label="Application state and behaviour flow through a UI adapter to a React interface">
  <section><i>◇</i><b>Application state and behaviour</b><small>Named information and operations you can inspect.</small><code>atom · defn · deref</code></section>
  <section><i>⚛</i><b>UI adapter</b><small>React renders the information for this view.</small><code>state → interface</code></section>
</div>

React can still render this information. It simply does not have to be the
final owner of it. The deeper application architecture is documented in
[Substrate application architecture](react.md), outside the Start sequence.

## Isn't this just a console?

A JavaScript developer should ask this. The browser console already evaluates
code, inspects values, and can change a page. Hara does not replace DevTools;
DevTools lets you inspect the browser, while Hara lets you design an
application to be inspectable.

> A console is an interface. A kernel is the running environment behind the
> interface.

Chrome DevTools connects its console to a page's JavaScript runtime. Hara aims
to provide a deliberately structured kernel that can be embedded in a system
and reached through more than one surface, including browser workspaces,
Chrome panels, VS Code, the CLI / REPL, and AI agents.

The distinction matters only if the kernel provides more than arbitrary
evaluation. A Hara kernel is intended to provide:

<div class="hara-kernel-capabilities" role="img" aria-label="Hara kernel capabilities">
  <div><i>◷</i><b>Named session</b><small>Persistent runtime state.</small></div>
  <div><i>◇</i><b>Structured values</b><small>State you can inspect.</small></div>
  <div><i>▦</i><b>Workspace model</b><small>Projects have explicit shape.</small></div>
  <div><i>⌁</i><b>Capabilities</b><small>Host access is controlled.</small></div>
  <div><i>⌘</i><b>Evidence</b><small>Traces explain evaluations.</small></div>
  <div><i>↔</i><b>Protocol</b><small>Tools and agents connect reliably.</small></div>
  <div><i>◎</i><b>Shared clients</b><small>Several surfaces see one system.</small></div>
  <div><i>◫</i><b>Connected output</b><small>Source, state, nodes, visuals.</small></div>
</div>

The browser console is a powerful developer tool attached to one browser
execution context. It does not normally define an application-level inspection
contract shared by people, editors, visual tools, and agents.

> The console is one possible front end to Hara. The kernel is the persistent,
> inspectable runtime that the console connects to.

There is an important caveat. If Hara only evaluates HAL forms and
prints results, then the JavaScript developer is right: it is effectively
another console. The documentation must demonstrate the difference early—by
showing the same kernel from multiple surfaces, named state, bounded changes,
visible output, traces, and structured agent access—not merely assert it.

## What the kernel makes inspectable

Inspectability is not a debugging feature added after an application exists.
It is a property to design for from the beginning. A Hara system should make
these relationships legible:

<div class="hara-inspection-lanes" role="img" aria-label="Inspectable Hara system relationships">
  <div class="hara-inspection-lane">
    <span>Source<br>forms</span><span>Evaluated<br>values</span><span>Application<br>state</span>
  </div>
  <div class="hara-inspection-lane">
    <span>Messages<br>and events</span><span>Functions</span><span>Traces</span>
  </div>
  <div class="hara-inspection-lane">
    <span>Host<br>capabilities</span><span>Permitted<br>effects</span><span>Visual<br>output</span>
  </div>
  <div class="hara-inspection-evidence">
    Developer or agent change <b>→</b> observable evidence <b>→</b> source kept deliberately
  </div>
</div>

That makes practical questions answerable: What state exists now? Which form
changed it? What depends on it? Which event reached this function? What can be
changed safely, and what result proves the change?

## A shared interface for people and agents

An agent using Hara should not have to edit files blindly and infer outcomes
from build logs. The same live kernel can provide a structured loop:

<div class="hara-evidence-loop" role="img" aria-label="Structured loop for people and agents">
  <div><i>◉</i><b>Inspect</b><small>State and capabilities.</small></div>
  <div><i>λ</i><b>Evaluate</b><small>One controlled form.</small></div>
  <div><i>◫</i><b>Examine</b><small>Value, output, or error.</small></div>
  <div><i>⌘</i><b>Trace</b><small>Calls and effects.</small></div>
  <div><i>▣</i><b>Keep</b><small>Evidence becomes source.</small></div>
</div>

<div class="hara-safety-callout">
  <span>Safety boundary</span>
  <p>This does not make changes automatically safe. It makes their scope and their evidence visible to both collaborators.</p>
</div>

## Source, state, and effects are different things

A source form is durable text. Evaluation gives it a value in a running
session. That value may update state, and a host capability may turn state into
an effect such as a canvas draw, file operation, DOM update, or message.

Keeping those layers distinct makes a live system easier to reason about:

<div class="hara-runtime-chain" role="img" aria-label="Source form evaluates to runtime state, which invokes a host capability and creates an observable effect">
  <span>Source<br>form</span>
  <span>Evaluate&nbsp;→</span>
  <span>Runtime value<br>or state</span>
  <span>Host<br>capability</span>
  <span>Observable<br>effect</span>
</div>

The kernel lets you work across those layers without pretending they are the
same thing.

## Take the next step: persistent state

Now create a small piece of persistent runtime state, change it once, and
inspect it again. Evaluate each form in order.

```hara
(def orientation-state
  (atom {:status :ready
         :count 0}))

(swap! orientation-state update :count inc)

(deref orientation-state)
; => {:status :ready :count 1}
```

You have just made one bounded change to a live session and inspected the
result. The important lesson is not the syntax: it is that you can observe the
system between each step.

## What to expect today

The documentation and browser examples provide a shared live kernel for
evaluation, inline results, syntax-aware editing, and small inspectable
experiments. Different hosts expose different capabilities; a browser kernel
does not silently become access to local files, network services, or browser
extension APIs. Those boundaries are explicit parts of the host relationship.

The following chapters place the same kernel closer to the systems you are
building: first by choosing a host and installing a runtime, then by working
with definitions, state, projects, and visual systems in more depth.

## Continue

Next, choose where the kernel will run and verify that it is available:

<div class="hara-next-routes">
  <a href="../getting-started.md"><i>02</i><span><b>Install</b><small>Put a kernel where you work.</small></span></a>
  <a href="https://playground.hara-lang.org/"><i>▶</i><span><b>Browser Playground</b><small>Try the live kernel now.</small></span></a>
  <a href="../learn-programming/index.md"><i>→</i><span><b>Learn Hara</b><small>Continue with forms and state.</small></span></a>
</div>
