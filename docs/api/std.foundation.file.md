<!-- hara-api:generated -->
---
title: std.foundation.file migration
description: Migration guidance for the former std.foundation.file API.
---

# `std.foundation.file`

Status: `moved`.

Current direction: native-static-object `File`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Remove the old dependency; use File for current native primitives and require std.fs only after it is present in the selected release.

## Update calls

Replace std.foundation.file/... with File/...; migrate higher-level portable operations to std.fs as that library lands.

## Planned portable layer

`std.fs` is marked `planned`; this page does not claim it is available in the documented revision.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
