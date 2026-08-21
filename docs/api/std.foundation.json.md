<!-- hara-api:generated -->
---
title: std.foundation.json migration
description: Migration guidance for the former std.foundation.json API.
---

# `std.foundation.json`

Status: `moved`.

Current direction: native-static-object `Json`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Remove the old dependency; Json is a built-in static object.

## Update calls

Replace std.foundation.json/... with Json/....

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
