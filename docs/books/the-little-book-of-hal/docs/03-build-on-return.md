---
title: 03 — Build on Return
hara_kernel_loading: auto
---

# 03 — Build on Return

**Question:** A recursive call solves the smaller problem. What happens next?

**Answer:** The caller uses that answer to build its own result.

> **Rule 4 — Rebuild persistent output around the recursive answer.**

`cons` is useful here because it can put the current value in front of the
already-computed tail. `vec` makes the finite result explicit at the display
boundary.

<div class="hara-lesson" data-hara-lesson="little-hal-03-v1" data-hara-lesson-title="Build on Return" data-hara-session-group="little-hal-03" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="remove-the-first-match" data-hara-step-title="Remove the first match" data-hara-completion="run-edit-run">

## Remove the first match

**Question:** How do we remove one value without changing the original vector?

**Answer:** Stop rebuilding at the first match and return the untouched rest.

```hara eval group=little-hal-03
(do
  (defn remove-first [target values]
    (cond
      (empty? values) []
      (= target (first values)) (vec (rest values))
      :else
      (vec
        (cons (first values)
              (remove-first target (rest values))))))

  (remove-first :mint
                [:lamb :chops :and :mint :flavoured :mint :jelly]))
```

Only the path before the first match is rebuilt. Values after the match are
reused through persistence.

Run it, choose the second `:mint` as a different target experiment, and run it
again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="insert-to-the-right" data-hara-step-title="Insert to the right" data-hara-completion="run-edit-run">

## Insert to the right

**Question:** How can a new value appear immediately after the first match?

**Answer:** At the matching point, build two values in front of the remaining
tail.

```hara eval group=little-hal-03
(do
  (defn insert-right [new-value old-value values]
    (cond
      (empty? values) []
      (= old-value (first values))
      (vec
        (cons old-value
              (cons new-value (rest values))))
      :else
      (vec
        (cons (first values)
              (insert-right new-value old-value (rest values))))))

  (insert-right :topping
                :fudge
                [:ice :cream :with :fudge :for :dessert]))
```

The recurring case preserves the current value. The matching case changes the
local construction rule.

Run it, insert on the left by swapping the two `cons` calls, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="collect-the-first-values" data-hara-step-title="Collect the first values" data-hara-completion="run-edit-run">

## Collect the first values

**Question:** What is the first value of every non-empty row?

**Answer:** Take the first row's first value, then build it in front of the
answer for the remaining rows.

```hara eval group=little-hal-03
(do
  (defn heads [rows]
    (if (empty? rows)
      []
      (vec
        (cons (first (first rows))
              (heads (rest rows))))))

  (heads [[:apple :peach :pumpkin]
          [:plum :pear :cherry]
          [:grape :raisin :pea]
          [:bean :carrot :eggplant]]))
```

The base case is an empty vector because the function is building a vector of
answers.

Run it, reorder a row or add another row, and run it again.

</div>

</div>

## Build around the answer

The important line is usually the recurring construction:

```hara
(vec (cons current (solve (rest values))))
```

The recursive call answers the smaller problem. The surrounding form explains
how the current value participates in the larger answer.

[Back to Ask Again →](02-ask-again.md){ .md-button }
[Continue to Number Games →](04-number-games.md){ .md-button .md-button--primary }
