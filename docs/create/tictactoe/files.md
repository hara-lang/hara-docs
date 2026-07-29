# Part II — Organise the game

The board has already taught us an important boundary: drawing is a small,
explicit adapter. Keep that boundary when the program gets larger.

```text
tictactoe/
├── board.hal       drawing commands and layout
├── game.hal        pure state, rules, and win checking
└── main.hal        ns+, frame input, and draw/render
```

`board.hal` says what to draw. `game.hal` decides what a move means. `main.hal`
is the only file that knows about the browser frame and the canvas capability.
The division is useful because the first two files can be read and tested as
ordinary data transformations.

## Practical — name a boundary

Pick one command from the board page and decide where it belongs. A
`[:line ...]` board command belongs in `board.hal`; `next-move` belongs in
`game.hal`; `draw/next-frame` belongs in `main.hal`. If you are unsure, ask:
“does this need the browser, or only the game value?”

[Continue: state and rules →](state.md){ .md-button .md-button--primary }
