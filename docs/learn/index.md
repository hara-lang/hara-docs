---
title: Learn Hara
hide:
  - toc
---

# Learn Path

Hara is easiest to understand by using it. Run a form, inspect the value, make
one change, and see what the running kernel does next.

## Why Hara

Hara is a compact language for understanding and building complete systems. Its data
is readable, its programs remain inspectable while they run, and the same core
language can be hosted by the browser, native Rust, or the JVM. You can learn
the parts beneath a framework without choosing a language you must later throw
away.

This guided path begins with the compact language and then builds toward the
complete portable runtime model. Start in the browser; installation can wait
until you want a local project.

<div class="hara-syllabus-grid">
  <a class="hara-path-card hara-path-card--primary" href="../getting-started/playground/">
    <span>TRY IT NOW</span>
    <h2>Playground</h2>
    <p>Evaluate Hara in the browser without installing a runtime.</p>
    <small>Immediate · browser kernel</small>
  </a>

  <a class="hara-path-card hara-path-card--primary" href="first-contact/">
    <span>01 · START HERE</span>
    <h2>First Contact</h2>
    <p>Six short experiments: read a form, shape data, write a function, preserve an old value, and meet protocols.</p>
    <small>About 15 minutes · browser kernel</small>
  </a>

  <a class="hara-path-card" href="../learn-programming/">
    <span>READ PROGRAMS</span>
    <h2>Learn programming</h2>
    <p>Build an understanding of values, functions, state, decisions, and repetition from first principles.</p>
    <small>Beginner path · no prior Lisp required</small>
  </a>

  <a class="hara-path-card" href="../hal-intro/">
    <span>02 · GO DEEPER</span>
    <h2>Hara Foundations</h2>
    <p>Continue through persistent collections, atoms, iterators, promises, coroutines, bytes, and explicit I/O.</p>
    <small>Seven connected lessons · complete runtime model</small>
  </a>
</div>

## The guided sequence

### Data work

Start with immutable maps and vectors, transform them with iterator-backed
functions, and inspect each intermediate value in the REPL. Keep file, network,
and database access behind explicit providers so the same transformation stays
portable across hosts.

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

When you are ready to work locally, continue to
[Install and choose a host](../getting-started.md).
