# 06. Bytes and strings

A string represents text. Bytes represent binary storage.

Text must be encoded before a byte-oriented API can write or send it. Bytes must be decoded before text functions can interpret them.

Hara uses UTF-8 for string encoding and decoding.

## Learning goals

By the end of this lesson, you can:

1. Build and transform strings.
2. Join, trim, and normalize text.
3. Encode a string as UTF-8 bytes.
4. Decode UTF-8 bytes as a string.
5. Read signed and unsigned byte views.
6. Update, copy, and slice byte buffers.
7. Keep text and binary boundaries explicit.

## Strings are immutable text

Create a string literal:

```hara
"HAL"
```

Combine values with `str`:

```hara
(str "line=" 42)
; => "line=42"
```

`str` converts its arguments to text and concatenates them.

The result is a new string. Existing strings do not change.

## Trim text

Use `str/trim` to remove leading and trailing whitespace:

```hara
(str/trim "  HAL  ")
; => "HAL"
```

Store the result when later code needs the cleaned value:

```hara
(def raw-line "  Alpha  ")
(def clean-line (str/trim raw-line))
```

`raw-line` still contains its original spaces.

## Normalize case

Convert text to lower case:

```hara
(str/to-lower "HARA")
; => "hara"
```

Use one normalization rule before comparison:

```hara
(defn normalized-name [value]
  (str/to-lower (str/trim value)))

(= (normalized-name " Hara ")
   (normalized-name "HARA"))
; => true
```

Case normalization is not a complete Unicode identity or locale policy. Use it only when the application contract calls for this comparison.

## Join string values

Use `str/join` to place a separator between values:

```hara
(str/join "," ["alpha" "beta" "gamma"])
; => "alpha,beta,gamma"
```

Build an output line from stable fields:

```hara
(defn record-line [record]
  (str/join "\t"
    [(:line/number record)
     (:line/text record)]))
```

Use an explicit separator. Do not rely on printed collection syntax as a file format.

## Newlines are data

A newline inside a string is represented with an escape:

```hara
"first\nsecond"
```

Append one line terminator at the output boundary:

```hara
(defn terminated-line [line]
  (str line "\n"))
```

Keep the internal line value and the serialized line representation distinct.

## Encode text as bytes

Use `str/encode` to encode a string as UTF-8:

```hara
(def encoded
  (str/encode "Hara"))
```

The result is a bytes value.

Count its byte length:

```hara
(bytes/count encoded)
; => 4
```

Character count and byte count can differ:

```hara
(def word "café")

(count word)
(bytes/count (str/encode word))
```

UTF-8 uses more than one byte for many non-ASCII characters.

Use byte count for file sizes, protocol lengths, and storage limits. Use text length only when the application contract defines what a text unit means.

## Decode bytes as text

Use `str/decode` to decode UTF-8 bytes:

```hara
(str/decode encoded)
; => "Hara"
```

Round-trip text through UTF-8:

```hara
(def original "HAL")
(def round-trip
  (str/decode (str/encode original)))

(= original round-trip)
; => true
```

Decoding requires valid input under the string library contract. Do not assume arbitrary binary data is text.

## Create bytes directly

Use `bytes` to create mutable binary storage:

```hara
(def packet
  (bytes 72 97 114 97))
```

Input values accept the checked range from `-128` through `255`.

Readable bytes print with the bytes constructor form:

```hara
(bytes 1 2 -3)
```

## Read unsigned byte values

`bytes/get` returns an unsigned value from `0` through `255`:

```hara
(bytes/get packet 0)
; => 72
```

It can accept a fallback for an invalid index:

```hara
(bytes/get packet 100 nil)
; => nil
```

Without a fallback, an invalid index reports a bounds error.

## Signed protocol view

The ordinary indexed protocol preserves signed byte storage:

```hara
(def signed-sample
  (bytes -1 0 1))

(nth signed-sample 0)
; => -1

(bytes/get signed-sample 0)
; => 255
```

The stored bits are the same. The operation chooses the signed or unsigned view.

Use `bytes/u8` and `bytes/s8` when code must state the conversion explicitly.

## Update bytes

Bytes are mutable:

```hara
(def mutable-packet
  (bytes 1 2 3))

(bytes/set mutable-packet 1 42)
(bytes/get mutable-packet 1)
; => 42
```

`bytes/set` mutates and returns the same byte-buffer identity.

Do not treat bytes like a persistent vector.

## Copy bytes

Create independent storage with `bytes/copy`:

```hara
(def packet-copy
  (bytes/copy mutable-packet))
```

Update the copy:

```hara
(bytes/set packet-copy 0 99)
```

The original buffer retains its original first byte.

Copy when another component needs ownership of an independent mutable buffer.

## Slice bytes

Create a selected byte range:

```hara
(def header
  (bytes/slice mutable-packet 0 2))
```

The slice allocates independent storage.

Use a slice for a protocol field, file segment, prefix, or bounded decoder input.

## Bytes use content equality

Bytes have mutable identity, but their equality and hashing contract uses byte content.

```hara
(= (bytes 1 2 3)
   (bytes 1 2 3))
; => true
```

Be careful when a mutable bytes value is used where stable hashing matters. A later mutation can change its content.

Copy or freeze the data into a stable representation before long-lived keyed use.

## Text pipeline boundary

A common file pipeline has four stages:

```text
file bytes
-> UTF-8 decode
-> string transformations
-> UTF-8 encode
-> output bytes
```

Represent each conversion explicitly:

```hara
(defn transform-text-bytes [input-bytes]
  (-> input-bytes
      (str/decode)
      (str/trim)
      (str/to-lower)
      (str "\n")
      (str/encode)))
```

The returned value is bytes, ready for a byte-oriented file or socket API.

## Build the course encoder

Create a serialized line:

```hara
(defn encode-output-line [line-number line]
  (str/encode
    (str/join "\t"
      [line-number
       (normalize-line line)
       "\n"])))
```

Inspect the result:

```hara
(def output-bytes
  (encode-output-line 1 " Alpha "))

(bytes/count output-bytes)
(str/decode output-bytes)
```

Record the actual byte count in the run state:

```hara
(swap! run add-line (bytes/count output-bytes))
```

The state now records transport size rather than an assumed character count.

## Practice loop

1. Predict a string result.
2. Encode it.
3. Inspect each byte with `bytes/get`.
4. Decode it.
5. Change one non-ASCII character.
6. Compare character count and byte count.
7. Copy the bytes and mutate only the copy.

## Common mistakes

### Passing a string to a byte API

Encode the string first.

### Decoding arbitrary binary data

Only decode bytes that the surrounding contract identifies as text.

### Assuming character count equals byte count

Use `bytes/count` after encoding.

### Forgetting byte mutation

Copy a byte buffer when independent ownership matters.

### Mixing signed and unsigned views

Use `bytes/get` for unsigned values and explicit conversion functions when the representation matters.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. Why are strings and bytes separate value categories?
2. Which encoding does Hara use for string conversion?
3. Why can text length and byte length differ?
4. What range does `bytes/get` return?
5. How does `nth` expose a stored negative byte?
6. Why should a byte buffer be copied?
7. What value type should a file write operation receive?

Continue with [07. I/O and files](07-io-and-files.md).
