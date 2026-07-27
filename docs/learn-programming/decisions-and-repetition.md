# Decisions and repetition

Programs become interesting when they react differently to different values,
or when they perform a small action many times.

## Make a decision

`if` chooses between two results. The first value is a question; only one of
the next two forms is evaluated.

```clojure
(def score 12)

(if (>= score 10)
  "level complete"
  "keep playing")
; => "level complete"
```

Try changing `score` to a smaller number. The same program now follows a
different path.

## Choose from several cases

`cond` is useful when there are several ordered choices.

```clojure
(defn rank [score]
  (cond
    (>= score 100) "gold"
    (>= score 50) "silver"
    :else "bronze"))

(rank 70)
; => "silver"
```

Read a `cond` from top to bottom. The first true condition supplies the result.

## Repeat over a collection

Programs often apply one rule to each item in a collection.

```clojure
(map (fn [score] (+ score 10)) [0 10 20])
; => [10 20 30]
```

Here `map` calls the small function once for every score. The original vector
stays intact and a new vector is returned. This is a reliable way to update a
list of game objects, tasks, or messages.

Next, learn how to name that behaviour and keep track of change over time in
[functions and changing state](functions-and-state.md).
