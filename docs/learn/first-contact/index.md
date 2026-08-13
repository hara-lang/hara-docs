---
title: First Contact
hara_kernel_loading: auto
---

# First Contact

This is a short working session, not a survey of the whole language. The six
examples share one named lesson session, so definitions remain available as you
move down the page. Each step is also self-contained and can be rerun safely.

Use the same rhythm throughout:

1. Predict the result.
2. Run the starter form.
3. Change one value and run it again.
4. Explain the new result in one sentence.

The lesson records progress in this browser. A step completes automatically once
the starter form and a changed form have both run successfully.

<div class="hara-lesson" data-hara-lesson="first-contact-v2" data-hara-lesson-title="First Contact" data-hara-session-group="first-contact" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="01-run-one-form" data-hara-step-title="Run one form" data-hara-completion="run-edit-run">

## 01 — Run one form

Most Hara expressions use one visible shape: the operation comes first, followed
by its inputs.

```hara eval group=first-contact
(+ 19 23)
```

Run the starter form, change either number, and run it again.

**What to notice:** the source form and the returned value stay close together.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="02-shape-data" data-hara-step-title="Give information a shape" data-hara-completion="run-edit-run">

## 02 — Give information a shape

Vectors keep order. Maps give facts names. Keywords make those names stable and
readable.

```hara eval group=first-contact
(let [player {:name "Nova"
              :score 10
              :items ["lamp" "cable"]}]
  {:name (:name player)
   :first-item (nth (:items player) 0)})
```

Run the starter, then replace the name, add another item, or retrieve a different
field and run the changed form.

**What to notice:** the same value can be read directly, inspected, tested, or
passed to another function.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="03-name-a-transformation" data-hara-step-title="Name a transformation" data-hara-completion="run-edit-run">

## 03 — Name a transformation

A function receives values and returns a value. It does not need to know where
those values came from or where the result will go.

```hara eval group=first-contact
(do
  (defn add-score [player amount]
    (update player :score + amount))

  (add-score {:name "Nova" :score 10} 25))
```

Run it once, change the amount, then run the changed form. You can also add
another field to the player map; the function still has one clear job.

**What to notice:** a useful name turns a general operation into a domain rule.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="04-keep-the-original" data-hara-step-title="Keep the original" data-hara-completion="run-edit-run">

## 04 — Keep the original

Persistent data lets an old value and a changed value coexist.

```hara eval group=first-contact
(let [original {:name "Nova" :score 10}
      changed (assoc original :score 35)]
  {:original original
   :changed changed})
```

Run the starter, change another field, and inspect both maps again.

**What to notice:** history, comparison, testing, rollback, and explanation all
become easier when updates return values rather than silently rewriting them.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="05-one-operation-many-values" data-hara-step-title="One operation, many values" data-hara-completion="run-edit-run">

## 05 — One operation, many values

`count` works with several kinds of value because those values participate in a
shared contract.

```hara eval group=first-contact
{:vector (count [10 20 30])
 :map (count {:left 10 :right 20})
 :set (count #{:read :build :test})}
```

Run it once, add an item or map field, and run it again. The call does not need a
different spelling for every collection type.

**What to notice:** the important idea is not the concrete type. It is the
ability the value provides.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="06-let-a-new-value-join" data-hara-step-title="Let a new value join the language" data-hara-completion="run-edit-run">

## 06 — Let a new value join the language

`ICount` is Hara's countability protocol. Its canonical identity lives at
`std.protocol.icount/ICount`. A new value can implement that contract and work
with the ordinary `count` function.

```hara eval group=first-contact
(do
  (defstruct Inventory [items])

  (extend-type Inventory ICount
    (count [inventory]
      (count (field inventory :items))))

  (count (Inventory ["lamp" "cable" "radio"])))
```

Run the starter, add or remove an item, and run it again. You can then rename
`Inventory`; the calling convention does not change.

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
