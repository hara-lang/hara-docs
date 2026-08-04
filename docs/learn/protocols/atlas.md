---
title: Protocol Atlas
hide:
  - toc
---

# The Hara Protocol Atlas

Hara's foundation protocols are a compact vocabulary for constructing values,
collections, stateful components, deferred work, and live runtime systems.
Their canonical identities live under `std.protocol.*`.

The Atlas is both a reference and a course map. Protocol families with a
complete interactive lab link directly to it; the remaining families identify
the next labs to build.

## 01 — Represent and identify values

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IDisplay` | `std.protocol.idisplay` | `display` |
| `IEquality` | `std.protocol.iequality` | `equality` |
| `IHash` | `std.protocol.ihash` | `hash` |
| `IHashCached` | `std.protocol.ihashcached` | `hash-current`, `hash-put` |
| `INamespaced` | `std.protocol.inamespaced` | `name`, `namespace` |
| `IObjType` | `std.protocol.iobjtype` | `meta`, `with-meta` |
| `IExInfo` | `std.protocol.iexinfo` | `data` |
| `IPointer` | `std.protocol.ipointer` | `ptr-context`, `ptr-keys`, `ptr-val` |

These protocols keep display, equality, hashing, metadata, naming, error data,
and indirect references as deliberate choices rather than one bundled object
identity.

## 02 — Encode values

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IEncode` | `std.protocol.iencode` | `encode` |
| `IEncodable` | `std.protocol.iencodable` | `encode-with` |
| `IEncodeVisitor` | `std.protocol.iencodevisitor` | `visit-nil`, `visit-boolean`, `visit-number`, `visit-character`, `visit-string`, `visit-keyword`, `visit-symbol`, `visit-seq`, `visit-vector`, `visit-map`, `visit-set`, `visit-tagged`, `visit-unknown` |

Encoding is separated from the value's storage and from the concrete output
format.

## 03 — Inspect collections

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `ICount` | `std.protocol.icount` | `count` |
| `IEmpty` | `std.protocol.iempty` | `empty` |
| `ILookup` | `std.protocol.ilookup` | `lookup` |
| `IFind` | `std.protocol.ifind` | `find` |
| `INth` | `std.protocol.inth` | `nth` |
| `IIndexed` | `std.protocol.iindexed` | `index-of` |
| `IIndexedKV` | `std.protocol.iindexedkv` | `index-of-key`, `index-of-val` |
| `IPair` | `std.protocol.ipair` | `key`, `value` |

A collection is not required to inherit from one universal base class. It can
provide only the abilities that make sense for its representation.

[Work through these contracts in Collection Protocols →](collections.md){ .md-button .md-button--primary }

## 04 — Construct and update collections

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IAssoc` | `std.protocol.iassoc` | `assoc` |
| `IDissoc` | `std.protocol.idissoc` | `dissoc` |
| `IConj` | `std.protocol.iconj` | `conj` |
| `ICons` | `std.protocol.icons` | `cons` |
| `IPeekFirst` | `std.protocol.ipeekfirst` | `peek-first` |
| `IPeekLast` | `std.protocol.ipeeklast` | `peek-last` |
| `IPopFirst` | `std.protocol.ipopfirst` | `pop-first` |
| `IPopLast` | `std.protocol.ipoplast` | `pop-last` |
| `IPushFirst` | `std.protocol.ipushfirst` | `push-first` |
| `IPushLast` | `std.protocol.ipushlast` | `push-last` |

The separate contracts make collection direction, update semantics, and return
shape visible.

[Practice persistent updates and direction →](collections.md#04-update-without-losing-the-previous-value){ .md-button }

## 05 — Traverse and reduce

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IIter` | `std.protocol.iiter` | `iter` |
| `IIterator` | `std.protocol.iiterator` | `iter-next?`, `iter-next` |
| `IReduce` | `std.protocol.ireduce` | `reduce` |

Persistent collections, lazy sequences, generated values, and one-shot sources
can participate in shared algorithms without pretending to have identical
resource behaviour.

[Acquire and advance an explicit iterator →](collections.md#06-traversal-is-a-resource){ .md-button }

## 06 — Mark mutability boundaries

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IMutable` | `std.protocol.imutable` | marker protocol |
| `IPersistent` | `std.protocol.ipersistent` | marker protocol |
| `IToMutable` | `std.protocol.itomutable` | `to-mutable` |
| `IToPersistent` | `std.protocol.itopersistent` | `to-persistent` |

Hara treats mutable and persistent representations as explicit design
boundaries.

## 07 — Work with state and deferred results

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IDeref` | `std.protocol.ideref` | `deref` |
| `IDerefTimeout` | `std.protocol.idereftimeout` | `deref-timeout` |
| `IReset` | `std.protocol.ireset` | `reset` |
| `ICas` | `std.protocol.icas` | `cas` |
| `IWatch` | `std.protocol.iwatch` | `watch-add`, `watch-remove`, `watch-list` |
| `IRealize` | `std.protocol.irealize` | `realized?`, `realize` |
| `IPromise` | `std.protocol.ipromise` | `state`, `value`, `then`, `catch`, `finally`, `cancel` |
| `ICoroutine` | `std.protocol.icoroutine` | `status`, `resume` |

Reading, replacing, observing, awaiting, settling, cancelling, suspending, and
resuming are different capabilities.

## 08 — Invoke behaviour in a context

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IFn` | `std.protocol.ifn` | `invoke` |
| `IOFn` | `std.protocol.iofn` | marker protocol |
| `IApplicable` | `std.protocol.iapplicable` | `apply-in`, `apply-default`, `transform-in`, `transform-out` |
| `IInvokeIn` | `std.protocol.iinvokein` | `invoke-in` |
| `IContext` | `std.protocol.icontext` | `call` |
| `IContextLifeCycle` | `std.protocol.icontextlifecycle` | `has-module?`, `setup-module`, `teardown-module`, `has-pointer?`, `setup-pointer`, `teardown-pointer` |

These contracts move from calling a function to invoking work inside explicit
runtime and transformation contexts.

## 09 — Assemble live systems

| Protocol | Canonical namespace | Methods |
| --- | --- | --- |
| `IClose` | `std.protocol.iclose` | `close` |
| `IComponent` | `std.protocol.icomponent` | `props`, `status`, `started?`, `stopped?`, `start`, `stop`, `kill`, `remote?` |
| `ISpace` | `std.protocol.ispace` | `context-set`, `context-unset`, `context-list`, `context-get`, `rt-active`, `rt-get`, `rt-start`, `rt-started?`, `rt-stopped?`, `rt-stop` |

Components and runtime spaces make lifecycle, ownership, and active execution
visible.

## Beyond the foundation

Hara also places portable domain contracts under `std.protocol.*`. The current
standard test family includes `IMatch`, `ITestClock`, `ITestTimer`,
`ITestControl`, `ITestRegistry`, `ITestReporter`, and `ITestSession`.

These demonstrate the larger pattern: a test system is assembled from
replaceable contracts for matching, time, cancellation, registration,
reporting, execution, results, and closure.

[Start the collection lab →](collections.md){ .md-button .md-button--primary }
[Return to Protocols for Builders →](./){ .md-button }
