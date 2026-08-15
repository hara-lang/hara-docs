<!-- hara-api:generated -->
---
title: std.foundation.set migration
description: Migration guidance for the former std.foundation.set API.
---

# `std.foundation.set`

Status: `moved`.

Current direction: namespace-root `std.foundation`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Remove the old dependency; retained set operations resolve from std.foundation.

## Update calls

Replace std.foundation.set/union and related calls with std.foundation/union or referred root operations.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
