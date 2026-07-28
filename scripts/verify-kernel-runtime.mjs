#!/usr/bin/env node
import { access } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
for (const path of ["rust/hara.wasm", "rust/hta.js", "rust/hta-worker.js"]) {
  await access(join(root, path));
}
console.log("verified docs kernel runtime");
