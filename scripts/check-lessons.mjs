#!/usr/bin/env node
import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const COMPLETION_MODES = new Set([
  "manual",
  "run",
  "edit-run",
  "run-edit-run",
  "tasks",
  "signal"
]);
const RUN_MODES = new Set(["run", "edit-run", "run-edit-run"]);

async function markdownFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith(".md") ? [path] : [];
  }));
  return nested.flat();
}

function parseFences(source) {
  const lines = source.split(/(?<=\n)/);
  const structural = [];
  const fences = [];
  let offset = 0;
  let open = null;

  for (const line of lines) {
    if (!open) {
      const match = line.match(/^(\s*)(`{3,}|~{3,})([^\r\n]*)/);
      if (!match) {
        structural.push(line);
        offset += line.length;
        continue;
      }
      open = {
        marker: match[2][0],
        length: match[2].length,
        info: match[3].trim(),
        start: offset,
        end: source.length
      };
      structural.push(line.replace(/[^\r\n]/g, " "));
      offset += line.length;
      continue;
    }

    const close = line.match(/^\s*(`{3,}|~{3,})\s*(?:\r?\n)?$/);
    structural.push(line.replace(/[^\r\n]/g, " "));
    offset += line.length;
    if (close && close[1][0] === open.marker && close[1].length >= open.length) {
      open.end = offset;
      fences.push(open);
      open = null;
    }
  }

  if (open) fences.push(open);
  return { structural: structural.join(""), fences };
}

function attribute(attributes, name) {
  const match = String(attributes).match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1] ?? null;
}

function fenceGroup(meta = "") {
  const match = String(meta).match(
    /(?:^|\s)group(?:\s*=\s*|\s*:\s*|\s+)(?:"([^"]+)"|'([^']+)'|([^\s]+))/i
  );
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
}

function blocks(structural, attributeName) {
  const stack = [];
  const found = [];
  const tags = /<\/?div\b[^>]*>/gi;
  for (const match of structural.matchAll(tags)) {
    const token = match[0];
    if (!token.startsWith("</")) {
      stack.push({ token, start: match.index, contentStart: match.index + token.length });
      continue;
    }
    const open = stack.pop();
    if (!open) continue;
    const id = attribute(open.token, attributeName);
    if (!id) continue;
    found.push({
      attributes: open.token,
      id,
      body: structural.slice(open.contentStart, match.index),
      start: open.start,
      contentStart: open.contentStart,
      end: match.index + token.length
    });
  }
  return found.sort((left, right) => left.start - right.start);
}

const failures = [];
let lessonCount = 0;
let stepCount = 0;

for (const path of await markdownFiles(new URL("../docs", import.meta.url).pathname)) {
  const source = await readFile(path, "utf8");
  const { structural, fences } = parseFences(source);

  if (/data-hara-syllabus=|data-hara-step=/.test(structural)) {
    failures.push(`${path}: migrate legacy syllabus markup to data-hara-lesson`);
  }

  const lessonRoots = blocks(structural, "data-hara-lesson");
  if (!lessonRoots.length) continue;
  lessonCount += lessonRoots.length;

  if (lessonRoots.length !== 1) {
    failures.push(`${path}: keep one lesson component per page`);
  }

  const lesson = lessonRoots[0];
  if (!/-v\d+$/.test(lesson.id)) {
    failures.push(`${path}: lesson id must end in a version, received ${lesson.id}`);
  }
  if (!attribute(lesson.attributes, "data-hara-lesson-title")) {
    failures.push(`${path}: declare data-hara-lesson-title`);
  }

  const sessionGroup = attribute(lesson.attributes, "data-hara-session-group") ?? "";
  if (sessionGroup && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sessionGroup)) {
    failures.push(`${path}: data-hara-session-group must be kebab-case`);
  }

  const steps = blocks(lesson.body, "data-hara-lesson-step");
  stepCount += steps.length;
  if (steps.length < 2) failures.push(`${path}: a lesson needs at least two steps`);

  const identifiers = steps.map((step) => step.id);
  if (new Set(identifiers).size !== identifiers.length) {
    failures.push(`${path}: duplicate data-hara-lesson-step values`);
  }
  for (const id of identifiers) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      failures.push(`${path}: step id must be kebab-case, received ${id}`);
    }
  }

  let runnableStepCount = 0;
  for (const step of steps) {
    const mode = attribute(step.attributes, "data-hara-completion");
    if (!mode || !COMPLETION_MODES.has(mode)) {
      failures.push(`${path}: ${step.id} has invalid data-hara-completion ${mode ?? "<missing>"}`);
      continue;
    }
    if (!attribute(step.attributes, "data-hara-step-title")) {
      failures.push(`${path}: ${step.id} must declare data-hara-step-title`);
    }
    if (mode === "tasks" && !/data-hara-task="[^"]+"/.test(step.body)) {
      failures.push(`${path}: ${step.id} uses tasks completion without data-hara-task items`);
    }
    if (mode === "signal" && !attribute(step.attributes, "data-hara-signal")) {
      failures.push(`${path}: ${step.id} uses signal completion without data-hara-signal`);
    }
    if (!RUN_MODES.has(mode)) continue;
    runnableStepCount += 1;

    const absoluteStart = lesson.contentStart + step.start;
    const absoluteEnd = lesson.contentStart + step.end;
    const runnable = fences.filter((fence) =>
      fence.start >= absoluteStart
      && fence.end <= absoluteEnd
      && /^hara\s+eval(?:\s|$)/i.test(fence.info));
    if (!runnable.length) {
      failures.push(`${path}: ${step.id} needs a runnable Hara fence`);
    }
    if (sessionGroup) {
      for (const fence of runnable) {
        if (fenceGroup(fence.info) !== sessionGroup) {
          failures.push(`${path}: ${step.id} runnable fence must declare group=${sessionGroup}`);
        }
      }
    }
  }

  if (runnableStepCount > 0
      && !/^---[\s\S]*?hara_kernel_loading:\s*auto[\s\S]*?---/m.test(source)) {
    failures.push(`${path}: runnable lessons must set hara_kernel_loading: auto`);
  }
}

const controllerPath = new URL("../docs/javascripts/syllabus.js", import.meta.url);
const controller = await readFile(controllerPath, "utf8");
for (const contract of [
  "data-hara-lesson",
  ".hara-live-card-output",
  "run-edit-run",
  "data-hara-task",
  "hara:lesson-signal",
  "hara:lesson-progress",
  "hara:reset-session",
  "globalThis.HaraLessons"
]) {
  if (!controller.includes(contract)) {
    failures.push(`lesson controller is missing ${contract}`);
  }
}

const styles = await readFile(
  new URL("../docs/stylesheets/syllabus.css", import.meta.url),
  "utf8"
);
for (const contract of [
  "--sl-color-bg",
  "--md-default-bg-color",
  ".hara-lesson-progress",
  ".hara-lesson-step",
  ".hara-lesson-task",
  ".hara-lesson-complete"
]) {
  if (!styles.includes(contract)) failures.push(`lesson styles are missing ${contract}`);
}

try {
  await access(new URL("../docs/guides/authoring-lessons.md", import.meta.url));
} catch (_) {
  failures.push("missing lesson authoring guide");
}

if (!lessonCount) failures.push("no lesson components found");
if (failures.length) throw new Error(failures.join("\n"));
console.log(`validated ${lessonCount} lessons with ${stepCount} steps`);
