import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { describeDocsRuntimeEvidence } from "../public/assets/docs-repl-evidence.js";
import { describeDocsSession } from "../public/assets/docs-repl-state.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("runtime evidence preserves the exact session fence and monotonic generation", () => {
  const descriptor = describeDocsSession({
    scope: "group",
    groupName: "Board state",
    pagePath: "/docs/create/game/"
  });
  const evidence = describeDocsRuntimeEvidence(descriptor, {
    revision: 2,
    route: "/docs/create/game/",
    capabilities: ["eval", "observations", "eval", "memory filesystem"]
  });

  assert.deepEqual(evidence, {
    scope: "group",
    scopeLabel: "group Board state",
    sessionId: "docs-create-game-group-board-state",
    filesystem: "memory:docs-create-game-group-board-state",
    sharedWith: "group Board state on this page",
    generation: 3,
    route: "/docs/create/game/",
    capabilities: ["eval", "observations", "memory filesystem"]
  });
});

test("missing optional evidence stays explicit rather than becoming an empty claim", () => {
  const evidence = describeDocsRuntimeEvidence({}, { revision: -4, capabilities: [] });
  assert.equal(evidence.scope, "isolated");
  assert.equal(evidence.sessionId, "unassigned");
  assert.equal(evidence.filesystem, "unavailable");
  assert.equal(evidence.generation, 1);
  assert.deepEqual(evidence.capabilities, []);
});

test("runnable and canvas surfaces mount the same evidence grammar without changing kernels", async () => {
  const repl = await read("public/assets/docs-repl.js");
  assert.match(repl, /from "\.\/docs-repl-evidence\.js"/);
  assert.match(repl, /mountDocsRuntimeEvidence\(mount, descriptor/);
  assert.match(repl, /capabilities: \["eval", "observations", "memory filesystem"\]/);
  assert.match(repl, /capabilities: \["eval", "observations", "memory filesystem", "canvas\/2d"\]/);
  assert.match(repl, /kernel: sessionProxyKernel\(sessions, descriptor\)/);
  assert.match(repl, /kernel: directSessionKernel\(sessions, descriptor\)/);
  assert.match(repl, /matching\.forEach\(\(runner\) => runner\.refreshEvidence\(\)\)/);
});

test("the evidence disclosure mirrors connection state without adding a competing live region", async () => {
  const source = await read("public/assets/docs-repl-evidence.js");
  for (const field of ["Scope", "Session", "Generation", "Filesystem", "Shared with", "Route", "Declared surface"]) {
    assert.match(source, new RegExp(`"${field}"`));
  }
  assert.match(source, /data-connection-state/);
  assert.match(source, /MutationObserver/);
  assert.match(source, /data-docs-runtime-generation/);
  assert.doesNotMatch(source, /aria-live/);
  assert.doesNotMatch(source, /innerHTML\s*=/, "runtime identity and group labels must be inserted as text, not HTML");
});

test("the v2 runtime evidence styles use words, structure, compact reflow and reduced motion", async () => {
  const css = await read("src/styles/v2-runtime-evidence.css");
  for (const state of ["loading", "busy", "ready", "error"]) {
    assert.match(css, new RegExp(`data-state=\\"${state}\\"`));
  }
  assert.match(css, /grid-template-columns:\s*repeat\(4/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "Docs may consume but not redefine protected v2 tokens");
});

test("Starlight loads runtime evidence after the baseline v2 mapping", async () => {
  const config = await read("astro.config.mjs");
  assert.match(config, /"\.\/src\/styles\/docs\.css"[\s\S]*?"\.\/src\/styles\/v2-adoption\.css"[\s\S]*?"\.\/src\/styles\/v2-runtime-evidence\.css"/);
});
