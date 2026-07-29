# Substrate: the application connection layer

React has become much more than a rendering library. Components, hooks, and
state models give web developers an excellent way to divide an interface,
co-locate behaviour, and turn state changes into new views.

That strength has a gravitational pull: application structure can begin to
follow the component tree. Hara's `std.substrate` starts one layer earlier. It
gives the application a structured, live connection layer; React remains the
excellent renderer and interaction surface above it.

<div class="hara-react-relationship" role="img" aria-label="Substrate connects the application while React renders it">
  <section><i>◉</i><b>Substrate</b><small>Spaces, state, actions, events, services, and transports.</small></section>
  <b>↑↓</b>
  <section><i>⚛</i><b>React</b><small>Components, input, local interaction state, and rendered views.</small></section>
</div>

## When the component tree becomes the application map

It is natural to start locally:

```jsx
const [order, setOrder] = useState(initialOrder)
```

Then another component needs the order, then a branch needs it, then a page,
then a server cache. The question changes from “what does the application
mean?” to “where should this state live?”

<div class="hara-react-escalation" role="img" aria-label="State moves from a component through lifted state and context to a global store and server cache">
  <span>Component<br><small>local state</small></span><b>→</b><span>Parent<br><small>lifted state</small></span><b>→</b><span>Context<br><small>shared branch</small></span><b>→</b><span>Store / cache<br><small>cross-page state</small></span>
</div>

Those are valid UI engineering decisions. They are not always the right first
place to model the system. React does not need to own every application
decision in order to render the result of it.

## Begin with the application layer

A Substrate node is an eventing application node. It coordinates bounded
application spaces, their state, named request handlers, event triggers,
services, pending requests, subscriptions, and local or remote transports.
The portable core is deliberately an in-memory, atom-backed node; browser
ports, network transports, wire formats, and Studio integration are adapters
above that core.

<div class="hara-substrate-hub" role="img" aria-label="Local state, remote state, browser events, service responses, agent actions, and other nodes connect to a Substrate node which connects to a UI adapter">
  <div class="hara-substrate-hub__inputs"><span>Local state</span><span>Remote state</span><span>Browser events</span><span>Service responses</span><span>Agent actions</span><span>Other nodes</span></div>
  <b>→</b>
  <div class="hara-substrate-hub__node">Substrate node<small>application connection layer</small></div>
  <b>→</b>
  <div class="hara-substrate-hub__adapter">UI adapter<small>React, Solid, canvas, CLI</small></div>
</div>

The interface does not have to decide where all application information
ultimately lives. It connects to an application layer that already knows how
state and events move.

## Separate the model from the page

A node contains multiple named **spaces**. A space is a bounded application
context with its own state and metadata. A page and a model can therefore be
related without being the same thing.

<div class="hara-substrate-spaces" role="img" aria-label="A Substrate node contains page orders with view-specific state, model orders with application state, and model current user with shared identity state">
  <div class="hara-substrate-spaces__node"><b>Substrate node</b><section><strong>page/orders</strong><small>view-specific state</small></section><section><strong>model/orders</strong><small>application state</small></section><section><strong>model/current-user</strong><small>shared identity state</small></section></div>
  <p>React may render <code>page/orders</code>; it does not need to own <code>model/orders</code>.</p>
</div>

A second page, a test, a background process, or an agent can interact with the
same model without pretending to be a React component.

## Requests express intentions

A request names a target space, action, arguments, metadata, and—when
needed—a transport. The UI says what happened from the user's perspective;
the application layer decides whether the transition is valid, local or
remote, and which state, service, and event are involved.

<div class="hara-request-path" role="img" aria-label="A UI intention becomes a request with space action and arguments, which passes to a local handler or remote transport and returns a result">
  <span>UI intention</span><b>↓</b><span>Request<br><small>space · action · arguments</small></span><b>↓</b><span>Local handler<br>or remote transport</span><b>↓</b><span>Result</span>
</div>

Instead of encoding the whole transition in a component:

```jsx
setOrder({ ...order, status: "submitted" })
```

the UI can ask the application layer to perform an operation:

```text
space:  model/orders
action: order/submit
args:   ["order-42"]
```

This is delegation. The component does not need to own the order, know where
it is stored, or know whether the submission happens locally, in a worker, or
through a remote service.

## Streams describe what happened

Requests describe an intention and expect a response. Streams describe events
that occurred. A node can publish a signal inside a space, run local triggers,
and forward the resulting frame to subscribed transports.

<div class="hara-stream-contrast" role="img" aria-label="Request means please perform this action while stream event means this has happened">
  <section><i>→</i><b>Request</b><small>Please perform this action.</small><code>model/orders → order/submit</code></section>
  <section><i>⌁</i><b>Stream event</b><small>This has happened.</small><code>model/orders → order/submitted</code></section>
</div>

A React adapter can subscribe to the events it needs. A logger can record
them, a transport can forward them, an agent can inspect them, and a second
model can react. The event does not belong to one component.

## React becomes an adapter—not a smaller React

Substrate state and events can be translated into the UI mechanism that makes
sense for a renderer. React is free to use local state, context, a reducer, or
an external store; another adapter could use Solid signals, a Svelte store, a
canvas renderer, or a command-line display.

<div class="hara-react-adapters" role="img" aria-label="A Substrate space connects through adapters to React, Solid, Svelte, Canvas, and CLI renderers">
  <div>Substrate space<small>state · actions · events</small></div><b>→</b><section><span>React</span><span>Solid</span><span>Svelte</span><span>Canvas</span><span>CLI</span></section>
</div>

This does not weaken React. It lets React concentrate on composition,
receiving input, rendering projections, and genuinely local interaction state.

## Keep view state local; give application state a home

Not every value belongs in a Substrate space. A dropdown being open, an input's
temporary contents, a hovered row, or an animation phase can stay local to a
component. The distinction is ownership, not visibility.

<div class="hara-state-distinction hara-react-state" role="img" aria-label="Component-local state is temporary view detail while Substrate state belongs to the application">
  <section><i>⚛</i><b>Component-local state</b><small>Temporary detail of this view.</small><code>open · hover · draft</code></section>
  <section><i>◉</i><b>Substrate state</b><small>Information belonging to the application.</small><code>orders · user · document</code></section>
</div>

Ask one question: **would this information still matter if this component were
removed?** If yes, it probably belongs to a model or application space. That
keeps Substrate from becoming another indiscriminate global store.

## Shared does not mean one giant store

The challenge with global state is not only that it is global. One
undifferentiated store often ends up responsible for unrelated domains, pages,
services, caches, and transient UI details. Substrate keeps shared
connectivity while dividing a node into bounded, addressable spaces.

<div class="hara-substrate-spaces hara-substrate-spaces--compact" role="img" aria-label="One application node contains separate model session, model orders, model catalog, page orders, and page catalog spaces">
  <div class="hara-substrate-spaces__node"><b>Application node</b><section><strong>model/session</strong><strong>model/orders</strong><strong>model/catalog</strong><strong>page/orders</strong><strong>page/catalog</strong></section></div>
  <p>Bounded spaces + named actions + named signals + explicit connections.</p>
</div>

## The application exists before the UI

The shift is an ordering of responsibilities—not “Hara state versus React
state.” React-centred work can begin with components and let application
behaviour emerge from state and effects. Substrate starts with application
spaces, state, actions, and events, then connects a UI adapter.

<div class="hara-react-ordering" role="img" aria-label="React-centred design goes from component to state to effects to application behaviour while substrate-centred design goes from application spaces to state actions and events to UI adapter to components">
  <section><b>React-centred</b><span>Component</span><i>↓</i><span>State</span><i>↓</i><span>Effects</span><i>↓</i><span>Application behaviour</span></section>
  <section><b>Substrate-centred</b><span>Application spaces</span><i>↓</i><span>State · actions · events</span><i>↓</i><span>UI adapter</span><i>↓</i><span>Components</span></section>
</div>

React remains an excellent way to display and interact with the system. The
point is that the interface should not have to invent the entire application
layer as it renders it.

Use the [browser playground](../learn-programming/index.md) for a contained
live environment, or [On the Web](../getting-started.md) to choose a host for
a project.
