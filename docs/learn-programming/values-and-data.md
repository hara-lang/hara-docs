# Values and data

Programs work by receiving, creating, and transforming values. A value can be a
number, some text, a name, a list of things, or a set of labelled facts.

## Numbers and text

```hara
(+ 19 23)
; => 42

(str "hello, " "Ada")
; => "hello, Ada"
```

The first item in a Hara form is usually the operation. The remaining items are
the values passed to it. This makes the shape of an instruction easy to read:
`(operation input-one input-two)`.

## Lists of values

A vector uses square brackets. It is useful when the order of values matters.

```hara
(def scores [10 20 30])
(count scores)
; => 3
```

`def` gives a value a name so later forms can use it. Change the vector, run
the two forms again, and see how the result changes.

## Labelled facts

A map uses braces. Keywords, such as `:name`, are lightweight labels.

```hara
(def player {:name "Nova" :score 0})
(:name player)
; => "Nova"
```

Maps are a natural way to represent a game player, a task, a screen, or a
project setting: one value that groups related facts together.

## Try it

Make a map for something you care about. Give it at least a name and one
number, then retrieve each value by its keyword. That is already the beginning
of modelling a small program world.
