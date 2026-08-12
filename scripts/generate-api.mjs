import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = resolve(root, "../..");
const inputFlag = process.argv.indexOf("--input");
const raw = inputFlag >= 0
  ? await readFile(resolve(process.cwd(), process.argv[inputFlag + 1]), "utf8")
  : execFileSync("cargo", [
      "run", "--quiet", "--manifest-path", resolve(workspace, "technology/hara/core/rust/Cargo.toml"),
      "--bin", "hara-api-doc", "--",
      resolve(workspace, "technology/hara/core/lib/src"),
      resolve(workspace, "technology/hara/core/lib/test"),
    ], { encoding: "utf8" });
const api = JSON.parse(raw);
const output = resolve(root, "docs/api");
await mkdir(output, { recursive: true });
await mkdir(resolve(root, "generated"), { recursive: true });

const title = (name) => name;
const summary = (ns) => ns.definitions.length === 1 ? "1 public definition" : `${ns.definitions.length} public definitions`;
const code = (value) => `\`${String(value).replaceAll("`", "\\`")}\``;

for (const ns of api.namespaces) {
  const lines = [
    "---", `title: ${title(ns.name)}`, `description: Generated API reference for ${ns.name}.`, "---", "",
    `# ${code(ns.name)}`, "",
    `Generated from ${code(ns.source)} and its companion tests. ${summary(ns)}.`, "",
    "> This page is generated from Hara source. Edit the source or tests, then regenerate it; do not edit this page by hand.", "",
  ];
  for (const def of ns.definitions) {
    lines.push(`## ${code(def.name)}`, "", `${def.kind}${def.signature ? ` · ${code(def.signature)}` : ""}`, "");
    lines.push(def.doc || "No source docstring is currently provided.", "");
    lines.push(`Source: ${code(`${ns.source}:${def.line}`)}`, "");
  }
  if (ns.examples.length) {
    lines.push("## Examples from tests", "");
    for (const example of ns.examples.slice(0, 3)) lines.push("```clojure", example, "```", "");
  }
  await writeFile(resolve(output, `${ns.name}.md`), `${lines.join("\n").trim()}\n`);
}

const index = [
  "---", "title: Language API", "description: Source-derived reference for Hara's std.foundation library.", "---", "",
  "# Language API", "",
  "This reference is generated from the public definitions and test facts in Hara's `std.foundation` source family. It is an index, not a second learning path.", "",
  ...api.namespaces.flatMap((ns) => [`- [${code(ns.name)}](./${ns.name.replaceAll(".", "")}/) — ${summary(ns)}`]), "",
  `Generated from ${api.namespaces.length} namespaces and ${api.namespaces.reduce((count, ns) => count + ns.definitions.length, 0)} public definitions.`,
];
await writeFile(resolve(output, "index.md"), `${index.join("\n")}\n`);
await writeFile(resolve(root, "generated/api-index.json"), `${JSON.stringify(api, null, 2)}\n`);
console.log(`generated ${api.namespaces.length} Foundation API namespace pages`);
