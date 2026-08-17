# Streams: pull values without materializing them

A Hara stream produces one value each time a consumer calls `IStream/next`.
The result is a Promise; `nil` means end of stream. This separates a lazy,
asynchronous source from eager collections such as vectors.

```clojure
(ns example.streams
  (:require [std.stream.common :as stream]))

(def source (stream/from-iterator [1 2 3 4 5 6]))

(def selected
  (stream/take 2
    (stream/map (fn [value] (* value 10))
      (stream/filter even? source))))

(stream/collect selected)
;; => Promise of [20 40]
```
Transforms remain lazy. Terminals such as `collect`, `reduce`, `first`,
`last`, `count`, `some`, `every?`, and `find` consume the source and return a
Promise. Owning transforms close their upstream when they finish, fail, or are
explicitly closed.

## Group and combine

The practical combinator set includes:

- selection: `keep`, `remove`, `drop`, `take-while`, and `drop-while`;
- grouping: `partition`, `partition-all`, and `partition-by`;
- combination: `concat`, `zip`, and `interleave`.

```clojure
(stream/collect
 (stream/partition-all
  2
  (stream/from-iterator [1 2 3 4 5])))
;; => Promise of [[1 2] [3 4] [5]]
```

Use an iterator when advancing is immediate and local. Use a stream when the
next value may arrive later, must propagate failure, or owns a resource that
needs closing.

## Test without `code.test`

Native `Test/run` awaits a Promise returned by a test body:

```clojure
(Test/run
 [{:name "collects a lazy stream"
   :test (fn []
           (stream/collect
            (stream/map inc (stream/from-iterator [1 2 3]))))
   :expected [2 3 4]}])
```
