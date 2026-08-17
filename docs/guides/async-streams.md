# Async streams and channels

`std.stream.async` provides coroutine-friendly channel operations while using
the same stream protocols as other sources and sinks.

```clojure
(ns example.async-streams
  (:require [std.stream.async :as async]))

(defn pipeline []
  (let [values (async/chan 2)]
    (async/go
     (fn []
       (co/await (async/put values :first))
       (co/await (async/put values :second))
       (async/close values)))
    (async/go
     (fn []
       [(co/await (async/take values))
        (co/await (async/take values))
        (co/await (async/take values))]))))
```
`co/await` belongs inside the function passed to `async/go`. Outside a
coroutine, compose promises with `promise/then`; only use `deref` at an
intentional blocking application boundary.

Channels implement the core capabilities directly:

- `IStream/next` and `IStreamWrite/write` for promised reads and writes;
- `IStreamPoll/poll` and `IStreamOffer/offer` for immediate attempts;
- `IClosed/closed?`, `IFlush/flush`, `IClose/close`, and `IAbort/abort` for
  lifecycle control.

`async/alts` selects among readable ports or `[port value]` write operations.
`async/from-stream` pumps any `IStream` into a channel and preserves EOF,
failure, and close behavior.

Native tests can return the coroutine Promise directly:

```clojure
(Test/run
 [{:name "awaits channel values"
   :test (fn []
           (let [port (async/chan 1)]
             (async/offer port 41)
             (async/go
              (fn [] (inc (co/await (async/take port)))))))
   :expected 42}])
```
