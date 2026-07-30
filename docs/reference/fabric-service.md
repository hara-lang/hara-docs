# Hara Fabric service

Hara Fabric is an experimental coordination service built from the native Rust
runtime. It is aimed at agent workrooms and other systems where isolated state,
portable behavior, and low-latency messages belong together.

It is not a Redis-compatible key-value server. RESP4 is the control and data
transport, HTA1 carries typed binary values, and Hara-specific commands expose
the service model.

## Model

The public hierarchy is:

| Level | Meaning |
|---|---|
| Space | Workroom, routing boundary, and future authorization boundary |
| Session | Isolated mutable Hara runtime with ordered evaluation |
| Namespace | HAL or WASM-backed API loaded into a session |
| Signal | Report channel addressed to a session |

The process starts with `default/ROOT`. Additional sessions are assigned to a
fixed runtime shard from the hash of their space and name. A shard owns its
Hara runtimes, so sessions execute concurrently across shards without making
the non-`Send` runtime cross thread boundaries.

Start the service:

```shell
cargo build --manifest-path rust/Cargo.toml --bin hara
rust/target/debug/hara --data target/fabric --shards 4 fabric
```

The default listener is `127.0.0.1:1311`. `--node-id`, repeated `--peer`, and
`--cluster-epoch` configure deterministic home-node selection. The current
prototype detects a remote home and returns `route/home-unavailable`; peer
transport and failover are not implemented yet.

## RESP4 commands

Negotiate protocol 4 with `["HELLO", "4"]`. All other requests have the shape
`[OPERATION, REQUEST-ID, ...ARGUMENTS]` and return `RESULT` followed by `DONE`.

```text
["SPACE", "1", "CREATE", "workroom"]
["SPACE", "2", "ATTACH", "workroom"]
["SESSION", "3", "NEW", "researcher"]
["SESSION", "4", "ATTACH", "researcher"]
["EVAL", "5", "(def status :ready)"]
```

Upload and load an import-free `:core.v1` WASM extension:

```text
["MODULE", "6", "PUT", MANIFEST-EDN, WASM-BYTES]
["MODULE", "7", "LOAD", "sha256:..."]
["MODULE", "8", "CALL", "agent.tool/score", HTA1-ARGUMENT-VECTOR]
```

Artifacts are immutable and content-addressed by their manifest plus module
bytes. Compiled code is validated at upload; mutable instances belong to the
session that loads them. A namespace can currently be loaded once per session.

## Reports and retention

Reports are binary-safe, bounded to 1 MiB, and attributed to the attached
source session by the service:

```text
["REPORT", "9", "SUBSCRIBE", "finding"]
["REPORT", "10", "SEND", "reviewer", "finding", HTA1-OR-OPAQUE-BYTES]
["REPORT", "11", "NEXT", "sub-1"]
```

Live delivery is best-effort and at-most-once. Each subscription has a bounded
mailbox; a full target returns `report/backpressure` rather than silently
dropping an accepted report.

Retention is configured by target session and signal:

```text
["REPORT", "12", "RETAIN", "final", "10000", "86400000"]
["REPORT", "13", "REPLAY", "final", "0", "100"]
```

Retained reports are committed to SQLite in WAL/FULL mode before
acknowledgement. Sequence numbers are ordered within one
`space/session/signal`; no global sender order is promised.

## Analytics and visualization

The service tracks lifecycle, call, report, queue, retention, and error
metadata:

```text
["METRICS", "14"]
["EVENTS", "15", "0", "500"]
["TOPOLOGY", "16"]
```

`EVENTS` is cursor-based. Report analytics contain source, target, signal,
byte count, delivery count, retention status, and timestamps, but never report
bodies or evaluated source. `TOPOLOGY` returns spaces, sessions, shard/home
placement, and loaded namespaces.

Studio's `fabric-analytics.js` consumes these read-only feeds.
`FabricAnalyticsModel` accumulates traffic edges, and `FabricTopologyView`
renders spaces, sessions, namespaces, and weighted report flow as SVG.

## Benchmark

Run the built-in four-agent workroom workload:

```shell
scripts/run-fabric-benchmark \
  --rooms 100 --tasks 100 --payload 4096 --clients 8 --shards 8
```

The command emits `hara.fabric.benchmark.v1` JSON with task throughput,
p50/p95/p99/p99.9 latency, peak RSS, and service counters. The full comparison
matrix and claim gates live in `rust/bench/fabric/baselines.edn`.

The wasmCloud/NATS and Valkey/NATS/Wasmtime adapters are required before making
a state-of-the-art performance claim. The local harness alone measures Hara;
it does not establish superiority.

## Current boundaries

- Static home selection exists, but remote forwarding, migration, replication,
  consensus, mTLS, and client authentication are not yet implemented.
- Subscriptions use `REPORT NEXT`; server-pushed RESP notifications are not
  implemented.
- Uploaded modules support the direct import-free WASM ABI. HTA subprocess
  packages continue to use the existing extension discovery path.
- Exactly-once state transitions and Redis key commands are out of scope.
