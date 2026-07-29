# Hara for Game Developers

Hara is suited to games and interactive tools where the interesting system is
already running. A live kernel lets you inspect a world value, make one bounded
change, and observe the result without restarting the whole session.

```hara
(def player
  (atom {:x 10 :y 8 :score 0}))

(swap! player update :x + 3)

@player
```

The editor, a browser workspace, and other tools can connect to the same
kernel. That makes it possible to inspect state beside a running scene, test a
small rule, and retain the successful change in source deliberately.

## Where it fits

- browser games that need a responsive, inspectable runtime;
- simulation and tool workflows with long-lived state;
- visual scenes driven by ordinary Hara values;
- extension-backed capabilities such as audio, rendering, or assets, with
  explicit host permission.

Start with [your first browser game](../create/first-game.md), then use the
kernel to inspect and evolve the running system.
