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

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
