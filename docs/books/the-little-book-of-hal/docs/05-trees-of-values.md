---
title: 05 — Trees of Values
hara_kernel_loading: auto
---

# 05 — Trees of Values

**Question:** What changes when a collection contains other collections?

**Answer:** A function must recur through both the current branch and the
remaining siblings.

> **Rule 6 — Recur into every subvalue that has the same shape.**

The examples use nested vectors as a small tree language. Scalars are leaves;
vectors are branches.

<div class="hara-lesson" data-hara-lesson="little-hal-05-v1" data-hara-lesson-title="Trees of Values" data-hara-session-group="little-hal-05" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="count-every-leaf" data-hara-step-title="Count every leaf" data-hara-completion="run-edit-run">

## Count every leaf

**Question:** How many scalar leaves are inside a nested value?

**Answer:** A scalar contributes one. A vector contributes the total of its
children.

```hara eval group=little-hal-05
(do
  (declare count-tree)

  (defn count-children [values]
    (if (empty? values)
      0
      (+ (count-tree (first values))
         (count-children (rest values)))))

  (defn count-tree [value]
    (if (vector? value)
      (count-children value)
      1))

  (count-tree [[:coffee] :cup [[:tea] :cup] [:and [:hickory]]]))
```

`count-tree` decides whether a value is a branch. `count-children` performs the
ordered recursion across that branch.

Run it, add another nested leaf, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="remove-through-every-branch" data-hara-step-title="Remove through every branch" data-hara-completion="run-edit-run">

## Remove through every branch

**Question:** How can every matching leaf disappear while the tree shape
remains?

**Answer:** Rebuild each branch, skipping matching scalar children.

```hara eval group=little-hal-05
(do
  (declare remove-deep)

  (defn remove-deep-many [target values]
    (cond
      (empty? values) []
      (vector? (first values))
      (vec
        (cons (remove-deep target (first values))
              (remove-deep-many target (rest values))))
      (= target (first values))
      (remove-deep-many target (rest values))
      :else
      (vec
        (cons (first values)
              (remove-deep-many target (rest values))))))

  (defn remove-deep [target value]
    (if (vector? value)
      (remove-deep-many target value)
      value))

  (remove-deep :cup
               [[:coffee] :cup [[:tea] :cup] [:and [:hickory]] :cup]))
```

There are now three non-empty cases: another branch, a matching leaf, and a leaf
to preserve.

Run it, remove a different value, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="find-the-first-leaf" data-hara-step-title="Find the first leaf" data-hara-completion="run-edit-run">

## Find the first leaf

**Question:** What is the leftmost scalar, even when an earlier branch is empty?

**Answer:** Search the first child; if that branch has no leaf, continue across
the remaining children.

```hara eval group=little-hal-05
(do
  (defn first-leaf [value]
    (cond
      (not (vector? value)) value
      (empty? value) nil
      :else
      (let [candidate (first-leaf (first value))]
        (if (nil? candidate)
          (first-leaf (vec (rest value)))
          candidate))))

  (first-leaf [[[]] [[:hot] :tuna] :cheese]))
```

The function uses `nil` as “no leaf found in this branch.” That local result
controls whether the search continues among the siblings.

Run it, move the empty branches or replace the first leaf, and run it again.

</div>

</div>

## Two recursive directions

A tree traversal often needs both:

```text
first child       → descend into a branch
remaining children → continue across siblings
```

Treating those as separate questions keeps the recursive shape readable.

[Back to Number Games →](04-number-games.md){ .md-button }
[Continue to Forms Have Meaning →](06-forms-have-meaning.md){ .md-button .md-button--primary }
