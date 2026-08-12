---
title: std.foundation.kernel
description: Generated API reference for std.foundation.kernel.
---

# `std.foundation.kernel`

Generated from `std/foundation/kernel.hal` and its companion tests. 16 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `session-create`

defn · `[name]`

Creates an isolated evaluator session named name.

Source: `std/foundation/kernel.hal:34`

## `session-close`

defn · `[name]`

Closes a non-ROOT evaluator session and releases its attached state.

Source: `std/foundation/kernel.hal:40`

## `session-list`

defn · `[]`

Returns the names of every live evaluator session.

Source: `std/foundation/kernel.hal:46`

## `session-info`

defn · `[name]`

Returns lifecycle, namespace, and attachment information for session.

Source: `std/foundation/kernel.hal:52`

## `session-eval`

defn · `[name source]`

Evaluates HAL source in session and returns transferable immutable data.

Source: `std/foundation/kernel.hal:58`

## `session-namespace`

defn · `[name]`

Returns session's current namespace symbol.

Source: `std/foundation/kernel.hal:64`

## `session-complete`

defn · `[name prefix]`

Returns completion candidates for prefix in session's current namespace.

Source: `std/foundation/kernel.hal:70`

## `resource-register`

defn · `[name source]`

Registers executable HAL source under name for subsequent session requires.

Source: `std/foundation/kernel.hal:76`

## `resource-remove`

defn · `[name]`

Removes the registered HAL resource named name.

Source: `std/foundation/kernel.hal:82`

## `resource-list`

defn · `[]`

Returns the names of registered HAL resources.

Source: `std/foundation/kernel.hal:88`

## `filesystem-create`

defn · `[options]`

Creates an opaque filesystem handle according to options.

Source: `std/foundation/kernel.hal:94`

## `filesystem-attach`

defn · `[session filesystem]`

Attaches filesystem to session without resetting evaluator state.

Source: `std/foundation/kernel.hal:100`

## `filesystem-detach`

defn · `[session]`

Detaches and returns session's filesystem handle.

Source: `std/foundation/kernel.hal:106`

## `filesystem-info`

defn · `[filesystem]`

Returns descriptive state for filesystem without exposing its host object.

Source: `std/foundation/kernel.hal:112`

## `filesystem-close`

defn · `[filesystem]`

Closes an unattached filesystem and releases its host resources.

Source: `std/foundation/kernel.hal:118`

## `capabilities`

defn · `[]`

Returns the host kernel's supported operations and availability policy.

Source: `std/foundation/kernel.hal:124`
