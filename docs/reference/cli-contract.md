# CLI application contract

Hara owns one machine-readable command-line contract implemented by the Rust
`hara` binary and the Java/Truffle `hara-truffle` binary. The binaries are
peers: they resolve the same public routes, aliases, options, outcomes, and
exit codes while retaining independent native implementations.

The normative sources live in the Hara specification repository:

- `specs/02-platform/000001-cli/metaspec/hal-cli-app-metaspec.edn` defines the document model for CLI
  applications.
- `specs/02-platform/000001-cli/draft/hara-cli.edn` inventories Hara's public routes and closed
  handler identifiers.
- `specs/02-platform/000001-cli/draft/conformance/` defines shared routing, option, and outcome
  cases consumed by both native test suites.

Route matching is deterministic and uses the longest matching path. For
example, `spec check-contribution` resolves before the `spec` group fallback.
Compatibility aliases resolve to the same stable route ID as their canonical
grouped route.

Route documents are data, not executable configuration. A handler is a
qualified keyword looked up in a closed native registry; a document cannot
execute a HAL Var, Java class, Rust function, or project namespace.

## Outcomes

| Class | Exit code |
| --- | ---: |
| success | 0 |
| failed check, test, unknown obligation, or blocked obligation | 1 |
| usage, read, resolution, unavailable, or internal tool error | 2 |
| user interruption | 130 |

Structured command data is written to standard output and diagnostics to
standard error. Finite inspection and checking commands support
`--format text|edn`.

## Repository runtime selection

The repository wrapper uses `HARA_RUNTIME=rust|truffle` and defaults to
Truffle for development compatibility. It never selects a runtime by command.
Release installations expose the peer binaries directly.

The offline parity smoke harness is:

```shell
./scripts/check-cli-parity
```
