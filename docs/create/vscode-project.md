# Create a project with Hara VS Code

The Hara VS Code extension connects an editor workspace to a running Hara
server. It is a source-first companion to the same live workflow: select a
form, evaluate it in a named session, inspect the result, and keep the working
state close to the files.

## Start a Hara server

Start Hara with its listener enabled. The standard interactive command starts
the ROOT session and exposes it to editor clients:

```shell
./hara
```

Configure the extension's server host and port to match the listener you are
running. The extension defaults to `127.0.0.1` and port `4164`; check the
runtime listener status when connecting a different build or host.

## Connect and evaluate

1. Open your Hara project folder in VS Code.
2. Run **Hara: Connect to Server** from the Command Palette.
3. Open a `.hal` source file and select a complete form.
4. Run **Hara: Evaluate Selection**.
5. Read the value in the Hara output channel and revise the source.

The status bar shows the current Hara session. Use **Hara: Create Session**
for an isolated experiment, then switch back to the project session when the
idea is ready to keep.

## Project shape

Use the same project boundaries as other Hara hosts: source files should be
stored in the repository and the live session is a fast feedback loop, not the
only copy of your work. Keep the required `project.edn` and `workspace.edn` at
the workspace root so VS Code, Chrome, and browser Studio discover the same
source roots and workspace.

For browser-oriented projects, pair this workflow with the
[first browser game](first-game.md) guide. The Chrome panel offers the more
visual browser workspace; VS Code offers the focused source and session view.
