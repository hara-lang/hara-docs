#!/usr/bin/env node
import { access } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? "");
const sessionApiOnly = process.argv[3] === "--session-api-only";
const releaseRuntime = process.argv[3] === "--release-runtime";
const releaseFiles = [
  "rust/hara.wasm",
  "rust/hta.js",
  "rust/hta-worker.js",
  "rust/packages/hta/index.js",
  "rust/packages/hta/worker.js",
  "rust/studio/broker.js",
  "rust/studio/canvas-runtime.js",
  "rust/studio/host-services.js",
  "rust/studio/hal/draw.hal",
  "rust/studio/hal/node.hal",
  "rust/studio/hal/store.hal",
  "rust/studio/hal/substrate-frame.hal"
];
const requiredFiles = releaseRuntime
  ? releaseFiles
  : [...releaseFiles, "rust/studio/hal/fs.hal"];
for (const path of sessionApiOnly ? ["rust/hta.js"] : requiredFiles) {
  await access(join(root, path));
}
const { HtaContext } = await import(pathToFileURL(join(root, "rust/hta.js")).href);
if (typeof HtaContext?.prototype?.createSession !== "function") {
  throw new Error("docs runtime is missing HtaContext.createSession");
}
console.log(
  sessionApiOnly
    ? "verified docs session runtime"
    : releaseRuntime
      ? "verified release kernel runtime"
      : "verified docs kernel runtime"
);
