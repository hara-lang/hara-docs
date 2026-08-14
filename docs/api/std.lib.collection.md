---
title: std.lib.collection
description: Generated API reference for std.lib.collection.
---

# `std.lib.collection`

Generated from `std/lib/collection.hal` and its companion tests. 19 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `ordered-map`

builtin

Native constructor activated by this namespace.

Source: `std/lib/collection.hal:1`

## `ordered-set`

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

## `ordered-map?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent map.

Source: `std/lib/collection.hal:5`

## `ordered-set?`

defn · `[value]`

Returns true when value is an insertion-ordered persistent set.

Source: `std/lib/collection.hal:10`

## `queue?`

defn · `[value]`

Returns true when value is a persistent queue.

Source: `std/lib/collection.hal:15`

## `sorted-map?`

defn · `[value]`

Returns true when value is a key-sorted persistent map.

Source: `std/lib/collection.hal:20`

## `sorted-set?`

defn · `[value]`

Returns true when value is a value-sorted persistent set.

Source: `std/lib/collection.hal:25`

## `trie?`

defn · `[value]`

Returns true when value is a persistent string-keyed trie.

Source: `std/lib/collection.hal:30`

## `keywordize-keys`

defn · `[value]`

Recursively transforms string and symbol map keys into keywords.

Source: `std/lib/collection.hal:44`

## `keyword-spearify-keys`

defn · `[value]`

Recursively transforms string map keys into spear-case keywords.

Source: `std/lib/collection.hal:54`

## `stringify-keys`

defn · `[value]`

Recursively transforms keyword map keys into strings.

Source: `std/lib/collection.hal:66`

## `string-snakify-keys`

defn · `[value]`

Recursively transforms keyword map keys into snake-case strings.

Source: `std/lib/collection.hal:75`

## `walk:contains`

defn · `[predicate form]`

Returns true when predicate matches any value in a nested form.

Source: `std/lib/collection.hal:87`

## `walk:find`

defn · `[predicate form]`

Returns the set of nested values matched by predicate.

Source: `std/lib/collection.hal:99`

## `walk:keep`

defn · `[function form]`

Returns the set of truthy values produced while walking form.

Source: `std/lib/collection.hal:111`
