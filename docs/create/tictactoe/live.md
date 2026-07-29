# Part VI — Make it live

`draw/next-frame` yields canvas size and local input. `draw/render` sends only
the command data through the declared canvas capability. The loop carries the
new immutable game state into the next frame.

<div class="hara-canvas-stage" data-hara-canvas-stage="5" data-hara-canvas-program="../../../assets/tictactoe/tictactoe.hal">

```hara
(let [frame (co/await (draw/next-frame "canvas/background"))
      layout (game-layout (get frame "canvas/width")
                          (get frame "canvas/height"))
      next-game (apply-events game (get frame "input/events") layout)]
  (co/await (draw/render "canvas/background"
    {:type :canvas-2d
     :commands (render-commands next-game layout)})))
```

</div>

## Practical — play the complete game

The finished program has reset, draw detection, a winning line, mouse input,
and touch input. Play a short game, use reset, then rerun the file to see that
the old running generation is replaced.

<div class="hara-canvas-stage" data-hara-canvas-stage="6" data-hara-canvas-program="../../../assets/tictactoe/tictactoe.hal">

```hara
(node/start
  (fn []
    (loop [game (new-game)]
      (let [frame (co/await (draw/next-frame "canvas/background"))
            layout (game-layout (get frame "canvas/width")
                                (get frame "canvas/height"))
            next-game (apply-events game (get frame "input/events") layout)]
        (co/await (draw/render "canvas/background"
          {:type :canvas-2d :commands (render-commands next-game layout)}))
        (recur next-game)))))
```

</div>

Download the full final [tictactoe.hal](../../assets/tictactoe/tictactoe.hal){download}.

## The browser's deliberately small role

The adapter owns one worker, one Canvas2D capability, and local pointer
translation per stage. Game rules, win checking, state changes, and rendering
policy remain Hara forms and values in the stage-local kernel.

[Return to Building Tic Tac Toe →](../first-game.md){ .md-button }
