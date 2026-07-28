# Your first browser game

This is the visual-first path through Hara. You will make a small live scene,
then use the same loop for a game: change a form, evaluate it, and immediately
observe the result.

## Start with a runnable scene

Open the [Studio](../studio.md) and choose **Browser Game**. The packaged
project loads `project.edn` first, then `workspace.edn`, which connects the
anonymous `src/tron.hal` document to its canvas and input node.

Read the scene in three passes:

1. Find the state that changes while the game runs.
2. Find the function that advances that state on each tick.
3. Find the drawing calls that turn state into pixels.

That is the useful first model for an interactive Hara program: state, update,
and rendering are small forms you can inspect and replace independently.

## Make one visible change

Duplicate a scene into your own project, then change one visible value: a
colour, movement speed, starting position, or score. Evaluate the changed form
in the active REPL and compare the result in the canvas.

Use the normal live-development rhythm:

```hara
; change one form
(def speed 2)

; evaluate it in the active kernel
speed
```

Keep changes small enough that you can tell what changed. When a change is
useful, save it in the project file rather than leaving it only in the REPL.

## Turn the scene into a game

For a first game, add one behaviour at a time:

- a player-controlled value such as direction or position;
- an event that changes it;
- a rule for scoring, collision, or completion; and
- a rendered signal that makes the rule clear.

The HAL program owns game state, timing, input handling, and complete frame
generation. JavaScript only schedules frames, captures normalized input, and
executes the declared canvas commands. The [workspace model](../work-visually.md)
explains how the code, REPL, and visual surfaces relate.

## Continue

Put the game in a project with [Hara Chrome](chrome-project.md), or develop it
against a local runtime with [Hara VS Code](vscode-project.md). Publishing to
Greenways Spaces is planned; see the [publishing roadmap](../projects/publish-greenways.md)
for its intended handoff.
