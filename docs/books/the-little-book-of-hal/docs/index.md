---
title: The Little Book of HAL
---

# The Little Book of HAL

A small book about learning to see programs as values, questions, and
transformations.

The chapters are written as short dialogues. Each chapter gives you a few forms
to predict, run, change, and explain. The goal is not to memorise a library. It
is to become comfortable finding the smallest recursive shape that solves a
problem.

## How to read this book

For every lesson:

1. Read the question before looking at the result.
2. Predict what the form returns.
3. Run the starter form.
4. Change one value or rule and run it again.
5. Explain why the result changed.

The browser keeps lesson progress locally. Chapter sessions are independent, so
you can reset one chapter without losing the others.

!!! note "Source and originality"
    The chapter progression was researched against Peteris Krumins's public
    [collection of examples from *The Little Schemer*](https://github.com/pkrumins/the-little-schemer).
    This book is an original HAL adaptation: the prose, examples, names, data,
    and exercises have been rewritten for Hara's iterator-first and persistent
    data model. It is not a transcription or replacement for the published
    book.

## Ten rules of small recursion

| Rule | Working habit |
| --- | --- |
| 1 | Read the value's shape before choosing an operation. |
| 2 | State the empty case before the recurring case. |
| 3 | Move at least one argument closer to the empty case. |
| 4 | Rebuild persistent output around the recursive answer. |
| 5 | Use the identity value of the operation at the base case. |
| 6 | Recur into every subvalue that has the same shape. |
| 7 | Separate a representation from the meaning it carries. |
| 8 | Use functions to name the behaviour that changes. |
| 9 | Prefer named recursion once the recursive shape is understood. |
| 10 | Return all the information the caller needs. |

## Chapters

<div class="hara-syllabus-grid">
  <a class="hara-path-card hara-path-card--primary" href="./01-values-have-shapes/">
    <span>01 · VALUES</span>
    <h2>Values Have Shapes</h2>
    <p>Read scalars, vectors, maps, sets, quoted forms, and the first/rest boundary.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./02-ask-again/">
    <span>02 · RECURSION</span>
    <h2>Ask Again</h2>
    <p>Find the empty case, change the input, and let a function call itself.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./03-build-on-return/">
    <span>03 · PERSISTENCE</span>
    <h2>Build on Return</h2>
    <p>Remove, insert, and transform values without rewriting the original collection.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./04-number-games/">
    <span>04 · IDENTITIES</span>
    <h2>Number Games</h2>
    <p>Build addition, multiplication, powers, and reductions from terminating rules.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./05-trees-of-values/">
    <span>05 · NESTING</span>
    <h2>Trees of Values</h2>
    <p>Recur through nested vectors and combine answers from branches and tails.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./06-forms-have-meaning/">
    <span>06 · REPRESENTATION</span>
    <h2>Forms Have Meaning</h2>
    <p>Represent arithmetic as data and evaluate it through a small semantic boundary.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./07-sets-and-relations/">
    <span>07 · RELATIONS</span>
    <h2>Sets and Relations</h2>
    <p>Remove duplicates, compare collections, and treat pairs as meaningful records.</p>
    <small>Three interactive steps</small>
  </a>

  <a class="hara-path-card" href="./08-functions-make-functions/">
    <span>08 · HIGHER ORDER</span>
    <h2>Functions Make Functions</h2>
    <p>Pass predicates, create specialised transforms, and collect more than one result.</p>
    <small>Four interactive steps</small>
  </a>

  <a class="hara-path-card" href="./09-recursion-without-a-name/">
    <span>09 · FIXED POINTS</span>
    <h2>Recursion Without a Name</h2>
    <p>See self-application, then return to Hara's clearer letfn and loop/recur forms.</p>
    <small>Four interactive steps</small>
  </a>

  <a class="hara-path-card" href="./10-the-value-of-a-form/">
    <span>10 · EVALUATION</span>
    <h2>The Value of a Form</h2>
    <p>Build an environment, closures, calls, conditionals, and a small evaluator in HAL.</p>
    <small>Four interactive steps</small>
  </a>
</div>

[Begin with Values Have Shapes →](01-values-have-shapes.md){ .md-button .md-button--primary }
