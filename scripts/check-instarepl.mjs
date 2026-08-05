#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const controller = await readFile(
  new URL("../docs/javascripts/instarepl.js", import.meta.url),
  "utf8"
);
const config = await readFile(new URL("../mkdocs.yml", import.meta.url), "utf8");

const requirements = [
  ["imports the structural form selector", /localFormAt/],
  ["adds an explicit Eval control", /hara-live-eval/],
  ["evaluates direct touch taps", /pointerType !== "touch"/],
  ["does not replace touch selections", /selectionStart !== editor\.selectionEnd/],
  ["routes evaluation through the existing Ctrl-E session", /ctrlKey: true/],
  ["renders HTA keywords", /HtaKeyword\.prototype\.toString/],
  ["renders HTA symbols", /HtaSymbol\.prototype\.toString/],
  ["handles dynamically mounted examples", /MutationObserver/]
];

const failures = requirements
  .filter(([, pattern]) => !pattern.test(controller))
  .map(([message]) => `instarepl controller ${message}`);

if (!/live-examples\.js[\s\S]*instarepl\.js/.test(config)) {
  failures.push("mkdocs must load instarepl.js after live-examples.js");
}

if (failures.length) throw new Error(failures.join("\n"));
console.log("validated Hara documentation InstaREPL integration");
