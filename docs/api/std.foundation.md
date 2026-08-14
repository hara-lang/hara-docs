---
title: std.foundation
description: Generated API reference for std.foundation.
---

# `std.foundation`

Generated from `std/foundation.hal` and its companion tests. 162 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `read-forms`

defn · `[path]`

Reads every top-level form from a capability-gated HAL source file.

Source: `std/foundation.hal:53`

## `identity`

defn · `[value]`

Returns its argument unchanged.

Source: `std/foundation.hal:63`

## `inc`

defn · `[value]`

Returns value + 1.

Source: `std/foundation.hal:68`

## `dec`

defn · `[value]`

Returns value - 1.

Source: `std/foundation.hal:73`

## `constantly`

defn · `[value]`

Returns a function that ignores its arguments and always returns value.

Source: `std/foundation.hal:78`

## `comp`

defn

Composes two or more functions right-to-left.

Source: `std/foundation.hal:83`

## `complement`

defn · `[predicate]`

Returns a function returning the logical negation of predicate's result.

Source: `std/foundation.hal:96`

## `partial`

defn · `[function & arguments]`

Returns a function that calls function with arguments prepended to its own.

Source: `std/foundation.hal:101`

## `juxt`

defn · `[& functions]`

Returns a function whose result is the vector of each function applied to
   its arguments.

Source: `std/foundation.hal:108`

## `boolean`

defn · `[value]`

Coerces value to true or false using Hara truthiness.

Source: `std/foundation.hal:122`

## `zero?`

defn · `[value]`

Returns true if value equals 0.

Source: `std/foundation.hal:127`

## `pos?`

defn · `[value]`

Returns true if value is greater than 0.

Source: `std/foundation.hal:132`

## `neg?`

defn · `[value]`

Returns true if value is less than 0.

Source: `std/foundation.hal:137`

## `even?`

defn · `[value]`

Returns true if value is evenly divisible by 2.

Source: `std/foundation.hal:142`

## `odd?`

defn · `[value]`

Returns true if value is not evenly divisible by 2.

Source: `std/foundation.hal:147`

## `nil?`

defn · `[value]`

Returns true if value is nil.

Source: `std/foundation.hal:152`

## `false?`

defn · `[value]`

Returns true if value is exactly false.

Source: `std/foundation.hal:157`

## `true?`

defn · `[value]`

Returns true if value is exactly true.

Source: `std/foundation.hal:162`

## `has?`

defn · `[collection key]`

Returns true if collection contains key, including when its value is nil.

Source: `std/foundation.hal:167`

## `reset!`

defn · `[reference value]`

Sets reference to value through IReset and returns value.

Source: `std/foundation.hal:177`

## `cas!`

defn · `[reference old-value new-value]`

Atomically replaces old-value with new-value through ICas.

Source: `std/foundation.hal:183`

## `swap!`

defn · `[reference function & arguments]`

Atomically applies function to reference through an ICas retry loop.

Source: `std/foundation.hal:189`

## `watch-add`

defn · `[reference key function]`

Adds a keyed watch callback through IWatch and returns reference.

Source: `std/foundation.hal:200`

## `watch-remove`

defn · `[reference key]`

Removes keyed watch through IWatch and returns reference.

Source: `std/foundation.hal:206`

## `watch-list`

defn · `[reference]`

Returns reference's watch iterator through IWatch.

Source: `std/foundation.hal:212`

## `empty?`

defn · `[value]`

Returns true if value yields no items.

Source: `std/foundation.hal:222`

## `first`

defn · `[value]`

Returns the first item of value, or nil if value is empty.

Source: `std/foundation.hal:227`

## `second`

defn · `[value]`

Returns the second item of value, or nil if value has fewer than two items.

Source: `std/foundation.hal:234`

## `rest`

defn · `[value]`

Returns all but the first item of value as a seq, or nil if empty.

Source: `std/foundation.hal:239`

## `not-empty`

defn · `[value]`

Returns value if it has any items, nil otherwise.

Source: `std/foundation.hal:245`

## `last`

defn · `[value]`

Returns the last item of value, or nil if value is empty.

Source: `std/foundation.hal:250`

## `reverse`

defn · `[value]`

Returns the items of value in reverse order as a list.

Source: `std/foundation.hal:260`

## `get-in`

defn · `[value keys]`

Returns the value at the end of the key path keys, or nil if absent.

Source: `std/foundation.hal:274`

## `assoc-in`

defn · `[value keys new-value]`

Returns value with new-value associated at the end of the key path keys,
   creating intermediate maps as needed.

Source: `std/foundation.hal:285`

## `update`

defn · `[value key function & args]`

Associates key in value with the result of applying function to the old
   value and args.

Source: `std/foundation.hal:299`

## `update-in`

defn · `[value keys function & args]`

Like update, but at the end of the key path keys.

Source: `std/foundation.hal:306`

## `key`

defn · `[entry]`

Returns the key of a map entry.

Source: `std/foundation.hal:316`

## `val`

defn · `[entry]`

Returns the value of a map entry.

Source: `std/foundation.hal:321`

## `keys`

defn · `[value]`

Returns a vector of the map's keys.

Source: `std/foundation.hal:326`

## `vals`

defn · `[value]`

Returns a vector of the map's values.

Source: `std/foundation.hal:331`

## `range`

defn

Returns a lazy seq of numbers: from 0 upward, below end, or from start
   below end.

Source: `std/foundation.hal:362`

## `repeat`

defn

Returns a lazy seq of value repeated forever, or amount times.

Source: `std/foundation.hal:378`

## `repeatedly`

defn

Returns a lazy seq of calls to function, forever or amount times.

Source: `std/foundation.hal:385`

## `iterate`

defn · `[function seed]`

Returns a lazy seq of seed, (function seed), (function (function seed)), …

Source: `std/foundation.hal:392`

## `take-while`

defn

Unary form returns an iterator transform; collection form eagerly
   materializes items while predicate holds.

Source: `std/foundation.hal:397`

## `drop-while`

defn

Unary form returns an iterator transform; collection form eagerly
   materializes after dropping items while predicate holds.

Source: `std/foundation.hal:405`

## `partition-all`

defn

Partitions value into groups of at most amount items; unary form returns a
   transform.

Source: `std/foundation.hal:413`

## `partition`

defn

Partitions value into groups of exactly amount items; unary form returns a
   transform.

Source: `std/foundation.hal:422`

## `interpose`

defn

Unary form returns an iterator transform; collection form eagerly inserts
   separator between items.

Source: `std/foundation.hal:431`

## `interleave`

defn · `[value & rest]`

Eagerly returns the first items of each source, then the second items, and
   so on, stopping at the shortest source.

Source: `std/foundation.hal:439`

## `map`

defn

Unary form returns an iterator transform. Otherwise eagerly maps function
   over one or more sources into a vector, stopping at the shortest.

Source: `std/foundation.hal:447`

## `filter`

defn

Unary form returns an iterator transform; collection form eagerly keeps
   items for which predicate returns true.

Source: `std/foundation.hal:457`

## `take`

defn

Unary form returns an iterator transform; collection form eagerly returns
   the first amount items.

Source: `std/foundation.hal:465`

## `drop`

defn

Unary form returns an iterator transform; collection form eagerly returns
   all but the first amount items.

Source: `std/foundation.hal:472`

## `mapcat`

defn

Unary form returns an iterator transform; collection form eagerly maps and
   concatenates.

Source: `std/foundation.hal:479`

## `keep`

defn

Unary form returns an iterator transform; collection form eagerly returns
   non-nil mapped results.

Source: `std/foundation.hal:487`

## `cycle`

defn · `[value]`

Returns a lazy seq repeating the items of value forever.

Source: `std/foundation.hal:495`

## `zip`

defn · `[first & rest]`

Eagerly returns tuples of the items of each source in parallel, stopping at
   the shortest source.

Source: `std/foundation.hal:500`

## `partition-pair`

defn · `[value]`

Eagerly returns value partitioned into pairs.

Source: `std/foundation.hal:508`

## `every?`

defn

Unary form returns a reusable terminal; collection form tests every item.

Source: `std/foundation.hal:513`

## `any?`

defn

Unary form returns a reusable terminal; collection form tests any item.

Source: `std/foundation.hal:519`

## `E`

def

No source docstring is currently provided.

Source: `std/foundation.hal:529`

## `PI`

def

No source docstring is currently provided.

Source: `std/foundation.hal:531`

## `long`

defn · `[value]`

Converts a numeric value to a signed 64-bit integer by truncating toward zero.

Source: `std/foundation.hal:536`

## `double`

defn · `[value]`

Converts a numeric value to an IEEE-754 double.

Source: `std/foundation.hal:542`

## `bit-and`

defn · `[& values]`

Returns the bitwise conjunction of values through the portable Bits boundary.

Source: `std/foundation.hal:548`

## `bit-or`

defn · `[& values]`

Returns the bitwise disjunction of values through the portable Bits boundary.

Source: `std/foundation.hal:554`

## `bit-xor`

defn · `[& values]`

Returns the bitwise exclusive-or of values through the portable Bits boundary.

Source: `std/foundation.hal:560`

## `bit-not`

defn · `[value]`

Returns the bitwise complement of value through the portable Bits boundary.

Source: `std/foundation.hal:566`

## `bit-shift-left`

defn · `[& values]`

Left-shifts the first value by the remaining shift counts.

Source: `std/foundation.hal:572`

## `bit-shift-right`

defn · `[& values]`

Right-shifts the first value by the remaining shift counts.

Source: `std/foundation.hal:578`

## `abs`

defn · `[value]`

Returns the absolute magnitude of value.

Source: `std/foundation.hal:584`

## `acos`

defn · `[value]`

Returns the arc cosine of value in radians.

Source: `std/foundation.hal:590`

## `acosh`

defn · `[value]`

Returns the inverse hyperbolic cosine of value.

Source: `std/foundation.hal:596`

## `asin`

defn · `[value]`

Returns the arc sine of value in radians.

Source: `std/foundation.hal:602`

## `asinh`

defn · `[value]`

Returns the inverse hyperbolic sine of value.

Source: `std/foundation.hal:608`

## `atan`

defn · `[value]`

Returns the arc tangent of value in radians.

Source: `std/foundation.hal:614`

## `atan2`

defn · `[y x]`

Returns the angle for y and x in radians.

Source: `std/foundation.hal:620`

## `atanh`

defn · `[value]`

Returns the inverse hyperbolic tangent of value.

Source: `std/foundation.hal:626`

## `ceil`

defn · `[value]`

Rounds value upward to the nearest integral number.

Source: `std/foundation.hal:632`

## `cos`

defn · `[value]`

Returns the cosine of value in radians.

Source: `std/foundation.hal:638`

## `cosh`

defn · `[value]`

Returns the hyperbolic cosine of value.

Source: `std/foundation.hal:644`

## `exp`

defn · `[value]`

Returns Euler's number raised to value.

Source: `std/foundation.hal:650`

## `floor`

defn · `[value]`

Rounds value downward to the nearest integral number.

Source: `std/foundation.hal:656`

## `pow`

defn · `[value exponent]`

Returns value raised to exponent.

Source: `std/foundation.hal:662`

## `sin`

defn · `[value]`

Returns the sine of value in radians.

Source: `std/foundation.hal:668`

## `sinh`

defn · `[value]`

Returns the hyperbolic sine of value.

Source: `std/foundation.hal:674`

## `sqrt`

defn · `[value]`

Returns the non-negative square root of value.

Source: `std/foundation.hal:680`

## `tan`

defn · `[value]`

Returns the tangent of value in radians.

Source: `std/foundation.hal:686`

## `tanh`

defn · `[value]`

Returns the hyperbolic tangent of value.

Source: `std/foundation.hal:692`

## `T`

defn · `[& values]`

Ignores its arguments and returns true.

Source: `std/foundation.hal:698`

## `F`

defn · `[& values]`

Ignores its arguments and returns false.

Source: `std/foundation.hal:703`

## `NIL`

defn · `[& values]`

Ignores its arguments and returns nil.

Source: `std/foundation.hal:708`

## `U`

defn · `[function]`

Self-application combinator.

Source: `std/foundation.hal:713`

## `Z`

defn · `[function]`

Eager fixed-point combinator.

Source: `std/foundation.hal:718`

## `Y`

defn · `[function]`

Classical fixed-point combinator; diverges under ordinary eager use.

Source: `std/foundation.hal:725`

## `min`

defn · `[value & values]`

Returns the least of value and values under compare.

Source: `std/foundation.hal:736`

## `max`

defn · `[value & values]`

Returns the greatest of value and values under compare.

Source: `std/foundation.hal:745`

## `sort`

defn

Returns values sorted by comparison (default compare) as a vector. Stable.

Source: `std/foundation.hal:767`

## `sort-by`

defn

Returns values sorted by the results of key-function under comparison
   (default compare).

Source: `std/foundation.hal:780`

## `drop-last`

defn

Returns values without its last amount items (default 1) as a vector.

Source: `std/foundation.hal:795`

## `butlast`

defn · `[values]`

Returns values without its last item.

Source: `std/foundation.hal:804`

## `take-last`

defn · `[amount values]`

Returns the last amount items of values as a vector.

Source: `std/foundation.hal:809`

## `split-at`

defn · `[amount values]`

Returns a pair of vector results from take and drop.

Source: `std/foundation.hal:816`

## `split-with`

defn · `[predicate values]`

Returns vectors containing the longest matching prefix and the remainder.

Source: `std/foundation.hal:823`

## `partition-by`

defn · `[function values]`

Returns a vector of the runs of items of values for which function returns
   equal consecutive markers.

Source: `std/foundation.hal:838`

## `take-nth`

defn · `[amount values]`

Returns every amount-th item as a vector. Throws on non-positive amount.

Source: `std/foundation.hal:858`

## `into`

defn · `[destination source]`

Returns destination with every item of source conjoined.

Source: `std/foundation.hal:879`

## `distinct`

defn · `[values]`

Returns the items of values with duplicates removed, preserving order and
   origin.

Source: `std/foundation.hal:885`

## `distinct?`

defn · `[& values]`

Returns true if no two of values are equal.

Source: `std/foundation.hal:900`

## `mapv`

defn · `[function & collections]`

Returns a vector containing function applied across one or more collections.

Source: `std/foundation.hal:913`

## `map-indexed`

defn · `[function values]`

Returns a vector of function applied to each index and value.

Source: `std/foundation.hal:919`

## `ffirst`

defn · `[values]`

Returns the first item of the first item in values.

Source: `std/foundation.hal:931`

## `remove`

defn · `[predicate values]`

Returns the values for which predicate is false.

Source: `std/foundation.hal:937`

## `zipmap`

defn · `[map-keys map-values]`

Returns a map of map-keys to map-values, stopping at the shorter input.

Source: `std/foundation.hal:943`

## `map-keys`

defn · `[function value-map]`

Returns a map whose keys are (function key), preserving each value.
   When transformed keys collide, the later entry wins.

Source: `std/foundation.hal:954`

## `map-vals`

defn · `[function value-map]`

Returns a map with function applied to each value, preserving its keys.

Source: `std/foundation.hal:968`

## `merge-with`

defn · `[function & maps]`

Merges maps left-to-right, combining duplicate values with
   (function old new). Nil maps are skipped.

Source: `std/foundation.hal:981`

## `group-by`

defn · `[function values]`

Returns a map of (function value) to vectors of the values producing it.

Source: `std/foundation.hal:1004`

## `frequencies`

defn · `[values]`

Returns a map of each distinct item of values to its occurrence count.

Source: `std/foundation.hal:1016`

## `union`

defn · `[& sets]`

Returns a set containing every value in sets.

Source: `std/foundation.hal:1030`

## `intersection`

defn · `[first-set & sets]`

Returns the values present in every set.

Source: `std/foundation.hal:1036`

## `difference`

defn · `[first-set & sets]`

Returns values in first-set absent from every remaining set.

Source: `std/foundation.hal:1048`

## `subset?`

defn · `[left right]`

Returns true when every value in left is present in right.

Source: `std/foundation.hal:1054`

## `superset?`

defn · `[left right]`

Returns true when every value in right is present in left.

Source: `std/foundation.hal:1060`

## `hierarchical-top`

defn · `[index]`

Returns the root node of a descendant hierarchy.

Source: `std/foundation.hal:1066`

## `hierarchical-sort`

defn · `[index]`

Prunes a descendant hierarchy into its direct dependency graph.

Source: `std/foundation.hal:1077`

## `topological-top`

defn · `[graph]`

Returns graph nodes which are not dependencies of another node.

Source: `std/foundation.hal:1098`

## `find-cycle`

defn · `[graph]`

Returns one closed cycle path from graph, or nil.

Source: `std/foundation.hal:1125`

## `topological-sort`

defn · `[graph]`

Returns graph nodes in dependency order and throws on a cycle.

Source: `std/foundation.hal:1131`

## `topological-sort-order-by-deps`

defn · `[graph sorted-values]`

Stably sorts each dependency level by dependency count and node identity.

Source: `std/foundation.hal:1168`

## `walk`

defn · `[inner outer form]`

Traverses persistent data while preserving collection kinds and metadata.

Source: `std/foundation.hal:1192`

## `postwalk`

defn · `[function form]`

Performs a depth-first post-order traversal.

Source: `std/foundation.hal:1222`

## `prewalk`

defn · `[function form]`

Performs a depth-first pre-order traversal.

Source: `std/foundation.hal:1228`

## `prewalk-replace`

defn · `[replacements form]`

Recursively replaces keys found in replacements before descending.

Source: `std/foundation.hal:1234`

## `postwalk-replace`

defn · `[replacements form]`

Recursively replaces keys found in replacements after descending.

Source: `std/foundation.hal:1242`

## `macroexpand`

defn · `[form]`

Repeatedly applies macroexpand-1 until the form is stable. Throws after
   1000 expansion steps.

Source: `std/foundation.hal:1253`

## `macroexpand-all`

defn · `[form]`

Fully expands form, descending into subforms. Quote bodies are preserved;
   syntax-quote templates expand only their unquoted parts.

Source: `std/foundation.hal:1309`

## `case`

defmacro · `[value & clauses]`

Selects the expression paired with the matching constant, or the optional default.

Source: `std/foundation.hal:1413`

## `some->`

defmacro · `[value & forms]`

Threads a non-nil value through forms as their first argument.

Source: `std/foundation.hal:1419`

## `some->>`

defmacro · `[value & forms]`

Threads a non-nil value through forms as their last argument.

Source: `std/foundation.hal:1424`

## `apply-in`

defn · `[value runtime args]`

Invokes value in runtime after IApplicable input and output transforms.

Source: `std/foundation.hal:1433`

## `apply-as`

defn · `[value args]`

Invokes value using its default IApplicable runtime.

Source: `std/foundation.hal:1441`

## `invoke-as`

defn · `[value & args]`

Invokes value using its default IApplicable runtime and arguments.

Source: `std/foundation.hal:1447`

## `doto`

defmacro · `[value & forms]`

Evaluates value once, invokes each form with it inserted first, and returns
   the original value.

Source: `std/foundation.hal:1464`

## `if-not`

defmacro · `[test then & alternative]`

Evaluates then when test is false, otherwise the optional alternative.

Source: `std/foundation.hal:1474`

## `when`

defmacro · `[test & body]`

Evaluates body when test is truthy, otherwise returns nil.

Source: `std/foundation.hal:1479`

## `if-let`

defmacro · `[binding then & alternative]`

Binds name to expression; evaluates then when the value is truthy,
   otherwise the optional alternative.

Source: `std/foundation.hal:1484`

## `when-let`

defmacro · `[binding & body]`

Binds name to expression; when the value is truthy, evaluates body.

Source: `std/foundation.hal:1493`

## `cond->`

defmacro · `[value & clauses]`

Threads value through each step whose condition holds, inserting it as the
   first argument.

Source: `std/foundation.hal:1501`

## `cond->>`

defmacro · `[value & clauses]`

Threads value through each step whose condition holds, inserting it as the
   last argument.

Source: `std/foundation.hal:1507`

## `with-ns`

defmacro · `[namespace & forms]`

Evaluates body forms in an existing namespace and restores the caller.

Source: `std/foundation.hal:1513`

## `intern-in`

defmacro · `[ns? & syms]`

Copies selected Vars into a namespace as its public façade.

Source: `std/foundation.hal:1518`

## `intern-all`

defmacro · `[& namespaces]`

Copies every public Var from each source namespace into the current namespace.

Source: `std/foundation.hal:1535`

## `*template-meta*`

def

No source docstring is currently provided.

Source: `std/foundation.hal:1550`

## `with:template-meta`

defmacro · `[metadata & body]`

Binds template metadata for the duration of body.

Source: `std/foundation.hal:1552`

## `template-meta`

defn · `[]`

Returns metadata supplied to the active template expansion.

Source: `std/foundation.hal:1559`

## `template-vars`

defmacro · `[spec & entries]`

Evaluates template forms for named source Vars.

Source: `std/foundation.hal:1565`

## `template-entries`

defmacro · `[spec & entries]`

Evaluates template forms for literal entries.

Source: `std/foundation.hal:1581`

## `template-ensure`

defn · `[symbols variables]`

Returns generated template Vars after the caller has materialized them.

Source: `std/foundation.hal:1591`

## `code-line`

defmacro · `[]`

Expands to the line number of the invocation form.

Source: `std/foundation.hal:1597`

## `code-column`

defmacro · `[]`

Expands to the column number of the invocation form.

Source: `std/foundation.hal:1601`
