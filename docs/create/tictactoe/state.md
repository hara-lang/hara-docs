# Part III — State and rules

The grid now has a precise value behind it. The game state is deliberately
small: played cells, whose turn it is, and whether play is active or done.

<div class="hara-canvas-stage" data-hara-canvas-stage="2" data-hara-canvas-program="../../assets/tictactoe/stage-02-state.hal">

```hara
(ns+
  (:require [studio.draw :as draw]))

(defn new-game []
  {:board {:p1 #{} :p2 #{}}
   :turn :p1
   :status :active})
```

</div>

`next-move` receives a game value and a cell. It returns a new game only when
the move is legal. Win and draw detection belong beside it: they are rules, not
canvas behaviour.

## Practical — make a state change visible

Edit the starting `:turn` to `:p2`, run the file, and inspect the returned
value. Then add one occupied cell to `:p1`. This is the core loop in miniature:
write a value, evaluate it, inspect the next value.

[Continue: pointer input →](input.md){ .md-button .md-button--primary }
