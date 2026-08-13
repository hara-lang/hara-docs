---
title: 01 — Values Have Shapes
hara_kernel_loading: auto
---

# 01 — Values Have Shapes

**Question:** What does a Hara program begin with?

**Answer:** A value. Before choosing a function, learn to see the value's shape.

> **Rule 1 — Read the value's shape before choosing an operation.**

Hara has scalars, persistent collections, and quoted forms. Parentheses usually
mean evaluation, while quote lets a form remain data.

<div class="hara-lesson" data-hara-lesson="little-hal-01-v1" data-hara-lesson-title="Values Have Shapes" data-hara-session-group="little-hal-01" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="see-the-values" data-hara-step-title="See the values" data-hara-completion="run-edit-run">

## See the values

**Question:** Can one result show several kinds of value at once?

**Answer:** Yes. Put each value behind a named map key.

```hara eval group=little-hal-01
{:number 42
 :text "HAL"
 :keyword :direction/north
 :vector [:north :east :south]
 :map {:name "Nova" :score 12}
 :set #{:read :build :test}
 :quoted-form '(+ 19 23)}
```

The quoted form is a list value. It is not added because quote prevents the
usual call interpretation.

Run the starter, change at least two values, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="take-first-and-rest" data-hara-step-title="Take first and rest" data-hara-completion="run-edit-run">

## Take first and rest

**Question:** How do we ask an ordered value about its first item and everything
after it?

**Answer:** Use `first` and `rest`.

```hara eval group=little-hal-01
(let [directions [:north :east :south :west]]
  {:first (first directions)
   :rest (vec (rest directions))
   :empty (empty? [])})
```

Hara is iterator-first. `rest` returns a lazy `Seq`, or `nil` when no values
remain. `vec` materialises the remaining values here so the finite result is
plain to read.

Run the starter, reorder the directions, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="put-one-in-front" data-hara-step-title="Put one in front" data-hara-completion="run-edit-run">

## Put one in front

**Question:** Does adding a first value alter the old collection?

**Answer:** No. `cons` returns another value.

```hara eval group=little-hal-01
(let [original [:butter :jelly]
      rebuilt (vec (cons :peanut [:butter :jelly]))]
  {:original original
   :rebuilt rebuilt})
```

The original vector and the rebuilt value coexist. That is the persistent-data
habit used throughout the book.

Run the starter, put a different value in front, and run it again.

</div>

</div>

## Keep this shape in mind

```text
empty?  decides whether there is work left
first   selects the current value
rest    moves toward termination
cons    rebuilds a result without mutation
```

[Return to the book →](index.md){ .md-button }
[Continue to Ask Again →](02-ask-again.md){ .md-button .md-button--primary }
