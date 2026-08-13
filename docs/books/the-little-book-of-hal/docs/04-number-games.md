---
title: 04 — Number Games
hara_kernel_loading: auto
---

# 04 — Number Games

**Question:** Collections become smaller with `rest`. How does a positive number
become smaller?

**Answer:** Subtract one and test for zero.

> **Rule 5 — Use the identity value of the operation at the base case.**

Addition starts from zero. Multiplication also terminates at zero, while powers
start from one because multiplying by one preserves the accumulated value.

<div class="hara-lesson" data-hara-lesson="little-hal-04-v1" data-hara-lesson-title="Number Games" data-hara-session-group="little-hal-04" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="add-by-moving-to-zero" data-hara-step-title="Add by moving to zero" data-hara-completion="run-edit-run">

## Add by moving to zero

**Question:** Can addition be described with only one-step changes?

**Answer:** Move one argument toward zero while adding one to the answer.

```hara eval group=little-hal-04
(do
  (defn plus [n m]
    (if (= m 0)
      n
      (+ 1 (plus n (- m 1)))))

  (plus 46 12))
```

The function is intentionally restricted to a non-negative second argument. Its
purpose is to expose the recursive shape, not replace Hara's ordinary `+`.

Run it, change either number, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="multiply-and-raise" data-hara-step-title="Multiply and raise" data-hara-completion="run-edit-run">

## Multiply and raise

**Question:** What are multiplication and exponentiation made from?

**Answer:** Repeated addition and repeated multiplication.

```hara eval group=little-hal-04
(do
  (defn times [n m]
    (if (= m 0)
      0
      (+ n (times n (- m 1)))))

  (defn power [base exponent]
    (if (= exponent 0)
      1
      (* base (power base (- exponent 1)))))

  {:times (times 7 4)
   :power (power 3 4)})
```

Zero is the identity for the addition accumulated by `times`. One is the
identity for the multiplication accumulated by `power`.

Run it, change the exponent or multiplier, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="choose-the-empty-answer" data-hara-step-title="Choose the empty answer" data-hara-completion="run-edit-run">

## Choose the empty answer

**Question:** What should a reduction return for an empty input?

**Answer:** The identity that leaves the combining operation unchanged.

```hara eval group=little-hal-04
(do
  (defn sum-values [values]
    (if (empty? values)
      0
      (+ (first values)
         (sum-values (rest values)))))

  (defn product-values [values]
    (if (empty? values)
      1
      (* (first values)
         (product-values (rest values)))))

  {:sum (sum-values [3 5 2 8])
   :product (product-values [3 5 2])
   :empty-sum (sum-values [])
   :empty-product (product-values [])})
```

The terminating values are part of each function's meaning. They are not merely
implementation details.

Run it, add a number to either vector, and run it again.

</div>

</div>

## Two paths to termination

```text
ordered values → rest → empty?
positive number → subtract one → equals zero?
```

Both patterns make progress visible in the changing argument.

[Back to Build on Return →](03-build-on-return.md){ .md-button }
[Continue to Trees of Values →](05-trees-of-values.md){ .md-button .md-button--primary }
