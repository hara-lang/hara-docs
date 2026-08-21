<!-- hara-api:generated -->
---
title: std.foundation
description: Generated API reference for std.foundation.
---

# `std.foundation`

Generated from `std/foundation.hal` and its companion tests. 285 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `list`

defn · `[& values]`

Creates a persistent list from values.

Source: `std/foundation.hal:46`

## `vector`

defn · `[& values]`

Creates a persistent vector from values.

Source: `std/foundation.hal:49`

## `vec`

defn · `[value]`

Converts value to a persistent vector.

Source: `std/foundation.hal:52`

## `set`

defn · `[value]`

Converts value to a persistent set.

Source: `std/foundation.hal:55`

## `pair`

defn · `[left right]`

Creates a key/value pair.

Source: `std/foundation.hal:58`

## `pair?`

defn · `[value]`

Returns true when value is a key/value pair.

Source: `std/foundation.hal:61`

## `tuple`

defn · `[& values]`

Creates a fixed-width tuple from values.

Source: `std/foundation.hal:65`

## `hash-map`

defn · `[& entries]`

Creates a persistent map from alternating keys and values.

Source: `std/foundation.hal:68`

## `hash-set`

defn · `[& values]`

Creates a persistent set from values.

Source: `std/foundation.hal:71`

## `atom`

defn · `[value]`

Creates an atom containing value.

Source: `std/foundation.hal:74`

## `time-ms`

defn · `[]`

Returns Unix wall-clock milliseconds; the value may jump when the system clock is corrected.

Source: `std/foundation.hal:77`

## `time-ns`

defn · `[]`

Returns a runtime-local monotonic nanosecond counter for elapsed-time differences.

Source: `std/foundation.hal:83`

## `stream`

defn · `[function & arguments]`

Creates a lazy asynchronous pull stream from a coroutine body and its initial arguments.

Source: `std/foundation.hal:89`

## `stream?`

defn · `[value]`

Returns true when value implements the native stream contract.

Source: `std/foundation.hal:95`

## `pointer`

defn · `[descriptor]`

Creates a context pointer from descriptor.

Source: `std/foundation.hal:101`

## `symbol`

defn

Creates a symbol with an optional namespace.

Source: `std/foundation.hal:104`

## `keyword`

defn

Creates a keyword with an optional namespace.

Source: `std/foundation.hal:112`

## `reduced`

defn · `[value]`

Wraps value as an early reduction result.

Source: `std/foundation.hal:120`

## `apply`

defn · `[function & arguments]`

Applies function to leading arguments and a final sequential value.

Source: `std/foundation.hal:123`

## `not`

defn · `[value]`

Returns true when value is false or nil.

Source: `std/foundation.hal:128`

## `boolean`

defn · `[value]`

Coerces value to true or false using Hara truthiness.

Source: `std/foundation.hal:131`

## `compare`

defn · `[left right]`

Compares two mutually orderable Hara values.

Source: `std/foundation.hal:134`

## `reduced?`

defn · `[value]`

Returns true when value is a reduced result.

Source: `std/foundation.hal:137`

## `unreduced`

defn · `[value]`

Returns the value carried by a reduced result, or value unchanged.

Source: `std/foundation.hal:140`

## `nil?`

defn · `[value]`

Returns true when value is nil.

Source: `std/foundation.hal:144`

## `not-nil?`

defn · `[value]`

Returns true when value is not nil.

Source: `std/foundation.hal:147`

## `boolean?`

defn · `[value]`

Returns true when value is a boolean.

Source: `std/foundation.hal:150`

## `false?`

defn · `[value]`

Returns true when value is false.

Source: `std/foundation.hal:153`

## `true?`

defn · `[value]`

Returns true when value is true.

Source: `std/foundation.hal:156`

## `string?`

defn · `[value]`

Returns true when value is a string.

Source: `std/foundation.hal:159`

## `char?`

defn · `[value]`

Returns true when value is a character.

Source: `std/foundation.hal:162`

## `number?`

defn · `[value]`

Returns true when value is numeric.

Source: `std/foundation.hal:165`

## `integer?`

defn · `[value]`

Returns true when value is an integer.

Source: `std/foundation.hal:168`

## `long?`

defn · `[value]`

Returns true when value is a signed 64-bit integer.

Source: `std/foundation.hal:171`

## `double?`

defn · `[value]`

Returns true when value is an IEEE-754 double.

Source: `std/foundation.hal:174`

## `keyword?`

defn · `[value]`

Returns true when value is a keyword.

Source: `std/foundation.hal:177`

## `symbol?`

defn · `[value]`

Returns true when value is a symbol.

Source: `std/foundation.hal:180`

## `pointer?`

defn · `[value]`

Returns true when value is a context pointer.

Source: `std/foundation.hal:183`

## `atom?`

defn · `[value]`

Returns true when value is an atom.

Source: `std/foundation.hal:186`

## `fn?`

defn · `[value]`

Returns true when value satisfies IFn.

Source: `std/foundation.hal:189`

## `function?`

defn · `[value]`

Returns true when value is a native function.

Source: `std/foundation.hal:192`

## `bytes?`

defn · `[value]`

Returns true when value is a byte buffer.

Source: `std/foundation.hal:195`

## `array?`

defn · `[value]`

Returns true when value is a mutable array.

Source: `std/foundation.hal:198`

## `object?`

defn · `[value]`

Returns true when value is a mutable object.

Source: `std/foundation.hal:201`

## `list?`

defn · `[value]`

Returns true when value is a persistent list.

Source: `std/foundation.hal:204`

## `cons?`

defn · `[value]`

Returns true when value is a Cons sequence.

Source: `std/foundation.hal:207`

## `vector?`

defn · `[value]`

Returns true when value is a persistent vector.

Source: `std/foundation.hal:210`

## `tuple?`

defn · `[value]`

Returns true when value is a tuple.

Source: `std/foundation.hal:213`

## `map?`

defn · `[value]`

Returns true when value is a persistent map.

Source: `std/foundation.hal:216`

## `map-entry?`

defn · `[value]`

Returns true when value is a map entry.

Source: `std/foundation.hal:219`

## `set?`

defn · `[value]`

Returns true when value is a persistent set.

Source: `std/foundation.hal:222`

## `sequential?`

defn · `[value]`

Returns true when value has sequential collection semantics.

Source: `std/foundation.hal:225`

## `coll?`

defn · `[value]`

Returns true when value satisfies the runtime collection capability.

Source: `std/foundation.hal:228`

## `satisfies?`

defn · `[protocol value]`

Returns true when value satisfies protocol.

Source: `std/foundation.hal:231`

## `type`

defn · `[value]`

Returns value's portable runtime type keyword.

Source: `std/foundation.hal:234`

## `instance?`

defn · `[descriptor value]`

Returns true when value is an instance of descriptor.

Source: `std/foundation.hal:237`

## `schema`

defn · `[value]`

Compiles schema data into a SchemaType.

Source: `std/foundation.hal:240`

## `schema-of`

defn · `[variable]`

Returns the compiled schema contract of variable.

Source: `std/foundation.hal:243`

## `var-sym`

defn · `[variable]`

Returns the qualified symbol naming variable.

Source: `std/foundation.hal:248`

## `env-current`

defn · `[]`

Returns the active namespace symbol.

Source: `std/foundation.hal:251`

## `env-snapshot`

defn · `[]`

Returns a stable descriptor of the current environment.

Source: `std/foundation.hal:254`

## `env-vars`

defn

Returns Vars owned by the active or supplied namespace.

Source: `std/foundation.hal:257`

## `env-namespaces`

defn · `[]`

Returns descriptors for every known namespace.

Source: `std/foundation.hal:265`

## `env-namespace`

defn · `[namespace]`

Returns a namespace descriptor, or nil when unknown.

Source: `std/foundation.hal:268`

## `env-module`

defn · `[path]`

Returns the loaded module descriptor for path, or nil.

Source: `std/foundation.hal:271`

## `env-resolve`

defn · `[symbol]`

Resolves symbol without triggering namespace or package loading.

Source: `std/foundation.hal:274`

## `ns-alias-state`

defn

Returns load state for an alias in the active or supplied namespace.

Source: `std/foundation.hal:277`

## `intern-var`

defn

Interns a Var root and optional metadata into namespace.

Source: `std/foundation.hal:285`

## `eval-in-ns`

defn · `[namespace forms]`

Evaluates form values in an existing namespace.

Source: `std/foundation.hal:293`

## `eval`

defn · `[form]`

Evaluates one form value in the active namespace.

Source: `std/foundation.hal:296`

## `code-line`

defmacro · `[]`

Expands to the line number of the invocation form.

Source: `std/foundation.hal:299`

## `code-column`

defmacro · `[]`

Expands to the column number of the invocation form.

Source: `std/foundation.hal:304`

## `read-forms`

defn · `[path]`

Reads every top-level form from a capability-gated HAL source file.

Source: `std/foundation.hal:308`

## `result`

defn

Creates or synchronizes a native Result.

Source: `std/foundation.hal:318`

## `result?`

defn · `[value]`

Returns true when value is a native Result.

Source: `std/foundation.hal:330`

## `meta`

defn · `[value]`

Returns value metadata through IObjType, or nil when none is present.

Source: `std/foundation.hal:340`

## `with-meta`

defn · `[value metadata]`

Returns value carrying metadata through IObjType.

Source: `std/foundation.hal:348`

## `T`

defn · `[& values]`

Ignores its arguments and returns true.

Source: `std/foundation.hal:360`

## `F`

defn · `[& values]`

Ignores its arguments and returns false.

Source: `std/foundation.hal:365`

## `NIL`

defn · `[& values]`

Ignores its arguments and returns nil.

Source: `std/foundation.hal:370`

## `U`

defn · `[function]`

Self-application combinator.

Source: `std/foundation.hal:375`

## `Z`

defn · `[function]`

Eager fixed-point combinator.

Source: `std/foundation.hal:380`

## `Y`

defn · `[function]`

Classical fixed-point combinator; diverges under ordinary eager use.

Source: `std/foundation.hal:387`

## `identity`

defn · `[value]`

Returns its argument unchanged.

Source: `std/foundation.hal:394`

## `apply-with`

defn

Returns object unchanged when function is nil, otherwise calls function
   with object prepended to the remaining arguments.

Source: `std/foundation.hal:399`

## `tap`

defn · `[object function & arguments]`

Calls function with object prepended to arguments, then returns object.

Source: `std/foundation.hal:411`

## `inc`

defn · `[value]`

Returns value + 1.

Source: `std/foundation.hal:418`

## `dec`

defn · `[value]`

Returns value - 1.

Source: `std/foundation.hal:424`

## `constantly`

defn · `[value]`

Returns a function that ignores its arguments and always returns value.

Source: `std/foundation.hal:430`

## `concat`

defn · `[& sources]`

Returns a lazy sequence containing each source in order.

Source: `std/foundation.hal:435`

## `comp`

defn

Composes two or more functions right-to-left.

Source: `std/foundation.hal:441`

## `complement`

defn · `[predicate]`

Returns a function returning the logical negation of predicate's result.

Source: `std/foundation.hal:455`

## `partial`

defn · `[function & arguments]`

Returns a function that calls function with arguments prepended to its own.

Source: `std/foundation.hal:461`

## `juxt`

defn · `[& functions]`

Returns a function whose result is the vector of each function applied to
   its arguments.

Source: `std/foundation.hal:468`

## `zero?`

defn · `[value]`

Returns true if value equals 0.

Source: `std/foundation.hal:482`

## `pos?`

defn · `[value]`

Returns true if value is greater than 0.

Source: `std/foundation.hal:487`

## `neg?`

defn · `[value]`

Returns true if value is less than 0.

Source: `std/foundation.hal:492`

## `even?`

defn · `[value]`

Returns true if value is evenly divisible by 2.

Source: `std/foundation.hal:497`

## `odd?`

defn · `[value]`

Returns true if value is not evenly divisible by 2.

Source: `std/foundation.hal:502`

## `has?`

defn · `[collection key]`

Returns true if collection contains key, including when its value is nil.

Source: `std/foundation.hal:507`

## `regexp`

defn · `[pattern]`

Compiles a pattern string, returning RegExp values unchanged.

Source: `std/foundation.hal:519`

## `re-pattern`

defn · `[regex]`

Returns the source pattern of a RegExp value.

Source: `std/foundation.hal:527`

## `re-find`

defn · `[pattern input]`

Returns the first match in input, or nil when the pattern does not match.

Source: `std/foundation.hal:533`

## `re-matches`

defn · `[pattern input]`

Returns true when pattern matches all of input.

Source: `std/foundation.hal:539`

## `re-replace`

defn · `[pattern input replacement]`

Replaces every match in input using numbered $1 capture groups.

Source: `std/foundation.hal:545`

## `re-split`

defn · `[pattern input]`

Splits input around matches and returns the resulting vector.

Source: `std/foundation.hal:551`

## `reset!`

defn · `[reference value]`

Sets reference to value through IReset and returns value.

Source: `std/foundation.hal:561`

## `cas!`

defn · `[reference old-value new-value]`

Atomically replaces old-value with new-value through ICas.

Source: `std/foundation.hal:567`

## `swap!`

defn · `[reference function & arguments]`

Atomically applies function to reference through an ICas retry loop.

Source: `std/foundation.hal:573`

## `swap-return!`

defn

Atomically replaces reference state from a function returning
   [output new-state]. Returns output, or [output new-state] when state? is
   true. The returned values always belong to the successful CAS attempt.

Source: `std/foundation.hal:584`

## `watch-add`

defn · `[reference key function]`

Adds a keyed watch callback through IWatch and returns reference.

Source: `std/foundation.hal:603`

## `watch-remove`

defn · `[reference key]`

Removes keyed watch through IWatch and returns reference.

Source: `std/foundation.hal:609`

## `watch-list`

defn · `[reference]`

Returns reference's watch iterator through IWatch.

Source: `std/foundation.hal:615`

## `to-mutable`

defn · `[value]`

Converts a persistent receiver through IToMutable.

Source: `std/foundation.hal:625`

## `to-persistent`

defn · `[value]`

Converts a mutable receiver through IToPersistent.

Source: `std/foundation.hal:631`

## `reduce`

defn

Reduces source with function, optionally beginning with initial.

Source: `std/foundation.hal:641`

## `reduce-kv`

defn · `[function initial source]`

Reduces map entries by calling function with accumulator, key, and value.

Source: `std/foundation.hal:648`

## `reduce-in`

defn · `[initial function source]`

Reduces source into initial, using mutable conversion when supported.

Source: `std/foundation.hal:657`

## `empty?`

defn · `[value]`

Returns true if value yields no items.

Source: `std/foundation.hal:674`

## `first`

defn · `[value]`

Returns the first item of value, or nil if value is empty.

Source: `std/foundation.hal:682`

## `second`

defn · `[value]`

Returns the second item of value, or nil if value has fewer than two items.

Source: `std/foundation.hal:691`

## `rest`

defn · `[value]`

Returns all but the first item of value as a seq, or nil if empty.

Source: `std/foundation.hal:696`

## `not-empty`

defn · `[value]`

Returns value if it has any items, nil otherwise.

Source: `std/foundation.hal:702`

## `last`

defn · `[value]`

Returns the last item of value, or nil if value is empty.

Source: `std/foundation.hal:707`

## `reverse`

defn · `[value]`

Returns the items of value in reverse order as a list.

Source: `std/foundation.hal:719`

## `get-in`

defn · `[value keys]`

Returns the value at the end of the key path keys, or nil if absent.

Source: `std/foundation.hal:733`

## `assoc-in`

defn · `[value keys new-value]`

Returns value with new-value associated at the end of the key path keys,
   creating intermediate maps as needed.

Source: `std/foundation.hal:744`

## `update`

defn · `[value key function & args]`

Associates key in value with the result of applying function to the old
   value and args.

Source: `std/foundation.hal:758`

## `update-in`

defn · `[value keys function & args]`

Like update, but at the end of the key path keys.

Source: `std/foundation.hal:765`

## `merge`

defn · `[& sources]`

Returns a map containing the entries of each source, with later values winning.

Source: `std/foundation.hal:775`

## `select-keys`

defn · `[source keys]`

Returns a map containing the entries from source whose keys are requested.

Source: `std/foundation.hal:786`

## `key`

defn · `[entry]`

Returns the key of a map entry.

Source: `std/foundation.hal:798`

## `val`

defn · `[entry]`

Returns the value of a map entry.

Source: `std/foundation.hal:803`

## `keys`

defn · `[value]`

Returns a vector of the map's keys.

Source: `std/foundation.hal:808`

## `vals`

defn · `[value]`

Returns a vector of the map's values.

Source: `std/foundation.hal:813`

## `range`

defn

Returns a lazy seq of numbers: from 0 upward, below end, or from start
   below end.

Source: `std/foundation.hal:858`

## `repeat`

defn

Returns a lazy seq of value repeated forever, or amount times.

Source: `std/foundation.hal:876`

## `repeatedly`

defn

Returns a lazy seq of calls to function, forever or amount times.

Source: `std/foundation.hal:883`

## `iterate`

defn · `[function seed]`

Returns a lazy seq of seed, (function seed), (function (function seed)), …

Source: `std/foundation.hal:890`

## `take-while`

defn

Returns a source-sensitive transform, or transforms items while predicate holds.

Source: `std/foundation.hal:895`

## `drop-while`

defn

Returns a source-sensitive transform, or drops items while predicate holds.

Source: `std/foundation.hal:905`

## `partition-all`

defn

Returns a source-sensitive transform, or partitions value into groups of
   at most amount items.

Source: `std/foundation.hal:915`

## `partition`

defn

Returns a source-sensitive transform, or partitions value into groups of
   exactly amount items.

Source: `std/foundation.hal:926`

## `interpose`

defn

Returns a source-sensitive transform, or inserts separator between items.

Source: `std/foundation.hal:937`

## `interleave`

defn · `[value & values]`

Returns alternating source items, stopping at the shortest source. The first
   source controls result mode.

Source: `std/foundation.hal:947`

## `map`

defn

Returns a source-sensitive transform, or maps function over one or more
   sources. The first source controls result mode.

Source: `std/foundation.hal:955`

## `filter`

defn

Returns a source-sensitive transform, or keeps matching items.

Source: `std/foundation.hal:971`

## `take`

defn

Returns a source-sensitive transform, or the first amount items.

Source: `std/foundation.hal:981`

## `drop`

defn

Returns a source-sensitive transform, or all but the first amount items.

Source: `std/foundation.hal:990`

## `subs`

defn

Returns the string slice from start (inclusive) to optional end (exclusive).

Source: `std/foundation.hal:999`

## `subvec`

defn

Returns the vector slice from start (inclusive) to end (exclusive).

Source: `std/foundation.hal:1009`

## `mapcat`

defn

Returns a source-sensitive transform, or maps and concatenates.

Source: `std/foundation.hal:1023`

## `keep`

defn

Returns a source-sensitive transform, or keeps non-nil mapped results.

Source: `std/foundation.hal:1033`

## `cycle`

defn · `[value]`

Returns a lazy seq repeating the items of value forever.

Source: `std/foundation.hal:1043`

## `zip`

defn · `[value & values]`

Returns tuples of source items in parallel, stopping at the shortest source.
   The first source controls result mode.

Source: `std/foundation.hal:1048`

## `partition-pair`

defn · `[value]`

Returns value partitioned into pairs using its source result mode.

Source: `std/foundation.hal:1056`

## `every?`

defn

Unary form returns a reusable terminal; collection form tests every item.

Source: `std/foundation.hal:1061`

## `any?`

defn

Unary form returns a reusable terminal; collection form tests any item.

Source: `std/foundation.hal:1068`

## `some`

defn · `[predicate values]`

Returns the first truthy result of applying predicate to values, or nil.

Source: `std/foundation.hal:1075`

## `mapv`

defn · `[function value & values]`

Returns a persistent vector of function results over one or more sources.

Source: `std/foundation.hal:1086`

## `E`

def

No source docstring is currently provided.

Source: `std/foundation.hal:1096`

## `PI`

def

No source docstring is currently provided.

Source: `std/foundation.hal:1098`

## `long`

defn · `[value]`

Converts a numeric value to a signed 64-bit integer by truncating toward zero.

Source: `std/foundation.hal:1103`

## `double`

defn · `[value]`

Converts a numeric value to an IEEE-754 double.

Source: `std/foundation.hal:1109`

## `parse-long`

defn · `[value]`

Parses a signed 64-bit integer string, returning nil when invalid.

Source: `std/foundation.hal:1115`

## `parse-double`

defn · `[value]`

Parses an IEEE-754 double string, returning nil when invalid.

Source: `std/foundation.hal:1121`

## `bit-and`

defn · `[& values]`

Returns the bitwise conjunction of values through the portable Bits boundary.

Source: `std/foundation.hal:1127`

## `bit-or`

defn · `[& values]`

Returns the bitwise disjunction of values through the portable Bits boundary.

Source: `std/foundation.hal:1133`

## `bit-xor`

defn · `[& values]`

Returns the bitwise exclusive-or of values through the portable Bits boundary.

Source: `std/foundation.hal:1139`

## `bit-not`

defn · `[value]`

Returns the bitwise complement of value through the portable Bits boundary.

Source: `std/foundation.hal:1145`

## `bit-shift-left`

defn · `[& values]`

Left-shifts the first value by the remaining shift counts.

Source: `std/foundation.hal:1151`

## `bit-shift-right`

defn · `[& values]`

Right-shifts the first value by the remaining shift counts.

Source: `std/foundation.hal:1157`

## `abs`

defn · `[value]`

Returns the absolute magnitude of value.

Source: `std/foundation.hal:1163`

## `acos`

defn · `[value]`

Returns the arc cosine of value in radians.

Source: `std/foundation.hal:1169`

## `acosh`

defn · `[value]`

Returns the inverse hyperbolic cosine of value.

Source: `std/foundation.hal:1175`

## `asin`

defn · `[value]`

Returns the arc sine of value in radians.

Source: `std/foundation.hal:1181`

## `asinh`

defn · `[value]`

Returns the inverse hyperbolic sine of value.

Source: `std/foundation.hal:1187`

## `atan`

defn · `[value]`

Returns the arc tangent of value in radians.

Source: `std/foundation.hal:1193`

## `atan2`

defn · `[y x]`

Returns the angle for y and x in radians.

Source: `std/foundation.hal:1199`

## `atanh`

defn · `[value]`

Returns the inverse hyperbolic tangent of value.

Source: `std/foundation.hal:1205`

## `ceil`

defn · `[value]`

Rounds value upward to the nearest integral number.

Source: `std/foundation.hal:1211`

## `cos`

defn · `[value]`

Returns the cosine of value in radians.

Source: `std/foundation.hal:1217`

## `cosh`

defn · `[value]`

Returns the hyperbolic cosine of value.

Source: `std/foundation.hal:1223`

## `exp`

defn · `[value]`

Returns Euler's number raised to value.

Source: `std/foundation.hal:1229`

## `floor`

defn · `[value]`

Rounds value downward to the nearest integral number.

Source: `std/foundation.hal:1235`

## `pow`

defn · `[value exponent]`

Returns value raised to exponent.

Source: `std/foundation.hal:1241`

## `sin`

defn · `[value]`

Returns the sine of value in radians.

Source: `std/foundation.hal:1247`

## `sinh`

defn · `[value]`

Returns the hyperbolic sine of value.

Source: `std/foundation.hal:1253`

## `sqrt`

defn · `[value]`

Returns the non-negative square root of value.

Source: `std/foundation.hal:1259`

## `tan`

defn · `[value]`

Returns the tangent of value in radians.

Source: `std/foundation.hal:1265`

## `tanh`

defn · `[value]`

Returns the hyperbolic tangent of value.

Source: `std/foundation.hal:1271`

## `min`

defn · `[value & values]`

Returns the least of value and values under compare.

Source: `std/foundation.hal:1281`

## `max`

defn · `[value & values]`

Returns the greatest of value and values under compare.

Source: `std/foundation.hal:1290`

## `sort`

defn

Returns values sorted by comparison (default compare) as a vector. Stable.

Source: `std/foundation.hal:1312`

## `sort-by`

defn

Returns values sorted by the results of key-function under comparison
   (default compare).

Source: `std/foundation.hal:1325`

## `drop-last`

defn

Returns values without its last amount items (default 1) as a vector.

Source: `std/foundation.hal:1340`

## `butlast`

defn · `[values]`

Returns values without its last item.

Source: `std/foundation.hal:1349`

## `take-last`

defn · `[amount values]`

Returns the last amount items of values as a vector.

Source: `std/foundation.hal:1354`

## `split-at`

defn · `[amount values]`

Returns a pair of vector results from take and drop.

Source: `std/foundation.hal:1361`

## `split-with`

defn · `[predicate values]`

Returns vectors containing the longest matching prefix and the remainder.

Source: `std/foundation.hal:1368`

## `partition-by`

defn · `[function values]`

Returns a vector of the runs of items of values for which function returns
   equal consecutive markers.

Source: `std/foundation.hal:1383`

## `take-nth`

defn · `[amount values]`

Returns every amount-th item as a vector. Throws on non-positive amount.

Source: `std/foundation.hal:1403`

## `into`

defn · `[destination source]`

Returns destination with every item of source conjoined.

Source: `std/foundation.hal:1424`

## `distinct`

defn · `[values]`

Returns the items of values with duplicates removed, preserving order and
   origin.

Source: `std/foundation.hal:1430`

## `distinct?`

defn · `[& values]`

Returns true if no two of values are equal.

Source: `std/foundation.hal:1445`

## `filterv`

defn · `[predicate values]`

Returns a vector of the items for which predicate returns true.

Source: `std/foundation.hal:1458`

## `map-indexed`

defn · `[function values]`

Returns a vector of function applied to each index and value.

Source: `std/foundation.hal:1464`

## `ffirst`

defn · `[values]`

Returns the first item of the first item in values.

Source: `std/foundation.hal:1476`

## `remove`

defn · `[predicate values]`

Returns the values for which predicate is false.

Source: `std/foundation.hal:1482`

## `zipmap`

defn · `[map-keys map-values]`

Returns a map of map-keys to map-values, stopping at the shorter input.

Source: `std/foundation.hal:1488`

## `map-keys`

defn · `[function value-map]`

Returns a map whose keys are (function key), preserving each value.
   When transformed keys collide, the later entry wins.

Source: `std/foundation.hal:1499`

## `map-vals`

defn · `[function value-map]`

Returns a map with function applied to each value, preserving its keys.

Source: `std/foundation.hal:1509`

## `merge-with`

defn · `[function & maps]`

Merges maps left-to-right, combining duplicate values with
   (function old new). Nil maps are skipped.

Source: `std/foundation.hal:1518`

## `merge-nested`

defn · `[& maps]`

Recursively merges maps from left to right. Later non-map values replace
   earlier values.

Source: `std/foundation.hal:1541`

## `dissoc-in`

defn · `[value-map path]`

Removes the value at path and prunes empty parent maps.

Source: `std/foundation.hal:1552`

## `transpose`

defn · `[value-map]`

Returns a map with its keys and values exchanged. Later duplicate values win.

Source: `std/foundation.hal:1564`

## `find-at`

defn · `[predicate values]`

Returns the index of the first value matched by predicate, or -1.

Source: `std/foundation.hal:1572`

## `insert-at`

defn · `[values index value & more]`

Returns a vector with one or more values inserted at index.

Source: `std/foundation.hal:1583`

## `remove-at`

defn

Returns values without count items beginning at index. Count defaults to one.

Source: `std/foundation.hal:1591`

## `qualified-keys`

defn

Returns entries whose keyword keys are qualified, optionally by namespace.

Source: `std/foundation.hal:1599`

## `unqualified-keys`

defn · `[value-map]`

Returns entries whose keyword keys are unqualified.

Source: `std/foundation.hal:1627`

## `qualify-keys`

defn · `[value-map qualifier]`

Qualifies unqualified keyword keys with qualifier.

Source: `std/foundation.hal:1639`

## `unqualify-keys`

defn

Removes namespaces from keyword keys, optionally only for qualifier.

Source: `std/foundation.hal:1652`

## `flatten-nested`

defn · `[value]`

Returns the non-collection leaves of a nested collection.

Source: `std/foundation.hal:1671`

## `group-by`

defn · `[function values]`

Returns a map of (function value) to vectors of the values producing it.

Source: `std/foundation.hal:1681`

## `frequencies`

defn · `[values]`

Returns a map of each distinct item of values to its occurrence count.

Source: `std/foundation.hal:1692`

## `union`

defn · `[& sets]`

Returns a set containing every value in sets.

Source: `std/foundation.hal:1704`

## `intersection`

defn · `[first-set & sets]`

Returns the values present in every set.

Source: `std/foundation.hal:1712`

## `difference`

defn · `[first-set & sets]`

Returns values in first-set absent from every remaining set.

Source: `std/foundation.hal:1724`

## `subset?`

defn · `[left right]`

Returns true when every value in left is present in right.

Source: `std/foundation.hal:1732`

## `superset?`

defn · `[left right]`

Returns true when every value in right is present in left.

Source: `std/foundation.hal:1738`

## `find-cycle`

defn · `[graph]`

Returns one closed cycle path from graph, or nil.

Source: `std/foundation.hal:1770`

## `hierarchical-top`

defn · `[index]`

Returns the root node of a descendant hierarchy.

Source: `std/foundation.hal:1782`

## `hierarchical-sort`

defn · `[index]`

Prunes a descendant hierarchy into its direct dependency graph.

Source: `std/foundation.hal:1793`

## `topological-top`

defn · `[graph]`

Returns graph nodes which are not dependencies of another node.

Source: `std/foundation.hal:1819`

## `topological-sort`

defn · `[graph]`

Returns graph nodes in dependency order and throws on a cycle.

Source: `std/foundation.hal:1826`

## `topological-sort-order-by-deps`

defn · `[graph sorted-values]`

Stably sorts each dependency level by dependency count and node identity.

Source: `std/foundation.hal:1863`

## `form?`

defn · `[value]`

Returns true when value is a persistent Hara source form.

Source: `std/foundation.hal:1887`

## `walk`

defn · `[inner outer form]`

Traverses persistent data while preserving collection kinds and metadata.

Source: `std/foundation.hal:1893`

## `postwalk`

defn · `[function form]`

Performs a depth-first post-order traversal.

Source: `std/foundation.hal:1923`

## `prewalk`

defn · `[function form]`

Performs a depth-first pre-order traversal.

Source: `std/foundation.hal:1929`

## `prewalk-replace`

defn · `[replacements form]`

Recursively replaces keys found in replacements before descending.

Source: `std/foundation.hal:1935`

## `postwalk-replace`

defn · `[replacements form]`

Recursively replaces keys found in replacements after descending.

Source: `std/foundation.hal:1943`

## `macroexpand`

defn · `[form]`

Repeatedly applies macroexpand-1 until the form is stable. Throws after
   1000 expansion steps.

Source: `std/foundation.hal:1955`

## `macroexpand-all`

defn · `[form]`

Fully expands form, descending into subforms. Quote bodies are preserved;
   syntax-quote templates expand only their unquoted parts.

Source: `std/foundation.hal:2013`

## `defonce`

defmacro · `[name expression]`

Defines name with expression only when its Var is absent, returning the Var.

Source: `std/foundation.hal:2366`

## `case`

defmacro · `[value & clauses]`

Selects the expression paired with the matching constant, or the optional default.

Source: `std/foundation.hal:2387`

## `some->`

defmacro · `[value & forms]`

Threads a non-nil value through forms as their first argument.

Source: `std/foundation.hal:2393`

## `some->>`

defmacro · `[value & forms]`

Threads a non-nil value through forms as their last argument.

Source: `std/foundation.hal:2398`

## `apply-in`

defn · `[value runtime args]`

Invokes value in runtime after IApplicable input and output transforms.

Source: `std/foundation.hal:2407`

## `apply-as`

defn · `[value args]`

Invokes value using its default IApplicable runtime.

Source: `std/foundation.hal:2415`

## `invoke-as`

defn · `[value & args]`

Invokes value using its default IApplicable runtime and arguments.

Source: `std/foundation.hal:2421`

## `doto`

defmacro · `[value & forms]`

Evaluates value once, invokes each form with it inserted first, and returns
   the original value.

Source: `std/foundation.hal:2438`

## `if-not`

defmacro · `[test then & alternative]`

Evaluates then when test is false, otherwise the optional alternative.

Source: `std/foundation.hal:2448`

## `when`

defmacro · `[test & body]`

Evaluates body when test is truthy, otherwise returns nil.

Source: `std/foundation.hal:2453`

## `if-let`

defmacro · `[bindings then & alternative]`

Evaluates binding pairs from left to right; evaluates then when every value
   is truthy, otherwise the optional shared alternative.

Source: `std/foundation.hal:2458`

## `when-let`

defmacro · `[bindings & body]`

Evaluates binding pairs from left to right; when every value is truthy,
   evaluates body.

Source: `std/foundation.hal:2466`

## `for`

defmacro · `[bindings body]`

Returns an iterator-backed Seq comprehension. Supports collection bindings,
   :let, :when, :while, and one optional final :into destination.

Source: `std/foundation.hal:2472`

## `doseq`

defmacro · `[bindings & body]`

Executes body eagerly for collection bindings and :let, :when, or :while
   modifiers, then returns nil.

Source: `std/foundation.hal:2487`

## `dotimes`

defmacro · `[binding & body]`

Executes body with index from zero to below count, then returns nil.

Source: `std/foundation.hal:2509`

## `while`

defmacro · `[test & body]`

Repeatedly executes body while test is truthy, then returns nil.

Source: `std/foundation.hal:2531`

## `cond->`

defmacro · `[value & clauses]`

Threads value through each step whose condition holds, inserting it as the
   first argument.

Source: `std/foundation.hal:2542`

## `cond->>`

defmacro · `[value & clauses]`

Threads value through each step whose condition holds, inserting it as the
   last argument.

Source: `std/foundation.hal:2548`

## `with-ns`

defmacro · `[namespace & forms]`

Evaluates body forms in an existing namespace and restores the caller.

Source: `std/foundation.hal:2554`

## `with-out-string`

defmacro · `[& body]`

Captures text written by p and println while evaluating body.

Source: `std/foundation.hal:2559`

## `with-close`

defmacro · `[bindings & body]`

Binds closeable resources and closes them in reverse order after body.

Source: `std/foundation.hal:2565`

## `intern-in`

defmacro · `[target-or-entry & additional-entries]`

Copies selected Vars into a namespace as its public façade.

Source: `std/foundation.hal:2586`

## `intern-all`

defmacro · `[& namespaces]`

Copies every public Var from each source namespace into the current namespace.

Source: `std/foundation.hal:2605`

## `*template-meta*`

def

No source docstring is currently provided.

Source: `std/foundation.hal:2624`

## `with-template-meta`

defmacro · `[metadata & body]`

Binds template metadata for the duration of body.

Source: `std/foundation.hal:2630`

## `template-meta`

defn · `[]`

Returns metadata supplied to the active template expansion.

Source: `std/foundation.hal:2637`

## `template-vars`

defmacro · `[spec & entries]`

Evaluates template forms for named source Vars.

Source: `std/foundation.hal:2643`

## `template-entries`

defmacro · `[spec & entries]`

Evaluates template forms for literal entries.

Source: `std/foundation.hal:2659`

## `template-ensure`

defn · `[symbols variables]`

Returns generated template Vars after the caller has materialized them.

Source: `std/foundation.hal:2669`

## `test-check`

defmacro · `[name actual expected]`

Evaluates one lightweight assertion and converts thrown errors into native Test Results.

Source: `std/foundation.hal:2680`

## `dep-get`

defn · `[context id]`

Returns one dependency entry from a map graph or IDeps context.

Source: `std/foundation.hal:2701`

## `dep-entries`

defn · `[context id]`

Returns one entry's dependencies as a set.

Source: `std/foundation.hal:2712`

## `dep-keys`

defn · `[context]`

Lists dependency identifiers from a map graph or IDeps context.

Source: `std/foundation.hal:2724`

## `deps-map`

defn · `[context ids]`

Builds the direct dependency map for ids.

Source: `std/foundation.hal:2732`

## `deps-resolve`

defn

Resolves ids and every transitive dependency into {:all set :graph map}.

Source: `std/foundation.hal:2741`

## `deps-ordered`

defn

Returns dependencies before dependents and throws on a cycle.

Source: `std/foundation.hal:2759`

## `dependents-direct`

defn

Returns selected entries that directly depend on id.

Source: `std/foundation.hal:2768`

## `dependents-topological`

defn · `[context ids selected]`

Builds one level of the reverse dependency graph.

Source: `std/foundation.hal:2779`

## `dependents-all`

defn

Returns the complete reverse graph rooted at id.

Source: `std/foundation.hal:2788`

## `dependents-ordered`

defn

Returns transitive dependents before id in teardown order.

Source: `std/foundation.hal:2804`
