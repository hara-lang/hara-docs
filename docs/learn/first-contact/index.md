---
title: First Contact
hara_kernel_loading: auto
---

# First Contact

This is a short working session, not a survey of the whole language. Each step
runs in the browser-hosted Hara kernel and stands on its own, so you can change
anything without breaking the next exercise.

Use the same rhythm throughout:

1. Predict the result.
2. Run the form.
3. Change one value.
4. Explain the new result in one sentence.

<div class="hara-syllabus" data-hara-syllabus="first-contact-v1" data-hara-syllabus-title="First Contact">

<div class="hara-syllabus-step" data-hara-step="01-run-one-form">

## 01 — Run one form

Most Hara expressions use one visible shape: the operation comes first, followed
by its inputs.

```hara eval
(+ 19 23)
```

Change either number and run it again. Nothing else is required to begin.

**What to notice:** the source form and the returned value stay close together.

</div>

<div class="hara-syllabus-step" data-hara-step="02-shape-data">

## 02 — Give information a shape

Vectors keep order. Maps give facts names. Keywords make those names stable and
readable.

```hara eval
(let [player {:name "Nova"
              :score 10
              :items ["lamp" "cable"]}]
  {:name (:name player)
   :first-item (nth (:items player) 0)})
```

Replace the name, add another item, or retrieve a different field.

**What to notice:** the same value can be read directly, inspected, tested, or
passed to another function.

</div>

<div class="hara-syllabus-step" data-hara-step="03-name-a-transformation">

## 03 — Name a transformation

A function receives values and returns a value. It does not need to know where
those values came from or where the result will go.

```hara eval
(do
  (defn add-score [player amount]
    (update player :score + amount))

  (add-score {:name "Nova" :score 10} 25))
```

Change the amount, then add another field to the player map. The function still
has one clear job.

**What to notice:** a useful name turns a general operation into a domain rule.

</div>

<div class="hara-syllabus-step" data-hara-step="04-keep-the-original">

## 04 — Keep the original

Persistent data lets an old value and a changed value coexist.

```hara eval
(let [original {:name "Nova" :score 10}
      changed (assoc original :score 35)]
  {:original original
   :changed changed})
```

Change another field and inspect both maps again.

**What to notice:** history, comparison, testing, rollback, and explanation all
become easier when updates return values rather than silently rewriting them.

</div>

<div class="hara-syllabus-step" data-hara-step="05-one-operation-many-values">

## 05 — One operation, many values

`count` works with several kinds of value because those values participate in a
shared contract.

```hara eval
{:vector (count [10 20 30])
 :map (count {:left 10 :right 20})
 :set (count #{:read :build :test})}
```

The call does not need a different spelling for every collection type.

**What to notice:** the important idea is not the concrete type. It is the
ability the value provides.

</div>

<div class="hara-syllabus-step" data-hara-step="06-let-a-new-value-join">

## 06 — Let a new value join the language

`ICount` is Hara's countability protocol. Its canonical identity lives at
`std.protocol.icount/ICount`. A new value can implement that contract and work
with the ordinary `count` function.

```hara eval
(do
  (defstruct Inventory [items])

  (extend-type Inventory ICount
    (count [inventory]
      (count (field inventory :items))))

  (count (Inventory ["lamp" "cable" "radio"])))
```

Add or remove an item. Then rename `Inventory`; the calling convention does not
change.

**What to notice:** existing code gains a new implementation without being
rewritten.

</div>

</div>

## What you have learned

You have already used Hara's central progression:

```text
value → transformation → persistent result → shared protocol
```

Hara is not simple because it can do less. It stays simple because a small
vocabulary can be extended.

[Continue to Protocols for Builders →](../protocols/){ .md-button .md-button--primary }
[Build the first game →](../../create/first-game/){ .md-button }
