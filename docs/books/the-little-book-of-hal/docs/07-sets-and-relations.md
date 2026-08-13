---
title: 07 — Sets and Relations
hara_kernel_loading: auto
---

# 07 — Sets and Relations

**Question:** When is an ordered collection also a set?

**Answer:** When no value occurs more than once.

Hara already has a native set value, but rebuilding the idea from vectors makes
the membership and recursion rules visible. We can then compare the derived
operations with the language's persistent collection contracts.

<div class="hara-lesson" data-hara-lesson="little-hal-07-v1" data-hara-lesson-title="Sets and Relations" data-hara-session-group="little-hal-07" data-hara-sequential="true">

<div class="hara-lesson-step" data-hara-lesson-step="recognise-and-build-a-set" data-hara-step-title="Recognise and build a set" data-hara-completion="run-edit-run">

## Recognise and build a set

**Question:** How can the first value reveal a duplicate?

**Answer:** Search for it in the rest of the collection.

```hara eval group=little-hal-07
(do
  (defn member-value? [target values]
    (cond
      (empty? values) false
      (= target (first values)) true
      :else (member-value? target (rest values))))

  (defn set-vector? [values]
    (cond
      (empty? values) true
      (member-value? (first values) (rest values)) false
      :else (set-vector? (rest values))))

  (defn make-set-vector [values]
    (cond
      (empty? values) []
      (member-value? (first values) (rest values))
      (make-set-vector (rest values))
      :else
      (vec
        (cons (first values)
              (make-set-vector (rest values))))))

  {:set? (set-vector? [:apple :peach :pear :plum])
   :duplicate? (set-vector? [:apple :peach :apple :plum])
   :made (make-set-vector [:apple :peach :pear :peach :plum :apple])})
```

This version keeps the final occurrence of a duplicate. A different local rule
could keep the first occurrence instead.

Run it, add another duplicate, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="compare-and-combine-sets" data-hara-step-title="Compare and combine sets" data-hara-completion="run-edit-run">

## Compare and combine sets

**Question:** What does it mean for every value in one set to belong to another?

**Answer:** Each first value must be a member, and the same must hold for the
rest.

```hara eval group=little-hal-07
(do
  (defn member-value? [target values]
    (cond
      (empty? values) false
      (= target (first values)) true
      :else (member-value? target (rest values))))

  (defn subset-vector? [left right]
    (if (empty? left)
      true
      (and (member-value? (first left) right)
           (subset-vector? (rest left) right))))

  (defn union-vectors [left right]
    (cond
      (empty? left) (vec right)
      (member-value? (first left) right)
      (union-vectors (rest left) right)
      :else
      (vec
        (cons (first left)
              (union-vectors (rest left) right)))))

  {:subset (subset-vector? [:read :test]
                           [:read :build :test :publish])
   :union (union-vectors [:read :build]
                         [:build :test :publish])
   :native #{:read :build :test :publish}})
```

The native set literal states the uniqueness contract directly. The recursive
versions explain how membership-based operations can be derived.

Run it, change either side, and run it again.

</div>

<div class="hara-lesson-step" data-hara-lesson-step="reverse-a-relation" data-hara-step-title="Reverse a relation" data-hara-completion="run-edit-run">

## Reverse a relation

**Question:** What is a relation in this small model?

**Answer:** A vector of two-value pairs.

```hara eval group=little-hal-07
(do
  (defn member-value? [target values]
    (cond
      (empty? values) false
      (= target (first values)) true
      :else (member-value? target (rest values))))

  (defn set-vector? [values]
    (cond
      (empty? values) true
      (member-value? (first values) (rest values)) false
      :else (set-vector? (rest values))))

  (defn reverse-pair [pair]
    [(second pair) (first pair)])

  (defn reverse-relation [relation]
    (map reverse-pair relation))

  (defn function-relation? [relation]
    (set-vector? (map first relation)))

  (let [relation [[:cyan :yellow]
                  [:opal :gold]
                  [:indigo :white]]]
    {:function? (function-relation? relation)
     :reversed (reverse-relation relation)}))
```

A relation behaves like a function when its first components are unique. Reverse
the pairs and the same test asks whether the original outputs were unique.

Run it, duplicate a first or second component, and run it again.

</div>

</div>

## Let the contract choose the representation

A vector is useful while order and duplicates are part of the exercise. A Hara
set is clearer once uniqueness is the intended public contract. A map is often
the best representation when a relation is already known to be a function.

[Back to Forms Have Meaning →](06-forms-have-meaning.md){ .md-button }
[Continue to Functions Make Functions →](08-functions-make-functions.md){ .md-button .md-button--primary }
