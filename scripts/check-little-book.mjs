#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const chapters = [
  ["01", "01-values-have-shapes.md", "01 — Values Have Shapes"],
  ["02", "02-ask-again.md", "02 — Ask Again"],
  ["03", "03-build-on-return.md", "03 — Build on Return"],
  ["04", "04-number-games.md", "04 — Number Games"],
  ["05", "05-trees-of-values.md", "05 — Trees of Values"],
  ["06", "06-forms-have-meaning.md", "06 — Forms Have Meaning"],
  ["07", "07-sets-and-relations.md", "07 — Sets and Relations"],
  ["08", "08-functions-make-functions.md", "08 — Functions Make Functions"],
  ["09", "09-recursion-without-a-name.md", "09 — Recursion Without a Name"],
  ["10", "10-the-value-of-a-form.md", "10 — The Value of a Form"]
].map(([number, file, label]) => ({
  number,
  file,
  label,
  group: `little-hal-${number}`,
  lesson: `little-hal-${number}-v1`,
  path: `books/the-little-book-of-hal/docs/${file}`
}));

const bookRoot = new URL("../docs/books/the-little-book-of-hal/", import.meta.url);
const docsRoot = new URL("docs/", bookRoot);
const failures = [];
let stepCount = 0;

const index = await readFile(new URL("index.md", docsRoot), "utf8");
if (!index.includes("https://github.com/pkrumins/the-little-schemer")) {
  failures.push("book introduction must attribute the example repository");
}
if (!index.includes("original HAL adaptation")) {
  failures.push("book introduction must state that the work is an original HAL adaptation");
}
for (const chapter of chapters) {
  if (!index.includes(`href=\"./${chapter.file.replace(/\.md$/, "/")}\"`)) {
    failures.push(`book introduction is missing the ${chapter.number} chapter card`);
  }

  let source;
  try {
    source = await readFile(new URL(chapter.file, docsRoot), "utf8");
  } catch (_) {
    failures.push(`missing chapter ${chapter.file}`);
    continue;
  }

  if (!/^---[\s\S]*?hara_kernel_loading:\s*auto[\s\S]*?---/m.test(source)) {
    failures.push(`${chapter.file}: runnable chapter must set hara_kernel_loading: auto`);
  }
  if (!source.includes(`data-hara-lesson=\"${chapter.lesson}\"`)) {
    failures.push(`${chapter.file}: expected lesson id ${chapter.lesson}`);
  }
  if (!source.includes(`data-hara-session-group=\"${chapter.group}\"`)) {
    failures.push(`${chapter.file}: expected grouped session ${chapter.group}`);
  }

  const steps = [...source.matchAll(/data-hara-lesson-step=\"([^\"]+)\"/g)];
  const completionModes = [...source.matchAll(/data-hara-completion=\"run-edit-run\"/g)];
  const fenceMarker = "```hara eval group=" + chapter.group;
  const fences = source.split(/\r?\n/)
    .filter((line) => line.trim() === fenceMarker);

  stepCount += steps.length;
  if (steps.length < 3) {
    failures.push(`${chapter.file}: expected at least three lesson steps`);
  }
  if (completionModes.length !== steps.length) {
    failures.push(`${chapter.file}: every step must use run-edit-run completion`);
  }
  if (fences.length < steps.length) {
    failures.push(`${chapter.file}: expected at least one grouped runnable fence per step`);
  }
  const identifiers = steps.map((match) => match[1]);
  if (new Set(identifiers).size !== identifiers.length) {
    failures.push(`${chapter.file}: duplicate lesson step identifiers`);
  }
}

const nestedNav = await readFile(new URL("mkdocs.yml", bookRoot), "utf8");
for (const chapter of chapters) {
  if (!nestedNav.includes(chapter.file)) {
    failures.push(`nested MkDocs navigation is missing ${chapter.file}`);
  }
}

const manifest = JSON.parse(await readFile(
  new URL("../docs-manifest.json", import.meta.url),
  "utf8"
));
const route = manifest.routeTrees?.find((item) => item.id === "little-book");
if (!route) {
  failures.push("docs manifest is missing the little-book route tree");
} else {
  const expected = [
    "books/the-little-book-of-hal/docs/index.md",
    ...chapters.map((chapter) => chapter.path)
  ];
  const actual = route.items?.map((item) => item.path) ?? [];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push("little-book route tree does not contain the complete ordered book");
  }
}

if (failures.length) throw new Error(failures.join("\n"));
console.log(
  `validated The Little Book of HAL: ${chapters.length} chapters and ${stepCount} interactive steps`
);
