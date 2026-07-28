#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
const required = [
  "rust/hara.wasm", "rust/hta.js", "rust/hta-worker.js",
  "rust/studio/broker.js", "rust/studio/host-services.js",
  "rust/studio/ui.js", "rust/studio/studio.css",
  "rust/studio/hal/store.hal", "rust/studio/hal/fs.hal",
  "rust/studio/hal/space.hal", "rust/studio/hal/boot.hal",
  "examples/index.json"
];
for (const path of required) await access(join(root, path));
const index = JSON.parse(await readFile(join(root, "examples/index.json"), "utf8"));
if (!Array.isArray(index.projects) || index.projects.map((item) => item.id).join(",") !== "starter,game,music") {
  throw new Error("runtime examples must be Starter, Browser Game, and Music");
}
for (const project of index.projects) {
  for (const path of [project.project, project.workspace, ...project.files]) await access(join(root, path));
}
console.log(`verified docs runtime ${index.version}`);
