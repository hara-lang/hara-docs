import assert from "node:assert/strict";
import test from "node:test";

await import("./syllabus.js");

const {
  normalizeSource,
  completionMode,
  classifyRunnerState,
  completionSatisfied,
  decodeStoredState
} = globalThis.HaraLessons.__testing;

test("completion modes retain explicit lesson contracts", () => {
  assert.equal(completionMode("run-edit-run"), "run-edit-run");
  assert.equal(completionMode("unknown"), "manual");
  assert.equal(completionMode("unknown", { legacy: true }), "run");
});

test("stored lesson state filters stale steps and migrates syllabus arrays", () => {
  assert.deepEqual(decodeStoredState('["one","removed"]', ["one", "two"]), {
    version: 1,
    completed: ["one"],
    active: null,
    tasks: {}
  });

  assert.deepEqual(decodeStoredState({
    completed: ["two"],
    active: "two",
    tasks: { two: ["edit", 42], removed: ["old"] }
  }, ["one", "two"]), {
    version: 1,
    completed: ["two"],
    active: "two",
    tasks: { two: ["edit"] }
  });
});

test("runner state recognises the shared live-card output contract", () => {
  const output = {
    hidden: false,
    dataset: { state: "ready" },
    textContent: "42",
    classList: { contains: () => false },
    matches: (selector) => selector === ".hara-live-card-output",
    closest: () => null
  };
  assert.equal(classifyRunnerState(output), "success");
  output.dataset.state = "pending";
  output.textContent = "Evaluating…";
  assert.equal(classifyRunnerState(output), "pending");
  output.dataset.state = "error";
  output.textContent = "Unknown symbol";
  assert.equal(classifyRunnerState(output), "error");
});

test("run-edit-run requires both starter and changed executions", () => {
  const runtime = {
    ranAny: true,
    ranBaseline: true,
    ranChanged: false,
    signalMatched: false
  };
  assert.equal(completionSatisfied("run-edit-run", runtime), false);
  runtime.ranChanged = true;
  assert.equal(completionSatisfied("run-edit-run", runtime), true);
  assert.equal(completionSatisfied("tasks", runtime, 3, 2), false);
  assert.equal(completionSatisfied("tasks", runtime, 3, 3), true);
});

test("source comparison ignores line-ending and outer whitespace differences", () => {
  assert.equal(normalizeSource("\r\n(+ 1 2)\r\n"), "(+ 1 2)");
});
