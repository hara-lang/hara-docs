---
title: Collection Protocols
hara_kernel_loading: auto
---

# Collection Protocols

Collections are where Hara's protocol model becomes concrete.

A vector, map, set, list, iterator, or value you define yourself does not need
to inherit one universal collection class. It provides the particular
abilities that make sense for it: counting, lookup, positional access,
persistent update, traversal, or reduction.

This lab uses the canonical method Vars under `std.protocol.*`. Ordinary names
such as `count`, `get`, and `assoc` are the convenient public surface; the
protocol methods reveal the contracts underneath them.

<div class="hara-syllabus" data-hara-syllabus="collection-protocols-v1" data-hara-syllabus-title="Collection Protocols" data-hara-session-group="collection-protocols">

<div class="hara-syllabus-step" data-hara-step="01-one-ability">

## 01 — One operation, one ability

`count` is the ordinary language operation. `std.protocol.icount/count` is the
canonical protocol method it can dispatch through.

```hara eval group=collection-protocols
{:ordinary (count [:a :b :c])
 :protocol (std.protocol.icount/count [:a :b :c])}
```

The two calls agree because the vector provides `ICount`.

**Builder's rule:** depend on the smallest ability that expresses the question.

</div>

<div class="hara-syllabus-step" data-hara-step="02-lookup-is-not-presence">

## 02 — Lookup is not presence

A lookup asks for a value. A find asks whether an entry exists. Those questions
must remain distinct when a present key is associated with `nil`.

```hara eval group=collection-protocols
(let [record {:present nil}]
  {:lookup (std.protocol.ilookup/lookup record :present)
   :found (std.protocol.ifind/find record :present)
   :present? (IFind/has? record :present)
   :missing? (IFind/has? record :missing)})
```

`get` alone cannot distinguish the last two cases. `IFind` preserves the
information needed to do so.

**Builder's rule:** choose a contract that preserves the distinction your
system needs.

</div>

<div class="hara-syllabus-step" data-hara-step="03-position-and-key">

## 03 — Position and key are different contracts

Indexed access and keyed lookup may both return a value, but they describe
different structures.

```hara eval group=collection-protocols
{:position (std.protocol.inth/nth [:north :east :south] 1)
 :key (std.protocol.ilookup/lookup {:east 90 :south 180} :east)}
```

`INth` says a value has positions. `ILookup` says a value accepts keys. A type
may provide either contract, both, or neither.

</div>

<div class="hara-syllabus-step" data-hara-step="04-persistent-update">

## 04 — Update without losing the previous value

Persistent update is represented by separate association and removal
contracts.

```hara eval group=collection-protocols
(let [original {:name "Nova" :score 10}
      changed (std.protocol.iassoc/assoc original :score 35)
      trimmed (std.protocol.idissoc/dissoc changed :name)]
  {:original original
   :changed changed
   :trimmed trimmed})
```

All three values remain available. The protocol says what the operation means;
the concrete collection preserves its own representation rules.

</div>

<div class="hara-syllabus-step" data-hara-step="05-direction-matters">

## 05 — Direction matters

Adding at a collection's natural edge and prepending a value are separate
operations.

```hara eval group=collection-protocols
(do
  (require [std.lib.collection :as collection])
  (let [deque (collection/deque 2 3)]
    {:conj (std.protocol.iconj/conj [2 3] 4)
     :cons (std.protocol.icons/cons [2 3] 1)
     :front (collection/push-first deque 1)
     :back (collection/push-last deque 4)}))
```

The direct protocol calls place the receiver first. The ordinary public `cons`
form keeps its documented `(cons item collection)` order.

**Builder's rule:** do not hide direction or ownership inside a generic
"append" operation.

</div>

<div class="hara-syllabus-step" data-hara-step="06-traversal-is-a-resource">

## 06 — Traversal is a resource

`IIter` acquires a cursor. `IIterator` advances that cursor. The collection and
the traversal are not the same value.

```hara eval group=collection-protocols
(let [cursor (std.protocol.iiter/iter [:a :b])]
  [(std.protocol.iiterator/iter-next? cursor)
   (std.protocol.iiterator/iter-next cursor)
   (std.protocol.iiterator/iter-next cursor)])
```

The first check observes the next item without logically consuming it. The two
`iter-next` calls then return `:a` and `:b`.

**Builder's rule:** make one-shot work visible instead of pretending every
source is replayable.

</div>

<div class="hara-syllabus-step" data-hara-step="07-join-an-existing-vocabulary">

## 07 — Let a new value join an existing vocabulary

A new value can become countable without changing `count` or creating another
calling convention.

```hara eval group=collection-protocols
(do
  (defstruct CountedShelf [items])

  (extend-type CountedShelf std.protocol.icount/ICount
    (count [shelf]
      (count (field shelf :items))))

  (count (CountedShelf ["hammer" "saw" "plane"])))
```

The extension belongs with `CountedShelf`. Every existing caller of `count`
can use it immediately.

</div>

<div class="hara-syllabus-step" data-hara-step="08-compose-contracts">

## 08 — Compose a useful value from several contracts

A domain value can provide only the collection abilities that make sense for
its job.

```hara eval group=collection-protocols
(do
  (defstruct Catalog [entries])

  (extend-type Catalog std.protocol.icount/ICount
    (count [catalog]
      (count (field catalog :entries))))

  (extend-type Catalog std.protocol.ilookup/ILookup
    (lookup [catalog key]
      (get (field catalog :entries) key)))

  (extend-type Catalog std.protocol.ifind/IFind
    (find [catalog key]
      (IFind/find (field catalog :entries) key)))

  (let [catalog
        (Catalog {:saw {:stock 4}
                  :plane {:stock 2}})]
    {:count (count catalog)
     :saw (get catalog :saw)
     :plane? (IFind/has? catalog :plane)
     :drill? (IFind/has? catalog :drill)}))
```

`Catalog` is now countable, lookupable, and searchable. It is not required to
pretend to be a vector, map, or host object.

**That is the protocol advantage:** a stable vocabulary can accept new values
without central coordination or framework-specific adapters.

</div>

</div>

## What to carry into a real system

| Question | Protocol |
| --- | --- |
| How many values are present? | `ICount` |
| What value belongs to this key? | `ILookup` |
| Does this entry actually exist? | `IFind` |
| What occupies this position? | `INth` |
| What is the persistent replacement? | `IAssoc`, `IDissoc` |
| How is a value added? | `IConj`, `ICons` |
| What is at either end, and what remains after removing it? | `IPeekFirst`, `IPeekLast`, `IPopFirst`, `IPopLast` |
| How is a value added to a specific end? | `IPushFirst`, `IPushLast` |
| How is a traversal acquired and advanced? | `IIter`, `IIterator` |

[Continue through the Protocol Atlas →](atlas.md){ .md-button .md-button--primary }
[Return to Protocols for Builders →](./){ .md-button }
