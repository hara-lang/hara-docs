# Publish to Greenways Spaces

> **Roadmap — not available yet.** Hara project publishing to Greenways Spaces
> is a planned workflow. This page describes the intended journey, not commands
> or controls that are currently shipped.

## The intended journey

1. Create a Hara project with source, assets, and project metadata.
2. Run and inspect it locally in a Hara workspace.
3. Choose a Greenways Space as the project's shared destination.
4. Publish a versioned project bundle and receive a shareable live URL.
5. Return to the project to iterate, preview, and publish the next version.

## What exists today

The Studio provides local spaces and files, including creating spaces and
importing a GitHub repository into a space. Hara Chrome provides a local home
directory for `.hal` sources. Neither feature publishes a Hara project to
Greenways Spaces today.

Until publishing exists, keep the project in a Git repository and use the
workspace as a live development environment. That preserves the boundary the
future publisher will need: durable source on one side, a shareable project
release on the other.

## What the future guide must verify

The implementation guide will need to document authentication, project assets,
runtime selection, preview versus production publishing, permissions, a stable
project URL, failure messages, and rollback. Those details are deliberately
left open until the product capability is implemented.
