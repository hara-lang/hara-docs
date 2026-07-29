#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function markdownFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith(".md") ? [path] : [];
  }));
  return nested.flat();
}

const failures = [];
const deprecatedBranding = [
  ["A Modern Lisp", /A Modern Lisp/i],
  ["small Lisp", /\bsmall Lisp\b/i],
  ["Lisp kernel", /\bLisp kernel\b/i],
  ["Hara Lisp — Intro", /Hara Lisp\s+[—-]\s+Intro/i]
];
for (const path of await markdownFiles(new URL("../docs", import.meta.url).pathname)) {
  const source = await readFile(path, "utf8");
  if (source.includes("docs/scenes/tron.hal")) failures.push(`${path}: stale Tron scene path`);
  for (const [label, pattern] of deprecatedBranding) {
    if (pattern.test(source)) failures.push(`${path}: deprecated product branding: ${label}`);
  }
}
if (failures.length) throw new Error(failures.join("\n"));
console.log("docs project guidance is current");
