# 01. Basic data and immutable collections

Hara programs start with values. Most values are immutable. An operation returns a new value instead of changing the old value.

This lesson introduces scalar values, collection literals, lookup, and persistent updates.

## Learning goals

By the end of this lesson, you can:

1. Read the main Hara literal forms.
2. Distinguish a list form from a vector value.
3. Use keywords to label data.
4. Read values from vectors and maps.
5. Update a persistent collection without mutation.
6. Choose a collection from the job it performs.

## Scalar values

A scalar value is one value that is not a collection.

### Nil and booleans

Hara has one empty value and two boolean values:

```hara
nil
true
false
```

Only `nil` and `false` are falsey. Zero, an empty string, and an empty collection are truthy.

```hara
(if 0 :yes :no)
; => :yes

(if [] :yes :no)
; => :yes
```

Do not use emptiness as a boolean test. Use an explicit predicate such as `empty?`.

### Numbers

Hara supports integers and floating-point values:

```hara
42
-7
3.5
```

It also reads big integers and big decimals:

```hara
12345678901234567890N
19.95M
```

The suffix is part of the numeric literal.

Ratios are not an L0 numeric type. Division does not create a ratio value.

```hara
(/ 5 2)
```

Check the result in your current runtime before you build numeric rules around integer division.

### Strings and characters

A string contains text:

```hara
"HAL"
"line one\nline two"
```

A character is a single character value:

```hara
\a
\newline
```

Strings are immutable. String transformation functions return new strings.

### Keywords

A keyword is a stable label:

```hara
:name
:task/title
:status/ready
```

Keywords often label fields in maps. A namespaced keyword makes the domain explicit.

```hara
{:task/title "Read input"
 :task/status :status/ready}
```

### Symbols

A symbol names a Var, local binding, function, namespace, or other program entity:

```hara
score
map
file/read
```

The evaluator resolves an unquoted symbol. Quote returns the symbol itself:

```hara
'file/read
; => file/read
```

A keyword usually labels data. A symbol usually names program behavior or a binding.

## Collection literals

Hara has lists, vectors, maps, and sets.

### Lists

A list uses parentheses:

```hara
(+ 19 23)
```

In source code, the evaluator normally treats a list as a call or special form.

Quote a list when you want list data:

```hara
'(north east south west)
```

Use lists for forms and list-shaped data. Do not use a list only because HAL
uses parentheses for evaluation forms.

### Vectors

A vector uses square brackets:

```hara
["alpha" "beta" "gamma"]
```

A vector preserves order and supports indexed access:

```hara
(nth [10 20 30] 1)
; => 20
```

Indexes start at zero.

Use a vector for ordered records, argument lists, coordinates, and finite sequences that need indexed access.

### Maps

A map associates keys with values:

```hara
{:task/id 1
 :task/title "Read input"
 :task/done false}
```

Use `get` to read a key:

```hara
(get {:task/title "Read input"} :task/title)
; => "Read input"
```

A keyword can also look itself up in a map:

```hara
(:task/title {:task/title "Read input"})
; => "Read input"
```

Use a map when fields have names.

### Sets

A set contains unique values:

```hara
#{:read :transform :write}
```

Adding an existing value does not create a duplicate:

```hara
(conj #{:read :write} :read)
; => #{:read :write}
```

Use a set for membership, permissions, tags, and unique categories.

## Persistent updates

A persistent collection does not change in place. An update returns another collection.

### Add a vector item

```hara
(def steps [:read :transform])
(def next-steps (conj steps :write))

steps
; => [:read :transform]

next-steps
; => [:read :transform :write]
```

The old vector remains valid.

### Replace a map field

```hara
(def task
  {:task/id 1
   :task/title "Read input"
   :task/done false})

(def completed-task
  (assoc task :task/done true))
```

`assoc` returns a map with the selected key associated with the new value.

### Remove a map field

```hara
(dissoc task :task/title)
; => {:task/id 1 :task/done false}
```

The original `task` value still contains the title.

### Update nested data

Use `get-in` and `assoc-in` for nested paths:

```hara
(def job
  {:job/id 7
   :job/progress {:current 0 :total 3}})

(get-in job [:job/progress :total])
; => 3

(assoc-in job [:job/progress :current] 1)
```

Use `update-in` when the new value depends on the old value:

```hara
(update-in job [:job/progress :current] inc)
```

Each operation returns a new root map.

## Collection operations preserve the boundary

Persistent operations return persistent values:

```hara
(conj [1 2] 3)
(assoc {:a 1} :b 2)
(dissoc {:a 1 :b 2} :a)
```

These operations do not silently create mutable arrays or objects.

Later, you will use `array` and `object` when mutation is intentional.

## Build the course configuration

Create one immutable configuration value:

```hara
(def config
  {:input/path "data/input.txt"
   :output/path "data/output.txt"
   :pipeline/steps [:trim :remove-empty :number]
   :pipeline/tags #{:text :utf8}
   :pipeline/options
   {:skip-empty true
    :max-lines 1000}})
```

Read one value from each collection level:

```hara
(:input/path config)

(nth (:pipeline/steps config) 1)

(get-in config [:pipeline/options :max-lines])
```

Create a changed configuration without changing `config`:

```hara
(def small-config
  (assoc-in config [:pipeline/options :max-lines] 10))
```

## Practice loop

Use this sequence for each form:

1. Predict the result.
2. Run the form.
3. Change one literal.
4. Explain which value changed.

Try these changes:

1. Add another pipeline step.
2. Add a tag to the set.
3. Change the maximum line count.
4. Remove the output path.
5. Confirm that the original value remains unchanged.

## Common mistakes

### Treating parentheses as a container

```hara
(1 2 3)
```

The evaluator tries to call `1`. Quote list data or use a vector.

### Expecting `assoc` to mutate

```hara
(assoc config :input/path "other.txt")
config
```

The second form returns the original value because the first result was not stored or passed onward.

### Using truthiness for emptiness

```hara
(if [] :empty :not-empty)
; => :empty
```

This label is misleading. Empty collections are truthy. Use `empty?`.

### Mixing field names

Do not call the same field `:path`, `:file`, and `:input` in nearby examples. Choose one stable key such as `:input/path`.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. Which Hara values are falsey?
2. Why does a list often represent code?
3. When should you use a vector instead of a map?
4. What does `assoc` return?
5. Why can old and new persistent values coexist?
6. When is a set a better fit than a vector?
7. What is the difference between a keyword and a symbol?

Continue with [02. Functions and atoms](02-functions-and-atoms.md).
