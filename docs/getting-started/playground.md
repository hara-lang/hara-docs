# Get started with Playground

Playground is the quickest way to experience Hara. It runs in the browser, does
not require a local editor, and keeps code, evaluation, state, and visual output
close together.

Open [playground.hara-lang.org](https://playground.hara-lang.org/) and use this
guide as a first session. The goal is not to read the whole language before
writing anything. The goal is to change a running program and understand what
each form does.

## The working rhythm

Use the same four-step loop throughout this guide:

1. Predict what a form will return or change.
2. Evaluate the form.
3. Change one part of it.
4. Explain the new result in your own words.

Hara is designed for a live workflow. A useful program can remain running while
you evaluate a new definition, inspect a value, change current state, and keep
the successful change in source.

## Evaluate a value

Start with a small expression:

```hara
(+ 19 23)
```

The result should be:

```text
42
```

Now change one number. Before evaluating, predict the answer. This separates
the language rule from the interface action.

Try several literal values:

```hara
42
"wombat"
:ready
true
nil
[10 20 30]
{:name "Hara" :ready true}
```

A literal evaluates to a corresponding value. A vector and map are persistent
collections: operations produce new values rather than rewriting the original
collection in place.

## Bind a name

Define a value:

```hara
(def greeting "Hello from Hara")
```

Evaluate the name:

```hara
greeting
```

Then replace the definition with another value and evaluate the name again.
The active session remembers definitions, which is why the feedback loop feels
continuous.

## Define and call a function

Create a function:

```hara
(defn greet [name]
  (str "Hello, " name))
```

Call it:

```hara
(greet "Ada")
```

A function receives values through its parameters and returns the result of its
body. Change the prefix, call the function again, and observe that the new
definition is used by the running session.

## Work with immutable data

Create a player value:

```hara
(def initial-player
  {:x 40
   :y 30
   :score 0})
```

Produce a changed value:

```hara
(assoc initial-player :score 10)
```

Evaluate `initial-player` again. Its `:score` remains `0`. `assoc` returned a
new map; it did not mutate the original value.

Pure transformations are easy to test because the same input produces the same
output:

```hara
(defn add-score [player amount]
  (assoc player
         :score
         (+ (get player :score) amount)))
```

Try:

```hara
(add-score initial-player 25)
```

## Introduce current state

A running game, drawing, controller, or simulation needs a place to hold its
current value. Use an atom for that explicit mutable boundary:

```hara
(def player
  (atom initial-player))
```

Read the current value:

```hara
@player
```

Change the current value through a function:

```hara
(swap! player add-score 5)
```

The map inside the atom is still an immutable Hara map. The atom is the named
container whose current value changes.

## Connect code to a visual result

A visual Playground project can treat the atom as the model and a visualiser as
a view of that model. A controller applies state transitions; the visualiser
reads the resulting value.

A small movement function might be:

```hara
(defn move-right [player amount]
  (assoc player
         :x
         (+ (get player :x) amount)))
```

Apply it to current state:

```hara
(swap! player move-right 8)
```

When a canvas or object is connected to `player`, the visible result can update
without restarting the program. The important idea is that the visualiser does
not own the game rules. It renders state produced by ordinary Hara functions.

## Keep the source understandable

Live evaluation makes experimentation fast, but the session should not become
the only record of the program. Keep definitions that matter in a `.hal` source
file. Use the REPL or evaluation surface to test a change, then move the useful
form into the project.

A small file might look like this:

```hara
(ns orbit.game)

(def initial-player
  {:x 40 :y 30 :score 0})

(def player
  (atom initial-player))

(defn move-right [state amount]
  (assoc state :x (+ (get state :x) amount)))

(defn step-right [amount]
  (swap! player move-right amount))
```

This separates the pure transformation `move-right` from the state-changing
operation `step-right`.

## Use Playground to inspect evaluation

Playground is also a natural place to teach how Hara evaluates code. A complete
teaching view can expose these stages:

1. source text is read into a form;
2. macros expand the form into a simpler form;
3. symbols resolve in the current namespace and session;
4. arguments evaluate;
5. the function or special form runs;
6. the resulting value is shown;
7. watches and visualisers respond to state changes.

Not every expression performs every stage visibly, but the sequence explains
why a live workspace can show more than a final printed answer.

## Know what Playground is for

Playground is best for:

- a first Hara session;
- learning one language idea at a time;
- sharing a visual example;
- experimenting with state, controllers, and visualisers;
- checking whether a small project idea works before local setup.

Move to the CLI when you need shell automation, files, local tests, or a long-
running server. Move to Hara Chrome when you need DevTools and page capabilities.
Move to VS Code or Emacs when the local source tree should be the main working
surface.

## A first practice project

Build a counter with three pieces:

```hara
(def count (atom 0))

(defn increase []
  (swap! count + 1))

(defn reset-count []
  (reset! count 0))
```

Connect the current count to a text visualiser. Connect one control to
`increase` and another to `reset-count`. Then add a rule that stops the counter
at ten.

This tiny project contains the core dataflow pattern: current state, named
transitions, controls, and a visual representation.

## Continue

Use [Get started with the Web](web.md) when you are ready to turn the experiment
into a browser project. Follow the
[first browser game](../create/first-game.md) for a complete walkthrough, or
start the [Hara Lisp — Intro](../hara-lisp-intro/index.md) course for a deeper
language sequence.