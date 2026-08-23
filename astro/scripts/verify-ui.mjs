import { access, cp, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const workspace = resolve(appRoot, "../../../");
const packages = [
  { name: "@hara-lang/ui", source: resolve(workspace, "technology/hara-ui"), installed: resolve(appRoot, "node_modules/@hara-lang/ui") },
  { name: "@hara-lang/ui-astro", source: resolve(workspace, "technology/hara-ui/packages/ui-astro"), installed: resolve(appRoot, "node_modules/@hara-lang/ui-astro") }
];

const exists = async (path) => {
  try { await access(path); return true; } catch { return false; }
};

for (const entry of packages) {
  const manifestPath = resolve(entry.source, "package.json");
  if (!(await exists(manifestPath))) throw new Error(`missing ${entry.name} at ${entry.source}`);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.name !== entry.name) throw new Error(`wrong package at ${entry.source}: ${manifest.name}`);
  await rm(entry.installed, { recursive: true, force: true });
  await mkdir(entry.installed, { recursive: true });
  for (const path of ["package.json", ...new Set(manifest.files ?? [])]) {
    if (typeof path !== "string" || path.includes("*") || path.includes("\0")) throw new Error(`unsupported ${entry.name} entry: ${String(path)}`);
    const from = resolve(entry.source, path);
    const to = resolve(entry.installed, path);
    if (from !== entry.source && !from.startsWith(`${entry.source}${sep}`)) throw new Error(`${entry.name} entry escapes its root: ${path}`);
    if (!(await exists(from))) throw new Error(`${entry.name} entry is missing: ${path}`);
    await mkdir(dirname(to), { recursive: true });
    await cp(from, to, { recursive: true, dereference: true });
  }
  console.log(`using materialised ${entry.name} ${manifest.version}`);
}
