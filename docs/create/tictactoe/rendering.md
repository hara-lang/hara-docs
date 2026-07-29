# Part V — Rendering

Rendering takes a game value and a layout and returns ordinary canvas command
data. Canvas objects do not enter the game rules. That lets you inspect the
picture before the browser draws it.

<div class="hara-canvas-stage" data-hara-canvas-stage="4" data-hara-canvas-program="../../assets/tictactoe/tictactoe.hal">

```hara
(defn render-commands [game layout]
  (let [base (chrome-commands game layout)
        board (append-commands base (board-lines layout))
        p1 (add-pieces board layout (get (get game :board) :p1) :p1)
        p2 (add-pieces p1 layout (get (get game :board) :p2) :p2)]
    (append-commands p2 (winner-commands game layout))))
```

</div>

## Practical — change the picture, not the rules

Change the colour used for a player piece and run the file. The game state and
legal-move logic remain exactly the same; only the command data changes. This
is why rendering stays a separate concern.

[Continue: make it live →](live.md){ .md-button .md-button--primary }
