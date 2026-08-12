---
title: std.foundation.coroutine
description: Generated API reference for std.foundation.coroutine.
---

# `std.foundation.coroutine`

Generated from `std/foundation/coroutine.hal` and its companion tests. 7 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `create`

defn · `[function]`

Creates a suspended coroutine from function.

Source: `std/foundation/coroutine.hal:40`

## `coroutine?`

defn · `[value]`

Returns true when value is a coroutine.

Source: `std/foundation/coroutine.hal:46`

## `status`

defn · `[coroutine]`

Returns coroutine's scheduler state.

Source: `std/foundation/coroutine.hal:52`

## `resume`

defn · `[coroutine & arguments]`

Advances coroutine, supplying optional resume arguments.

Source: `std/foundation/coroutine.hal:58`

## `close`

defn · `[coroutine]`

Closes coroutine and releases its scheduler state.

Source: `std/foundation/coroutine.hal:64`

## `yield`

defn · `[value]`

Suspends the current coroutine with value.

Source: `std/foundation/coroutine.hal:70`

## `await`

defn · `[promise]`

Suspends until promise settles, then returns or throws its result.

Source: `std/foundation/coroutine.hal:76`
