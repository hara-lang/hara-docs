# Build Tic Tac Toe from a blank canvas

This is the first complete Hara program in the documentation.

You will begin with an empty browser canvas and build the game in six small parts. Along the way, ordinary Hara values become drawing commands, game rules, current state, pointer input, and a live render loop.

The runnable panels use a real browser-hosted Hara kernel and canvas. The examples are not screenshots, pseudocode, an iframe, or a reduced teaching runtime.

## What you will build

By the end, the program will have:

- a board described as visible command data;
- a small multi-file project shape;
- immutable game values and legal-move rules;
- an atom for the current game;
- pointer events translated into possible moves;
- rendering functions that return canvas commands;
- a live frame loop with reset and touch input.

The important progression is:

```text
data → rules → state → input → rendering → running program
```

Each part introduces one new boundary without replacing the model used in the previous part.

<div class="hara-tictactoe-sketches" aria-label="Tic Tac Toe tutorial construction storyboard">
  <section><small>01 · DRAW</small><div class="hara-tictactoe-flow" aria-hidden="true"><b>blank canvas</b><em>↓</em><b>line commands</b><em>↓</em><b>board</b></div><p>Turn ordinary values into visible output.</p></section>
  <section><small>02–04 · DESCRIBE</small><div class="hara-tictactoe-flow" aria-hidden="true"><b>files</b><em>↓</em><b>state + rules</b><em>↓</em><b>pointer</b></div><p>Keep the game understandable as it grows.</p></section>
  <section><small>05–06 · RUN</small><div class="hara-tictactoe-flow" aria-hidden="true"><b>commands</b><em>↓</em><b>next frame</b><em>↓</em><b>play</b></div><p>Connect the program to the browser and play it.</p></section>
</div>

## Build it in order

<div class="hara-tutorial-next">
  <a href="tictactoe/board/"><b>Part I</b><strong>Draw the board</strong><small>Canvas commands and a focused drawing practical.</small></a>
  <a href="tictactoe/files/"><b>Part II</b><strong>Organise the game</strong><small>Three small files with clear responsibilities.</small></a>
  <a href="tictactoe/state/"><b>Part III</b><strong>State and rules</strong><small>Immutable game data and legal moves.</small></a>
  <a href="tictactoe/input/"><b>Part IV</b><strong>Pointer input</strong><small>Turn a local event into one possible move.</small></a>
  <a href="tictactoe/rendering/"><b>Part V</b><strong>Rendering</strong><small>Translate the game into canvas commands.</small></a>
  <a href="tictactoe/live/"><b>Part VI</b><strong>Make it live</strong><small>Frames, reset, touch input, and the finished game.</small></a>
</div>

Follow the parts in order for the full construction. Each page also includes a focused practical, so you can pause and change the program before moving on.

## What comes after the game

Once the game is running, the same language can move into a larger browser project, local CLI project, editor-connected session, native host, or JVM application.

Continue with [Choose your Hara setup](../getting-started.md) to decide where your own project should live, or take the [Hara language course](../hal-intro/index.md) to go deeper into streams, coroutines, bytes, and I/O.
