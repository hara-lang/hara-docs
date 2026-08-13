import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createDocsSessionRegistry,
  describeDocsSession
} from "../public/assets/docs-repl-state.js";
import remarkHaraEval, { parseHaraEvalScope } from "../scripts/remark-hara-eval.mjs";

test("describes isolated, page-global, and named group sessions", () => {
  const isolated = describeDocsSession({ pagePath: "/docs/start/orientation/", sequence: 2 });
  const global = describeDocsSession({ scope: "global", pagePath: "/docs/start/orientation/", sequence: 9 });
  const group = describeDocsSession({ scope: "group", groupName: "Board state", pagePath: "/docs/create/game/", sequence: 3 });

  assert.deepEqual(isolated, {
    scope: "isolated",
    label: "isolated",
    id: "docs-start-orientation-2",
    filesystem: "memory:docs-start-orientation-2",
    sharedWith: "this runner only"
  });
  assert.equal(global.label, "global");
  assert.equal(global.id, "docs-start-orientation-global");
  assert.equal(group.label, "group Board state");
  assert.equal(group.id, "docs-create-game-group-board-state");
});

test("reuses one session promise for repeated evaluations", async () => {
  const calls = [];
  const kernel = {
    async createSession(id, options) {
      calls.push([id, options]);
      return { id };
    }
  };
  const registry = createDocsSessionRegistry(Promise.resolve(kernel));
  const descriptor = describeDocsSession({ pagePath: "/docs/start/orientation/", sequence: 1 });

  const first = registry.get(descriptor);
  const second = registry.get(descriptor);
  assert.strictEqual(first, second);
  assert.deepEqual(await first, { id: descriptor.id });
  assert.deepEqual(calls, [[descriptor.id, { filesystem: descriptor.filesystem }]]);
});

test("closes and replaces a named session exactly once during reset", async () => {
  const created = [];
  const closed = [];
  const kernel = {
    async createSession(id, options) {
      const generation = created.length + 1;
      created.push([id, options, generation]);
      return {
        id,
        generation,
        async close() {
          closed.push(generation);
        }
      };
    }
  };
  const registry = createDocsSessionRegistry(Promise.resolve(kernel));
  const descriptor = describeDocsSession({
    scope: "group",
    groupName: "lesson",
    pagePath: "/docs/learn/first-contact/"
  });

  const first = await registry.get(descriptor);
  const firstReset = registry.reset(descriptor);
  const repeatedReset = registry.reset(descriptor);
  assert.strictEqual(firstReset, repeatedReset);

  const replacement = await firstReset;
  assert.notStrictEqual(first, replacement);
  assert.equal(replacement.generation, 2);
  assert.deepEqual(closed, [1]);
  assert.equal(registry.revision(descriptor), 1);
  assert.strictEqual(await registry.get(descriptor), replacement);
});

test("shares global and named group sessions but not isolated sessions", () => {
  const firstGlobal = describeDocsSession({ scope: "global", pagePath: "/docs/start/", sequence: 1 });
  const secondGlobal = describeDocsSession({ scope: "global", pagePath: "/docs/start/", sequence: 2 });
  const firstGroup = describeDocsSession({ scope: "group", groupName: "lesson", pagePath: "/docs/start/", sequence: 1 });
  const secondGroup = describeDocsSession({ scope: "group", groupName: "lesson", pagePath: "/docs/start/", sequence: 2 });
  const firstIsolated = describeDocsSession({ pagePath: "/docs/start/", sequence: 1 });
  const secondIsolated = describeDocsSession({ pagePath: "/docs/start/", sequence: 2 });

  assert.equal(firstGlobal.id, secondGlobal.id);
  assert.equal(firstGroup.id, secondGroup.id);
  assert.notEqual(firstIsolated.id, secondIsolated.id);
});

test("parses documentation evaluator scopes", () => {
  assert.deepEqual(parseHaraEvalScope("eval"), { scope: "isolated", groupName: "" });
  assert.deepEqual(parseHaraEvalScope("eval global"), { scope: "global", groupName: "" });
  assert.deepEqual(parseHaraEvalScope("eval group=lesson"), { scope: "group", groupName: "lesson" });
  assert.deepEqual(parseHaraEvalScope('eval group "Board state"'), { scope: "group", groupName: "Board state" });
});

test("emits scope metadata on runnable Hara fences", () => {
  const tree = {
    type: "root",
    children: [
      { type: "code", lang: "clojure", meta: "eval global", value: "(+ 19 23)" },
      { type: "code", lang: "clojure", meta: "eval group=lesson", value: "(def answer 42)" }
    ]
  };

  remarkHaraEval()(tree);
  assert.match(tree.children[0].value, /data-hara-scope="global"/);
  assert.match(tree.children[1].value, /data-hara-scope="group"/);
  assert.match(tree.children[1].value, /data-hara-group="lesson"/);
});

test("runnable docs use canonical /docs live-card assets", async () => {
  const repl = await readFile(new URL("../public/assets/docs-repl.js", import.meta.url), "utf8");
  assert.match(repl, /from "\/docs\/docs-assets\/live\/kernel\.js"/);
  assert.match(repl, /from "\/docs\/docs-assets\/live\/live-card\.js"/);
  assert.match(repl, /from "\/docs\/docs-assets\/live\/snippets\.js"/);
  assert.match(repl, /mountLiveCard/);
  assert.match(repl, /sessionProxyKernel/);
  assert.match(repl, /progress\.toast\.remove\(\)/);
  assert.doesNotMatch(repl, /\/docs\/docs\/docs-assets/);
});

test("tutorial canvases and reset keep the shared component contract", async () => {
  const repl = await readFile(new URL("../public/assets/docs-repl.js", import.meta.url), "utf8");
  const live = await readFile(new URL("../../vendor/hara-ui/packages/live/src/live-card.js", import.meta.url), "utf8");
  const state = await readFile(new URL("../public/assets/docs-repl-state.js", import.meta.url), "utf8");
  assert.match(repl, /docsSnippet\(descriptor, source, "canvas"\)/);
  assert.match(repl, /kernel: directSessionKernel\(sessions, descriptor\)/);
  assert.match(repl, /hara:reset-session/);
  assert.match(repl, /matching\.forEach\(\(runner\) => runner\.beginReset\(\)\)/);
  assert.match(live, /operation \+= 1/);
  assert.match(state, /await session\.close\?\.\(\)/);
});
