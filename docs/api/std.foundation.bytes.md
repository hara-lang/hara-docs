---
title: std.foundation.bytes
description: Generated API reference for std.foundation.bytes.
---

# `std.foundation.bytes`

Generated from `std/foundation/bytes.hal` and its companion tests. 7 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `count`

defn · `[value]`

Returns the number of bytes in value.

Source: `std/foundation/bytes.hal:32`

## `get`

defn

Returns a byte at index, or fallback when the indexed form supplies one.

Source: `std/foundation/bytes.hal:38`

## `set`

defn · `[value index item]`

Returns value with item written at index.

Source: `std/foundation/bytes.hal:47`

## `copy`

defn · `[value]`

Returns an independent byte-buffer copy of value.

Source: `std/foundation/bytes.hal:53`

## `slice`

defn

Returns the bytes from start up to optional end.

Source: `std/foundation/bytes.hal:59`

## `u8`

defn · `[value]`

Coerces value to its unsigned eight-bit representation.

Source: `std/foundation/bytes.hal:68`

## `s8`

defn · `[value]`

Coerces value to its signed eight-bit representation.

Source: `std/foundation/bytes.hal:74`
