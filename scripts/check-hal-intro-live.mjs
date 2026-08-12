#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const lessons = [
  ["01-basic-data.md", "hal-intro-01", 30, 2],
  ["02-functions-and-atoms.md", "hal-intro-02", 25, 1],
  ["03-iterators-and-streaming.md", "hal-intro-03", 30, 2],
  ["04-coroutines-and-promises.md", "hal-intro-04", 6, 18],
  ["05-array-and-object.md", "hal-intro-05", 33, 1],
  ["06-bytes-and-strings.md", "hal-intro-06", 26, 3],
  ["07-io-and-files.md", "hal-intro-07", 8, 17]
];

const failures = [];
const lessonRoot = new URL("../docs/hal-intro/", import.meta.url);

for (const [file, group, expectedLive, expectedStatic] of lessons) {
  const source = await readFile(new URL(file, lessonRoot), "utf8");
  const live = [...source.matchAll(/^```hara\s+eval\s+group=([^\s]+)\s*$/gm)];
  const liveBodies = [...source.matchAll(/^```hara\s+eval\s+group=[^\s]+\s*\n([\s\S]*?)^```\s*$/gm)]
    .map((match) => match[1]);
  const staticFences = [...source.matchAll(/^```hara\s*$/gm)];

  if (live.length !== expectedLive) {
    failures.push(`${file}: expected ${expectedLive} runnable Hara fences, found ${live.length}`);
  }
  if (staticFences.length !== expectedStatic) {
    failures.push(`${file}: expected ${expectedStatic} deliberate static Hara fences, found ${staticFences.length}`);
  }
  for (const fence of live) {
    if (fence[1] !== group) failures.push(`${file}: runnable fence must use group=${group}`);
  }
  for (const body of liveBodies) {
    if (/\(file\/(?:read|write)\b|std\.foundation\.coroutine|coroutine\//.test(body)) {
      failures.push(`${file}: unsupported capability/provider example must remain static`);
    }
  }
  if (/str\/(?:encode|decode)(?!-utf8)/.test(source)) {
    failures.push(`${file}: use the browser-supported encode-utf8/decode-utf8 names`);
  }
  if (/str\/to-(?:lower|upper)/.test(source)) {
    failures.push(`${file}: use current str/lower and str/upper names`);
  }
  for (const body of liveBodies) {
    if (/^\s*\(\([^\n]*\b(?:map|filter|take|drop|keep|partition)\b/.test(body.trim())) {
      failures.push(`${file}: runnable lazy values must end at a display-safe boundary`);
    }
  }
  if (!/reload the page to start\s+with a clean session/.test(source)) {
    failures.push(`${file}: explain the page-local lesson session and reload behavior`);
  }
}

const courseMap = await readFile(new URL("index.md", lessonRoot), "utf8");
if (/^```hara\s+eval\b/m.test(courseMap)) {
  failures.push("index.md: the course map must remain static");
}

if (failures.length) throw new Error(failures.join("\n"));
console.log(`validated ${lessons.length} HAL intro lessons with grouped live examples`);
