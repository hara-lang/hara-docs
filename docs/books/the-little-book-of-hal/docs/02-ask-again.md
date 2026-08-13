---
title: 02 — Ask Again
hara_kernel_loading: auto
---

# 02 — Ask Again

**Question:** What makes a recursive function stop?

**Answer:** A question whose answer no longer needs recursion.

> **Rule 2 — State the empty case before the recurring case.**
>
> **Rule 3 — Move at least one argument closer to the empty case.**

For an ordered collection, `empty?` is the terminating question and `rest`
provides the smaller input.

<div class="hara-lesson" data-hara-lesson="little-hal-02-v1" data-hara-lesson-title="Ask Again" data-hara-session-group="little-hal-02" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="count-by-asking-again" data-hara-step-title="Count by asking again" data-hara-completion="run-edit-run">

## Count by asking again

**Question:** How many values remain?

**Answer:** None when the collection is empty; otherwise one plus the answer for
its rest.

```hara eval group=little-hal-02
(do
  (defn length-of [values]
    (if (empty? values)
      0
      (+ 1 (length-of (rest values)))))

  (length-of [:read :build :test :publish]))
```

The function changes `values` on every recurring call. Eventually `rest`
produces no more values.

Run the starter, add or remove an item, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="recognise-a-flat-value" data-hara-step-title="Recognise a flat value" data-hara-completion="run-edit-run">

## Recognise a flat value

**Question:** Is every item a leaf, or does one item open another branch?

**Answer:** Check the current item, then ask the same question of the rest.

```hara eval group=little-hal-02
(do
  (defn flat-vector? [values]
    (cond
      (empty? values) true
      (vector? (first values)) false
      :else (flat-vector? (rest values))))

  {:flat (flat-vector? [:north :east :south])
   :nested (flat-vector? [:north [:east :south] :west])})
```

This is deliberately a small predicate: in this chapter, a nested vector is the
only branch shape we recognise.

Run it, move the nested vector, or replace it with a scalar, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="search-one-value-at-a-time" data-hara-step-title="Search one value at a time" data-hara-completion="run-edit-run">

## Search one value at a time

**Question:** Is the target present?

**Answer:** Compare the first value. If it is not the target, continue with the
rest.

```hara eval group=little-hal-02
(do
  (defn contains-value? [target values]
    (cond
      (empty? values) false
      (= target (first values)) true
      :else (contains-value? target (rest values))))

  {:found (contains-value? :meat [:potatoes :and :meat :gravy])
   :missing (contains-value? :liver [:bagels :and :lox])})
```

The empty case answers `false`. The matching case answers immediately. Only the
remaining case recurs.

Run it, change either target, and run it again.

</div>

</div>

## The recurring shape

```text
empty input  → direct answer
current item → local question
rest         → smaller version of the original problem
```

[Back to Values Have Shapes →](01-values-have-shapes.md){ .md-button }
[Continue to Build on Return →](03-build-on-return.md){ .md-button .md-button--primary }
