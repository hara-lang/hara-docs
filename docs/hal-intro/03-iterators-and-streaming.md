# 03. Iterators and streaming

A collection can hold values that already exist. A stream produces values as a consumer asks for them.

The runnable examples on this page share one lesson session. Work from top to
bottom when an example uses an earlier definition, and reload the page to start
with a clean session.

Hara separates three related concepts:

- A persistent collection is an immutable value.
- A lazy `Seq` is a proven non-empty, one-shot iterator.
- A raw iterator is a one-shot source that advances.

These values have different roles even when they expose no elements. `nil`
means that no non-empty sequence cell exists, `[]` is a reusable empty vector,
and an exhausted iterator is a one-shot cursor at its end. Hara does not have
an empty `Seq` object: every value satisfying `seq?` has a first item.

```hara eval group=hal-intro-03
(seq [])           ; => nil
(rest [1])         ; => nil
(seq? (rest [1 2])); => true
(iter? (rest [1 2])); => true
(vec (rest [1]))   ; => []
```

This is why Hara needs only `rest`, not separate `rest` and `next` operations.
Use `vec` when a reusable persistent result is required.

The live evaluator cannot display a raw `Seq` or iterator as a portable HTA
value. End runnable lazy examples with `vec`, `iter-next`, or another scalar
consumer instead of returning the cursor itself.

Use `iter` for explicit conversion at the empty boundary:

```hara
(iter-has? (iter nil)); => false
(iter-has? nil)       ; => error
```

`cons` prepends lazily to a `Seq`; `conj` does not accept a `Seq`. `cycle`
also requires at least one source item, so `(cycle [])` is an error.

## Learning goals

By the end of this lesson, you can:

1. Transform collections with `map`, `filter`, and `reduce`.
2. Distinguish eager collection calls from lazy iterator transforms.
3. Build bounded streams from generators.
4. Create and consume a raw iterator.
5. Close an iterator when work stops early.
6. Choose between a persistent result, a `Seq`, and an iterator.

## Transform every item with `map`

`map` applies one function to each source item:

```hara eval group=hal-intro-03
(map inc [1 2 3])
```

With both arguments supplied, `map` evaluates the vector eagerly and returns `[2 3 4]`. The one-argument form, such as `(map inc)`, returns an iterator transform for use in a lazy pipeline.

Use a domain function when the operation has a domain meaning:

```hara eval group=hal-intro-03
(defn line-length [line]
  (count line))

(map line-length ["one" "three" "seven"])
```

The mapping function receives one item and returns one item.

## Keep selected items with `filter`

`filter` calls a predicate and keeps matching items:

```hara eval group=hal-intro-03
(defn non-empty-line? [line]
  (not (empty? (str/trim line))))

(filter non-empty-line?
        ["first" "  " "third"])
```

A predicate answers a question. It does not transform the item. With the
collection supplied, `filter` eagerly returns `["first" "third"]`.

## Combine items with `reduce`

`reduce` carries an accumulator through the source:

```hara eval group=hal-intro-03
(reduce + 0 [10 20 12])
; => 42
```

Count total characters:

```hara eval group=hal-intro-03
(defn add-line-length [total line]
  (+ total (count line)))

(reduce add-line-length
        0
        ["one" "three" "seven"])
; => 13
```

Use `reduce` when many input items become one result.

## Build an eager collection pipeline

Nest operations from source to consumer:

```hara eval group=hal-intro-03
(take 2
  (map str/trim
    (filter non-empty-line?
            [" first " " " " second " " third "])))
```

Read the pipeline from the inside:

1. Start with the vector.
2. Keep non-empty lines.
3. Trim each line.
4. Take two results.

These full-arity calls are eager. `filter` creates a vector, `map` creates
another vector, and `take` creates the final two-item vector. This form is
clear for bounded, already-realized data, but it does not stop the earlier
stages after two results.

The threading macro can express the same flow:

```hara eval group=hal-intro-03
(->> [" first " " " " second " " third "]
     (filter non-empty-line?)
     (map str/trim)
     (take 2))
```

Choose the form that makes the data flow easiest to inspect.

## Build a lazy iterator pipeline

The one-argument forms construct iterator transforms. Compose those transforms,
then apply the resulting pipeline to a source:

```hara eval group=hal-intro-03
(def clean-first-two
  (comp (take 2)
        (map str/trim)
        (filter non-empty-line?)))

(vec (clean-first-two
       [" first " " " " second " " third "]))
```

The transform result is a raw iterator. `vec` is the boundary that requests
and stores its values. Because `take` stops requesting values after two
outputs, the upstream transforms need not process the remaining source. The result is
`["first" "second"]`. As with functions, `comp` lists transforms in reverse
execution order.

Lazy producers such as `range` return a `Seq`. Apply iterator transforms to
them without using the eager two-argument collection form:

```hara eval group=hal-intro-03
(def numbers (range 0 1000000))
(def incremented ((map inc) numbers))
```

A bounded consumer requests only part of the source:

```hara eval group=hal-intro-03
(vec ((take 3) incremented))
```

This property supports large inputs and early termination.

Keep effects out of iterator mapping functions. An effect occurs when a
consumer advances the iterator, not when the transform is constructed.

## Realize a result at a boundary

A UI model, encoded response, or saved result often needs a complete persistent collection.

Full-arity collection transforms already return eager vectors. `mapv` also
makes that intent explicit:

```hara eval group=hal-intro-03
(mapv str/trim [" one " " two "])
; => ["one" "two"]
```

Use `vec` when you already have a `Seq` or iterator and need a reusable vector:

```hara eval group=hal-intro-03
(vec ((take 3) (range 0 1000000)))
```

Do not materialize a large source without a reason. Preserve streaming until
the next boundary needs a complete value.

## Create a raw iterator

Use `iter` to acquire an iterator:

```hara eval group=hal-intro-03
(def line-iterator
  (iter ["one" "two" "three"]))
```

Check whether it has another item:

```hara eval group=hal-intro-03
(iter-has? line-iterator)
; => true
```

This check does not logically consume the item. Repeated checks return the same
answer, and the following `iter-next` returns the item that was observed.
Exhaustion returns `false`; an iterator failure is still an error.

Advance it:

```hara eval group=hal-intro-03
(iter-next line-iterator)
; => "one"

(iter-next line-iterator)
; => "two"
```

The iterator has changed position. It does not restart when you read its Var again.

## Raw iterators are one-shot

A persistent vector can create another iterator later. An existing iterator represents one traversal.

```hara eval group=hal-intro-03
(def values [1 2 3])

(def first-pass (iter values))
(def second-pass (iter values))
```

The two iterators advance independently.

Do not store a partially consumed iterator where code expects a reusable collection value.

## Transform iterators directly

The `iter-*` functions return raw iterator pipelines:

```hara eval group=hal-intro-03
(def source
  (iter-range 0 100))

(def even-source
  (iter-filter even? source))

(def doubled-source
  (iter-map (fn [number] (* number 2))
            even-source))
```

Take a bounded iterator view:

```hara eval group=hal-intro-03
(def first-five
  (iter-take 5 doubled-source))
```

Each `iter-next` request moves the pipeline forward by one output value.

Direct iterator control is useful for protocol adapters, large sources, and code that must manage resource lifetime.

## Close an iterator

Close an iterator when the consumer stops before exhaustion:

```hara eval group=hal-intro-03
(iter-close first-five)
```

Closing a wrapper closes its acquired source iterators.

Use cleanup paths when the source owns a file handle, socket, decoder, or other host resource.

A plain vector iterator has little to release, but the same discipline applies to resource-backed iterators.

## Know which forms are lazy

The producers `range`, `repeat`, `repeatedly`, `iterate`, and `cycle`
return lazy `Seq` values. The one-argument forms of `map`, `filter`, `take`,
`drop`, `mapcat`, `keep`, and `partition` return transforms; applying a
transform returns a raw iterator. Supplying a collection directly to those
functions eagerly returns a vector.

```hara eval group=hal-intro-03
(vec
  ((comp (take 3)
         (map (fn [number] (* number number))))
   (range 0 100)))
```

A `Seq` is a lazy, one-shot producer boundary. Iterator transforms expose the
pipeline explicitly; `vec` creates a reusable result.

Prefer ordinary collection functions unless you need one-shot control.

## Transform constructors

Hara also supports a one-argument transform form:

```hara eval group=hal-intro-03
(def trim-all
  (map str/trim))

(vec (trim-all [" one " " two "]))
; => ["one" "two"]
```

Applying the transform returns a raw iterator regardless of whether its source
is a vector or a `Seq`. Use `vec` to materialize the iterator when required.

This is a Hara transform contract. It is not a transducer contract.

## Stop when the answer is known

Use `any?` for a boolean existential result:

```hara eval group=hal-intro-03
(any? empty? ["one" "" "three"])
; => true
```

Use `every?` when all items must match:

```hara eval group=hal-intro-03
(every? string? ["one" "two"])
; => true
```

These consumers can stop as soon as the result is known.

## Build the course stream

Create a line transformation:

```hara eval group=hal-intro-03
(defn normalize-line [line]
  (str/lower (str/trim line)))
```

Build an eager collection helper:

```hara eval group=hal-intro-03
(defn normalized-lines [lines]
  (->> lines
       (filter non-empty-line?)
       (map normalize-line)))
```

Both full-arity calls materialize vectors. For a streaming helper, compose the
one-argument transforms instead:

```hara eval group=hal-intro-03
(def normalize-lines
  (comp (map normalize-line)
        (filter non-empty-line?)))
```

Consume only the first three lines:

```hara eval group=hal-intro-03
(take 3
  (normalized-lines
    [" Alpha " " " " Beta " " Gamma " " Delta "]))
```

Or consume three values from the streaming helper:

```hara eval group=hal-intro-03
(vec ((take 3)
      (normalize-lines
        [" Alpha " " " " Beta " " Gamma " " Delta "])))
```

Create a raw iterator version:

```hara eval group=hal-intro-03
(defn normalized-line-iterator [lines]
  (iter-map normalize-line
    (iter-filter non-empty-line?
      (iter lines))))
```

Advance it manually and close it when you stop.

## Streaming and state

Keep the stream transformation pure. Update the run atom at the consumer boundary:

```hara
(defn consume-line! [line]
  (swap! run add-line (count (str/encode-utf8 line)))
  line)
```

Do not place this function inside an iterator transform unless updates during
consumption are intentional. A full-arity `map` runs it immediately.

A safer design lets the consumer request one line, update state, then request the next line.

## Practice loop

1. Predict the next iterator value.
2. Call `iter-next` once.
3. Check `iter-has?`.
4. Change the source data.
5. Explain whether the pipeline is reusable or one-shot.
6. Close the iterator before its source is exhausted.

## Common mistakes

### Assuming every collection function is lazy

Full-arity transforms such as `(map f values)` eagerly return vectors. Use the
one-argument transform form when work must advance only with demand.

### Reusing a consumed iterator

Acquire a new iterator from a replayable source when you need another pass.

### Performing hidden effects in an iterator transform

Use transforms for data changes. Put state changes and I/O at a clear consumer boundary.

### Forgetting to bound a large source

Use `take`, a predicate, or another stopping rule before realization.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. What question does `map` answer?
2. Which `map` form is eager, and which form constructs an iterator transform?
3. What changes when `iter-next` runs?
4. Why is a raw iterator one-shot?
5. When should an iterator be closed?
6. When should you materialize an iterator with `vec`?
7. Why should effects stay outside iterator transforms?

Continue with [04. Coroutines and promises](04-coroutines-and-promises.md).
