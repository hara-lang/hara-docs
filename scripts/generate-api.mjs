import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), "..");
const GENERATED_MARKER = "<!-- hara-api:generated -->";
const LEGACY_GENERATED_MARKER = "> This page is generated from Hara source.";

const optionValue = (args, name) => {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
};

export const parseOptions = (args) => ({
  input: optionValue(args, "--input"),
  haraRoot: optionValue(args, "--hara-root") ?? process.env.HARA_ROOT,
  output: optionValue(args, "--output") ?? resolve(root, "docs/api"),
  indexOutput: optionValue(args, "--index-output") ?? resolve(root, "generated/api-index.json"),
  check: args.includes("--check"),
  allowSchemaV1: args.includes("--allow-schema-v1"),
});

const gitValue = (checkout, args, fallback) => {
  try {
    return execFileSync("git", ["-C", checkout, ...args], { encoding: "utf8" }).trim() || fallback;
  } catch {
    return fallback;
  }
};

const defaultHaraRoot = () => {
  const legacy = resolve(root, "../..", "technology/hara");
  return existsSync(legacy) ? legacy : undefined;
};

export const loadManifest = async ({ input, haraRoot }) => {
  if (input) return JSON.parse(await readFile(resolve(process.cwd(), input), "utf8"));
  const selectedRoot = haraRoot ?? defaultHaraRoot();
  if (!selectedRoot) {
    throw new Error("Pass --input MANIFEST.json or --hara-root PATH; no implicit Hara checkout was found.");
  }
  const checkout = resolve(selectedRoot);
  const commit = gitValue(checkout, ["rev-parse", "HEAD"], "unknown");
  const sourceRef = gitValue(checkout, ["branch", "--show-current"], "detached");
  const raw = execFileSync("cargo", [
    "run", "--quiet",
    "--manifest-path", resolve(checkout, "core/rust/Cargo.toml"),
    "--bin", "hara-api-doc", "--",
    resolve(checkout, "core/lib/src"),
    resolve(checkout, "core/lib/test"),
    "--ref", sourceRef,
    "--commit", commit,
  ], { encoding: "utf8" });
  return JSON.parse(raw);
};

const requireString = (value, label) => {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} is required`);
  return value;
};

export const validateManifest = (api, { allowSchemaV1 = false } = {}) => {
  if (!api || !Number.isInteger(api.schemaVersion)) throw new Error("API manifest requires integer schemaVersion");
  if (api.schemaVersion === 1) {
    if (!allowSchemaV1) throw new Error("Schema-v1 API manifests require --allow-schema-v1 and cannot be published as pinned documentation");
  } else if (api.schemaVersion === 2) {
    requireString(api.source?.repository, "source.repository");
    const commit = requireString(api.source?.commit, "source.commit");
    if (commit === "unknown") throw new Error("source.commit must identify an immutable Hara revision");
    const digest = requireString(api.surfaceDigest, "surfaceDigest");
    if (!/^sha256:[0-9a-f]{64}$/.test(digest)) throw new Error("surfaceDigest must be a sha256 digest");
  } else {
    throw new Error(`Unsupported API manifest schemaVersion: ${api.schemaVersion}`);
  }
  if (!Array.isArray(api.namespaces)) throw new Error("API manifest requires namespaces");
  const current = new Set();
  for (const namespace of api.namespaces) {
    const name = requireString(namespace?.name, "namespace.name");
    if (current.has(name)) throw new Error(`Duplicate API namespace: ${name}`);
    current.add(name);
    if (!Array.isArray(namespace.definitions)) throw new Error(`Namespace ${name} requires definitions`);
  }
  const former = new Set();
  for (const migration of api.migrations ?? []) {
    const name = requireString(migration?.formerName, "migration.formerName");
    if (former.has(name)) throw new Error(`Duplicate API migration: ${name}`);
    if (current.has(name)) throw new Error(`Migration name is still current API: ${name}`);
    former.add(name);
  }
  return api;
};

const code = (value) => `\`${String(value).replaceAll("`", "\\`")}\``;
const summary = (namespace) => namespace.definitions.length === 1
  ? "1 public definition"
  : `${namespace.definitions.length} public definitions`;
const route = (name) => `./${name.replaceAll(".", "")}/`;

const provenanceLines = (api) => {
  if (api.schemaVersion !== 2) return ["> Generated from a legacy schema-v1 manifest without immutable source provenance.", ""];
  return [
    `Documented source: ${code(api.source.repository)} at ${code(api.source.commit)} (${code(api.source.ref ?? "detached")}).`,
    "",
    `Semantic surface: ${code(api.surfaceDigest)}. Manifest schema: ${code(api.schemaVersion)}.`,
    "",
  ];
};

export const renderNamespace = (api, namespace) => {
  const lines = [
    GENERATED_MARKER,
    "---", `title: ${namespace.name}`, `description: Generated API reference for ${namespace.name}.`, "---", "",
    `# ${code(namespace.name)}`, "",
    `Generated from ${code(namespace.source)} and its companion tests. ${summary(namespace)}.`, "",
    ...provenanceLines(api),
    "> This page is generated from the canonical Hara API manifest. Edit Hara source or tests, then regenerate it; do not edit this page by hand.", "",
  ];
  if (Array.isArray(namespace.profiles) && namespace.profiles.length) {
    lines.push(`Runtime profiles: ${namespace.profiles.map(code).join(", ")}.`, "");
  }
  for (const definition of namespace.definitions) {
    lines.push(`## ${code(definition.name)}`, "", `${definition.kind}${definition.signature ? ` · ${code(definition.signature)}` : ""}`, "");
    lines.push(definition.doc || "No source docstring is currently provided.", "");
    if (namespace.source && definition.line) lines.push(`Source: ${code(`${namespace.source}:${definition.line}`)}`, "");
  }
  if (namespace.examples?.length) {
    lines.push("## Examples from tests", "");
    for (const example of namespace.examples.slice(0, 3)) lines.push("```clojure", example, "```", "");
  }
  return `${lines.join("\n").trim()}\n`;
};

const replacementText = (migration) => {
  if (migration.replacement?.name) return `${migration.replacement.kind ?? "replacement"} ${code(migration.replacement.name)}`;
  if (migration.disposition) return migration.disposition;
  return "No direct replacement is declared.";
};

export const renderMigration = (api, migration) => {
  const name = migration.formerName;
  const lines = [
    GENERATED_MARKER,
    "---", `title: ${name} migration`, `description: Migration guidance for the former ${name} API.`, "---", "",
    `# ${code(name)}`, "",
    `Status: ${code(migration.status ?? "retired")}.`, "",
    `Current direction: ${replacementText(migration)}.`, "",
    migration.compatibility ?? "This former name is not part of the current public Foundation namespace set.", "",
    "## Update imports", "", migration.requireRewrite ?? "Remove the retired dependency and follow the current owner documented above.", "",
    "## Update calls", "", migration.callRewrite ?? "Rewrite qualified calls to the current owner documented above.", "",
  ];
  if (migration.plannedPortableReplacement) {
    lines.push("## Planned portable layer", "", `${code(migration.plannedPortableReplacement.name)} is marked ${code(migration.plannedPortableReplacement.status ?? "planned")}; this page does not claim it is available in the documented revision.`, "");
  }
  lines.push(...provenanceLines(api));
  lines.push("> This migration page is generated from Hara's canonical migration ledger.", "");
  return `${lines.join("\n").trim()}\n`;
};

export const renderIndex = (api) => {
  const current = api.namespaces.map((namespace) => `- [${code(namespace.name)}](${route(namespace.name)}) — ${summary(namespace)}`);
  const migrations = (api.migrations ?? []).map((migration) => `- [${code(migration.formerName)}](${route(migration.formerName)}) — ${migration.status ?? "retired"}`);
  const lines = [
    GENERATED_MARKER,
    "---", "title: Language API", "description: Source-derived reference for Hara's standard library.", "---", "",
    "# Language API", "",
    "This reference is generated from Hara's canonical public API manifest. Current namespaces and historical migration records are deliberately separated.", "",
    ...provenanceLines(api),
    "## Current namespaces", "", ...current, "",
    `Generated from ${api.namespaces.length} current namespaces and ${api.namespaces.reduce((count, namespace) => count + namespace.definitions.length, 0)} public definitions.`, "",
  ];
  if (migrations.length) lines.push("## Historical namespace migrations", "", ...migrations, "");
  return `${lines.join("\n").trim()}\n`;
};

export const expectedPages = (api) => {
  const pages = new Map([["index.md", renderIndex(api)]]);
  for (const namespace of api.namespaces) pages.set(`${namespace.name}.md`, renderNamespace(api, namespace));
  for (const migration of api.migrations ?? []) pages.set(`${migration.formerName}.md`, renderMigration(api, migration));
  return pages;
};

const readIfPresent = async (path) => {
  try { return await readFile(path, "utf8"); } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
};

const managedPage = (content) => content?.includes(GENERATED_MARKER) || content?.includes(LEGACY_GENERATED_MARKER);

export const reconcilePages = async (output, pages, { check = false } = {}) => {
  let entries = [];
  try { entries = await readdir(output, { withFileTypes: true }); } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const changed = [];
  for (const [name, content] of pages) {
    if (await readIfPresent(resolve(output, name)) !== content) changed.push(name);
  }
  const stale = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || pages.has(entry.name)) continue;
    const path = resolve(output, entry.name);
    if (managedPage(await readIfPresent(path))) stale.push(entry.name);
  }
  changed.sort();
  stale.sort();
  if (!check) {
    await mkdir(output, { recursive: true });
    for (const name of stale) await unlink(resolve(output, name));
    for (const name of changed) await writeFile(resolve(output, name), pages.get(name));
  }
  return { changed, stale };
};

export const generateFromManifest = async (api, {
  output = resolve(root, "docs/api"),
  indexOutput = resolve(root, "generated/api-index.json"),
  check = false,
  allowSchemaV1 = false,
} = {}) => {
  validateManifest(api, { allowSchemaV1 });
  const pages = expectedPages(api);
  const pageDrift = await reconcilePages(output, pages, { check });
  const indexContent = `${JSON.stringify(api, null, 2)}\n`;
  const indexChanged = await readIfPresent(indexOutput) !== indexContent;
  if (!check && indexChanged) {
    await mkdir(dirname(indexOutput), { recursive: true });
    await writeFile(indexOutput, indexContent);
  }
  return { ...pageDrift, indexChanged, pageCount: pages.size };
};

export const main = async (args = process.argv.slice(2)) => {
  const options = parseOptions(args);
  const api = await loadManifest(options);
  const result = await generateFromManifest(api, options);
  if (options.check && (result.changed.length || result.stale.length || result.indexChanged)) {
    throw new Error(`Generated API is stale: changed=${result.changed.join(",") || "none"}; stale=${result.stale.join(",") || "none"}; index=${result.indexChanged ? "changed" : "current"}`);
  }
  console.log(`${options.check ? "checked" : "generated"} ${result.pageCount} API and migration pages`);
};

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
