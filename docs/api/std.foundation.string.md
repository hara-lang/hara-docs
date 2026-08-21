<!-- hara-api:generated -->
---
title: std.foundation.string
description: Generated API reference for std.foundation.string.
---

# `std.foundation.string`

Generated from `std/foundation/string.hal` and its companion tests. 47 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `string-like?`

defn · `[value]`

Returns true when value can round-trip through a string representation.

Source: `std/foundation/string.hal:10`

## `to-string`

defn · `[value]`

Returns the reversible string representation of a string-like value.

Source: `std/foundation/string.hal:15`

## `from-string`

defn · `[sample text]`

Reconstructs the type of sample from text.

Source: `std/foundation/string.hal:20`

## `length`

defn · `[value]`

Returns the portable character count of value.

Source: `std/foundation/string.hal:25`

## `blank?`

defn · `[value]`

Returns true when value is nil, empty, or contains only whitespace.

Source: `std/foundation/string.hal:31`

## `includes?`

defn · `[value part]`

Returns true when value contains part.

Source: `std/foundation/string.hal:39`

## `starts-with?`

defn · `[value part]`

Returns true when value begins with part.

Source: `std/foundation/string.hal:45`

## `ends-with?`

defn · `[value part]`

Returns true when value ends with part.

Source: `std/foundation/string.hal:51`

## `char-at`

defn · `[value index]`

Returns the character at index as a one-character string.

Source: `std/foundation/string.hal:57`

## `slice`

defn

Returns the portion of value from start up to optional end.

Source: `std/foundation/string.hal:63`

## `index-of`

defn

Returns the first index of part at or after optional offset.

Source: `std/foundation/string.hal:73`

## `last-index-of`

defn

Returns the last index of part, optionally bounded by offset.

Source: `std/foundation/string.hal:83`

## `join`

defn · `[separator values]`

Joins values into one string, placing separator between adjacent items.

Source: `std/foundation/string.hal:93`

## `split`

defn · `[value separator]`

Splits value around a string or regular-expression separator.

Source: `std/foundation/string.hal:99`

## `split-lines`

defn · `[value]`

Splits value at portable line boundaries.

Source: `std/foundation/string.hal:105`

## `repeat`

defn · `[value count]`

Returns value repeated count times.

Source: `std/foundation/string.hal:111`

## `replace`

defn · `[value match replacement]`

Replaces every occurrence of match in value with replacement.

Source: `std/foundation/string.hal:117`

## `replace-first`

defn · `[value match replacement]`

Replaces the first occurrence of match in value with replacement.

Source: `std/foundation/string.hal:123`

## `trim`

defn · `[value]`

Removes leading and trailing whitespace from value.

Source: `std/foundation/string.hal:129`

## `trim-left`

defn · `[value]`

Removes leading whitespace from value.

Source: `std/foundation/string.hal:135`

## `trim-right`

defn · `[value]`

Removes trailing whitespace from value.

Source: `std/foundation/string.hal:141`

## `trim-newlines`

defn · `[value]`

Removes trailing newline and carriage-return characters from value.

Source: `std/foundation/string.hal:147`

## `upper-case`

defn · `[value]`

Returns value converted to uppercase.

Source: `std/foundation/string.hal:160`

## `lower-case`

defn · `[value]`

Returns value converted to lowercase.

Source: `std/foundation/string.hal:166`

## `upper`

defn · `[value]`

Compatibility alias for upper-case.

Source: `std/foundation/string.hal:172`

## `lower`

defn · `[value]`

Compatibility alias for lower-case.

Source: `std/foundation/string.hal:178`

## `capital-case`

defn · `[value]`

Uppercases the first character and lowercases the remainder.

Source: `std/foundation/string.hal:184`

## `capitalize`

defn · `[value]`

Uppercases value's first character according to the native contract.

Source: `std/foundation/string.hal:196`

## `decapitalize`

defn · `[value]`

Lowercases value's first character according to the native contract.

Source: `std/foundation/string.hal:202`

## `pad-left`

defn · `[value length padding]`

Prepends padding until value reaches length.

Source: `std/foundation/string.hal:208`

## `pad-right`

defn · `[value length padding]`

Appends padding until value reaches length.

Source: `std/foundation/string.hal:214`

## `reverse`

defn · `[value]`

Returns value with its portable character order reversed.

Source: `std/foundation/string.hal:220`

## `encode-utf8`

defn · `[value]`

Encodes value as UTF-8 bytes.

Source: `std/foundation/string.hal:226`

## `decode-utf8`

defn · `[value]`

Decodes UTF-8 bytes into a string.

Source: `std/foundation/string.hal:232`

## `tag`

defn

Returns portable tag text and concatenates additional values without a separator.

Source: `std/foundation/string.hal:256`

## `escape`

defn · `[value replacements]`

Replaces each one-character string found in replacements.

Source: `std/foundation/string.hal:269`

## `caseless=`

defn · `[left right]`

Returns true when values are equal after lowercase conversion.

Source: `std/foundation/string.hal:285`

## `replace-at`

defn · `[value index replacement]`

Replaces the character at a portable Unicode index.

Source: `std/foundation/string.hal:292`

## `insert-at`

defn · `[value index replacement]`

Inserts replacement at a portable Unicode index.

Source: `std/foundation/string.hal:300`

## `camel-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to camelCase.

Source: `std/foundation/string.hal:369`

## `pascal-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to PascalCase.

Source: `std/foundation/string.hal:382`

## `snake-case`

defn · `[value]`

Converts spaces, hyphens, and camel humps to snake_case.

Source: `std/foundation/string.hal:392`

## `spear-case`

defn · `[value]`

Converts spaces, underscores, and camel humps to spear-case.

Source: `std/foundation/string.hal:398`

## `dot-case`

defn · `[value]`

Converts spaces, underscores, hyphens, and camel humps to dot.case.

Source: `std/foundation/string.hal:404`

## `to-fixed`

defn · `[value precision]`

Formats numeric value with exactly precision fractional digits.

Source: `std/foundation/string.hal:410`

## `wrap`

defn

Wraps a string function so its first argument round-trips as a StringLike value.
   Pass true as return-value? for predicates and other non-string results.

Source: `std/foundation/string.hal:416`

## `wrap-compare`

defn · `[function]`

Wraps a binary string predicate for StringLike operands.

Source: `std/foundation/string.hal:437`
