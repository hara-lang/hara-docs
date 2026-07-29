import test from "node:test";
import assert from "node:assert/strict";

import { prepareDocsEval } from "./kernel.js";

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
