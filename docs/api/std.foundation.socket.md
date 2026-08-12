---
title: std.foundation.socket
description: Generated API reference for std.foundation.socket.
---

# `std.foundation.socket`

Generated from `std/foundation/socket.hal` and its companion tests. 7 public definitions.

> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.

## `connect`

defn · `[host port options callback]`

Connects to host and port, reporting completion through callback.

Source: `std/foundation/socket.hal:50`

## `listen`

defn · `[host port options callback]`

Starts a socket server and reports lifecycle events through callback.

Source: `std/foundation/socket.hal:56`

## `endpoint`

defn · `[server]`

Returns the bound host and port map for server.

Source: `std/foundation/socket.hal:62`

## `events`

defn · `[handle options]`

Creates an event stream for a socket or server handle.

Source: `std/foundation/socket.hal:68`

## `next`

defn · `[stream]`

Returns a promise of the next event from stream.

Source: `std/foundation/socket.hal:74`

## `send`

defn · `[connection contents]`

Writes contents to connection and returns the byte count.

Source: `std/foundation/socket.hal:80`

## `close`

defn · `[connection]`

Closes a socket connection or server handle.

Source: `std/foundation/socket.hal:86`
