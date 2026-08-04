---
title: State and Lifecycle Protocols
hara_kernel_loading: auto
---

# State and Lifecycle Protocols

State is not one magical object with one opaque lifecycle.

Hara separates the abilities involved in a live value: reading it, replacing
it, applying a conditional update, observing changes, waiting with a timeout,
realising deferred work, composing a settled result, resuming a computation,
and closing a resource.

That separation is useful to a builder. Code can depend on exactly the ability
it needs, and a new value can provide that ability without adopting an entire
framework lifecycle.

<div class="hara-syllabus" data-hara-syllabus="state-lifecycle-protocols-v1" data-hara-syllabus-title="State and Lifecycle Protocols" data-hara-session-group="state-lifecycle-protocols">

<div class="hara-syllabus-step" data-hara-step="01-read-and-replace">

## 01 — Reading and replacing are separate abilities

An atom supports `IDeref` for reading and `IReset` for complete replacement.
The two operations are deliberately different contracts.

```hara eval group=state-lifecycle-protocols
(let [cell (atom {:status :idle})
      before (std.protocol.ideref/deref cell)]
  (std.protocol.ireset/reset cell {:status :running})
  {:before before
   :after (std.protocol.ideref/deref cell)})
```

A function that only needs to inspect a value can depend on `IDeref` without
being given the power to replace it.

**Builder's rule:** separate observation from authority.

</div>

<div class="hara-syllabus-step" data-hara-step="02-compare-and-set">

## 02 — Conditional replacement is another contract

`ICas` performs a replacement only while the current value still matches an
expected value.

```hara eval group=state-lifecycle-protocols
(let [cell (atom 10)
      first (std.protocol.icas/cas cell 10 11)
      second (std.protocol.icas/cas cell 10 12)]
  {:first first
   :second second
   :current (std.protocol.ideref/deref cell)})
```

The first update succeeds. The second observes that `10` is no longer current
and leaves the cell at `11`.

**Builder's rule:** make the condition for a state transition visible.

</div>

<div class="hara-syllabus-step" data-hara-step="03-watch-a-change">

## 03 — Observation is not mutation

`IWatch` lets another part of the system observe a change without becoming the
owner of the state.

```hara eval group=state-lifecycle-protocols
(let [cell (atom 10)
      seen (atom nil)]
  (std.protocol.iwatch/watch-add
    cell
    :audit
    (fn [key reference old-value new-value]
      (std.protocol.ireset/reset
        seen
        {:key key :old old-value :new new-value})))

  (std.protocol.ireset/reset cell 11)
  (std.protocol.iwatch/watch-remove cell :audit)
  (std.protocol.ireset/reset cell 12)

  {:seen (std.protocol.ideref/deref seen)
   :remaining (count (std.protocol.iwatch/watch-list cell))})
```

The audit watch observes the transition from `10` to `11`. Removing it means
the later replacement does not change the recorded observation.

</div>

<div class="hara-syllabus-step" data-hara-step="04-timeout-policy">

## 04 — A timeout is part of the caller's policy

`IDerefTimeout` makes bounded waiting explicit. A value can define what it
returns when the caller's time budget is unavailable.

```hara eval group=state-lifecycle-protocols
(do
  (defstruct TimedValue [value])

  (extend-type TimedValue std.protocol.idereftimeout/IDerefTimeout
    (deref-timeout [timed milliseconds timeout-value]
      (if (neg? milliseconds)
        timeout-value
        (field timed :value))))

  (let [timed (TimedValue 42)]
    {:available
     (std.protocol.idereftimeout/deref-timeout timed 100 :timed-out)
     :expired
     (std.protocol.idereftimeout/deref-timeout timed -1 :timed-out)}))
```

The contract does not force every deferred value to use the same scheduler or
host implementation. It fixes the program-facing question.

</div>

<div class="hara-syllabus-step" data-hara-step="05-realise-once">

## 05 — Realisation is visible state

`IRealize` separates asking whether work is complete from causing the value to
be produced.

```hara eval group=state-lifecycle-protocols
(do
  (defstruct DeferredReading [value realised])

  (extend-type DeferredReading std.protocol.irealize/IRealize
    (realized? [reading]
      (std.protocol.ideref/deref (field reading :realised)))
    (realize [reading]
      (do
        (std.protocol.ireset/reset (field reading :realised) true)
        (field reading :value))))

  (let [reading (DeferredReading 42 (atom false))
        before (std.protocol.irealize/realized? reading)
        value (std.protocol.irealize/realize reading)]
    {:before before
     :value value
     :after (std.protocol.irealize/realized? reading)}))
```

A builder can expose lazy work without hiding whether that boundary has been
crossed.

</div>

<div class="hara-syllabus-step" data-hara-step="06-settled-result">

## 06 — A promise is a settlement contract

`IPromise` names the operations available on a result that may settle. The
provider can be a browser worker, native runtime, host future, or a value built
for deterministic testing.

```hara eval group=state-lifecycle-protocols
(do
  (defstruct SettledValue [value state])

  (extend-type SettledValue std.protocol.ipromise/IPromise
    (state [settled]
      (std.protocol.ideref/deref (field settled :state)))
    (value [settled]
      (field settled :value))
    (then [settled function]
      (function (field settled :value)))
    (catch [settled function]
      settled)
    (finally [settled function]
      (do (function) settled))
    (cancel [settled]
      (do
        (std.protocol.ireset/reset (field settled :state) :cancelled)
        settled)))

  (let [settled (SettledValue 21 (atom :fulfilled))
        doubled (std.protocol.ipromise/then settled (fn [value] (* value 2)))
        before (std.protocol.ipromise/state settled)]
    (std.protocol.ipromise/finally settled (fn [] nil))
    (std.protocol.ipromise/cancel settled)
    {:before before
     :value (std.protocol.ipromise/value settled)
     :then doubled
     :after (std.protocol.ipromise/state settled)}))
```

The example is synchronous by design. It demonstrates the contract without
requiring nondeterministic timing.

</div>

<div class="hara-syllabus-step" data-hara-step="07-resumable-computation">

## 07 — Resumption is distinct from settlement

A coroutine describes where a computation can pause and continue. Its protocol
therefore exposes status and resume rather than promise chaining.

```hara eval group=state-lifecycle-protocols
(do
  (defstruct Stepper [status])

  (extend-type Stepper std.protocol.icoroutine/ICoroutine
    (status [stepper]
      (std.protocol.ideref/deref (field stepper :status)))
    (resume [stepper input]
      (if (= input :stop)
        (do
          (std.protocol.ireset/reset (field stepper :status) :dead)
          :stopped)
        (do
          (std.protocol.ireset/reset (field stepper :status) :suspended)
          {:yield input}))))

  (let [stepper (Stepper (atom :suspended))
        first (std.protocol.icoroutine/resume stepper :next)
        stopped (std.protocol.icoroutine/resume stepper :stop)]
    {:first first
     :stopped stopped
     :status (std.protocol.icoroutine/status stepper)}))
```

Promises model *when a result settles*. Coroutines model *where work resumes*.
Hara keeps those jobs separate.

</div>

<div class="hara-syllabus-step" data-hara-step="08-close-explicitly">

## 08 — Resource closure is a first-class ability

`IClose` gives files, connections, sessions, iterators, and domain resources a
shared release boundary.

```hara eval group=state-lifecycle-protocols
(do
  (defstruct ManagedHandle [closed])

  (extend-type ManagedHandle std.protocol.iclose/IClose
    (close [handle]
      (do
        (std.protocol.ireset/reset (field handle :closed) true)
        nil)))

  (let [handle (ManagedHandle (atom false))
        before (std.protocol.ideref/deref (field handle :closed))]
    (std.protocol.iclose/close handle)
    {:before before
     :after (std.protocol.ideref/deref (field handle :closed))}))
```

Closure is not an incidental method hidden on a concrete provider. It is a
contract that callers can invoke deliberately and tools can inspect.

</div>

</div>

## The builder's state vocabulary

| Question | Protocol |
| --- | --- |
| What is current now? | `IDeref` |
| Replace it completely? | `IReset` |
| Replace it only if unchanged? | `ICas` |
| Observe later replacements? | `IWatch` |
| Wait within a time budget? | `IDerefTimeout` |
| Has deferred work been produced? | `IRealize` |
| How does a result settle and compose? | `IPromise` |
| Where can a computation resume? | `ICoroutine` |
| How is a resource released? | `IClose` |

[Continue through the Protocol Atlas →](atlas.md){ .md-button .md-button--primary }
[Return to Protocols for Builders →](./){ .md-button }
