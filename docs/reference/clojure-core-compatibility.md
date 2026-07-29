# Clojure core / Hara core compatibility

Canonical exhaustive grouping for Clojure 1.12.5 and Hara L0 plus `std.foundation`.

| Group | Count |
|---|---:|
| `only-clojure` | 486 |
| `only-hara` | 39 |
| `same-exact` | 194 |
| `same-renamed` | 1 |
| `same-changed` | 12 |

## same-changed

| Clojure | Hara | Contract |
|---|---|---|
| `map` | `map` | Direct calls are lazy in both; Hara's one-argument transform is eager on ordinary collections and returns a vector, while preserving arrays and existing lazy sources. |
| `seq` | `seq` | Hara exposes the iterator boundary explicitly and also supports applying a transform lazily as (seq transform source); it does not require Clojure ISeq. |
| `rest` | `rest` | Hara returns nil when no values remain; Clojure rest returns an empty sequence. |
| `partition` | `partition` | Hara direct calls are lazy, while its one-argument transform is eager and returns a vector (or array for array input); Clojure's one-argument form is a transducer. |
| `partition-all` | `partition-all` | Hara's one-argument form is an eager transform rather than a Clojure transducer. |
| `keys` | `keys` | Hara returns its runtime-neutral lazy Seq rather than Clojure's JVM sequence implementation. |
| `vals` | `vals` | Hara returns its runtime-neutral lazy Seq rather than Clojure's JVM sequence implementation. |
| `some` | `any?` | Hara any? returns a boolean existential result; Clojure some returns the first truthy predicate result. |
| `empty?` | `empty?` | Hara checks through the iterator protocol and may inspect a one-shot iterator; Clojure uses seq semantics. |
| `let` | `let` | Hara evaluates initializers against the enclosing lexical environment in parallel; Clojure let bindings are sequential. |
| `defrecord` | `defstruct` | Hara has no Clojure JVM record/class contract; portable immutable domain values use defstruct and protocols. |
| `eval` | `eval` | Hara evaluates through its context-local language runtime and does not expose Clojure compiler/JVM eval semantics. |

## same-renamed

| Clojure | Hara | Contract |
|---|---|---|
| `contains?` | `has?` | Hara exposes collection membership as the public has? function. |

## Hara public surface

| Kind | Count |
|---|---:|
| Core functions and macros | 213 |
| Special forms | 33 |
| Protocols | 41 |
| Namespaced library functions | 96 |

## only-clojure

`*'`, `*1`, `*2`, `*3`, `*agent*`, `*allow-unresolved-vars*`, `*assert*`, `*clojure-version*`, `*command-line-args*`, `*compile-files*`, `*compile-path*`, `*compiler-options*`, `*data-readers*`, `*default-data-reader-fn*`, `*e`, `*err*`, `*file*`, `*flush-on-newline*`, `*fn-loader*`, `*in*`, `*math-context*`, `*ns*`, `*out*`, `*print-dup*`, `*print-length*`, `*print-level*`, `*print-meta*`, `*print-namespace-maps*`, `*print-readably*`, `*read-eval*`, `*reader-resolver*`, `*repl*`, `*source-path*`, `*suppress-read*`, `*unchecked-math*`, `*use-context-classloader*`, `*verbose-defrecords*`, `*warn-on-reflection*`, `+'`, `-'`, `->`, `->>`, `->ArrayChunk`, `->Eduction`, `->Vec`, `->VecNode`, `->VecSeq`, `-cache-protocol-fn`, `-reset-methods`, `..`, `==`, `EMPTY-NODE`, `Inst`, `NaN?`, `PrintWriter-on`, `StackTraceElement->vec`, `Throwable->map`, `abs`, `accessor`, `aclone`, `add-classpath`, `add-tap`, `agent`, `agent-error`, `agent-errors`, `aget`, `alength`, `alias`, `all-ns`, `alter`, `alter-meta!`, `amap`, `ancestors`, `any?`, `areduce`, `array-map`, `as->`, `aset`, `aset-boolean`, `aset-byte`, `aset-char`, `aset-double`, `aset-float`, `aset-int`, `aset-long`, `aset-short`, `assert`, `assoc!`, `await`, `await-for`, `await1`, `bases`, `bean`, `biginteger`, `bit-and-not`, `bit-clear`, `bit-flip`, `bit-set`, `bit-test`, `boolean`, `boolean-array`, `booleans`, `bound-fn`, `bound-fn*`, `bound?`, `bounded-count`, `byte`, `byte-array`, `case`, `cast`, `cat`, `char`, `char-array`, `char-escape-string`, `char-name-string`, `chars`, `chunk`, `chunk-append`, `chunk-buffer`, `chunk-cons`, `chunk-first`, `chunk-next`, `chunk-rest`, `chunked-seq?`, `class`, `class?`, `clear-agent-errors`, `clojure-version`, `coll?`, `comment`, `commute`, `comparator`, `compile`, `completing`, `condp`, `conj!`, `construct-proxy`, `create-ns`, `create-struct`, `dec'`, `dedupe`, `default-data-readers`, `definline`, `definterface`, `defonce`, `defstruct`, `deftype`, `delay`, `delay?`, `deliver`, `denominator`, `derive`, `descendants`, `destructure`, `disj`, `disj!`, `dissoc!`, `doall`, `dorun`, `doseq`, `dosync`, `dotimes`, `double-array`, `double?`, `doubles`, `eduction`, `ensure`, `ensure-reduced`, `enumeration-seq`, `error-handler`, `error-mode`, `every-pred`, `ex-cause`, `extend`, `extend-protocol`, `extenders`, `extends?`, `ffirst`, `file-seq`, `filterv`, `find-keyword`, `find-ns`, `find-protocol-impl`, `find-protocol-method`, `find-var`, `flatten`, `float`, `float-array`, `float?`, `floats`, `flush`, `fn?`, `fnext`, `fnil`, `for`, `force`, `format`, `future`, `future-call`, `future-cancel`, `future-cancelled?`, `future-done?`, `future?`, `gen-class`, `gen-interface`, `get-method`, `get-proxy-class`, `get-thread-bindings`, `get-validator`, `halt-when`, `hash`, `hash-combine`, `hash-map`, `hash-ordered-coll`, `hash-set`, `hash-unordered-coll`, `ident?`, `identical?`, `if-some`, `ifn?`, `import`, `inc'`, `infinite?`, `init-proxy`, `inst-ms`, `inst-ms*`, `inst?`, `int`, `int-array`, `int?`, `intern`, `into-array`, `ints`, `io!`, `isa?`, `iteration`, `iterator-seq`, `keep-indexed`, `lazy-cat`, `lazy-seq`, `line-seq`, `list*`, `load`, `load-file`, `load-reader`, `loaded-libs`, `locking`, `long`, `long-array`, `longs`, `make-array`, `make-hierarchy`, `map-indexed`, `mapv`, `max-key`, `memfn`, `memoize`, `method-sig`, `methods`, `min-key`, `mix-collection-hash`, `monitor-enter`, `monitor-exit`, `munge`, `namespace-munge`, `nat-int?`, `neg-int?`, `newline`, `next`, `nfirst`, `nnext`, `not-any?`, `not-every?`, `ns-imports`, `ns-interns`, `ns-map`, `ns-refers`, `ns-resolve`, `ns-unalias`, `ns-unmap`, `nthnext`, `nthrest`, `num`, `numerator`, `object-array`, `parents`, `parse-boolean`, `parse-double`, `parse-long`, `parse-uuid`, `partitionv`, `partitionv-all`, `pcalls`, `persistent!`, `pmap`, `pop!`, `pop-thread-bindings`, `pos-int?`, `pr`, `prefer-method`, `prefers`, `primitives-classnames`, `print`, `print-ctor`, `print-dup`, `print-method`, `print-simple`, `print-str`, `printf`, `println`, `println-str`, `prn`, `prn-str`, `proxy`, `proxy-call-with-super`, `proxy-mappings`, `proxy-name`, `proxy-super`, `push-thread-bindings`, `pvalues`, `qualified-ident?`, `qualified-keyword?`, `qualified-symbol?`, `quot`, `rand`, `rand-int`, `rand-nth`, `random-sample`, `random-uuid`, `ratio?`, `rational?`, `rationalize`, `re-find`, `re-groups`, `re-matcher`, `re-matches`, `re-pattern`, `re-seq`, `read`, `read+string`, `read-line`, `read-string`, `reader-conditional`, `reader-conditional?`, `realized?`, `record?`, `reduced`, `reduced?`, `reductions`, `ref`, `ref-history-count`, `ref-max-history`, `ref-min-history`, `ref-set`, `refer-clojure`, `reify`, `release-pending-sends`, `rem`, `remove-all-methods`, `remove-method`, `remove-ns`, `remove-tap`, `replace`, `replicate`, `requiring-resolve`, `reset-meta!`, `reset-vals!`, `restart-agent`, `resultset-seq`, `reversible?`, `rseq`, `rsubseq`, `run!`, `satisfies?`, `send`, `send-off`, `send-via`, `seq-to-map-for-destructuring`, `seqable?`, `seque`, `sequence`, `set`, `set-agent-send-executor!`, `set-agent-send-off-executor!`, `set-error-handler!`, `set-error-mode!`, `set-validator!`, `short`, `short-array`, `shorts`, `shuffle`, `shutdown-agents`, `simple-ident?`, `simple-keyword?`, `simple-symbol?`, `slurp`, `some->`, `some->>`, `some-fn`, `some?`, `sorted-map`, `sorted-map-by`, `sorted-set`, `sorted-set-by`, `sorted?`, `spit`, `splitv-at`, `stream-into!`, `stream-reduce!`, `stream-seq!`, `stream-transduce!`, `struct`, `struct-map`, `subs`, `subseq`, `subvec`, `supers`, `swap-vals!`, `sync`, `tagged-literal`, `tagged-literal?`, `tap>`, `test`, `thread-bound?`, `time`, `to-array`, `to-array-2d`, `trampoline`, `transduce`, `transient`, `tree-seq`, `type`, `unchecked-add`, `unchecked-add-int`, `unchecked-byte`, `unchecked-char`, `unchecked-dec`, `unchecked-dec-int`, `unchecked-divide-int`, `unchecked-double`, `unchecked-float`, `unchecked-inc`, `unchecked-inc-int`, `unchecked-int`, `unchecked-long`, `unchecked-multiply`, `unchecked-multiply-int`, `unchecked-negate`, `unchecked-negate-int`, `unchecked-remainder-int`, `unchecked-short`, `unchecked-subtract`, `unchecked-subtract-int`, `underive`, `unquote`, `unquote-splicing`, `unreduced`, `unsigned-bit-shift-right`, `update-keys`, `update-proxy`, `update-vals`, `uri?`, `var-get`, `var-set`, `var?`, `vary-meta`, `vector`, `vector-of`, `volatile!`, `volatile?`, `vreset!`, `vswap!`, `when-first`, `when-some`, `while`, `with-bindings`, `with-bindings*`, `with-in-str`, `with-loading-context`, `with-local-vars`, `with-open`, `with-out-str`, `with-precision`, `with-redefs`, `with-redefs-fn`, `xml-seq`


## only-hara functions

`F`, `NIL`, `T`, `U`, `Y`, `Z`, `array`, `array?`, `atom?`, `callable?`, `code-column`, `code-line`, `collection?`, `coroutine?`, `current-namespace`, `current-symbols`, `defproject`, `derefable?`, `ex-class`, `get-watches`, `iter`, `iter?`, `iterable?`, `iterator?`, `load-resource`, `macroexpand-all`, `map-keys`, `map-vals`, `object`, `object?`, `partition-pair`, `promise?`, `queue?`, `read-forms`, `regexp?`, `tuple?`, `var-sym`, `watchable?`, `zip`


## same-exact

`*`, `+`, `-`, `/`, `<`, `<=`, `=`, `>`, `>=`, `add-watch`, `alter-var-root`, `and`, `apply`, `assoc`, `assoc-in`, `associative?`, `atom`, `bigdec`, `bigint`, `binding`, `bit-and`, `bit-not`, `bit-or`, `bit-shift-left`, `bit-shift-right`, `bit-xor`, `boolean?`, `butlast`, `bytes`, `bytes?`, `catch`, `char?`, `comp`, `compare`, `compare-and-set!`, `complement`, `concat`, `cond`, `cond->`, `cond->>`, `conj`, `cons`, `constantly`, `count`, `counted?`, `cycle`, `dec`, `decimal?`, `declare`, `def`, `defmacro`, `defmethod`, `defmulti`, `defn`, `defn-`, `defprotocol`, `deref`, `dissoc`, `distinct`, `distinct?`, `do`, `doto`, `double`, `drop`, `drop-last`, `drop-while`, `empty`, `even?`, `every?`, `ex-data`, `ex-info`, `ex-message`, `extend-type`, `false?`, `filter`, `finally`, `find`, `first`, `fn`, `frequencies`, `gensym`, `get`, `get-in`, `group-by`, `identity`, `if`, `if-let`, `if-not`, `in-ns`, `inc`, `indexed?`, `instance?`, `integer?`, `interleave`, `interpose`, `into`, `iterate`, `juxt`, `keep`, `key`, `keyword`, `keyword?`, `last`, `letfn`, `list`, `list?`, `load-string`, `loop`, `macroexpand`, `macroexpand-1`, `map-entry?`, `map?`, `mapcat`, `max`, `merge`, `merge-with`, `meta`, `min`, `mod`, `name`, `namespace`, `neg?`, `new`, `nil?`, `not`, `not-empty`, `not=`, `ns`, `ns-aliases`, `ns-name`, `ns-publics`, `nth`, `number?`, `odd?`, `or`, `partial`, `partition-by`, `peek`, `pop`, `pos?`, `pr-str`, `promise`, `quote`, `range`, `recur`, `reduce`, `reduce-kv`, `refer`, `remove`, `remove-watch`, `repeat`, `repeatedly`, `require`, `reset!`, `resolve`, `reverse`, `second`, `select-keys`, `seq?`, `sequential?`, `set!`, `set?`, `sort`, `sort-by`, `special-symbol?`, `split-at`, `split-with`, `str`, `string?`, `swap!`, `symbol`, `symbol?`, `take`, `take-last`, `take-nth`, `take-while`, `the-ns`, `throw`, `true?`, `try`, `update`, `update-in`, `use`, `uuid?`, `val`, `var`, `vec`, `vector?`, `when`, `when-let`, `when-not`, `with-meta`, `zero?`, `zipmap`

## Hara protocols

`IApplicable`, `IAssoc`, `IColl`, `IComponent`, `IComponentOptions`, `IComponentProps`, `IComponentQuery`, `IComponentTrack`, `IConj`, `ICons`, `IContext`, `ICount`, `IDeref`, `IDerefTimeout`, `IDisplay`, `IDissoc`, `IEmpty`, `IEquality`, `IExInfo`, `IFind`, `IFn`, `IHasRuntime`, `IHash`, `IIndexed`, `IIndexedKV`, `IInvokeIn`, `ILookup`, `IMetadata`, `INamespaced`, `INavigation`, `INth`, `IObjType`, `IPair`, `IPointer`, `IRealize`, `IReset`, `ISpace`, `IToMutable`, `IToPersistent`, `IValidate`, `IWatch`

## Hara namespaced libraries

| Alias | Public functions |
|---|---|
| `str` | `str/blank?`, `str/capitalize`, `str/char`, `str/char-at`, `str/comp`, `str/decapitalize`, `str/decode`, `str/decode-utf8`, `str/encode`, `str/encode-utf8`, `str/ends-with?`, `str/gt?`, `str/includes?`, `str/index-of`, `str/join`, `str/last-index-of`, `str/len`, `str/length`, `str/lower`, `str/lt?`, `str/pad-left`, `str/pad-right`, `str/repeat`, `str/replace`, `str/replace-first`, `str/reverse`, `str/slice`, `str/split`, `str/split-lines`, `str/starts-with?`, `str/substring`, `str/to-fixed`, `str/to-lower`, `str/to-upper`, `str/trim`, `str/trim-left`, `str/trim-right`, `str/upper` |
| `bytes` | `bytes/copy`, `bytes/count`, `bytes/get`, `bytes/s8`, `bytes/set`, `bytes/slice`, `bytes/u8` |
| `co` | `co/await`, `co/close`, `co/coroutine?`, `co/create`, `co/resume`, `co/status`, `co/yield` |
| `promise` | `promise/all`, `promise/cancel`, `promise/catch`, `promise/delay`, `promise/finally`, `promise/from`, `promise/new`, `promise/state`, `promise/then`, `promise/value` |
| `file` | `file/delete`, `file/exists?`, `file/list`, `file/mkdir`, `file/read`, `file/resolve`, `file/write` |
| `json` | `json/read`, `json/write`, `json/write-pp` |
| `os` | `os/arch`, `os/cwd`, `os/env`, `os/getenv`, `os/platform`, `os/process-alive?`, `os/process-close-input`, `os/process-kill`, `os/process-stderr`, `os/process-stdout`, `os/process-wait`, `os/process-write`, `os/process?`, `os/spawn` |
| `socket` | `socket/close`, `socket/connect`, `socket/send` |
| `set` | `set/difference`, `set/intersection`, `set/select`, `set/subset?`, `set/superset?`, `set/union` |
| `pretty` | `pretty/pprint-str` |
## Runtime drift

| Runtime | Missing canonical | Extra implementation |
|---|---:|---:|
| truffle | 0 | 0 |
| rust-native | 77 | 83 |
| wasm | 77 | 83 |

## Parity and transport notes

The Java/Truffle and Rust runtimes share the same Foundation mapping contract.
Parity coverage includes `odd?`, `update`, and direct/curried/lazy mapping
semantics. If an older packaged runtime disagrees, rebuild it from the current
Foundation source: stale embedded artifacts are the usual cause.

`HTA1` transports portable values only. It explicitly rejects `Seq` and raw
iterator values; materialize them with `vec` before sending them across an HTA
boundary. Internal `iter-*` helpers remain implementation-level cleanup work,
not the recommended public data-transport surface.
