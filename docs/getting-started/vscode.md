# Get started with VS Code

Hara VS Code is the source-first editor path. The extension connects a local
workspace to a running Hara server, evaluates selected forms in a named session,
and shows the result without making the editor the owner of runtime state.

Use this path when you want a normal project tree, local source control, editor
navigation, and a live Hara session beside the files.

## Install and start Hara

Install the CLI first, then confirm it works:

```shell
hara eval '(+ 19 23)'
```

Start the ordinary interactive server:

```shell
hara
```

Do not use `hara --offline` when the editor needs to connect. The ordinary
command starts the ROOT session and exposes the RESP listener used by editor
clients.

The current extension defaults to:

```text
host: 127.0.0.1
port: 4164
```

Check the listener status in the Hara REPL when a different runtime build or
host uses another endpoint.

## Open a Hara project

A new project should keep its source and workspace manifests together:

```text
orbit-game/
  project.edn
  workspace.edn
  src/
    orbit/
      game.hal
```

Open `orbit-game/` as the VS Code workspace rather than opening only one file.
This gives the editor, runtime, and project tools the same root.

`project.edn` describes source roots and requested capabilities.
`workspace.edn` describes the files, areas, nodes, and connections used by
visual workspaces. Executable Hara source uses `.hal`.

## Connect to the server

With `hara` still running:

1. Open the Command Palette.
2. Run **Hara: Connect to Server**.
3. Confirm the host and port.
4. Check that the Hara status item shows a connected session.

The extension should connect to an explicit session rather than treating the
runtime as one global mutable REPL. The initial session is normally ROOT. Use a
separate named session for an experiment or project when isolation matters.

## Evaluate a selected form

Create `src/orbit/game.hal`:

```hara
(ns orbit.game)

(def player
  (atom {:x 40
         :y 30
         :score 0}))

(defn move-right [amount]
  (swap! player
         (fn [state]
           (assoc state
                  :x
                  (+ (get state :x) amount)))))
```

Select the complete `defn` form, then run:

**Hara: Evaluate Selection**

Read the value or error in the Hara output channel. Next, select and evaluate:

```hara
(move-right 8)
```

Then inspect:

```hara
@player
```

The running session retains `player` and the function definition. The source
file remains the durable record of what the project should contain.

## Use named sessions

Run **Hara: Create Session** when you need an isolated context. A session owns
its namespace definitions, atoms, tasks, attached filesystems, and granted host
capabilities.

Named sessions are useful for:

- separating two projects connected to one server;
- testing a change without disturbing ROOT;
- comparing two versions of a namespace;
- giving an embedded tool only the capabilities it needs;
- closing all mutable state associated with one task.

After experimenting, switch back to the project session and evaluate the form
that belongs in the project.

## Run a complete file

Selection evaluation is ideal for one definition or expression. Run the whole
file when you need its namespace declaration and definitions loaded in source
order.

The CLI path is always available from the integrated terminal:

```shell
hara run src/orbit/game.hal
```

This is also a useful comparison when an editor command behaves differently
from a fresh process. A long-running session retains state; `hara run` starts
from the command's runtime context.

## Keep evaluation and source in sync

A live editor makes it easy to define something that has not been saved. Use a
simple rule:

> Experiment in the session; preserve the successful program in source.

When a form works:

1. save the file;
2. run the file in a fresh or project session;
3. make sure no earlier REPL-only definition was required;
4. commit the source and manifests together.

This prevents a project from depending on invisible session history.

## Work on browser projects

VS Code and Hara Chrome can use the same project directory. VS Code is the
focused source surface. Hara Chrome provides a browser-resident kernel, visual
spaces, and Chrome capabilities.

For a browser project:

1. edit `.hal`, `project.edn`, and `workspace.edn` in VS Code;
2. open the same directory as the Hara Chrome home;
3. load the file into the browser kernel;
4. evaluate small source changes from either connected surface;
5. keep the accepted version in the shared source tree.

Do not assume the VS Code server session and browser session are the same
session. They may run in different kernels with different capabilities.

## Understand connection failures

When the extension cannot connect, check these items in order:

1. Is the `hara` process still running?
2. Was it started without `--offline`?
3. Does the REPL show an active listener?
4. Does the extension use the same host and port?
5. Is a firewall, container boundary, or remote workspace changing
   `127.0.0.1`?
6. Is the requested session available?

In a dev container or remote SSH workspace, `127.0.0.1` refers to the remote
environment from the extension's point of view. Run the Hara server in the same
environment or expose the listener deliberately.

## Understand evaluation failures

A connection can succeed while evaluation fails. Distinguish:

- reader errors from an incomplete or incorrectly selected form;
- namespace errors from evaluating a definition in the wrong session;
- unresolved symbols from missing earlier definitions or requirements;
- `unsupported` host operations from unavailable providers;
- `denied` host operations from missing capabilities;
- stale session behavior from an older definition still being active.

Try the exact selected text with `hara stdin` when you need to separate editor
selection from runtime behavior:

```shell
pbpaste | hara stdin
```

On non-macOS systems, pipe the selection with the platform's clipboard or a
temporary file.

## Suggested key workflow

The exact keybindings can remain personal, but the operations should stay
clear:

- connect or reconnect to the server;
- choose or create a session;
- evaluate the current selection;
- run the current file;
- show the output channel;
- inspect listener and session status.

Avoid a single ambiguous "run" command that sometimes evaluates a form,
sometimes runs a file, and sometimes starts a new process.

## Continue

Read the deeper [Hara VS Code project guide](../create/vscode-project.md),
[Get started with the CLI](cli.md), and the
[RESP protocol reference](../reference/resp-protocol.md) when implementing or
debugging an editor client.