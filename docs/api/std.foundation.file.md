---
title: std.foundation.file
description: Generated API reference for std.foundation.file.
---

# `std.foundation.file`

Generated from `std/foundation/file.hal` and its companion tests. 11 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `parent`

defn · `[path]`

Returns the lexical parent of path, or nil when path has no parent.

Source: `std/foundation/file.hal:45`

## `join`

defn · `[base path]`

Joins path to base using the host platform's lexical path rules.

Source: `std/foundation/file.hal:51`

## `resolve`

defn · `[root path]`

Returns normalized path relative to root without touching the filesystem.

Source: `std/foundation/file.hal:57`

## `read`

defn · `[path]`

Returns a promise of bytes read from path.

Source: `std/foundation/file.hal:63`

## `write`

defn · `[path contents]`

Returns a promise after overwriting or creating path with contents.

Source: `std/foundation/file.hal:69`

## `exists?`

defn · `[path]`

Returns a promise of whether path exists.

Source: `std/foundation/file.hal:75`

## `stat`

defn · `[path]`

Returns a promise of deterministic :type and :size metadata for path.

Source: `std/foundation/file.hal:81`

## `list`

defn · `[path]`

Returns a promise of normalized child paths in deterministic order.

Source: `std/foundation/file.hal:87`

## `walk`

defn · `[path]`

Returns a promise of every regular file below path in deterministic order.

Source: `std/foundation/file.hal:93`

## `mkdir`

defn · `[path]`

Returns a promise after creating path and missing parent directories.

Source: `std/foundation/file.hal:99`

## `delete`

defn · `[path]`

Returns a promise after deleting a file or empty directory.

Source: `std/foundation/file.hal:105`
