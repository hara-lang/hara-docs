# Part I — Draw the board

Before there is a game, there is a canvas and a few drawing commands. A canvas
command is just data. Read this vector as: draw a vertical line from `(220,
170)` to `(220, 470)`, muted blue, two pixels wide, fully opaque.

```hara
[:line x1 y1 x2 y2 color width alpha]
```

`draw/render` is the only point at which those values become pixels. There is
no board widget hiding behind this example.

<div class="hara-canvas-stage" data-hara-canvas-stage="1" data-hara-canvas-program="../../assets/tictactoe/stage-01-canvas.hal">

```hara
(ns+
  (:require [studio.draw :as draw]))

(defn opening-commands [width height]
  [[:grid 48 "rgba(67,247,231,.12)" 1]
   [:line 220 170 220 470 "#386779" 2 1]
   [:line 380 170 380 470 "#386779" 2 1]
   [:line 60 270 540 270 "#386779" 2 1]
   [:line 60 370 540 370 "#386779" 2 1]])
```

</div>

## Practicals — draw with commands

You now know the complete mechanism: each vector is a requested drawing
operation, and running the file sends that list to the canvas. Choose one
exercise, or [skip to organising the game](files.md).

<div class="hara-board-annotations">
  <section><b>MOVE A LINE</b><p>Change both <code>220</code> values in the first line to <code>250</code>. Run the file. The shared <code>x</code> keeps it vertical.</p></section>
  <section><b>CHANGE A COLOUR</b><p>Replace <code>"#386779"</code> with <code>"#ff78b3"</code>, then run again. The command is the whole instruction.</p></section>
  <section><b>ADD A LINE</b><p>Copy one <code>:line</code> vector. Give its endpoints a shared <code>x</code> or <code>y</code> and observe the result.</p></section>
  <section><b>DRAW A CIRCLE</b><p>Add <code>[:circle 300 320 24 "#7dfff3" 1]</code>. This is the same command-list idea, with a different primitive.</p></section>
</div>

### Drawing reference

<div class="hara-canvas-command-cards">
  <section><b>:line</b><code>[:line x1 y1 x2 y2 color width alpha]</code><p>Draw a straight segment. Four lines make the board grid.</p></section>
  <section><b>:circle</b><code>[:circle x y radius color alpha]</code><p>Draw a filled circle. Later, two circles make an O.</p></section>
  <section><b>:rect</b><code>[:rect x y width height color alpha]</code><p>Fill a rectangle for a panel, button, or board background.</p></section>
  <section><b>:text</b><code>[:text label x y color size]</code><p>Put a status label or instruction onto the canvas.</p></section>
  <section><b>:grid</b><code>[:grid spacing color width]</code><p>Draw a regular guide grid behind the game.</p></section>
  <section><b>:mist</b><code>[:mist x y radius color alpha]</code><p>Add a soft radial glow behind a piece or winning line.</p></section>
</div>

[Continue: organise the game files →](files.md){ .md-button .md-button--primary }
