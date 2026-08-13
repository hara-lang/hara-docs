---
title: 09 — Recursion Without a Name
hara_kernel_loading: auto
---

# 09 — Recursion Without a Name

**Question:** Does recursion require a globally named function?

**Answer:** No. A function only needs a way to receive the behaviour it should
use for the next step.

> **Rule 9 — Prefer named recursion once the recursive shape is understood.**

This chapter first uses Hara's direct local-recursion forms. It then exposes the
self-application idea behind a fixed point, before returning to the clearer
forms used in ordinary programs.

<div class="hara-lesson" data-hara-lesson="little-hal-09-v1" data-hara-lesson-title="Recursion Without a Name" data-hara-session-group="little-hal-09" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="name-recursion-locally" data-hara-step-title="Name recursion locally" data-hara-completion="run-edit-run">

## Name recursion locally

**Question:** Can a recursive helper exist only inside one expression?

**Answer:** Yes. `letfn` installs local function bindings before evaluating its
body.

```hara eval group=little-hal-09
(letfn [(length-of [values]
          (if (empty? values)
            0
            (+ 1 (length-of (rest values)))))]
  (length-of [:north :east :south :west]))
```

The name `length-of` is available to its own body, but it does not become a Var
in the surrounding namespace.

Run it, change the input vector, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="pass-a-function-to-itself" data-hara-step-title="Pass a function to itself" data-hara-completion="run-edit-run">

## Pass a function to itself

**Question:** What can stand in for a recursive name?

**Answer:** A function can receive itself as an argument and use that value to
construct the next call.

```hara eval group=little-hal-09
((fn [maker]
   ((maker maker) [:a :b :c :d]))
 (fn [self]
   (fn [values]
     (if (empty? values)
       0
       (+ 1 ((self self) (rest values)))))))
```

`maker` is applied to itself. The result is the function that consumes
`values`; whenever it needs to continue, it repeats the same self-application.

Run it, add another value, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="extract-the-fixed-point" data-hara-step-title="Extract the fixed point" data-hara-completion="run-edit-run">

## Extract the fixed point

**Question:** Can the self-application machinery be separated from the function
being built?

**Answer:** Yes. A fixed-point helper receives a builder whose `again` argument
stands for the eventual recursive function.

```hara eval group=little-hal-09
(do
  (defn fix1 [builder]
    ((fn [self]
       (builder
         (fn [value]
           ((self self) value))))
     (fn [self]
       (builder
         (fn [value]
           ((self self) value))))))

  (def length-of
    (fix1
      (fn [again]
        (fn [values]
          (if (empty? values)
            0
            (+ 1 (again (rest values))))))))

  (length-of [:read :build :test :publish]))
```

This is an applicative-order fixed point for unary functions. It is valuable as
a model of how recursion can emerge from ordinary function application, not as
the preferred spelling for everyday HAL.

Run it, change the builder so it sums numeric values instead of counting them,
and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="use-loop-for-an-accumulator" data-hara-step-title="Use loop for an accumulator" data-hara-completion="run-edit-run">

## Use loop for an accumulator

**Question:** What should a production function use when every recursive call
is only carrying updated state forward?

**Answer:** `loop` and tail-position `recur` make the state transition explicit.

```hara eval group=little-hal-09
(do
  (defn length-loop [values]
    (loop [remaining values
           total 0]
      (if (empty? remaining)
        total
        (recur (rest remaining)
               (+ total 1)))))

  (length-loop [:read :build :test :publish :share]))
```

`remaining` moves toward exhaustion while `total` carries the accumulated
answer. No stack of pending additions is required.

Run it, change the initial total or the input, and run it again.

</div>

</div>

## Learn the mechanism, choose the clear form

```text
self-application → explains how a fixed point can exist
letfn            → names local recursive relationships
loop/recur       → expresses a tail-recursive state machine
```

The unusual construction is useful because it removes magic from recursion.
The named forms are useful because they make intent obvious to the next reader.

[Back to Functions Make Functions →](08-functions-make-functions.md){ .md-button }
[Continue to The Value of a Form →](10-the-value-of-a-form.md){ .md-button .md-button--primary }
