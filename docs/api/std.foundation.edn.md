---
title: std.foundation.edn
description: Generated API reference for std.foundation.edn.
---

# `std.foundation.edn`

Generated from `std/foundation/edn.hal` and its companion tests. 3 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `read`

defn · `[source]`

Reads exactly one value using the restricted HAL EDN profile.

Source: `std/foundation/edn.hal:32`

## `write`

defn · `[value]`

Returns value's canonical, readable EDN representation.

Source: `std/foundation/edn.hal:38`

## `pretty`

defn · `[value opts]`

Returns value's canonical readable representation.

   Options are reserved and must currently be supplied as a map.

Source: `std/foundation/edn.hal:44`
