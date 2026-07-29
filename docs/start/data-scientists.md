# Hara for Data Scientists

Hara is useful when an analysis needs to become a live, inspectable part of a
web application—not just a notebook result or a batch job.

Use a kernel session to keep the values, transformations, and evidence for an
experiment together. A browser workspace, a command-line session, and a tool
can inspect the same running system.

```hara
(def observations [12 19 23 18 28])

(def mean
  (/ (reduce + observations) (count observations)))

{:mean mean
 :count (count observations)}
```

The important distinction is that the values are not only printed: they remain
available for inspection, controlled changes, visual output, and a durable
project record.

## A practical workflow

1. Load or create a bounded dataset.
2. Evaluate one transformation at a time.
3. Inspect the value and any visual result.
4. Keep the verified step in source.

Hara does not replace a specialised Python or R ecosystem. It provides a
portable kernel boundary for applications that need their data work, runtime
state, and visible output to remain connected.
