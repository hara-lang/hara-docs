#!/usr/bin/env node
import { access } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
for (const path of [
  "rust/hara.wasm",
  "rust/hta.js",
  "rust/hta-worker.js",
  "rust/studio/broker.js",
  "rust/studio/canvas-runtime.js",
  "rust/studio/host-services.js",
  "rust/studio/hal/draw.hal",
  "rust/studio/hal/fs.hal",
  "rust/studio/hal/node.hal",
  "rust/studio/hal/store.hal",
  "rust/studio/hal/substrate-frame.hal"
]) {
  await access(join(root, path));
}
console.log("verified docs kernel runtime");
