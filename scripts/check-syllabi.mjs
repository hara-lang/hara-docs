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

function fenceGroup(meta = "") {
  const match = String(meta).match(
    /(?:^|\s)group(?:\s*=\s*|\s*:\s*|\s+)(?:"([^"]+)"|'([^']+)'|([^\s]+))/i
  );
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
}

const failures = [];
let syllabusCount = 0;
let stepCount = 0;

for (const path of await markdownFiles(new URL("../docs", import.meta.url).pathname)) {
  const source = await readFile(path, "utf8");
  const syllabusIds = [...source.matchAll(/data-hara-syllabus="([^"]+)"/g)].map((match) => match[1]);
  if (!syllabusIds.length) continue;
  syllabusCount += syllabusIds.length;

  if (syllabusIds.length !== 1) {
    failures.push(`${path}: keep one interactive syllabus per page`);
  }

  if (!/^---[\s\S]*?hara_kernel_loading:\s*auto[\s\S]*?---/m.test(source)) {
    failures.push(`${path}: interactive syllabus must set hara_kernel_loading: auto`);
  }

  for (const syllabusId of syllabusIds) {
    if (!/-v\d+$/.test(syllabusId)) {
      failures.push(`${path}: syllabus id must end in a version, received ${syllabusId}`);
    }
  }

  const sessionGroups = [...source.matchAll(/data-hara-session-group="([^"]+)"/g)]
    .map((match) => match[1]);
  if (sessionGroups.length !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sessionGroups[0] ?? "")) {
    failures.push(`${path}: declare one kebab-case data-hara-session-group`);
  }
  const sessionGroup = sessionGroups[0] ?? "";

  const steps = [...source.matchAll(/data-hara-step="([^"]+)"/g)].map((match) => match[1]);
  stepCount += steps.length;
  if (steps.length < 2) failures.push(`${path}: a syllabus needs at least two steps`);

  const unique = new Set(steps);
  if (unique.size !== steps.length) failures.push(`${path}: duplicate data-hara-step values`);

  const runnableFences = [...source.matchAll(/^```hara\s+eval([^\r\n]*)$/gm)];
  if (runnableFences.length < steps.length) {
    failures.push(`${path}: expected at least one runnable Hara fence per step`);
  }
  for (const fence of runnableFences) {
    const group = fenceGroup(fence[1]);
    if (group !== sessionGroup) {
      failures.push(`${path}: runnable fence must declare group=${sessionGroup}`);
    }
  }
}

const controller = await readFile(
  new URL("../docs/javascripts/syllabus.js", import.meta.url),
  "utf8"
);
if (!controller.includes(".hara-live-output, .hara-repl output")) {
  failures.push("syllabus controller must support both documentation runners");
}
if (!controller.includes("hara:reset-session") || !controller.includes("data-hara-session-group")) {
  failures.push("syllabus reset must request replacement of the named live session");
}

const styles = await readFile(
  new URL("../docs/stylesheets/syllabus.css", import.meta.url),
  "utf8"
);
if (!styles.includes("--sl-color-bg") || !styles.includes("--md-default-bg-color")) {
  failures.push("syllabus styles must support both Starlight and MkDocs variables");
}

if (!syllabusCount) failures.push("no interactive syllabi found");
if (failures.length) throw new Error(failures.join("\n"));
console.log(`validated ${syllabusCount} syllabi with ${stepCount} steps`);
