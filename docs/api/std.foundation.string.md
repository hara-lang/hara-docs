<!-- hara-api:generated -->
---
title: std.foundation.string
description: Generated API reference for std.foundation.string.
---

# `std.foundation.string`

Generated from `std/foundation/string.hal` and its companion tests. 42 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `209ffd3f8ac596b02290cd73663a75f1918ff436` (`209ffd3f8ac596b02290cd73663a75f1918ff436`).

Semantic surface: `sha256:8fdb5fafde7b0c29b1a01b2d7f7f9dfae037aa35ac622a9f277840bd4c8db95e`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `length`

defn · `[value]`

Returns the portable character count of value.

Source: `std/foundation/string.hal:10`

## `blank?`

defn · `[value]`

Returns true when value is nil, empty, or contains only whitespace.

Source: `std/foundation/string.hal:16`

## `includes?`

defn · `[value part]`

Returns true when value contains part.

Source: `std/foundation/string.hal:24`

## `starts-with?`

defn · `[value part]`

Returns true when value begins with part.

Source: `std/foundation/string.hal:30`

## `ends-with?`

defn · `[value part]`

Returns true when value ends with part.

Source: `std/foundation/string.hal:36`

## `char-at`

defn · `[value index]`

Returns the character at index as a one-character string.

Source: `std/foundation/string.hal:42`

## `slice`

defn

Returns the portion of value from start up to optional end.

Source: `std/foundation/string.hal:48`

## `index-of`

defn

Returns the first index of part at or after optional offset.

Source: `std/foundation/string.hal:57`

## `last-index-of`

defn

Returns the last index of part, optionally bounded by offset.

Source: `std/foundation/string.hal:66`

## `join`

defn · `[separator values]`

Joins values into one string, placing separator between adjacent items.

Source: `std/foundation/string.hal:75`

## `split`

defn · `[value separator]`

Splits value around separator and returns the resulting strings.

Source: `std/foundation/string.hal:81`

## `split-lines`

defn · `[value]`

Splits value at portable line boundaries.

Source: `std/foundation/string.hal:87`

## `repeat`

defn · `[value count]`

Returns value repeated count times.

Source: `std/foundation/string.hal:93`

## `replace`

defn · `[value match replacement]`

Replaces every occurrence of match in value with replacement.

Source: `std/foundation/string.hal:99`

## `replace-first`

defn · `[value match replacement]`

Replaces the first occurrence of match in value with replacement.

Source: `std/foundation/string.hal:105`

## `trim`

defn · `[value]`

Removes leading and trailing whitespace from value.

Source: `std/foundation/string.hal:111`

## `trim-left`

defn · `[value]`

Removes leading whitespace from value.

Source: `std/foundation/string.hal:117`

## `trim-right`

defn · `[value]`

Removes trailing whitespace from value.

Source: `std/foundation/string.hal:123`

## `trim-newlines`

defn · `[value]`

Removes trailing newline and carriage-return characters from value.

Source: `std/foundation/string.hal:129`

## `upper-case`

defn · `[value]`

Returns value converted to uppercase.

Source: `std/foundation/string.hal:142`

## `lower-case`

defn · `[value]`

Returns value converted to lowercase.

Source: `std/foundation/string.hal:148`

## `upper`

defn · `[value]`

Compatibility alias for upper-case.

Source: `std/foundation/string.hal:154`

## `lower`

defn · `[value]`

Compatibility alias for lower-case.

Source: `std/foundation/string.hal:160`

## `capital-case`

defn · `[value]`

Uppercases the first character and lowercases the remainder.

Source: `std/foundation/string.hal:166`

## `capitalize`

defn · `[value]`

Uppercases value's first character according to the native contract.

Source: `std/foundation/string.hal:178`

## `decapitalize`

defn · `[value]`

Lowercases value's first character according to the native contract.

Source: `std/foundation/string.hal:184`

## `pad-left`

defn · `[value length padding]`

Prepends padding until value reaches length.

Source: `std/foundation/string.hal:190`

## `pad-right`

defn · `[value length padding]`

Appends padding until value reaches length.

Source: `std/foundation/string.hal:196`

## `reverse`

defn · `[value]`

Returns value with its portable character order reversed.

Source: `std/foundation/string.hal:202`

## `encode-utf8`

defn · `[value]`

Encodes value as UTF-8 bytes.

Source: `std/foundation/string.hal:208`

## `decode-utf8`

defn · `[value]`

Decodes UTF-8 bytes into a string.

Source: `std/foundation/string.hal:214`

## `tag`

defn

Returns portable tag text and concatenates additional values without a separator.

Source: `std/foundation/string.hal:238`

## `escape`

defn · `[value replacements]`

Replaces each one-character string found in replacements.

Source: `std/foundation/string.hal:251`

## `caseless=`

defn · `[left right]`

Returns true when values are equal after lowercase conversion.

Source: `std/foundation/string.hal:267`

## `replace-at`

defn · `[value index replacement]`

Replaces the character at a portable Unicode index.

Source: `std/foundation/string.hal:274`

## `insert-at`

defn · `[value index replacement]`

Inserts replacement at a portable Unicode index.

Source: `std/foundation/string.hal:282`

## `camel-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to camelCase.

Source: `std/foundation/string.hal:351`

## `pascal-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to PascalCase.

Source: `std/foundation/string.hal:364`

## `snake-case`

defn · `[value]`

Converts spaces, hyphens, and camel humps to snake_case.

Source: `std/foundation/string.hal:374`

## `spear-case`

defn · `[value]`

Converts spaces, underscores, and camel humps to spear-case.

Source: `std/foundation/string.hal:380`

## `dot-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to dot.case.

Source: `std/foundation/string.hal:386`

## `to-fixed`

defn · `[value precision]`

Formats numeric value with exactly precision fractional digits.

Source: `std/foundation/string.hal:392`
