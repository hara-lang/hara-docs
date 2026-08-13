import { access, cp, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const dist = resolve(appRoot, "dist");
const nested = resolve(dist, "docs");

try {
  await access(nested);
} catch {
  process.exit(0);
}

for (const entry of await readdir(nested)) {
  await cp(resolve(nested, entry), resolve(dist, entry), {
    recursive: true,
    force: true,
    errorOnExist: false
  });
}
await rm(nested, { recursive: true, force: true });
console.log("flattened Astro /docs output to the deploy artifact root");
