<!-- hara-api:generated -->
---
title: std.lib.collection
description: Generated API reference for std.lib.collection.
---

# `std.lib.collection`

Generated from `std/lib/collection.hal` and its companion tests. 32 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `deque`

defn · `[& values]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:3`

## `ordered-map`

defn · `[& entries]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:4`

## `ordered-set`

defn · `[& values]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:5`

## `priority-map`

defn · `[& entries]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:6`

## `queue`

defn · `[& values]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:7`

## `sorted-map`

defn · `[& entries]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:8`

## `sorted-set`

defn · `[& values]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:9`

## `trie`

defn · `[& entries]`

No source docstring is currently provided.

Source: `std/lib/collection.hal:10`

## `peek-first`

defn · `[collection]`

Returns the first value through IPeekFirst.

Source: `std/lib/collection.hal:12`

## `peek-last`

defn · `[collection]`

Returns the last value through IPeekLast.

Source: `std/lib/collection.hal:17`

## `pop-first`

defn · `[collection]`

Returns collection without its first value through IPopFirst.

Source: `std/lib/collection.hal:22`

## `pop-last`

defn · `[collection]`

Returns collection without its last value through IPopLast.

Source: `std/lib/collection.hal:27`

## `push-first`

defn · `[collection value]`

Returns collection with value added at the front through IPushFirst.

Source: `std/lib/collection.hal:32`

## `push-last`

defn · `[collection value]`

Returns collection with value added at the back through IPushLast.

Source: `std/lib/collection.hal:37`

## `deque?`

defn · `[value]`

Returns true when value is a persistent deque.

Source: `std/lib/collection.hal:42`

## `priority-map?`

defn · `[value]`

Returns true when value is a stable persistent priority map.

Source: `std/lib/collection.hal:47`

## `ordered-map?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent map.

Source: `std/lib/collection.hal:52`

## `ordered-set?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent set.

Source: `std/lib/collection.hal:57`

## `queue?`

defn · `[value]`

Returns true when value is a persistent queue.

Source: `std/lib/collection.hal:62`

## `sorted-map?`

defn · `[value]`

Returns true when value is a key-sorted persistent map.

Source: `std/lib/collection.hal:67`

## `sorted-set?`

defn · `[value]`

Returns true when value is a value-sorted persistent set.

Source: `std/lib/collection.hal:72`

## `trie?`

defn · `[value]`

Returns true when value is a persistent string-keyed trie.

Source: `std/lib/collection.hal:77`

## `keywordize-keys`

defn · `[value]`

Recursively transforms string and symbol map keys into keywords.

Source: `std/lib/collection.hal:91`

## `keyword-spearify-keys`

defn · `[value]`

Recursively transforms string map keys into spear-case keywords.

Source: `std/lib/collection.hal:101`

## `stringify-keys`

defn · `[value]`

Recursively transforms keyword map keys into strings.

Source: `std/lib/collection.hal:113`

## `string-snakify-keys`

defn · `[value]`

Recursively transforms keyword map keys into snake-case strings.

Source: `std/lib/collection.hal:122`

## `walk:contains`

defn · `[predicate form]`

Returns true when predicate matches any value in a nested form.

Source: `std/lib/collection.hal:134`

## `walk:find`

defn · `[predicate form]`

Returns the set of nested values matched by predicate.

Source: `std/lib/collection.hal:146`

## `walk:keep`

defn · `[function form]`

Returns the set of truthy values produced while walking form.

Source: `std/lib/collection.hal:158`

## `select`

defmacro · `[value path]`

Selects the values addressed by a literal vector path, returning a vector.

   Path steps compile at macroexpansion: keywords and strings look up map
   keys, integers index sequences, :each traverses sequence elements,
   :map-vals and :map-keys traverse map values and keys, :map-entries
   traverses entries as pairs, :set traverses set members, :first and :last
   address sequence ends, :walk followed by a predicate descends into every
   matching nested node, :tree descends into every nested node, :when and
   :unless guard on a predicate, (view f) applies a function without
   filtering, :multi followed by sub-path vectors navigates every branch,
   and any other form is a predicate filtering the current value.

Source: `std/lib/collection.hal:429`

## `transform`

defmacro · `[value path function]`

Transforms the values addressed by a literal vector path, rebuilding the
   surrounding structure.

   Steps follow select semantics; a predicate step transforms only the
   values it matches. The path compiles to direct traversal code at
   macroexpansion, so there is no runtime path interpretation.

Source: `std/lib/collection.hal:446`

## `setval`

defmacro · `[value path replacement]`

Replaces the values addressed by a literal vector path with replacement,
   evaluating replacement once.

Source: `std/lib/collection.hal:458`
