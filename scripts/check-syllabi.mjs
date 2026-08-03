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
let syllabusCount = 0;
let stepCount = 0;

for (const path of await markdownFiles(new URL("../docs", import.meta.url).pathname)) {
  const source = await readFile(path, "utf8");
  const syllabusIds = [...source.matchAll(/data-hara-syllabus="([^"]+)"/g)].map((match) => match[1]);
  if (!syllabusIds.length) continue;
  syllabusCount += syllabusIds.length;

  if (!/^---[\s\S]*?hara_kernel_loading:\s*auto[\s\S]*?---/m.test(source)) {
    failures.push(`${path}: interactive syllabus must set hara_kernel_loading: auto`);
  }

  for (const syllabusId of syllabusIds) {
    if (!/-v\d+$/.test(syllabusId)) {
      failures.push(`${path}: syllabus id must end in a version, received ${syllabusId}`);
    }
  }

  const steps = [...source.matchAll(/data-hara-step="([^"]+)"/g)].map((match) => match[1]);
  stepCount += steps.length;
  if (steps.length < 2) failures.push(`${path}: a syllabus needs at least two steps`);

  const unique = new Set(steps);
  if (unique.size !== steps.length) failures.push(`${path}: duplicate data-hara-step values`);

  const runnableFences = (source.match(/```hara\s+eval\b/g) ?? []).length;
  if (runnableFences < steps.length) {
    failures.push(`${path}: expected at least one runnable Hara fence per step`);
  }
}

if (!syllabusCount) failures.push("no interactive syllabi found");
if (failures.length) throw new Error(failures.join("\n"));
console.log(`validated ${syllabusCount} syllabi with ${stepCount} steps`);
