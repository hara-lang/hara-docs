# 02. Functions and atoms

A function transforms input values into a result. An atom stores one value that a running program can replace.

Keep these jobs separate:

- A function describes a change.
- An atom records the current value.

## Learning goals

By the end of this lesson, you can:

1. Create anonymous and named functions.
2. Read parameter vectors and return values.
3. Use local bindings.
4. Build pure state-transition functions.
5. Create and read an atom.
6. Replace atom state with `reset!` and `swap!`.
7. Keep effects outside state-transition functions.

## Anonymous functions

Use `fn` to create a function value:

```hara
(fn [line] (str/trim line))
```

The parameter vector names the inputs. The body returns its final value.

Call the function directly:

```hara
((fn [number] (+ number 1)) 41)
; => 42
```

The inner form creates the function. The outer form calls it.

## Named functions

Use `defn` to define a function in the current namespace:

```hara
(defn clean-line [line]
  (str/trim line))

(clean-line "  Hara  ")
; => "Hara"
```

Read the definition in four parts:

1. `defn` defines a function.
2. `clean-line` is the function name.
3. `[line]` is the parameter vector.
4. `(str/trim line)` is the body.

A good function name states what the returned value means.

## Functions return values

A function returns the value of its final body form:

```hara
(defn line-info [line]
  (str/trim line)
  {:line/text line
   :line/length (count line)})
```

The map is the result. The earlier trim result is discarded.

Do not place forms in a function body unless their results or effects matter.

## Local bindings

Use `let` to name intermediate values:

```hara
(defn line-record [line-number line]
  (let [cleaned (str/trim line)]
    {:line/number line-number
     :line/text cleaned
     :line/empty (empty? cleaned)}))
```

The local name `cleaned` exists only inside the `let` body.

### Dependent local values

Hara evaluates sibling `let` initializers against the enclosing lexical environment. One sibling initializer cannot depend on a new sibling binding.

Use a nested `let` when the second value needs the first:

```hara
(let [cleaned (str/trim line)]
  (let [length (count cleaned)]
    {:line/text cleaned
     :line/length length}))
```

This rule makes the dependency visible.

## Pure state transitions

A state-transition function receives an old state and returns a new state.

```hara
(defn mark-started [state]
  (assoc state :run/status :status/running))
```

The function does not know where the state is stored.

Add progress with another pure function:

```hara
(defn record-line [state]
  (update state :run/line-count inc))
```

Create the initial state:

```hara
(def initial-state
  {:run/status :status/idle
   :run/line-count 0
   :run/error nil})
```

Test a transition with plain data:

```hara
(record-line initial-state)
; => {:run/status :status/idle
;     :run/line-count 1
;     :run/error nil}
```

The original state remains unchanged.

## Create an atom

Use an atom when the program needs one replaceable current value:

```hara
(def run-state
  (atom initial-state))
```

The atom is not the state map. The atom contains the current state map.

Read the atom with `deref`:

```hara
(deref run-state)
```

The reader shorthand is `@`:

```hara
@run-state
```

Both forms return the current value.

## Replace atom state

Use `reset!` when you already have the complete next value:

```hara
(reset! run-state initial-state)
```

`reset!` returns the value that it stores.

Use `swap!` when the next value depends on the current value:

```hara
(swap! run-state mark-started)
```

`swap!` reads the current value, calls the function, and stores the returned value.

Pass additional function arguments after the function:

```hara
(defn record-error [state message]
  (assoc state
         :run/status :status/failed
         :run/error message))

(swap! run-state record-error "Input file is missing")
```

The function receives the current state first, then the extra arguments.

## Keep the transition reusable

This is easy to test:

```hara
(record-error initial-state "bad input")
```

This version hides storage inside the transformation:

```hara
(defn fail-run! [message]
  (swap! run-state record-error message))
```

The second function can be useful at an application boundary. The first function remains the reusable domain rule.

Use `!` at the end of a name when the operation changes state or performs an effect.

## Compare and set

Use `compare-and-set!` when the replacement must happen only if the atom still contains an expected value:

```hara
(compare-and-set!
  run-state
  initial-state
  (mark-started initial-state))
```

The operation returns a boolean result.

This operation is identity-sensitive for the expected atom value. Prefer `swap!` for normal state transitions.

## One atom can hold a complete model

A common design stores one coherent immutable model in one atom:

```hara
(def app-state
  (atom
    {:run/status :status/idle
     :run/line-count 0
     :run/current nil
     :run/messages []}))
```

A transition can update several related fields together:

```hara
(defn begin-line [state line-number]
  (assoc state
         :run/status :status/running
         :run/current line-number))

(swap! app-state begin-line 1)
```

This is easier to reason about than several atoms that can drift into inconsistent combinations.

## Atom state is still immutable data

The atom changes which value it contains. It does not make the contained map mutable.

```hara
(def before @app-state)
(swap! app-state record-line)
(def after @app-state)
```

`before` and `after` are separate persistent values.

This property makes history, comparison, rollback, and UI rendering easier.

## Build the course state model

Add these definitions to your course project:

```hara
(def initial-run
  {:run/status :status/idle
   :run/line-count 0
   :run/byte-count 0
   :run/current nil
   :run/error nil})

(def run
  (atom initial-run))

(defn start-run [state]
  (assoc state :run/status :status/running))

(defn add-line [state byte-count]
  (-> state
      (update :run/line-count inc)
      (update :run/byte-count + byte-count)))

(defn finish-run [state]
  (assoc state
         :run/status :status/complete
         :run/current nil))
```

Hara supports the threading macro used above. Read it as a sequence of updates to the state value.

Exercise the state:

```hara
(reset! run initial-run)
(swap! run start-run)
(swap! run add-line 12)
(swap! run add-line 8)
(swap! run finish-run)
@run
```

## Practice loop

For each transition:

1. Predict the returned state.
2. Call the function with plain data.
3. Call the same function through `swap!`.
4. Compare the plain result with the atom value.
5. Change one argument and explain the new state.

## Common mistakes

### Putting an atom inside every function

A function that accepts plain state is easier to test, reuse, and trace.

### Forgetting to dereference

```hara
run
```

This returns the atom object. Use `@run` for its current value.

### Ignoring the return value of a persistent update

```hara
(assoc @run :run/status :status/complete)
@run
```

The atom did not change. Use `swap!` or `reset!` to store a replacement.

### Mixing transformation and I/O

Do not make `record-line` also write a file. Let the function calculate state. Let an I/O boundary write bytes.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. What value does a function return?
2. Why should a transition accept plain state?
3. What does an atom contain?
4. What is the difference between `reset!` and `swap!`?
5. Why can old atom values remain useful?
6. When should a function name end in `!`?
7. Why might one atom be safer than several related atoms?

Continue with [03. Iterators and streaming](03-iterators-and-streaming.md).
