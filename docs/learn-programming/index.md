# Learn to program with Hara

This path is for people learning programming, not only learning a new
language. You will use Hara's live REPL to make small, understandable changes
and see what each program does before moving on.

## How to use this guide

Keep a Hara REPL open as you read. Type each example, change one value, and
notice the result. Programming becomes much less mysterious when every idea is
something you can test immediately.

## The smallest program

Enter this in a REPL:

```hara
(+ 19 23)
```

Hara reads the form between the parentheses, runs `+` with the two numbers,
and returns `42`. A program is simply a series of precise instructions that
transform information or cause an explicit effect.

## Values and data

Programs receive, create, and transform values. A value can be a number, text,
a name, a list, or a set of labeled facts.

### Numbers and text

```hara
(+ 19 23)
; => 42

(str "hello, " "Ada")
; => "hello, Ada"
```

The first item in a Hara form is usually the operation. The other items are
the values passed to it:

```text
(operation input-one input-two)
```

### Lists of values

A vector uses square brackets. Use a vector when the order of values matters:

```hara
(def scores [10 20 30])
(count scores)
; => 3
```

`def` gives a value a name. Change the vector, run the forms again, and inspect
the new result.

### Labeled facts

A map uses braces. Keywords such as `:name` label each fact:

```hara
(def player {:name "Nova" :score 0})
(:name player)
; => "Nova"
```

A map can represent a player, task, screen, or project setting. It groups
related facts into one value.

Try it yourself. Make a map with a name and one number. Retrieve each value by
its keyword.

## Decisions and repetition

A program can choose an action from a value. It can also apply one action to
many values.

### Make a decision

`if` chooses between two results. The first value is a question. Hara evaluates
only one of the next two forms:

```hara
(def score 12)

(if (>= score 10)
  "level complete"
  "keep playing")
; => "level complete"
```

Change `score` to a smaller number. The program now follows the other path.

### Choose from several cases

Use `cond` for several ordered choices:

```hara
(defn rank [score]
  (cond
    (>= score 100) "gold"
    (>= score 50) "silver"
    :else "bronze"))

(rank 70)
; => "silver"
```

Read a `cond` from top to bottom. The first true condition supplies the result.

### Repeat over a collection

Use `map` to apply one rule to each item:

```hara
(map (fn [score] (+ score 10)) [0 10 20])
; => [10 20 30]
```

`map` calls the function once for every score. It leaves the original vector
unchanged and returns a new vector.

## Functions and changing state

A function gives a behavior a name. State records information that can change
while an interactive program runs.

### Name a behavior

```hara
(defn move-right [player amount]
  (assoc player :x (+ (:x player) amount)))

(move-right {:x 10 :y 4} 3)
; => {:x 13 :y 4}
```

`defn` defines a function. This function receives a player and an amount. It
returns a new player map and does not change the original map.

### Make change explicit

Use an atom when a value must change over time. The atom makes the mutable
state visible:

```hara
(def player (atom {:x 10 :score 0}))

(swap! player move-right 3)
@player
; => {:x 13 :score 0}
```

`swap!` applies a function to the current value in the atom. `@player` reads
the current value.

Use this model for a game position, timer, or selected visual object. In a live
workspace, redefine `move-right` and inspect the result without restarting the
project.

## You do not need to memorize everything

The goal is to build a useful mental model, not to learn every feature at once.
Use the [user guide](../user-guide.md) when you need a language detail and the
[reference](../reference/index.md) when you need the complete contract.

Continue with [your first browser game](../create/first-game.md). The game
combines state, updates, and rendering on one canvas.
