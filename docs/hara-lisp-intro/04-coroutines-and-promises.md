# 04. Coroutines and promises

A promise represents a result that can settle later. A coroutine represents a computation that can suspend and resume.

These concepts solve different problems:

- A promise models **when a result becomes available**.
- A coroutine models **where a computation pauses and continues**.

## Learning goals

By the end of this lesson, you can:

1. Create asynchronous work with `promise/run`.
2. Transform a successful result with `promise/then`.
3. Recover from failure with `promise/catch`.
4. Perform cleanup with `promise/finally`.
5. Create, resume, yield from, and close a coroutine.
6. Await a promise inside a coroutine.
7. Choose a promise, coroutine, or plain function for a task.

## Promises are values

A promise is a value that represents a future settlement.

Create asynchronous work:

```hara
(def answer-promise
  (promise/run
    (fn []
      (+ 19 23))))
```

The form returns a promise immediately. The promise later settles with `42` or an error.

The JVM runtime backs Hara promises with `CompletableFuture`. Other runtimes use their native promise mechanism while preserving the Hara settlement contract.

## Transform a successful result

Use `promise/then` to register the next transformation:

```hara
(def text-promise
  (promise/then
    answer-promise
    (fn [answer]
      (str "answer=" answer))))
```

The callback receives the settled value. `promise/then` returns another promise.

This creates a chain:

```text
asynchronous work
-> answer promise
-> successful callback
-> text promise
```

Do not treat the promise object as if it were the settled answer.

## Promise adoption

A promise callback can return a plain value or another promise.

A plain value settles the next promise:

```hara
(promise/then
  answer-promise
  (fn [answer]
    (+ answer 1)))
```

A returned promise is adopted. The outer chain waits for the returned promise to settle.

This lets asynchronous operations compose without nested callback trees.

## Recover from failure

Use `promise/catch` to handle a rejected promise:

```hara
(def recovered
  (promise/catch
    answer-promise
    (fn [error]
      {:result/status :status/failed
       :result/error error})))
```

The recovery callback receives the error value. Its return value settles the next promise.

Recover only where the program has enough context to choose a valid fallback or error representation.

## Run cleanup

Use `promise/finally` for cleanup that must run after success or failure:

```hara
(promise/finally
  answer-promise
  (fn []
    (swap! run assoc :run/current nil)))
```

Cleanup should not replace the original result unless the cleanup itself fails under the promise contract.

Use `finally` for release and state cleanup. Use `then` for successful transformations. Use `catch` for recovery.

## Wait for several promises

Use `promise/all` when several independent results must all settle:

```hara
(def combined
  (promise/all
    [(promise/run (fn [] 10))
     (promise/run (fn [] 20))
     (promise/run (fn [] 12))]))
```

The combined promise settles with the collected values when all input promises succeed.

A rejection rejects the combined operation. Put recovery at the level that knows whether partial results are useful.

## A promise is not an atom

An atom holds a current replaceable value. A promise settles according to an asynchronous completion contract.

Use an atom for live application state:

```hara
(def status
  (atom :status/idle))
```

Use a promise for a deferred result:

```hara
(def load-result
  (promise/run load-data))
```

Do not poll an atom to imitate promise settlement.

## Require the coroutine provider

Coroutines are available through an explicit namespace:

```hara
(ns intro.coroutines
  (:require [std.foundation.coroutine :as coroutine]))
```

The explicit `require` shows that coroutines are a provider-backed runtime service, not a core special form.

## Create a coroutine

`coroutine/create` wraps a function without starting it:

```hara
(def worker
  (coroutine/create
    (fn []
      (coroutine/yield :worker/ready)
      :worker/done)))
```

At this point, the body has not run.

Inspect its status:

```hara
(coroutine/status worker)
; => :suspended
```

## Resume and yield

Start the coroutine:

```hara
(coroutine/resume worker)
; => :worker/ready
```

The body runs until `coroutine/yield`. The yielded value returns to the resumer.

Resume it again:

```hara
(coroutine/resume worker)
; => :worker/done
```

The body continues after the yield and returns its final value.

Its status is now dead:

```hara
(coroutine/status worker)
; => :dead
```

A dead coroutine cannot restart. Create another coroutine for another run.

## Send a value back into a coroutine

`yield` returns the arguments supplied by the next resume.

```hara
(def echo-worker
  (coroutine/create
    (fn []
      (let [message
            (coroutine/yield :worker/ready)]
        {:worker/received message}))))
```

Start it:

```hara
(coroutine/resume echo-worker)
; => :worker/ready
```

Resume it with a value:

```hara
(coroutine/resume echo-worker "continue")
; => {:worker/received "continue"}
```

This creates a bidirectional control channel between the coroutine and its resumer.

Multiple yielded or resumed values are packed into vectors. A single value passes through directly.

## Yield from nested calls

A coroutine can yield from any call depth:

```hara
(defn pause-with [value]
  (coroutine/yield value))

(def nested-worker
  (coroutine/create
    (fn []
      (pause-with :phase/one)
      (pause-with :phase/two)
      :phase/done)))
```

The coroutine runtime preserves its continuation across nested calls.

This is different from returning a value. A return completes the current function call. A yield suspends the coroutine and preserves its place.

## Await a promise inside a coroutine

Use `coroutine/await` to suspend the coroutine until a promise settles:

```hara
(def async-worker
  (coroutine/create
    (fn []
      (let [answer
            (coroutine/await
              (promise/run
                (fn [] (+ 19 23))))]
        (coroutine/yield answer)
        :worker/done))))
```

Resume the coroutine to start it:

```hara
(coroutine/resume async-worker)
```

The coroutine waits for the promise without losing its local control flow. It then yields the settled value.

Plain `(coroutine/yield promise-value)` yields the promise object. It does not await settlement.

Use `coroutine/await` when the coroutine needs the settled result.

## Errors and cleanup

An error inside a coroutine rethrows at the resume site. The coroutine becomes dead.

Use `try` and `finally` inside the coroutine when it owns cleanup:

```hara
(def guarded-worker
  (coroutine/create
    (fn []
      (try
        (coroutine/yield :worker/ready)
        :worker/done
        (finally
          (swap! run assoc :run/current nil))))))
```

Close a suspended coroutine when it will not resume:

```hara
(coroutine/close guarded-worker)
```

Closing unwinds the coroutine and runs its `finally` clauses.

## Resume is synchronous

`coroutine/resume` is synchronous and single-resumer by design.

Do not resume or close the same coroutine concurrently from several threads.

A coroutine is a control-flow tool. It is not automatically a parallel worker.

Use promises for asynchronous settlement. Use the host or runtime execution facilities for actual parallel work.

## Choose the right tool

Use a plain function when all inputs are available now and the call can complete normally.

Use a promise when the result settles later:

```text
request -> promise -> success or failure
```

Use a coroutine when the computation must pause and later continue from the same point:

```text
resume -> run -> yield -> resume -> run -> return
```

Use both when a resumable workflow must wait for asynchronous results.

## Build the course workflow

Create a promise-based line transformation:

```hara
(defn transform-line-async [line]
  (promise/run
    (fn []
      (normalize-line line))))
```

Create a coroutine that processes one line per resume:

```hara
(ns intro.workflow
  (:require [std.foundation.coroutine :as coroutine]))

(defn make-line-worker [lines]
  (coroutine/create
    (fn []
      (let [source (iter lines)]
        (try
          (loop []
            (if (iter-has? source)
              (let [line (iter-next source)]
                (coroutine/yield
                  (coroutine/await
                    (transform-line-async line)))
                (recur))
              :worker/done))
          (finally
            (iter-close source)))))))
```

The worker owns its iterator. Its `finally` clause closes the iterator when the worker finishes, fails, or closes.

## Practice loop

1. Predict the first resume result.
2. Resume a coroutine once.
3. Inspect its status.
4. Resume it with a value.
5. Close a separate suspended coroutine.
6. Explain whether each pause came from a yield or a promise.

## Common mistakes

### Reading a promise as a settled value

Use `promise/then`, `promise/catch`, or `coroutine/await` to work with settlement.

### Expecting a coroutine to run at creation

`coroutine/create` wraps the body. `coroutine/resume` starts it.

### Yielding a promise instead of awaiting it

Use `(coroutine/yield (coroutine/await promise-value))` when the yielded value must be the settled result.

### Resuming one coroutine concurrently

A coroutine supports one synchronous resumer at a time.

### Forgetting cleanup on close

Put owned-resource cleanup in `finally`.

## Check yourself

You are ready for the next lesson when you can answer these questions:

1. What does a promise represent?
2. What does `promise/then` return?
3. Which promise operation handles rejection?
4. When does a coroutine body start?
5. What does `yield` preserve?
6. Why is `yield promise-value` different from `await`?
7. What happens when a suspended coroutine closes?
8. Why is a coroutine not automatically parallel?

Continue with [05. Array and object](05-array-and-object.md).