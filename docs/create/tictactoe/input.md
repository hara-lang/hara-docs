# Part IV — Pointer input

The browser contributes only a local pointer event. `position-at` converts that
event into a board cell; the pure game rules decide whether that cell changes
the game. Browser coordinates do not leak into `next-move`.

<div class="hara-canvas-stage" data-hara-canvas-stage="3" data-hara-canvas-program="../../../assets/tictactoe/tictactoe.hal">

```hara
(defn apply-pointer-event [game event layout]
  (if (and (= (get event "type") "pointer")
           (= (get event "phase") "down"))
    (if (reset-hit? layout (get event "x") (get event "y"))
      (new-game)
      (try-move game (position-at layout
                                  (get event "x") (get event "y"))))
    game))
```

</div>

## Practical — test the boundary

Click inside a square, then click it again. The first event selects a cell; the
second is rejected because the pure game state already owns it. Click outside
the board and confirm that nothing changes.

[Continue: rendering →](rendering.md){ .md-button .md-button--primary }
