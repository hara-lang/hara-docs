import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = resolve(root, "docs");
const manifest = JSON.parse(await readFile(resolve(root, "docs-manifest.json"), "utf8"));
const lock = JSON.parse(await readFile(resolve(root, "runtime.lock.json"), "utf8"));
const target = JSON.parse(await readFile(resolve(root, "runtime-target.json"), "utf8"));
const pages = [];

function collect(items) {
  for (const item of items) {
    if (item.path) pages.push(item.path);
    if (item.items) collect(item.items);
  }
}

collect(manifest.navigation);
if (new Set(pages).size !== pages.length) throw new Error("duplicate navigation page");
for (const page of pages) await access(resolve(docs, page));

const routes = manifest.redirects.map(({ from }) => from);
if (new Set(routes).size !== routes.length) throw new Error("duplicate redirect route");
for (const { from, to } of manifest.redirects) {
  if (from === to) throw new Error(`self redirect: ${from}`);
}

if (target.status === "released" && lock.version !== target.requiredRelease) {
  throw new Error(`runtime lock ${lock.version} does not satisfy released target ${target.requiredRelease}`);
}

console.log(`documentation manifest valid: ${pages.length} pages, ${routes.length} redirects`);
if (target.status !== "released") {
  console.log(`publication gate: Hara ${target.requiredRelease} runtime artifact is not released; lock remains ${lock.version}`);
}
