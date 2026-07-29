# 03. Iterators and streaming

A collection can hold values that already exist. A stream produces values as a consumer asks for them.

Hara separates three related concepts:

- A persistent collection is an immutable value.
- A lazy `Seq` produces values on demand.
- A raw iterator is a one-shot source that advances.

## Learning goals

By the end of this lesson, you can:

1. Transform collections with `map`, `filter`, and `reduce`.
2. Explain why a lazy pipeline does not do all work immediately.
3. Build bounded streams from generators.
4. Create and consume a raw iterator.
5. Close an iterator when work stops early.
6. Choose between a persistent result, a `Seq`, and an iterator.

## Transform every item with `map`

`map` applies one function to each source item:

```hara
(map inc [1 2 3])
```

The result is a lazy `Seq`. Its printed form can vary by runtime display, but its logical values are `2`, `3`, and `4`.

Use a domain function when the operation has a domain meaning:

```hara
(defn line-length [line]
  (count line))

(map line-length ["one" "three" "seven"])
```

The mapping function receives one item and returns one item.

## Keep selected items with `filter`

`filter` calls a predicate and keeps matching items:

```hara
(defn non-empty-line? [line]
  (not (empty? (str/trim line))))

(filter non-empty-line?
        ["first" "  " "third"])
```

A predicate answers a question. It does not transform the item.

## Combine items with `reduce`

`reduce` carries an accumulator through the source:

```hara
(reduce + 0 [10 20 12])
; => 42
```

Count total characters:

```hara
(defn add-line-length [total line]
  (+ total (count line)))

(reduce add-line-length
        0
        ["one" "three" "seven"])
; => 13
```

Use `reduce` when many input items become one result.

## Build a lazy pipeline

Nest operations from source to consumer:

```hara
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

The pipeline can stop after it has enough output.

The threading macro can express the same flow:

```hara
(->> [" first " " " " second " " third "]
     (filter non-empty-line?)
     (map str/trim)
     (take 2))
```

Choose the form that makes the data flow easiest to inspect.

## Laziness delays work

A lazy operation creates a plan for producing values. A consumer causes that plan to advance.

```hara
(def numbers
  (map inc (range 0 1000000)))
```

The runtime does not need to create one million incremented values immediately.

A bounded consumer requests only part of the source:

```hara
(take 3 numbers)
```

This property supports large inputs and early termination.

Keep effects out of lazy mapping functions. An effect can occur later than the source form suggests.

## Realize a result at a boundary

A UI model, encoded response, or saved result often needs a complete persistent collection.

Use `mapv` when the result must be an eager vector:

```hara
(mapv str/trim [" one " " two "])
; => ["one" "two"]
```

Use `realize` when you already have a lazy value and need its realized result:

```hara
(realize (take 3 numbers))
```

Do not realize a large source without a reason. Preserve streaming until the next boundary needs a complete value.

## Create a raw iterator

Use `iter` to acquire an iterator:

```hara
(def line-iterator
  (iter ["one" "two" "three"]))
```

Check whether it has another item:

```hara
(iter-has? line-iterator)
; => true
```

Advance it:

```hara
(iter-next line-iterator)
; => "one"

(iter-next line-iterator)
; => "two"
```

The iterator has changed position. It does not restart when you read its Var again.

## Raw iterators are one-shot

A persistent vector can create another iterator later. An existing iterator represents one traversal.

```hara
(def values [1 2 3])

(def first-pass (iter values))
(def second-pass (iter values))
```

The two iterators advance independently.

Do not store a partially consumed iterator where code expects a reusable collection value.

## Transform iterators directly

The `iter-*` functions return raw iterator pipelines:

```hara
(def source
  (iter-range 0 100))

(def even-source
  (iter-filter even? source))

(def doubled-source
  (iter-map (fn [number] (* number 2))
            even-source))
```

Take a bounded iterator view:

```hara
(def first-five
  (iter-take 5 doubled-source))
```

Each `iter-next` request moves the pipeline forward by one output value.

Direct iterator control is useful for protocol adapters, large sources, and code that must manage resource lifetime.

## Close an iterator

Close an iterator when the consumer stops before exhaustion:

```hara
(iter-close first-five)
```

Closing a wrapper closes its acquired source iterators.

Use cleanup paths when the source owns a file handle, socket, decoder, or other host resource.

A plain vector iterator has little to release, but the same discipline applies to resource-backed iterators.

## Use `Seq` for normal lazy code

The ordinary functions `map`, `filter`, `take`, `drop`, `mapcat`, `keep`, `cycle`, and `partition` return lazy `Seq` values.

```hara
(take 3
  (map (fn [number] (* number number))
       (range 0 100)))
```

A `Seq` gives application code a stable lazy boundary. The raw iterator forms expose traversal mechanics.

Prefer ordinary collection functions unless you need one-shot control.

## Transform constructors

Hara also supports a one-argument transform form:

```hara
(def trim-all
  (map str/trim))

(trim-all [" one " " two "])
; => ["one" "two"]
```

For an ordinary collection, the transform returns an eager collection result. Existing lazy sources remain lazy.

This is a Hara transform contract. It is not a transducer contract.

## Stop when the answer is known

Use `any?` for a boolean existential result:

```hara
(any? empty? ["one" "" "three"])
; => true
```

Use `every?` when all items must match:

```hara
(every? string? ["one" "two"])
; => true
```

These consumers can stop as soon as the result is known.

## Build the course stream

Create a line transformation:

```hara
(defn normalize-line [line]
  (str/to-lower (str/trim line)))
```

Build a lazy pipeline:

```hara
(defn normalized-lines [lines]
  (->> lines
       (filter non-empty-line?)
       (map normalize-line)))
```

Consume only the first three lines:

```hara
(take 3
  (normalized-lines
    [" Alpha " " " " Beta " " Gamma " " Delta "]))
```

Create a raw iterator version:

```hara
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
  (swap! run add-line (count (str/encode line)))
  line)
```

Do not place this function inside a lazy `map` unless delayed state updates are intentional.

A safer design lets the consumer request one line, update state, then request the next line.

## Practice loop

1. Predict the next iterator value.
2. Call `iter-next` once.
3. Check `iter-has?`.
4. Change the source data.
5. Explain whether the pipeline is reusable or one-shot.
6. Close the iterator before its source is exhausted.

## Common mistakes

### Treating a lazy plan as a completed result

A lazy pipeline may not have processed every source item yet.

### Reusing a consumed iterator

Acquire a new iterator from a replayable source when you need another pass.

### Performing hidden effects in `map`

Use `map` for transformations. Put state changes and I/O at a clear consumer boundary.

### Forgetting to bound a large source

Use `take`, a predicate, or another stopping rule before realization.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. What question does `map` answer?
2. Why can a lazy pipeline stop early?
3. What changes when `iter-next` runs?
4. Why is a raw iterator one-shot?
5. When should an iterator be closed?
6. When should you realize a lazy result?
7. Why should effects stay outside ordinary lazy transforms?

Continue with [04. Coroutines and promises](04-coroutines-and-promises.md).