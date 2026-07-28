# 03 — First evaluation: work through the live kernel

The first meaningful Hara action is not creating a package or selecting a framework. It is sending a small form to a live kernel, receiving a structured result, and using that result to decide the next action.

This chapter develops that loop carefully.

You will:

- evaluate values and functions;
- see how a session retains definitions;
- make a bounded change to live state;
- distinguish observation from modification;
- use errors as inspectable evidence; and
- understand how the same interaction can be used by an AI agent.

## Forms are requests to the kernel

A Hara form is a structural request. In the common case, the first item names an operation and the remaining items are its arguments:

```hara
(+ 19 23)
```

The kernel reads the form, resolves `+`, evaluates the arguments, invokes the operation, and returns a Hara value:

```text
42
```

This sounds like ordinary language evaluation, but the development consequence is important: a form can be as small as the question you need to ask.

You do not have to rebuild an application to find the result of one transformation.

## Start with values that explain themselves

Evaluate a map rather than a bare number:

```hara
{:system :hara
 :mode :live
 :status :running}
```

Maps, vectors, sets, keywords, symbols, strings, numbers, booleans, and `nil` are readable Hara values. They are useful development results because they preserve structure.

A person can scan them. An agent can parse them. A test can compare them. A visualiser can project them.

Prefer a structured result when structure is part of what you are trying to understand.

For example:

```hara
{:position {:x 40 :y 18}
 :velocity {:x 2 :y 0}
 :score 7
 :status :playing}
```

is more inspectable than:

```text
player ok
```

## Define something in the active session

Evaluate:

```hara
(def project-state
  {:name "first-system"
   :mode :inspection
   :changes 0})
```

The definition is installed in a Var in the current namespace.

Now evaluate a separate form:

```hara
project-state
```

Expected value:

```hara
{:name "first-system"
 :mode :inspection
 :changes 0}
```

The second evaluation can resolve the first definition because both reached the same kernel session.

This continuity is the basis of runtime-driven development. A session is an active context, not a series of unrelated command invocations.

## Define a transformation

Evaluate:

```hara
(defn record-change [state description]
  (-> state
      (assoc :last-change description)
      (update :changes + 1)))
```

Then evaluate:

```hara
(record-change project-state "changed the starting position")
```

Expected shape:

```hara
{:name "first-system"
 :mode :inspection
 :changes 1
 :last-change "changed the starting position"}
```

The original persistent map remains unchanged. The function returned a new value.

Inspect both explicitly:

```hara
{:before project-state
 :after (record-change project-state "changed the starting position")}
```

This `:before` and `:after` pattern is useful when a change needs review. It makes the comparison part of the result rather than part of a verbal explanation.

## Observation and modification are different operations

An inspectable system should make it clear whether a form merely reads state or changes it.

Reading a value:

```hara
(get project-state :mode)
```

Transforming a value without storing the result:

```hara
(assoc project-state :mode :building)
```

Changing a live reference:

```hara
(def live-state
  (atom {:position {:x 40 :y 18}
         :score 0}))
```

Then:

```hara
(swap! live-state
       (fn [state]
         (update state :score + 1)))
```

And inspect:

```hara
(deref live-state)
```

The distinction matters to people, tools, and agents:

- `get` observes;
- `assoc` returns a new value;
- `swap!` changes the value held by a live reference; and
- `deref` observes the current value of that reference.

A system becomes easier to reason about when mutation is concentrated in named places and transformations remain ordinary functions.

## Use a narrow live-state pattern

A useful first pattern is to keep the transition function separate from the mutable reference:

```hara
(defn move-right [state amount]
  (update-in state [:position :x] + amount))

(def player
  (atom {:position {:x 40 :y 18}
         :score 0}))
```

Test the transition as a pure value operation:

```hara
(move-right {:position {:x 40 :y 18}
             :score 0}
            2)
```

Only after the result is clear, apply it to the live reference:

```hara
(swap! player move-right 2)
```

Then inspect:

```hara
(deref player)
```

This sequence provides evidence at two levels:

1. the transition is understandable as a function from one value to another;
2. the live system now holds the accepted result.

It is much easier to inspect than burying calculation and mutation inside one large event handler.

## Evaluate the smallest meaningful form

The smallest syntactic form is not always the smallest meaningful change.

Changing only the number `2` is syntactically small but may not tell the kernel which definition you intend to replace. Re-evaluating the complete `defn` form makes the change explicit:

```hara
(defn move-right [state amount]
  (update-in state [:position :x] + (* amount 2)))
```

After evaluation, future calls in the session resolve the new Var root.

A good unit of live change is usually one of:

- a complete definition;
- one state transition;
- one namespace declaration;
- one workspace node declaration;
- one capability request; or
- one testable expression.

## Keep accepted changes in source

A live evaluation is immediate, but it is not automatically the durable project record.

Use this discipline:

```text
experiment in session
       |
       v
observe result
       |
       +--> reject -> restore or evaluate another form
       |
       +--> accept -> save the complete definition in source
```

The session is the laboratory. Source is the retained explanation.

Do not allow a useful runtime change to exist only in REPL history. Another person, another agent, a restarted kernel, and CI should be able to reconstruct it from the project.

## Let errors narrow the problem

Evaluate an unbound name intentionally:

```hara
missing-value
```

The kernel should return an unbound-symbol error rather than a fabricated `nil` value.

Now produce an arity error:

```hara
(+)
```

Or an invalid operation for a value:

```hara
(get 42 :answer)
```

The exact wording depends on the runtime projection, but a useful error should identify the category of failure and retain source location where available.

Treat an error as structured runtime evidence:

- Which form failed?
- Which symbol or protocol was being resolved?
- What receiver category was supplied?
- Which source span owns the failure?
- Did any earlier effect complete before the error?

Refreshing the system before reading the error destroys evidence.

## Inspect namespace context

Definitions live in namespaces. The prompt normally shows the current namespace, and `/ns` can be used from the REPL command surface to inspect or change namespace context.

A source file should normally declare its namespace:

```hara
(ns first-system.core)

(def status
  {:kernel :running
   :project :first-system})
```

Evaluate:

```hara
status
```

A later project file can require the namespace with an alias:

```hara
(ns first-system.view
  (:require [first-system.core :as core]))

(get core/status :kernel)
```

Namespaces make live definitions addressable. Addressability is an inspectability feature: a person or agent can refer to `first-system.core/status` rather than “the object somewhere in the app.”

## Use the REPL as one surface, not the system itself

The terminal REPL supports history, completion, multiline input, inline documentation, and slash commands such as:

```text
/help
/history
/clear
/ns
/quit
```

Slash commands are handled by the REPL surface. Ordinary Hara forms are sent to the evaluator.

The distinction matters because the kernel can have several clients:

- terminal REPL;
- browser workspace;
- Chrome DevTools panel;
- editor extension;
- protocol client; or
- AI agent.

Closing one surface does not define what Hara is. The kernel and its session model do.

## Record evidence for an agent

An agent should not make a live change based only on a prose instruction such as “move the player faster.” A better interaction has an inspectable chain:

```hara
{:target 'first-system.core/move-right
 :current-result
 (move-right {:position {:x 40 :y 18}} 2)
 :requested-change "double movement distance"}
```

After evaluating the replacement definition, the agent can return:

```hara
{:target 'first-system.core/move-right
 :input {:position {:x 40 :y 18}}
 :amount 2
 :before-x 42
 :after-x 44
 :source-retained? true}
```

The exact schema is project-specific. The principle is stable: the runtime should provide enough structured evidence to connect an instruction, an evaluated form, a changed value, and a retained source edit.

## Optional: trace a real evaluation

Development builds can include the tracing feature. A traced evaluation records what the real evaluator did without evaluating the expression twice:

```hara
(dev.trace/eval '(first-system.core/move-right
                   {:position {:x 40 :y 18}}
                   2))
```

A trace can include source spans, macro-expansion steps, calls, arguments, returns, selected branches, host effects, errors, and truncation diagnostics.

Tracing is development evidence, not portable language semantics and not a profiler. It is most useful when a value alone does not explain how the system reached that value.

See [Development tracing](../development-tracing.md) for build flags, policies, limits, and the stored trace API.

## A complete first RDD loop

Work through this sequence in Playground or a local session.

### 1. Define inspectable state

```hara
(def live-state
  (atom {:mode :ready
         :position {:x 10 :y 10}
         :events []}))
```

### 2. Inspect before changing

```hara
(deref live-state)
```

### 3. Define a pure transition

```hara
(defn apply-event [state event]
  (-> state
      (assoc :mode :active)
      (update :events conj event)))
```

### 4. Test the transition without mutation

```hara
(apply-event (deref live-state)
             {:type :start})
```

### 5. Apply it to the live system

```hara
(swap! live-state apply-event {:type :start})
```

### 6. Inspect the result

```hara
(deref live-state)
```

### 7. Retain the definitions

Save `live-state` and `apply-event` in a project source file. Add a small test or example that reconstructs the expected transition from data.

That is the core Hara workflow in miniature.

## Evaluation checkpoint

You are ready to continue when you can distinguish:

- a value from a live reference;
- a pure transformation from a state change;
- a session definition from a saved source definition;
- a REPL command from a Hara form; and
- a verbal claim from runtime evidence.

## Next

Continue to [04 — Choose a workspace](04-choose-workspace.md) to place the same kernel workflow inside the browser, Chrome DevTools, VS Code, or a local CLI session without treating any one editor as the architecture.
