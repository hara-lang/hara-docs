---
title: 10 — The Value of a Form
hara_kernel_loading: auto
---

# 10 — The Value of a Form

**Question:** What is an evaluator?

**Answer:** A function that receives a represented form, an environment, and the
rules that connect syntax to meaning.

The evaluator in this chapter is intentionally small. It is not Hara's runtime
and it does not execute arbitrary source text. It evaluates a tiny vector-based
language whose values are already ordinary Hara data.

<div class="hara-lesson" data-hara-lesson="little-hal-10-v1" data-hara-lesson-title="The Value of a Form" data-hara-session-group="little-hal-10" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="look-up-a-name" data-hara-step-title="Look up a name" data-hara-completion="run-edit-run">

## Look up a name

**Question:** Where does a represented name get its value?

**Answer:** From an environment that associates names with values.

```hara eval group=little-hal-10
(let [environment {:+ +
                   :* *
                   :- -
                   :x 7}]
  {:x (get environment :x)
   :addition ((get environment :+) 3 4)})
```

An environment is just persistent data. It can contain ordinary values and
callable Vars.

Run it, add another name, and use it in the result.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="evaluate-literals-names-and-calls" data-hara-step-title="Evaluate literals, names, and calls" data-hara-completion="run-edit-run">

## Evaluate literals, names, and calls

**Question:** What are the first three forms in our language?

**Answer:** A literal, a name lookup, and a function call.

```hara eval group=little-hal-10
(do
  (declare evaluate)

  (defn evaluate-list [forms environment]
    (map (fn [form]
           (evaluate form environment))
         forms))

  (defn evaluate [form environment]
    (let [tag (first form)]
      (cond
        (= tag :lit)
        (second form)

        (= tag :name)
        (get environment (second form))

        (= tag :call)
        (let [function (evaluate (second form) environment)
              arguments (evaluate-list (nth form 2) environment)]
          (apply function arguments))

        :else nil)))

  (evaluate
    [:call
     [:name :+]
     [[:name :x]
      [:lit 8]]]
    {:+ +
     :x 7}))
```

The outer call evaluates its function position and each argument before using
`apply`.

Run it, replace addition with multiplication, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="add-choice-and-local-binding" data-hara-step-title="Add choice and local binding" data-hara-completion="run-edit-run">

## Add choice and local binding

**Question:** How can the small language choose a branch and introduce a local
name?

**Answer:** Add `:if` and `:let` forms to the evaluator.

```hara eval group=little-hal-10
(do
  (declare evaluate)

  (defn evaluate-list [forms environment]
    (map (fn [form]
           (evaluate form environment))
         forms))

  (defn evaluate [form environment]
    (let [tag (first form)]
      (cond
        (= tag :lit)
        (second form)

        (= tag :name)
        (get environment (second form))

        (= tag :call)
        (let [function (evaluate (second form) environment)
              arguments (evaluate-list (nth form 2) environment)]
          (apply function arguments))

        (= tag :if)
        (if (evaluate (second form) environment)
          (evaluate (nth form 2) environment)
          (evaluate (nth form 3) environment))

        (= tag :let)
        (let [name (second form)
              value-form (nth form 2)
              body-form (nth form 3)]
          (let [value (evaluate value-form environment)]
            (evaluate body-form
                      (assoc environment name value))))

        :else nil)))

  (evaluate
    [:let :x [:lit 7]
     [:if
      [:call [:name :>] [[:name :x] [:lit 5]]]
      [:call [:name :*] [[:name :x] [:lit 2]]]
      [:lit 0]]]
    {:> >
     :* *}))
```

The inner `let` is deliberate. Hara evaluates sibling `let` initialisers
against the enclosing lexical environment, so the evaluated value is bound
before the body is interpreted in the extended environment.

Run it, change the comparison or either branch, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="create-and-call-a-closure" data-hara-step-title="Create and call a closure" data-hara-completion="run-edit-run">

## Create and call a closure

**Question:** What must a represented function remember?

**Answer:** Its parameters, its body, and the environment in which it was
created.

```hara eval group=little-hal-10
(do
  (declare evaluate)

  (defn evaluate-list [forms environment]
    (map (fn [form]
           (evaluate form environment))
         forms))

  (defn bind-parameters [parameters arguments environment]
    (if (empty? parameters)
      environment
      (bind-parameters
        (rest parameters)
        (rest arguments)
        (assoc environment
               (first parameters)
               (first arguments)))))

  (defn evaluate [form environment]
    (let [tag (first form)]
      (cond
        (= tag :lit)
        (second form)

        (= tag :name)
        (get environment (second form))

        (= tag :call)
        (let [function (evaluate (second form) environment)
              arguments (evaluate-list (nth form 2) environment)]
          (apply function arguments))

        (= tag :if)
        (if (evaluate (second form) environment)
          (evaluate (nth form 2) environment)
          (evaluate (nth form 3) environment))

        (= tag :let)
        (let [name (second form)
              value-form (nth form 2)
              body-form (nth form 3)]
          (let [value (evaluate value-form environment)]
            (evaluate body-form
                      (assoc environment name value))))

        (= tag :fn)
        (let [parameters (second form)
              body (nth form 2)]
          (fn [& arguments]
            (evaluate
              body
              (bind-parameters parameters
                               arguments
                               environment))))

        :else nil)))

  (evaluate
    [:call
     [:fn [:n]
      [:call
       [:name :*]
       [[:name :n]
        [:name :n]]]]
     [[:lit 6]]]
    {:* *}))
```

The Hara function returned by the `:fn` branch closes over `environment`. When
it is later called, parameter bindings extend that captured environment before
the represented body is evaluated.

Run it, add a second parameter or capture a name from an outer `:let`, and run
it again.

</div>

</div>

## The complete path

```text
represented form
      ↓
inspect its tag
      ↓
evaluate the relevant subforms
      ↓
look up names in a persistent environment
      ↓
return an ordinary Hara value
```

You have now moved from reading values to defining the meaning of a small
language. That is the same progression the book has followed all along: inspect
a shape, ask the terminating question, recur on smaller parts, and rebuild the
answer.

[Back to Recursion Without a Name →](09-recursion-without-a-name.md){ .md-button }
[Return to The Little Book of HAL →](index.md){ .md-button .md-button--primary }
