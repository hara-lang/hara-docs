---
title: Learn Hara
hide:
  - toc
---

# Learn Hara

Hara is easiest to understand by using it. Run a form, inspect the value, make
one change, and see what the running kernel does next.

The learning paths below begin with the same compact language and then move in
different directions. You do not need to install anything for the first two.

<div class="hara-syllabus-grid">
  <a class="hara-path-card hara-path-card--primary" href="first-contact/">
    <span>01 · START HERE</span>
    <h2>First Contact</h2>
    <p>Six short experiments: read a form, shape data, write a function, preserve an old value, and meet protocols.</p>
    <small>About 15 minutes · browser kernel</small>
  </a>

  <a class="hara-path-card" href="protocols/">
    <span>02 · THE BUILDER'S SKILL</span>
    <h2>Protocols for Builders</h2>
    <p>Learn why a small language can remain coherent as new values, providers, tools, and systems are added.</p>
    <small>Interactive foundations · no framework required</small>
  </a>

  <a class="hara-path-card" href="../create/first-game/">
    <span>03 · BUILD SOMETHING</span>
    <h2>Build Tic Tac Toe</h2>
    <p>Start from drawing-command data and finish with immutable state, pointer input, rendering, and a live game loop.</p>
    <small>Six practical stages · live canvas</small>
  </a>

  <a class="hara-path-card" href="../hal-intro/">
    <span>04 · GO DEEPER</span>
    <h2>Hara Foundations</h2>
    <p>Continue through persistent collections, atoms, iterators, promises, coroutines, bytes, and explicit I/O.</p>
    <small>Seven connected lessons · complete runtime model</small>
  </a>
</div>

## The sequence behind every path

### Data work

Start with immutable maps and vectors, transform them with iterator-backed
functions, and inspect each intermediate value in the REPL. Keep file, network,
and database access behind explicit providers so the same transformation stays
portable across hosts.

### Games and interactive systems

Start with the Tic Tac Toe course, separate state transitions from rendering,
and evaluate the smallest changed function into the running session. This is
the same runtime-driven loop used by larger visual applications.

<div class="hara-learning-sequence" role="img" aria-label="Values, functions, protocols, and systems form the Hara learning sequence">
  <span><b>Values</b><small>Give information a shape.</small></span>
  <i>→</i>
  <span><b>Functions</b><small>Describe a transformation.</small></span>
  <i>→</i>
  <span><b>Protocols</b><small>Name what a part can do.</small></span>
  <i>→</i>
  <span><b>Systems</b><small>Fit independent parts together.</small></span>
</div>

**Functions make things happen. Protocols make systems fit together.**
