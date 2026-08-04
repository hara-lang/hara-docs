---
title: Protocols for Builders
hara_kernel_loading: auto
---

# Protocols for Builders

A builder needs more than APIs. A builder needs stable contracts.

A protocol names what a part can do without deciding what that part must be. A
vector can be countable. An atom can be dereferenceable. A database can be
queryable. A test session can be runnable and closeable. Code can depend on the
ability rather than the provider.

The examples share one named lesson session on the main Hara site. Definitions
from an earlier step therefore remain available for later experiments, while
each displayed form remains complete enough to rerun.

> **Functions make things happen. Protocols make systems fit together.**

<div class="hara-syllabus" data-hara-syllabus="protocols-for-builders-v1" data-hara-syllabus-title="Protocols for Builders" data-hara-session-group="protocols-for-builders">

<div class="hara-syllabus-step" data-hara-step="01-see-the-contract">

## 01 — See the contract already in use

Collection operations in Hara are protocol-backed. The same `count` call works
across values that provide `ICount`.

```hara eval group=protocols-for-builders
{:vector (count [:a :b :c])
 :map (count {:a 1 :b 2})
 :list (count (conj (conj nil :first) :second))}
```

The caller asks one question: *how many?* It does not inspect the concrete
implementation first.

</div>

<div class="hara-syllabus-step" data-hara-step="02-extend-an-existing-protocol">

## 02 — Extend an existing protocol

A custom value can join the same vocabulary.

```hara eval group=protocols-for-builders
(do
  (defstruct Inventory [items label])

  (extend-type Inventory ICount
    (count [inventory]
      (count (field inventory :items))))

  {:label (field (Inventory [1 2 3 4] "Workshop") :label)
   :count (count (Inventory [1 2 3 4] "Workshop"))})
```

`count` did not gain an `Inventory` branch. `Inventory` provided the existing
contract.

</div>

<div class="hara-syllabus-step" data-hara-step="03-distinguish-presence-from-value">

## 03 — Choose the precise protocol

Lookup and membership are different questions. `IFind` can distinguish a
missing key from a key whose value is `nil`.

```hara eval group=protocols-for-builders
(let [record {:present nil}]
  {:present (IFind/has? record :present)
   :missing (IFind/has? record :missing)
   :value (get record :present)})
```

A builder should choose the contract that preserves the distinction the system
actually needs.

</div>

<div class="hara-syllabus-step" data-hara-step="04-state-is-several-abilities">

## 04 — State is several abilities

An atom participates in several contracts. Reading, replacing, atomically
comparing, and watching state are separate abilities rather than one opaque
object lifecycle.

```hara eval group=protocols-for-builders
(let [state (atom 41)]
  (IReset/reset state 42)
  {:ordinary (deref state)
   :protocol (IDeref/deref state)})
```

The ordinary functions are convenient language entry points. The protocols are
the contracts that allow other values to participate.

</div>

<div class="hara-syllabus-step" data-hara-step="05-design-a-domain-contract">

## 05 — Design a domain contract

Protocols are not limited to Hara's foundation. A domain can name its own
stable ability and support more than one implementation.

```hara eval group=protocols-for-builders
(do
  (defprotocol IDescribe
    (describe [value]))

  (defstruct Tool [name])
  (defstruct Material [name quantity])

  (extend-type Tool IDescribe
    (describe [tool]
      {:kind :tool
       :name (field tool :name)}))

  (extend-type Material IDescribe
    (describe [material]
      {:kind :material
       :name (field material :name)
       :quantity (field material :quantity)}))

  [(describe (Tool "saw"))
   (describe (Material "timber" 12))])
```

The calling code uses `describe`. New implementations can arrive later without
changing that call.

</div>

</div>

## Continue by protocol family

The foundation course establishes the model. The family labs now apply it to
larger parts of a real system.

<div class="hara-syllabus-grid">
  <a class="hara-path-card hara-path-card--primary" href="collections/">
    <span>01 · VALUES AND COLLECTIONS</span>
    <h2>Collection Protocols</h2>
    <p>Work through count, lookup, presence, indexed access, persistent updates, traversal, and a custom multi-protocol value.</p>
    <small>Eight interactive steps · real shared session</small>
  </a>

  <a class="hara-path-card" href="atlas/">
    <span>REFERENCE · 53 FOUNDATION CONTRACTS</span>
    <h2>Protocol Atlas</h2>
    <p>Browse the complete vocabulary by the builder question each protocol answers.</p>
    <small>Canonical std.protocol.* identities and methods</small>
  </a>
</div>

[Continue: Collection Protocols →](collections.md){ .md-button .md-button--primary }
[Browse the Protocol Atlas →](atlas.md){ .md-button }
[Return to the learning paths →](../){ .md-button }
