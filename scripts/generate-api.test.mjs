import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import {
  expectedPages,
  generateFromManifest,
  renderIndex,
  validateManifest,
} from "./generate-api.mjs";

const manifest = () => ({
  schemaVersion: 2,
  source: {
    repository: "https://github.com/hara-lang/hara",
    ref: "main",
    commit: "f336c05d4e147a217b3f650bf31fc0ebc23cd208",
  },
  surfaceDigest: `sha256:${"a".repeat(64)}`,
  namespaces: [{
    name: "std.foundation",
    source: "std/foundation.hal",
    profiles: ["jvm", "rust", "wasm"],
    definitions: [{
      name: "identity",
      kind: "defn",
      doc: "Returns its argument unchanged.",
      signature: "[value]",
      line: 63,
    }],
    examples: [],
  }],
  migrations: [{
    formerName: "std.foundation.file",
    status: "moved",
    replacement: { kind: "native-static-object", name: "File" },
    plannedPortableReplacement: { name: "std.fs", status: "planned" },
    requireRewrite: "Remove the old dependency.",
    callRewrite: "Use File/... for current native primitives.",
    compatibility: "The old namespace is not current API.",
  }],
});

const withTemp = async (callback) => {
  const directory = await mkdtemp(resolve(tmpdir(), "hara-api-"));
  try { return await callback(directory); } finally { await rm(directory, { recursive: true, force: true }); }
};

test("generation prunes managed stale pages and preserves authored pages", async () => withTemp(async (directory) => {
  const output = resolve(directory, "api");
  const indexOutput = resolve(directory, "generated/api-index.json");
  await import("node:fs/promises").then(({ mkdir }) => mkdir(output, { recursive: true }));
  await writeFile(resolve(output, "std.foundation.edn.md"), "> This page is generated from Hara source.\n");
  await writeFile(resolve(output, "notes.md"), "# Authored notes\n");

  const result = await generateFromManifest(manifest(), { output, indexOutput });
  assert.deepEqual(result.stale, ["std.foundation.edn.md"]);
  assert.match(await readFile(resolve(output, "std.foundation.file.md"), "utf8"), /Status: `moved`/);
  assert.equal(await readFile(resolve(output, "notes.md"), "utf8"), "# Authored notes\n");

  const checked = await generateFromManifest(manifest(), { output, indexOutput, check: true });
  assert.deepEqual(checked.changed, []);
  assert.deepEqual(checked.stale, []);
  assert.equal(checked.indexChanged, false);
}));

test("check mode reports edited generated output without changing it", async () => withTemp(async (directory) => {
  const output = resolve(directory, "api");
  const indexOutput = resolve(directory, "generated/api-index.json");
  await generateFromManifest(manifest(), { output, indexOutput });
  await writeFile(resolve(output, "std.foundation.md"), "edited\n");
  const result = await generateFromManifest(manifest(), { output, indexOutput, check: true });
  assert.deepEqual(result.changed, ["std.foundation.md"]);
  assert.equal(await readFile(resolve(output, "std.foundation.md"), "utf8"), "edited\n");
}));

test("rendering is deterministic and separates migrations", () => {
  const api = manifest();
  assert.equal(renderIndex(api), renderIndex(api));
  const pages = expectedPages(api);
  assert.deepEqual([...pages.keys()], ["index.md", "std.foundation.md", "std.foundation.file.md"]);
  assert.match(pages.get("index.md"), /## Current namespaces/);
  assert.match(pages.get("index.md"), /## Historical namespace migrations/);
});

test("schema v2 publication requires immutable provenance", () => {
  const api = manifest();
  api.source.commit = "unknown";
  assert.throws(() => validateManifest(api), /immutable Hara revision/);
});

test("schema v1 is a bounded opt-in compatibility path", () => {
  const api = { schemaVersion: 1, namespaces: [] };
  assert.throws(() => validateManifest(api), /--allow-schema-v1/);
  assert.equal(validateManifest(api, { allowSchemaV1: true }), api);
});
