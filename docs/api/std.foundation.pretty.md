<!-- hara-api:generated -->
---
title: std.foundation.pretty
description: Generated API reference for std.foundation.pretty.
---

# `std.foundation.pretty`

Generated from `std/foundation/pretty.hal` and its companion tests. 13 public definitions.

Documented source: `https://github.com/hara-lang/hara` at `e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366` (`e8ed43f532fe6dc3c5c78d07b92ca6b1bf9d5366`).

Semantic surface: `sha256:d2d75c2ab58bee209afa64942ab431c346cb58a68df271a479811cda55ad4e60`. Manifest schema: `2`.

> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.

Runtime profiles: `jvm`, `rust`, `wasm`.

## `default-options`

def

No source docstring is currently provided.

Source: `std/foundation/pretty.hal:13`

## `CanonicalVisitor`

defstruct · `[options]`

No source docstring is currently provided.

Source: `std/foundation/pretty.hal:20`

## `CanonicalVisitor`

def

No source docstring is currently provided.

Source: `std/foundation/pretty.hal:21`

## `PrettyVisitor`

defstruct · `[options]`

No source docstring is currently provided.

Source: `std/foundation/pretty.hal:26`

## `PrettyVisitor`

def

No source docstring is currently provided.

Source: `std/foundation/pretty.hal:27`

## `canonical-printer`

defn

Returns a canonical EDN visitor configured with options.

Source: `std/foundation/pretty.hal:160`

## `pretty-printer`

defn

Returns an annotated pretty-print visitor configured with options.

Source: `std/foundation/pretty.hal:169`

## `format-doc-edn`

defn · `[visitor value]`

Encodes value through visitor without adding metadata decoration.

Source: `std/foundation/pretty.hal:178`

## `format-doc`

defn

Formats value as a document, using the default pretty visitor when omitted.

Source: `std/foundation/pretty.hal:184`

## `render`

defn

Renders document to a string with optional Document rendering options.

Source: `std/foundation/pretty.hal:201`

## `write`

defn

Renders document and writes it through the portable Printer boundary.

Source: `std/foundation/pretty.hal:208`

## `pprint-str`

defn

Pretty-formats value to a width-sensitive string.

Source: `std/foundation/pretty.hal:215`

## `pprint`

defn

Pretty-formats value and writes it through the portable Printer boundary.

Source: `std/foundation/pretty.hal:225`
