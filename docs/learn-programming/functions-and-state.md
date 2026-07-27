# Functions and changing state

Functions give a behaviour a name. State records information that can change
while an interactive program runs.

## Name a behaviour

```hara
(defn move-right [player amount]
  (assoc player :x (+ (:x player) amount)))

(move-right {:x 10 :y 4} 3)
; => {:x 13 :y 4}
```

`defn` defines a function. The function receives a player and an amount, then
returns a new player map. The original data is not silently changed.

## Make change explicit

For a value that really must change over time, use an atom. The atom is the
visible place where mutable state lives.

```hara
(def player (atom {:x 10 :score 0}))

(swap! player move-right 3)
@player
; => {:x 13 :score 0}
```

`swap!` applies a function to the current value inside the atom. `@player`
reads the current value. This is a useful model for a game position, a timer,
or a currently selected visual object.

## Bring it to life

In a live workspace, you can redefine `move-right`, evaluate it, then inspect
the new player value without restarting the whole project. That short feedback
loop is the bridge from basic programming to interactive work.

Continue with [your first browser game](../create/first-game.md), where state,
updates, and rendering meet on a canvas.
