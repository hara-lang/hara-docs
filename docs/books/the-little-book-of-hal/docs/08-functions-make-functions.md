---
title: 08 — Functions Make Functions
hara_kernel_loading: auto
---

# 08 — Functions Make Functions

**Question:** What if the part of a recursive function that changes is not data,
but behaviour?

**Answer:** Pass that behaviour as a function, or return a new function that
remembers it.

> **Rule 8 — Use functions to name the behaviour that changes.**
>
> **Rule 10 — Return all the information the caller needs.**

<div class="hara-lesson" data-hara-lesson="little-hal-08-v1" data-hara-lesson-title="Functions Make Functions" data-hara-session-group="little-hal-08" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="remember-a-value-in-a-function" data-hara-step-title="Remember a value in a function" data-hara-completion="run-edit-run">

## Remember a value in a function

**Question:** Can a function remember the value used to create it?

**Answer:** Yes. A closure keeps the lexical values it references.

```hara eval group=little-hal-08
(do
  (defn equals-value [target]
    (fn [value]
      (= target value)))

  (def tuna? (equals-value :tuna))

  {:tuna (tuna? :tuna)
   :salad (tuna? :salad)
   :direct ((equals-value :opal) :opal)})
```

`equals-value` returns a specialised predicate. The returned function still
knows `target` after the creating call has finished.

Run it, change the remembered value, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="pass-the-test" data-hara-step-title="Pass the test" data-hara-completion="run-edit-run">

## Pass the test

**Question:** Must removal always use ordinary equality?

**Answer:** No. The recursive shape can receive its test as an argument.

```hara eval group=little-hal-08
(do
  (defn remove-where [predicate values]
    (cond
      (empty? values) []
      (predicate (first values))
      (remove-where predicate (rest values))
      :else
      (vec
        (cons (first values)
              (remove-where predicate (rest values))))))

  {:without-tuna
   (remove-where (fn [value] (= value :tuna))
                 [:shrimp :salad :tuna :and :tuna])

   :without-numbers
   (remove-where number?
                 [:five 5 :six 6 :seven 7])})
```

The traversal does not change. Only the question asked about each current value
changes.

Run it, provide a different predicate, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="build-a-transform-factory" data-hara-step-title="Build a transform factory" data-hara-completion="run-edit-run">

## Build a transform factory

**Question:** Inserting on the left and inserting on the right differ at only
one point. Can that difference become an argument?

**Answer:** Yes. Pass the local construction rule into a function factory.

```hara eval group=little-hal-08
(do
  (defn insert-with [sequence]
    (fn [new-value old-value values]
      (cond
        (empty? values) []
        (= old-value (first values))
        (sequence new-value old-value (rest values))
        :else
        (vec
          (cons (first values)
                ((insert-with sequence)
                 new-value
                 old-value
                 (rest values)))))))

  (def insert-left
    (insert-with
      (fn [new-value old-value tail]
        (vec (cons new-value (cons old-value tail))))))

  (def insert-right
    (insert-with
      (fn [new-value old-value tail]
        (vec (cons old-value (cons new-value tail))))))

  {:left (insert-left :d :e [:a :b :c :e :f])
   :right (insert-right :e :d [:a :b :c :d :f])})
```

The factory captures `sequence`, while the returned function supplies the data
for one insertion.

Run it, define a replacement rule that keeps only `new-value`, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="collect-two-answers" data-hara-step-title="Collect two answers" data-hara-completion="run-edit-run">

## Collect two answers

**Question:** Can one traversal return both the values kept and the values
removed?

**Answer:** Give the traversal a collector that decides how to receive both
answers.

```hara eval group=little-hal-08
(do
  (defn remove-and-collect [target values receive]
    (cond
      (empty? values)
      (receive [] [])

      (= target (first values))
      (remove-and-collect
        target
        (rest values)
        (fn [kept removed]
          (receive kept
                   (vec (cons (first values) removed)))))

      :else
      (remove-and-collect
        target
        (rest values)
        (fn [kept removed]
          (receive (vec (cons (first values) kept))
                   removed)))))

  (remove-and-collect
    :tuna
    [:strawberries :tuna :and :swordfish :tuna]
    (fn [kept removed]
      {:kept kept
       :removed removed
       :removed-count (count removed)})))
```

The traversal discovers two streams of information. The final collector chooses
the public result shape.

Run it, change the collector to return only `kept`, and run it again.

</div>

</div>

## Abstract the changing line

A higher-order function is useful when several functions share the same
recursion and differ only in a local decision. Keep the traversal visible; pass
only the behaviour that genuinely varies.

[Back to Sets and Relations →](07-sets-and-relations.md){ .md-button }
[Continue to Recursion Without a Name →](09-recursion-without-a-name.md){ .md-button .md-button--primary }
