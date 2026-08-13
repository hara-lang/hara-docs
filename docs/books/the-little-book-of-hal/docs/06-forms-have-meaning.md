---
title: 06 — Forms Have Meaning
hara_kernel_loading: auto
---

# 06 — Forms Have Meaning

**Question:** Can an arithmetic expression be a value before it is calculated?

**Answer:** Yes. Represent the expression as data, then give that representation
an evaluator.

> **Rule 7 — Separate a representation from the meaning it carries.**

The chapter uses prefix vectors such as `[:+ 1 [:* 3 4]]`. The first item names
the operation; the remaining items are subexpressions.

<div class="hara-lesson" data-hara-lesson="little-hal-06-v1" data-hara-lesson-title="Forms Have Meaning" data-hara-session-group="little-hal-06" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="inspect-an-expression" data-hara-step-title="Inspect an expression" data-hara-completion="run-edit-run">

## Inspect an expression

**Question:** What are the parts of a represented call?

**Answer:** An operator and its operands.

```hara eval group=little-hal-06
(let [form [:+ 1 [:* 3 4]]]
  {:operator (first form)
   :left (second form)
   :right (nth form 2)})
```

Nothing has been added or multiplied. The vector is only a description.

Run it, change the outer operator or one subexpression, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="evaluate-the-subexpressions" data-hara-step-title="Evaluate the subexpressions" data-hara-completion="run-edit-run">

## Evaluate the subexpressions

**Question:** Where should the evaluator recur?

**Answer:** Into the operands, because each operand is another expression of the
same language.

```hara eval group=little-hal-06
(do
  (defn value-of [form]
    (if (number? form)
      form
      (let [operator (first form)]
        (cond
          (= operator :+)
          (+ (value-of (second form))
             (value-of (nth form 2)))

          (= operator :*)
          (* (value-of (second form))
             (value-of (nth form 2)))

          (= operator :-)
          (- (value-of (second form))
             (value-of (nth form 2)))

          :else nil))))

  (value-of [:+ 1 [:* 3 4]]))
```

The scalar case returns its own value. A compound form evaluates its children
before applying the named operation.

Run it, nest another arithmetic form, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="hide-the-representation" data-hara-step-title="Hide the representation" data-hara-completion="run-edit-run">

## Hide the representation

**Question:** Must the evaluator know every indexing detail?

**Answer:** No. Helpers can define the representation boundary.

```hara eval group=little-hal-06
(do
  (def operations
    {:+ +
     :* *
     :- -})

  (defn operator-of [form]
    (first form))

  (defn operands-of [form]
    [(second form) (nth form 2)])

  (defn value-of [form]
    (if (number? form)
      form
      (let [operation (get operations (operator-of form))
            operands (map value-of (operands-of form))]
        (apply operation operands))))

  (value-of [:* [:+ 2 3] [:- 10 4]]))
```

The recursive evaluator now speaks in terms of operators and operands. Changing
the storage representation would mostly affect the helper functions.

Run it, add another operation to the map, and run a form that uses it.

</div>

</div>

## Representation is a boundary

```text
syntax data → representation helpers → recursive meaning → ordinary function
```

When indexing logic is scattered throughout an evaluator, representation and
meaning become difficult to change independently.

[Back to Trees of Values →](05-trees-of-values.md){ .md-button }
[Continue to Sets and Relations →](07-sets-and-relations.md){ .md-button .md-button--primary }
