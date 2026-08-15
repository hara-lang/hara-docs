<!-- hara-api:generated -->
---
title: std.foundation.promise
description: Generated API reference for std.foundation.promise.
---

# `std.foundation.promise`

Generated from `std/foundation/promise.hal` and its companion tests. 11 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `run`

defn · `[function]`

Runs function asynchronously and returns its promise.

Source: `std/foundation/promise.hal:41`

## `new`

defn · `[executor]`

Creates a promise controlled by executor.

Source: `std/foundation/promise.hal:47`

## `from`

defn · `[value]`

Returns a settled promise containing value.

Source: `std/foundation/promise.hal:53`

## `all`

defn · `[values]`

Returns a promise of all values after every input succeeds.

Source: `std/foundation/promise.hal:59`

## `delay`

defn · `[milliseconds function]`

Runs function after milliseconds and returns its promise.

Source: `std/foundation/promise.hal:65`

## `state`

defn · `[promise]`

Returns promise's scheduler state.

Source: `std/foundation/promise.hal:71`

## `value`

defn · `[promise]`

Returns promise's settled value or provider-specific failure.

Source: `std/foundation/promise.hal:77`

## `then`

defn · `[promise function]`

Chains function after promise succeeds.

Source: `std/foundation/promise.hal:83`

## `catch`

defn · `[promise function]`

Chains function after promise fails.

Source: `std/foundation/promise.hal:89`

## `finally`

defn · `[promise function]`

Chains cleanup function after promise settles.

Source: `std/foundation/promise.hal:95`

## `cancel`

defn · `[promise]`

Requests best-effort cancellation of promise.

Source: `std/foundation/promise.hal:101`
