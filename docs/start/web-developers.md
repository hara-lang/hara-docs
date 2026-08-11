# Hara for Web Devs

## Use Hara when your web application is hard to inspect

A web application can become difficult to understand long before it becomes
large. State moves through components, stores, workers, APIs, and caches;
events pass through layers; effects run after rendering; remote updates arrive
at unpredictable times. Source shows what should happen, not the current state
that exists in the running application.

Hara adds a live kernel to the application: a model you can inspect and change
while the application runs. React can still render the UI and TypeScript can
still handle browser integration.

<div class="hara-react-relationship" role="img" aria-label="Hara holds the live application model and React renders its user interface">
  <section><i>◉</i><b>Hara application model</b><small>Named state, operations, events, and inspectable runtime values.</small></section>
  <b>↓</b>
  <section><i>⚛</i><b>React interface</b><small>Input, local interaction detail, and rendered views.</small></section>
</div>

## Work with the running application

Most web development begins in source: edit a file, wait for reload, repeat an
action, inspect the UI. That works for visible changes; it is indirect when the
problem depends on current state, pending work, or event order.

<div class="hara-workflow-compare" role="group" aria-label="File-driven and runtime-driven web development loops">
  <section class="hara-workflow hara-workflow--files"><span class="hara-diagram-label">Files first</span><ol><li><i class="hara-step-picture hara-step-picture--edit" aria-hidden="true"></i><span><b>Edit</b><small>Change source.</small></span></li><li><i class="hara-step-picture hara-step-picture--reload" aria-hidden="true"></i><span><b>Reload</b><small>Wait for the application.</small></span></li><li><i class="hara-step-picture hara-step-picture--reproduce" aria-hidden="true"></i><span><b>Repeat</b><small>Recreate the interaction.</small></span></li><li><i class="hara-step-picture hara-step-picture--infer" aria-hidden="true"></i><span><b>Inspect</b><small>Infer what happened.</small></span></li></ol></section>
  <section class="hara-workflow hara-workflow--kernel"><span class="hara-diagram-label">Live model first</span><ol><li><i class="hara-step-picture hara-step-picture--inspect" aria-hidden="true"></i><span><b>Inspect</b><small>Read the current model.</small></span></li><li><i class="hara-step-picture hara-step-picture--evaluate" aria-hidden="true"></i><span><b>Evaluate</b><small>Call one operation.</small></span></li><li><i class="hara-step-picture hara-step-picture--observe" aria-hidden="true"></i><span><b>Observe</b><small>See the returned value.</small></span></li><li><i class="hara-step-picture hara-step-picture--keep" aria-hidden="true"></i><span><b>Save</b><small>Keep the verified definition.</small></span></li></ol></section>
</div>

This is REPL-driven development in the browser: inspect the current model,
evaluate one operation, observe the result, then save the successful change in
source.

## Connect the REPL to the application model

A REPL is not only a place to test isolated expressions. It can connect you to
the current application model.

```hara
(def project
  (atom {:status :ready
         :items []
         :selection nil}))

(defn add-item! [item]
  (swap! project update :items conj item))

(add-item! {:id "item-1" :title "First item"})
(deref project)
```

You do not need to click through the UI to test an operation: call it directly,
then let the UI render the result.

<div class="hara-runtime-chain" role="img" aria-label="A Hara application model passes through a UI adapter to a React user interface">
  <span>Hara application<br>model</span><span>→</span><span>Named<br>operation</span><span>UI<br>adapter</span><span>React<br>render</span>
</div>

## Keep the model outside React; keep UI details inside it

React's component, hook, context, and store models work well for UI state. It
becomes less clear when one component also owns the whole application model.
A stable operation can be called from the UI, a test, a REPL, or an agent.

```jsx
setOrder({ ...order, status: "submitted" })
```

```hara
(def orders
  (atom {"order-42" {:status :pending}}))

(defn submit-order! [order-id]
  (swap! orders assoc-in [order-id :status] :submitted))

(submit-order! "order-42")
```

<div class="hara-state-distinction hara-react-state" role="img" aria-label="React retains local view details while Hara owns shared application information">
  <section><i>⚛</i><b>React local detail</b><small>Hover state, open menus, input drafts, and animation state.</small><code>this view</code></section>
  <section><i>◉</i><b>Hara application model</b><small>Users, orders, documents, workflows, and live sessions.</small><code>shared system</code></section>
</div>

Ask: **does this value still matter if this component disappears?** If not,
keep it in the component. If it does, give it a place in the application model.

## Give shared state a clear address

Hara can divide an application into named spaces, instead of growing one global
store of unrelated values.

<div class="hara-substrate-spaces" role="img" aria-label="An application node contains model session, model orders, page dashboard, and document report spaces">
  <div class="hara-substrate-spaces__node"><b>Application node</b><section><strong>model/session</strong><small>shared live state</small></section><section><strong>model/orders</strong><small>application model</small></section><section><strong>page/dashboard</strong><small>view-specific state</small></section><section><strong>document/report-42</strong><small>working document</small></section></div>
  <p>Pages can display a model without owning it. Each bounded space has a clear address.</p>
</div>

## Use one vocabulary for local and remote work

Some work runs in the browser, some in a worker, and some on a server. Hara's
request and event model lets the UI describe one application action while an
adapter decides where the work runs.

<div class="hara-request-path" role="img" aria-label="A UI request reaches either a local handler or a remote transport and returns a result">
  <span>UI action</span><b>↓</b><span>Named request<br><small>space · action · arguments</small></span><b>↓</b><span>Local handler<br>or transport</span><b>↓</b><span>Result</span>
</div>

That lets a model begin locally and later move work into a Web Worker, service,
or remote node without rewriting the UI around a new state model. Read the
[application architecture](#application-architecture) for the complete model.

## Build an application that can answer questions

A live kernel exposes the current model rather than requiring developers to
reconstruct it from logs and screenshots.

<div class="hara-inspection-lanes" role="img" aria-label="Application state, named operation, event or request, and observable output form an inspectable system">
  <div class="hara-inspection-lane"><span>Current<br>state</span><span>Named<br>operation</span><span>Changed<br>value</span></div>
  <div class="hara-inspection-lane"><span>Event or<br>request</span><span>Pending<br>work</span><span>Trace</span></div>
  <div class="hara-inspection-evidence">Clear ownership <b>→</b> observable evidence <b>→</b> deliberate source change</div>
</div>

This makes useful questions direct: what exists now; which operation changed
it; which request is pending; which model owns a value; and which view depends
on it. Inspectability is an architectural property, not merely a debugger
feature added later.

## Give AI agents runtime evidence

Source-only agents make a static guess about a running application. A bounded
kernel interface gives an agent evidence from the actual model.

<div class="hara-evidence-loop" role="img" aria-label="An AI agent reads source, inspects the model, evaluates one operation, observes the result, and changes source">
  <div><i>▤</i><b>Read source</b><small>Understand the durable definition.</small></div><div><i>◉</i><b>Inspect</b><small>See current runtime state.</small></div><div><i>λ</i><b>Evaluate</b><small>Test one named operation.</small></div><div><i>◫</i><b>Observe</b><small>Compare the result.</small></div><div><i>▣</i><b>Keep</b><small>Change source deliberately.</small></div>
</div>

An agent can inspect a value, evaluate a revised function, call it, compare the
before and after values, and save an accepted definition. Separate sessions and
explicit capability boundaries can still limit access to files, network
services, and browser APIs.

## Start with one difficult part

## Application architecture

Keep application state and domain transitions in Hara namespaces. Let React or
another view layer own component lifecycle and DOM details, and connect the two
through a small explicit adapter. This keeps business behavior REPL-callable
without pretending host UI APIs are portable language primitives.

Do not rewrite an entire application. Start with one model that is difficult to
inspect: a document, workflow, browser game, dashboard, simulation, rules
engine, collaborative editor, or AI-assisted feature. Give its state and
operations names, connect it to the existing UI, then test the same model from
the UI, REPL, and a separate agent or test session.

Hara is a good fit when that makes the important questions easier to answer.
React still renders the application; Hara gives developers and agents a live
model they can inspect, test, and change.
