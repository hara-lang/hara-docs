---
title: std.lib.collection
description: Generated API reference for std.lib.collection.
---

# `std.lib.collection`

Generated from `std/lib/collection.hal` and its companion tests. 29 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `deque`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `ordered-map`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `ordered-set`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `priority-map`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `queue`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `sorted-map`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `sorted-set`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `trie`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `peek-first`

defn · `[collection]`

Returns the first value through IPeekFirst.

Source: `std/lib/collection.hal:5`

## `peek-last`

defn · `[collection]`

Returns the last value through IPeekLast.

Source: `std/lib/collection.hal:10`

## `pop-first`

defn · `[collection]`

Returns collection without its first value through IPopFirst.

Source: `std/lib/collection.hal:15`

## `pop-last`

defn · `[collection]`

Returns collection without its last value through IPopLast.

Source: `std/lib/collection.hal:20`

## `push-first`

defn · `[collection value]`

Returns collection with value added at the front through IPushFirst.

Source: `std/lib/collection.hal:25`

## `push-last`

defn · `[collection value]`

Returns collection with value added at the back through IPushLast.

Source: `std/lib/collection.hal:30`

## `deque?`

defn · `[value]`

Returns true when value is a persistent deque.

Source: `std/lib/collection.hal:35`

## `priority-map?`

defn · `[value]`

Returns true when value is a stable persistent priority map.

Source: `std/lib/collection.hal:40`

## `ordered-map?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent map.

Source: `std/lib/collection.hal:45`

## `ordered-set?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent set.

Source: `std/lib/collection.hal:50`

## `queue?`

defn · `[value]`

Returns true when value is a persistent queue.

Source: `std/lib/collection.hal:55`

## `sorted-map?`

defn · `[value]`

Returns true when value is a key-sorted persistent map.

Source: `std/lib/collection.hal:60`

## `sorted-set?`

defn · `[value]`

Returns true when value is a value-sorted persistent set.

Source: `std/lib/collection.hal:65`

## `trie?`

defn · `[value]`

Returns true when value is a persistent string-keyed trie.

Source: `std/lib/collection.hal:70`

## `keywordize-keys`

defn · `[value]`

Recursively transforms string and symbol map keys into keywords.

Source: `std/lib/collection.hal:84`

## `keyword-spearify-keys`

defn · `[value]`

Recursively transforms string map keys into spear-case keywords.

Source: `std/lib/collection.hal:94`

## `stringify-keys`

defn · `[value]`

Recursively transforms keyword map keys into strings.

Source: `std/lib/collection.hal:106`

## `string-snakify-keys`

defn · `[value]`

Recursively transforms keyword map keys into snake-case strings.

Source: `std/lib/collection.hal:115`

## `walk:contains`

defn · `[predicate form]`

Returns true when predicate matches any value in a nested form.

Source: `std/lib/collection.hal:127`

## `walk:find`

defn · `[predicate form]`

Returns the set of nested values matched by predicate.

Source: `std/lib/collection.hal:139`

## `walk:keep`

defn · `[function form]`

Returns the set of truthy values produced while walking form.

Source: `std/lib/collection.hal:151`
