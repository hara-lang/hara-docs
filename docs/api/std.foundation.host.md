---
title: std.foundation.host
description: Generated API reference for std.foundation.host.
---

# `std.foundation.host`

Generated from `std/foundation/host.hal` and its companion tests. 4 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `call`

defn · `[service method & args]`

Invokes a capability-gated host operation and returns its promise.

Source: `std/foundation/host.hal:17`

## `describe`

defn · `[]`

Returns a promise of the host descriptor: version, capability names, scopes, and limits.

Source: `std/foundation/host.hal:23`

## `capabilities`

defn · `[]`

Returns a promise of the capability names granted to this session.

Source: `std/foundation/host.hal:29`

## `capability?`

defn · `[capability]`

Returns a promise of whether capability is granted to this session.

Source: `std/foundation/host.hal:35`
