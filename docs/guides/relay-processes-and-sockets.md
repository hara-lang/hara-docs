# Relay over processes and sockets

`std.stream.duplex` composes a readable stream with write and lifecycle
capabilities. It is a regular Hara value satisfying `IStreamDuplex`; there is no
boxed native Duplex type.

Use the supplied adapters for native transports:

```clojure
(ns example.process-relay
  (:require [std.stream.async :as async]
            [std.stream.duplex :as duplex]
            [std.stream.frame :as frame]
            [std.stream.relay :as relay]))

(defn echo []
  (let [process (Process/spawn
                 ["sh" "-c"
                  "while IFS= read -r line; do printf '%s\\n' \"$line\"; done"])
        connection (relay/relay
                    (duplex/from-process process)
                    (frame/line)
                    {:timeout-ms 2000})]
    (async/go
     (fn []
       (let [reply (co/await (relay/exchange connection "hello"))]
         (relay/close connection)
         reply)))))
```

`duplex/from-process` combines `Process/stdout-stream`, `Process/write`,
`Process/close-input`, and `Process/kill`. `duplex/from-socket` combines
`Socket/receive-stream`, `Socket/send`, and `Socket/close`.

Relay adds framing and request coordination:

- serial mode permits one active exchange;
- correlated mode uses `:prepare-request` and `:response-id` to dispatch
  concurrent replies;
- unsolicited frames are available through `relay/events` or
  `relay/receive`;
- raw mode provides `read-line`, `read-limit`, and `read-some` buffering.

Every operation returns a Promise. Use `co/await` inside `async/go`, or return
the promise chain directly from `Test/run`.
