import test from "node:test";
import assert from "node:assert/strict";

import { createDocsKernel, prepareDocsEval } from "./kernel.js";

test("definitions are left intact so the runtime can return their Var", () => {
  assert.deepEqual(prepareDocsEval("(defn rank [score]\n  score)"), {
    source: "(defn rank [score]\n  score)",
    label: null
  });
});

test("anonymous functions use a serializable result", () => {
  assert.deepEqual(prepareDocsEval("(fn [score] (+ score 10))"), {
    source: "(do (fn [score] (+ score 10))\n nil)",
    label: "<function>"
  });
});

test("ordinary forms are evaluated unchanged", () => {
  assert.deepEqual(prepareDocsEval("(rank 70)"), {
    source: "(rank 70)",
    label: null
  });
});

test("all resources load before the kernel worker starts", async () => {
  const order = [];
  const responses = new Map([
    ["/hara.wasm", {
      ok: true,
      arrayBuffer: async () => {
        order.push("wasm-loaded");
        return new ArrayBuffer(1);
      }
    }],
    ["/studio.fs.hal", {
      ok: true,
      text: async () => {
        order.push("resource-loaded");
        return "(ns studio.fs)";
      }
    }]
  ]);
  class FakeWorker {
    constructor() {
      order.push("worker-started");
    }
  }
  class FakeContext {
    constructor() {
      this.ready = Promise.resolve();
      this.calls = [];
    }
    async call(target, args) {
      order.push(target);
      this.calls.push([target, args]);
      return true;
    }
    close() {}
    async createSession() {
      throw new Error("not used");
    }
  }

  const kernel = await createDocsKernel({
    wasmUrl: "/hara.wasm",
    workerUrl: "/hta-worker.js",
    resources: { "studio.fs": "/studio.fs.hal" },
    fetchAsset: async (url) => responses.get(url),
    WorkerClass: FakeWorker,
    ContextClass: FakeContext
  });

  assert.deepEqual(order, [
    "wasm-loaded",
    "resource-loaded",
    "worker-started",
    "register-resources"
  ]);
  assert.deepEqual(kernel.context.calls, [[
    "register-resources",
    [[["studio.fs", "(ns studio.fs)"]]]
  ]]);
});
