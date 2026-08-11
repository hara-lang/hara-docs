# 05. Array and object

Vectors and maps are persistent values. `array` and `object` create mutable marker values.

The constructor makes the boundary explicit:

- `[]` creates a persistent vector.
- `{}` creates a persistent map.
- `array` creates a mutable indexed value.
- `object` creates a mutable string-keyed value.

The runnable examples on this page share one lesson session. Work from top to
bottom because later examples inspect and mutate values created earlier, and
reload the page to start with a clean session.

## Learning goals

By the end of this lesson, you can:

1. Create mutable arrays and objects.
2. Read and update them with restricted dot calls.
3. Explain their identity semantics.
4. Clone before independent mutation.
5. Convert data at a persistent or mutable boundary.
6. Choose a persistent collection by default.

## Create an array

Use `array` for mutable indexed storage:

```hara eval group=hal-intro-05
(def buffer
  (array "alpha" "beta" "gamma"))
```

Read an item with a dot call:

```hara eval group=hal-intro-05
(. buffer (get 1))
; => "beta"
```

The dot form is restricted to declared marker methods. It is not general host reflection.

## Update an array

Set an indexed item:

```hara eval group=hal-intro-05
(. buffer (set 1 "BETA"))
```

Read it again:

```hara eval group=hal-intro-05
(. buffer (get 1))
; => "BETA"
```

The same array identity now exposes the new value.

This differs from `assoc` on a vector:

```hara eval group=hal-intro-05
(def values ["alpha" "beta" "gamma"])
(def changed (assoc values 1 "BETA"))
```

`values` and `changed` are separate persistent vectors.

## Add and remove array items

Append an item:

```hara eval group=hal-intro-05
(. buffer (push-last "delta"))
```

Prepend an item:

```hara eval group=hal-intro-05
(. buffer (push-first "zero"))
```

Remove the final item:

```hara eval group=hal-intro-05
(. buffer (pop-last))
```

Remove the first item:

```hara eval group=hal-intro-05
(. buffer (pop-first))
```

The operations mutate the array and return according to the array method contract.

Inspect the array after each operation. Do not infer a persistent result from the method name.

## Insert, remove, and slice

Insert at an index:

```hara eval group=hal-intro-05
(. buffer (insert 1 "inserted"))
```

Remove at an index:

```hara eval group=hal-intro-05
(. buffer (remove 1))
```

Create a slice:

```hara eval group=hal-intro-05
(def section
  (. buffer (slice 0 2)))
```

The slice allocates separate array storage for the selected range.

Use `clone` when you need a complete independent copy:

```hara eval group=hal-intro-05
(def copied-buffer
  (. buffer (clone)))
```

Mutating `copied-buffer` does not mutate `buffer`.

## Array transformations

Arrays support restricted transformation methods:

```hara eval group=hal-intro-05
(. (array 1 2 3)
   (map (fn [number] (* number 2))))
```

Filter array items:

```hara eval group=hal-intro-05
(. (array 1 2 3 4)
   (filter even?))
```

Fold left:

```hara eval group=hal-intro-05
(. (array 10 20 12)
   (fold-left + 0))
; => 42
```

These are array methods. They are distinct from Hara's ordinary persistent and lazy collection functions.

## Arrays participate in selected protocols

Marker arrays support declared collection protocols such as count and indexed access:

```hara eval group=hal-intro-05
(count buffer)
(nth buffer 0)
```

Protocol support does not make the array persistent. A later mutation remains visible through the same identity.

## Create an object

Use `object` for mutable string-keyed storage:

```hara eval group=hal-intro-05
(def record
  (object
    "line" "alpha"
    "number" 1
    "valid" true))
```

Object keys are strings.

Read a key:

```hara eval group=hal-intro-05
(. record (get "line"))
; => "alpha"
```

Check a key:

```hara eval group=hal-intro-05
(. record (has? "number"))
; => true
```

## Update an object

Set a key:

```hara eval group=hal-intro-05
(. record (set "line" "ALPHA"))
```

Delete a key:

```hara eval group=hal-intro-05
(. record (delete "valid"))
```

Inspect keys and values:

```hara eval group=hal-intro-05
(. record (keys))
(. record (vals))
(. record (pairs))
```

The exact returned collection family follows the object method contract. Treat the object itself as mutable identity.

## Assign several fields

Use `assign` to copy string-keyed fields from another compatible object value:

```hara eval group=hal-intro-05
(def extra
  (object
    "status" "ready"
    "source" "input.txt"))

(. record (assign extra))
```

Inspect `record` after the call.

Use `clone` before assignment when the original object must remain independent:

```hara eval group=hal-intro-05
(def independent
  (. record (clone)))

(. independent (set "status" "changed"))
```

## Identity semantics

Persistent values compare by their data contract. Mutable marker values have identity semantics.

Two objects with the same fields are still two mutable identities:

```hara eval group=hal-intro-05
(def first-record (object "value" 42))
(def second-record (object "value" 42))
```

Do not use a mutable marker as a stable map key based only on its current contents.

A mutation can change its visible data after another component receives it.

## Keep mutation local

A good mutable boundary has one clear owner:

```hara eval group=hal-intro-05
(defn collect-three [source]
  (let [output (array)]
    (loop [remaining 3]
      (if (and (> remaining 0)
               (iter-has? source))
        (do
          (. output (push-last (iter-next source)))
          (recur (- remaining 1)))
        output))))
```

The function creates and owns the array. It returns the array only after it finishes the local mutation sequence.

For general application data, a persistent vector often produces simpler code.

## Convert at the boundary

Convert a mutable array into a persistent vector when downstream code should not observe later mutation.

One direct approach is to stream its items into an eager transform:

```hara eval group=hal-intro-05
(mapv identity buffer)
```

Convert a persistent vector into an array when a mutable API requires one:

```hara eval group=hal-intro-05
(def mutable-values
  (apply array [1 2 3]))
```

Make the conversion visible near the boundary.

For objects, copy required string-keyed fields into a persistent map:

```hara eval group=hal-intro-05
{:line/text (. record (get "line"))
 :line/number (. record (get "number"))}
```

This gives domain code stable keyword keys and persistent update semantics.

## Choose the collection from ownership

Use a persistent vector or map when:

- several parts of the program share the value;
- old versions remain useful;
- equality should depend on contents;
- state transitions should be easy to test;
- a render or trace may retain the value.

Use an array or object when:

- a host or extension API expects mutable identity;
- a local algorithm needs a mutable work buffer;
- the operation has one clear owner;
- you can convert back at the boundary;
- mutation is part of the public contract.

Do not choose mutation only to make an update expression shorter.

## Build the course batch buffer

Create a mutable buffer for a small output batch:

```hara eval group=hal-intro-05
(defn make-batch []
  (array))

(defn add-to-batch! [batch line]
  (. batch (push-last line))
  batch)

(defn batch-full? [batch limit]
  (>= (count batch) limit))
```

Use it:

```hara eval group=hal-intro-05
(def batch (make-batch))
(add-to-batch! batch "alpha")
(add-to-batch! batch "beta")
(batch-full? batch 2)
; => true
```

Convert it before storing it in persistent application state:

```hara eval group=hal-intro-05
(def batch-value
  (mapv identity batch))
```

The atom can now store a stable vector snapshot:

```hara
(swap! run assoc :run/current-batch batch-value)
```

## Practice loop

1. Create one vector and one array with the same items.
2. Update each at index `0`.
3. Inspect the original vector.
4. Inspect the original array binding.
5. Clone the array and mutate the clone.
6. Explain which values share identity.

Repeat the exercise with a map and object.

## Common mistakes

### Expecting `set` to return a new array

The method mutates the existing marker value.

### Using keyword keys in an object

Object keys are strings. Use a persistent map when keyword keys are the correct domain representation.

### Sharing a mutable marker without an owner

Document which component can mutate it and when mutation ends.

### Assuming dot calls expose the host

Dot calls are restricted to marker methods. Hara does not grant general host reflection through `.`.

### Keeping mutable data in long-lived history

Convert to a persistent value before storing snapshots, traces, or render models.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. What does `array` make explicit?
2. How does `assoc` differ from array `set`?
3. Why does an object use string keys?
4. What does identity semantics mean for mutation?
5. When should you clone a marker value?
6. Why should mutation have one clear owner?
7. When should you convert back to a persistent value?

Continue with [06. Bytes and strings](06-bytes-and-strings.md).
