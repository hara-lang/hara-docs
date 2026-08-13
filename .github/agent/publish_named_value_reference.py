from pathlib import Path

path = Path("docs/reference/l0-language.md")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        "`defstruct`, `defprotocol`, `extend-type`, `field`, and\n`apply`.",
        "`defstruct`, `defmutable`, `defprotocol`, `extend-type`, `field`, and\n`apply`.",
    ),
    (
        "multifunctions, and `defstruct` constructors.",
        "multifunctions, and `defstruct` or `defmutable` constructors.",
    ),
    (
        "`defstruct` is Hara's primitive immutable struct form.",
        "`defstruct` is Hara's primitive immutable named-value form; `defmutable` is its fixed-shape reference-identity counterpart.",
    ),
]
for old, new in replacements:
    if text.count(old) != 1:
        raise SystemExit(f"expected one anchor, found {text.count(old)}: {old!r}")
    text = text.replace(old, new, 1)

matrix_anchor = "| Mutable Hara collections and `array`/`object` markers | supported only by their declared protocols or restricted dot methods | mutation returns the same identity and is immediately visible | declared collection protocols only | arrays support indexed access; objects use string keys | declared protocol only |"
matrix_rows = "\n".join(
    [
        "| Immutable named structs | keyword invocation and `get` read declared fields | `assoc`, `assoc-in`, `update`, and `update-in` return the same struct type; `dissoc` of a declared field returns a plain persistent map | `count` is the declared width; `empty` preserves the type with nil fields | unsupported | declared field order |",
        "| `defmutable` named values | keyword invocation, `get`, and `field` read declared fields | persistent updates are rejected; `(set! (field value :name) replacement)` mutates the existing identity | `count` is the declared width; `empty` is not a mutable update operation | unsupported | declared field order |",
        matrix_anchor,
    ]
)
if text.count(matrix_anchor) != 1:
    raise SystemExit(f"expected one collection matrix anchor, found {text.count(matrix_anchor)}")
text = text.replace(matrix_anchor, matrix_rows, 1)

old = "\n".join(
    [
        "`defstruct` creates immutable `HaraStruct` values. Struct metadata is separate",
        "from fields and survives `with-meta`; metadata does not affect value equality",
        "or hashing. `IFn` is a language protocol and can be extended to structs.",
        "`defmulti`/`defmethod` dispatch by Hara equality and support `:default`.",
    ]
)
new = "\n".join(
    [
        "### 7.3 Immutable and mutable named values",
        "",
        "`defstruct` and `defmutable` use parallel declaration and constructor shapes:",
        "",
        "```hara",
        "(defstruct Point [x y])",
        "(defmutable Cursor [x y])",
        "",
        "(Point 1 2)",
        "(->Point 1 2)",
        "(map->Point {:x 1 :y 2})",
        "",
        "(Cursor 1 2)",
        "(->Cursor 1 2)",
        "(map->Cursor {:x 1 :y 2})",
        "```",
        "",
        "An immutable struct is backed by Hara's persistent map implementation while its",
        "type descriptor retains declared field order. Keyword invocation and `get` read",
        "fields. `assoc`, `assoc-in`, `update`, and `update-in` accept declared fields",
        "only, return the same struct type, preserve the receiver, and use structural",
        "sharing. A map constructor supplies `nil` for a missing declared field and",
        "ignores extra keys. Removing a declared field with `dissoc` returns a plain",
        "persistent map. `empty` preserves the struct type and supplies `nil` for every",
        "declared field. The `field` special form rejects immutable structs; use",
        "`(:x value)` or `(get value :x)` instead. Struct equality and hashing include",
        "type identity and field values.",
        "",
        "A mutable named value has fixed declared fields and reference identity. `field`",
        "reads a field and is a settable place:",
        "",
        "```hara",
        "(field cursor :x)",
        "(set! (field cursor :x) 10)",
        "```",
        "",
        "The receiver and replacement are each evaluated once, from left to right.",
        "Mutation is visible through aliases and `set!` returns the replacement value.",
        "Keyword lookup, `get`, `keys`, `vals`, `count`, and iteration are supported.",
        "`assoc`, `dissoc`, and persistent nested updates reject mutable values. Use",
        "`(into {} value)` for a shallow persistent-map snapshot; later mutation does",
        "not alter that snapshot. Mutable equality and hashing use reference identity,",
        "and mutable named values are not HTA-serializable or session-transferable.",
        "",
        "Metadata, `instance?`, inline protocol clauses, `extend-type`, callable `IFn`,",
        "typed catch matching, and polyglot member access apply consistently to both",
        "named-value families without changing their persistence or identity rules.",
        "`defmulti`/`defmethod` dispatch by Hara equality and support `:default`.",
    ]
)
if text.count(old) != 1:
    raise SystemExit(f"expected one named-value paragraph, found {text.count(old)}")
path.write_text(text.replace(old, new, 1), encoding="utf-8")
