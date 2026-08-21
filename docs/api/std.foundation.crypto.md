<!-- hara-api:generated -->
---
title: std.foundation.crypto migration
description: Migration guidance for the former std.foundation.crypto API.
---

# `std.foundation.crypto`

Status: `moved`.

Current direction: native-static-object `Crypto`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Remove the old dependency; Crypto is a built-in static object.

## Update calls

Replace std.foundation.crypto/... with Crypto/... and use verified std.crypto.* libraries for higher-level algorithms.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
