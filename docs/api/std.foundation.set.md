---
title: std.foundation.set
description: Generated API reference for std.foundation.set.
---

# `std.foundation.set`

Generated from `std/foundation/set.hal` and its companion tests. 6 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `union`

defn · `[& sets]`

Returns a set containing every value in sets.

Source: `std/foundation/set.hal:80`

## `intersection`

defn · `[first-set & sets]`

Returns the values present in every set.

Source: `std/foundation/set.hal:90`

## `difference`

defn · `[first-set & sets]`

Returns values in first-set that are absent from every remaining set.

Source: `std/foundation/set.hal:100`

## `subset?`

defn · `[left right]`

Returns true when every value in left is present in right.

Source: `std/foundation/set.hal:110`

## `superset?`

defn · `[left right]`

Returns true when every value in right is present in left.

Source: `std/foundation/set.hal:122`

## `select`

defn · `[predicate values]`

Returns the values in values for which predicate is truthy.

Source: `std/foundation/set.hal:128`
