---
title: std.foundation.string
description: Generated API reference for std.foundation.string.
---

# `std.foundation.string`

Generated from `std/foundation/string.hal` and its companion tests. 28 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `length`

defn · `[value]`

Returns the portable character count of value.

Source: `std/foundation/string.hal:30`

## `blank?`

defn · `[value]`

Returns true when value is empty or contains only whitespace.

Source: `std/foundation/string.hal:36`

## `includes?`

defn · `[value part]`

Returns true when value contains part.

Source: `std/foundation/string.hal:42`

## `starts-with?`

defn · `[value part]`

Returns true when value begins with part.

Source: `std/foundation/string.hal:48`

## `ends-with?`

defn · `[value part]`

Returns true when value ends with part.

Source: `std/foundation/string.hal:54`

## `char-at`

defn · `[value index]`

Returns the character at index as a one-character string.

Source: `std/foundation/string.hal:60`

## `slice`

defn

Returns the portion of value from start up to optional end.

Source: `std/foundation/string.hal:66`

## `index-of`

defn

Returns the first index of part at or after optional offset.

Source: `std/foundation/string.hal:75`

## `last-index-of`

defn

Returns the last index of part, optionally bounded by offset.

Source: `std/foundation/string.hal:84`

## `join`

defn · `[separator values]`

Joins values into one string, placing separator between adjacent items.

Source: `std/foundation/string.hal:93`

## `split`

defn · `[value separator]`

Splits value around separator and returns the resulting strings.

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

## `upper`

defn · `[value]`

Returns value converted to uppercase.

Source: `std/foundation/string.hal:147`

## `lower`

defn · `[value]`

Returns value converted to lowercase.

Source: `std/foundation/string.hal:153`

## `capitalize`

defn · `[value]`

Uppercases value's first character according to the native contract.

Source: `std/foundation/string.hal:159`

## `decapitalize`

defn · `[value]`

Lowercases value's first character according to the native contract.

Source: `std/foundation/string.hal:165`

## `pad-left`

defn · `[value length padding]`

Prepends padding until value reaches length.

Source: `std/foundation/string.hal:171`

## `pad-right`

defn · `[value length padding]`

Appends padding until value reaches length.

Source: `std/foundation/string.hal:177`

## `reverse`

defn · `[value]`

Returns value with its portable character order reversed.

Source: `std/foundation/string.hal:183`

## `encode-utf8`

defn · `[value]`

Encodes value as UTF-8 bytes.

Source: `std/foundation/string.hal:189`

## `decode-utf8`

defn · `[value]`

Decodes UTF-8 bytes into a string.

Source: `std/foundation/string.hal:195`

## `to-fixed`

defn · `[value precision]`

Formats numeric value with exactly precision fractional digits.

Source: `std/foundation/string.hal:201`
