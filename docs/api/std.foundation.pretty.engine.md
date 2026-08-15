<!-- hara-api:generated -->
---
title: std.foundation.pretty.engine migration
description: Migration guidance for the former std.foundation.pretty.engine API.
---

# `std.foundation.pretty.engine`

Status: `retired`.

Current direction: namespace `std.foundation.pretty`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Require std.foundation.pretty rather than its former implementation helper.

## Update calls

Use the public std.foundation.pretty API; internal engine functions are not a compatibility promise.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
