<!-- hara-api:generated -->
---
title: std.foundation.os migration
description: Migration guidance for the former std.foundation.os API.
---

# `std.foundation.os`

Status: `moved`.

Current direction: native-static-object `OS`.

This former name is not part of the current public Foundation namespace set.

## Update imports

Remove the old dependency and use the OS/Process boundary supported by the runtime profile.

## Update calls

Replace std.foundation.os/... with OS/... where available; retain runtime-native Process handling for process values.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This migration page is generated from Hara's canonical migration ledger.
