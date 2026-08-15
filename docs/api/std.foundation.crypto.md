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

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
