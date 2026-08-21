<!-- hara-api:generated -->
---
title: std.foundation.bytes
description: Generated API reference for std.foundation.bytes.
---

# `std.foundation.bytes`

Generated from `std/foundation/bytes.hal` and its companion tests. 7 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

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

Source: `std/foundation/bytes.hal:48`

## `copy`

defn · `[value]`

Returns an independent byte-buffer copy of value.

Source: `std/foundation/bytes.hal:54`

## `slice`

defn

Returns the bytes from start up to optional end.

Source: `std/foundation/bytes.hal:60`

## `u8`

defn · `[value]`

Coerces value to its unsigned eight-bit representation.

Source: `std/foundation/bytes.hal:70`

## `s8`

defn · `[value]`

Coerces value to its signed eight-bit representation.

Source: `std/foundation/bytes.hal:76`
