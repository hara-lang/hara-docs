# Read Hara and build from scratch

This path is for learning how programs are constructed, not merely memorising a new syntax.

No previous Lisp or Clojure knowledge is assumed. Hara gives you a small reading model, a live evaluator, and direct access to the ideas beneath a framework: values, functions, decisions, collections, state, and effects.

Keep a Hara REPL or the [browser Playground](../getting-started/playground.md) open while you read. Type each example, predict the result, change one value, and run it again.

## The whole reading rule

Start with one form:

```hara
(+ 19 23)
; => 42
```

Hara reads the expression between the parentheses, calls `+` with two numbers, and returns `42`.

```text
(operation input input)
```

That operation-first shape continues through ordinary function calls. You do not need to learn a separate surface syntax for each kind of application.

## Values are the material of a program

Programs receive, create, name, and transform values.

### Numbers and text

```hara
(+ 19 23)
; => 42

(str "hello, " "Ada")
; => "hello, Ada"
```

The first form combines numbers. The second combines strings. Both follow the same reading rule.

### Ordered values

A vector uses square brackets:

```hara
(def scores [10 20 30])

(count scores)
; => 3
```

`def` gives a value a name. A vector is useful when order matters: positions, steps, coordinates, rows, or a sequence of commands.

### Named facts

A map uses braces. Keywords label each fact:

```hara
(def player
  {:name "Nova"
   :score 0})

(get player :name)
; => "Nova"
```

A map can represent a player, task, request, document, screen, or configuration. It keeps related facts in one inspectable value.

## Transform values instead of hiding change

Persistent collections return an updated value while preserving the original.

```hara
(def next-player
  (assoc player :score 10))

player
; => {:name "Nova" :score 0}

next-player
; => {:name "Nova" :score 10}
```

This makes the transformation visible. You can inspect the input, the output, and the function between them.

## Give behaviour a name

A function receives values and returns a value.

```hara
(defn add-score [player amount]
  (update player :score
    (fn [score]
      (+ score amount))))

(add-score player 25)
; => {:name "Nova" :score 25}
```

Read the definition from the outside in:

1. `defn` creates a named function.
2. `add-score` is its name.
3. `[player amount]` lists its inputs.
4. The remaining form calculates the result.

The function does not need to know where the player came from or how the result will be displayed. That separation lets the same rule be tested, reused, and connected to different hosts.

## Make decisions from data

`if` selects one of two results:

```hara
(def score 12)

(if (>= score 10)
  "level complete"
  "keep playing")
; => "level complete"
```

Only one branch is evaluated. Change `score` and run the form again to see the other path.

Use `cond` when several ordered cases are easier to read:

```hara
(defn rank [score]
  (cond
    (>= score 100) :gold
    (>= score 50)  :silver
    :else          :bronze))

(rank 70)
; => :silver
```

A program is often a collection of these small decisions over well-shaped data.

## Apply one rule to many values

Use `map` to transform every item in a collection:

```hara
(map
  (fn [score]
    (+ score 10))
  [0 10 20])
; => [10 20 30]
```

The input vector remains available. `map` returns the new sequence of results.

The same idea scales from three scores to records from a file, rows from a service, drawing commands, or events in a running system.

## Make changing state explicit

Most values in Hara are immutable. When an interactive program needs a current value that changes over time, place it in an atom.

```hara
(def game
  (atom {:player {:x 10 :y 4}
         :score 0}))
```

The atom marks the boundary. The map inside it remains an ordinary value.

Define a transition:

```hara
(defn move-right [state amount]
  (update-in state [:player :x]
    (fn [x]
      (+ x amount))))
```

Apply it to the current value:

```hara
(swap! game move-right 3)

(deref game)
; => {:player {:x 13 :y 4} :score 0}
```

The current state is visible, the transition has a name, and the result can be inspected before a renderer or host turns it into an effect.

This model works for a game position, selected document, connection status, timer, or any other piece of application state whose changes should remain understandable.

## Separate rules from effects

A pure function returns a value. An effect crosses into the environment: drawing on a canvas, reading a file, opening a socket, or calling a host object.

Hara keeps that boundary explicit. Application rules can remain ordinary transformations, while a granted capability performs the effect.

```text
input value → application rule → output value → host capability → visible effect
```

You do not need host access to test the middle of that chain.

## Work in a live loop

Hara is designed to keep the running program close:

```text
write → evaluate → inspect → change
```

A REPL is not only for isolated calculations. Definitions, atoms, functions, and project state can stay alive while you refine them. When an experiment is correct, keep the definition in durable `.hal` source.

This gives learning and production work the same basic rhythm. The program becomes more capable without replacing the mental model that got you started.

## What you have learned

You can now read and write the core of an ordinary Hara program:

- forms call operations;
- vectors hold ordered values;
- maps hold named facts;
- functions transform values;
- conditions choose results;
- persistent collections make updates visible;
- atoms mark changing state;
- capabilities mark effects at the host boundary.

These ideas are enough to begin building something complete.

## Continue

Build [Tic Tac Toe](../create/first-game.md) to combine data, state, rules, pointer input, and rendering from a blank canvas.

Then continue into the [Hara language course](../hal-intro/index.md) for persistent collections, streams, coroutines, promises, mutable boundaries, bytes, and files.
