(() => {
  "use strict";

  const ROOT_SELECTOR = "[data-hara-lesson], [data-hara-syllabus]";
  const STEP_SELECTOR = "[data-hara-lesson-step], [data-hara-step]";
  const OUTPUT_SELECTOR = ".hara-live-card-output, .hara-live-output, .hara-repl output";
  const EDITOR_SELECTOR = ".hara-live-card textarea, .hara-live-editor, .hara-repl textarea";
  const COMPLETION_MODES = new Set([
    "manual",
    "run",
    "edit-run",
    "run-edit-run",
    "tasks",
    "signal"
  ]);
  const STORAGE_VERSION = 1;
  const controllers = new Map();

  const ready = (fn) => {
    if (typeof document === "undefined") return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const normalizeSource = (source) => String(source ?? "")
    .replace(/\r\n?/g, "\n")
    .trim();

  const slug = (value, fallback) => {
    const normalized = String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || fallback;
  };

  const completionMode = (value, { legacy = false } = {}) => {
    const normalized = String(value ?? "").trim().toLowerCase();
    if (COMPLETION_MODES.has(normalized)) return normalized;
    return legacy ? "run" : "manual";
  };

  const classifyRunnerState = (output) => {
    if (!output || output.hidden) return "idle";
    const declared = String(output.dataset?.state ?? "").toLowerCase();
    const text = String(output.textContent ?? "").trim();
    const normalized = text.toLowerCase();

    if (declared === "error"
        || output.classList?.contains("is-error")
        || normalized.startsWith("error")) return "error";
    if (declared === "pending"
        || output.classList?.contains("is-pending")
        || normalized.includes("evaluating")) return "pending";
    if (declared === "ready") return "success";
    if (output.matches?.(".hara-live-card-output") && text) return "success";
    if (output.matches?.(".hara-live-output") && text.startsWith("=>")) return "success";
    if (output.closest?.(".hara-repl") && text) return "success";
    return "idle";
  };

  const completionSatisfied = (mode, runtime, taskCount = 0, completedTaskCount = 0) => {
    if (mode === "run") return runtime.ranAny;
    if (mode === "edit-run") return runtime.ranChanged;
    if (mode === "run-edit-run") return runtime.ranBaseline && runtime.ranChanged;
    if (mode === "tasks") return taskCount > 0 && completedTaskCount === taskCount;
    if (mode === "signal") return runtime.signalMatched;
    return false;
  };

  const decodeStoredState = (raw, validStepIds = []) => {
    const valid = new Set(validStepIds);
    let parsed = raw;
    if (typeof raw === "string") {
      try {
        parsed = JSON.parse(raw);
      } catch (_) {
        parsed = null;
      }
    }

    if (Array.isArray(parsed)) {
      return {
        version: STORAGE_VERSION,
        completed: parsed.filter((id) => valid.has(id)),
        active: null,
        tasks: {}
      };
    }

    if (!parsed || typeof parsed !== "object") {
      return { version: STORAGE_VERSION, completed: [], active: null, tasks: {} };
    }

    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter((id) => valid.has(id))
      : [];
    const active = valid.has(parsed.active) ? parsed.active : null;
    const tasks = {};
    if (parsed.tasks && typeof parsed.tasks === "object") {
      for (const [stepId, values] of Object.entries(parsed.tasks)) {
        if (!valid.has(stepId) || !Array.isArray(values)) continue;
        tasks[stepId] = values.filter((value) => typeof value === "string");
      }
    }
    return { version: STORAGE_VERSION, completed, active, tasks };
  };

  const readStorage = (key, legacyKey, validStepIds) => {
    if (typeof localStorage === "undefined") {
      return decodeStoredState(null, validStepIds);
    }
    try {
      const current = localStorage.getItem(key);
      if (current !== null) return decodeStoredState(current, validStepIds);
      const legacy = legacyKey ? localStorage.getItem(legacyKey) : null;
      return decodeStoredState(legacy, validStepIds);
    } catch (_) {
      return decodeStoredState(null, validStepIds);
    }
  };

  const writeStorage = (key, state) => {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (_) {
      // Lessons remain usable when storage is denied or unavailable.
    }
  };

  const reducedMotion = () => typeof matchMedia === "function"
    && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const element = (tag, className, text = null) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== null) node.textContent = text;
    return node;
  };

  class LessonController {
    constructor(root) {
      this.root = root;
      this.legacy = !root.dataset.haraLesson && Boolean(root.dataset.haraSyllabus);
      this.id = root.dataset.haraLesson ?? root.dataset.haraSyllabus ?? "";
      this.title = root.dataset.haraLessonTitle
        ?? root.dataset.haraSyllabusTitle
        ?? "Lesson";
      this.sessionGroup = String(root.dataset.haraSessionGroup ?? "").trim();
      this.sequential = root.dataset.haraSequential !== "false";
      this.storageKey = `hara-lesson:${this.id}`;
      this.legacyStorageKey = this.legacy ? `hara-syllabus:${this.id}` : null;
      this.steps = [];
      this.stepById = new Map();
      this.boundOutputs = new WeakSet();
      this.runnerObservers = [];
      this.progress = null;
      this.completionPanel = null;
      this.destroyed = false;
    }

    mount() {
      if (!this.id || this.root.dataset.haraLessonReady === "true") return this;
      this.root.dataset.haraLessonReady = "true";
      this.root.dataset.haraLesson = this.id;
      this.root.classList.add("hara-lesson");

      const candidates = [...this.root.querySelectorAll(STEP_SELECTOR)];
      this.steps = candidates.map((step, index) => this.prepareStep(step, index));
      this.steps.forEach((step) => this.stepById.set(step.id, step));
      if (!this.steps.length) return this;

      const stored = readStorage(
        this.storageKey,
        this.legacyStorageKey,
        this.steps.map((step) => step.id)
      );
      this.completed = new Set(stored.completed);
      this.activeId = stored.active;
      this.taskState = new Map(Object.entries(stored.tasks)
        .map(([stepId, values]) => [stepId, new Set(values)]));

      const firstIncomplete = this.steps.find((step) => !this.completed.has(step.id));
      if (!this.activeId || (this.completed.has(this.activeId) && firstIncomplete)) {
        this.activeId = firstIncomplete?.id ?? this.steps[0].id;
      }

      this.progress = this.createProgress();
      this.root.prepend(this.progress.element);
      this.completionPanel = this.createCompletionPanel();
      this.root.append(this.completionPanel);

      for (const step of this.steps) {
        this.createStepChrome(step);
        this.prepareTasks(step);
        this.attachRunner(step);
      }

      this.render();
      return this;
    }

    prepareStep(node, index) {
      const heading = node.querySelector("h2, h3, h4");
      const title = node.dataset.haraStepTitle
        ?? heading?.textContent?.replace(/^\s*\d+\s*[—–-]\s*/, "").trim()
        ?? `Step ${index + 1}`;
      const id = node.dataset.haraLessonStep
        ?? node.dataset.haraStep
        ?? slug(title, `step-${index + 1}`);
      const mode = completionMode(node.dataset.haraCompletion, { legacy: this.legacy });
      const signal = String(node.dataset.haraSignal ?? "").trim();

      node.dataset.haraLessonStep = id;
      node.classList.add("hara-lesson-step");
      if (!node.id) node.id = `${slug(this.id, "lesson")}--${slug(id, `step-${index + 1}`)}`;

      return {
        node,
        id,
        index,
        title,
        mode,
        signal,
        tasks: [],
        runtime: {
          baselineSource: null,
          sourceChanged: false,
          ranAny: false,
          ranBaseline: false,
          ranChanged: false,
          signalMatched: false,
          runnerState: "idle"
        },
        ui: null
      };
    }

    createProgress() {
      const aside = element("aside", "hara-lesson-progress");
      aside.setAttribute("aria-label", `${this.title} progress`);

      const top = element("div", "hara-lesson-progress__top");
      const copy = element("div", "hara-lesson-progress__copy");
      const eyebrow = element("span", "hara-lesson-progress__eyebrow", this.title.toUpperCase());
      const count = element("strong", "hara-lesson-progress__count");
      count.setAttribute("aria-live", "polite");
      const current = element("span", "hara-lesson-progress__current");
      copy.append(eyebrow, count, current);

      const reset = element("button", "hara-lesson-button hara-lesson-button--quiet", "Reset lesson");
      reset.type = "button";
      reset.addEventListener("click", () => this.reset());
      top.append(copy, reset);

      const outline = element("ol", "hara-lesson-outline");
      outline.setAttribute("aria-label", `${this.title} steps`);
      const outlineButtons = this.steps.map((step) => {
        const item = element("li", "hara-lesson-outline__item");
        const button = element("button", "hara-lesson-outline__button");
        button.type = "button";
        button.dataset.haraOutlineStep = step.id;
        button.setAttribute("aria-controls", step.node.id);
        const number = element("span", "hara-lesson-outline__number", String(step.index + 1));
        const label = element("span", "hara-lesson-outline__label", step.title);
        button.append(number, label);
        button.addEventListener("click", () => this.setActive(step.id, { scroll: true }));
        item.append(button);
        outline.append(item);
        return button;
      });

      const track = element("div", "hara-lesson-progress__bar");
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", `${this.title} completion`);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(this.steps.length));
      const bar = element("span", "hara-lesson-progress__fill");
      track.append(bar);

      aside.append(top, outline, track);
      return { element: aside, count, current, reset, track, bar, outlineButtons };
    }

    createCompletionPanel() {
      const panel = element("section", "hara-lesson-complete");
      panel.hidden = true;
      panel.setAttribute("aria-live", "polite");
      const mark = element("span", "hara-lesson-complete__mark", "✓");
      mark.setAttribute("aria-hidden", "true");
      const copy = element("div", "hara-lesson-complete__copy");
      copy.append(
        element("strong", "", `${this.title} complete`),
        element("span", "", "You can review any step or reset the lesson and run it again.")
      );
      const review = element("button", "hara-lesson-button", "Review from step 1");
      review.type = "button";
      review.addEventListener("click", () => this.setActive(this.steps[0].id, { scroll: true }));
      panel.append(mark, copy, review);
      return panel;
    }

    createStepChrome(step) {
      const meta = element("div", "hara-lesson-step__meta");
      const position = element(
        "span",
        "hara-lesson-step__position",
        `Step ${step.index + 1} of ${this.steps.length}`
      );
      const state = element("span", "hara-lesson-step__state");
      meta.append(position, state);
      step.node.prepend(meta);

      const footer = element("footer", "hara-lesson-step__footer");
      const feedback = element("div", "hara-lesson-step__feedback");
      const criteria = element("ul", "hara-lesson-criteria");
      criteria.setAttribute("aria-label", "Completion requirements");
      const status = element("span", "hara-lesson-step__status");
      status.setAttribute("aria-live", "polite");
      feedback.append(criteria, status);

      const actions = element("div", "hara-lesson-step__actions");
      const back = element("button", "hara-lesson-button hara-lesson-button--quiet", "Back");
      back.type = "button";
      back.addEventListener("click", () => {
        const previous = this.steps[step.index - 1];
        if (previous) this.setActive(previous.id, { scroll: true });
      });

      const manual = element("button", "hara-lesson-button hara-lesson-button--primary", "Complete step");
      manual.type = "button";
      manual.addEventListener("click", () => this.complete(step.id, "manual"));

      const incomplete = element("button", "hara-lesson-button hara-lesson-button--quiet", "Mark incomplete");
      incomplete.type = "button";
      incomplete.addEventListener("click", () => this.markIncomplete(step.id));

      const next = element("button", "hara-lesson-button hara-lesson-button--primary", "Continue");
      next.type = "button";
      next.addEventListener("click", () => {
        const following = this.steps[step.index + 1];
        if (following) this.setActive(following.id, { scroll: true });
      });

      actions.append(back, manual, incomplete, next);
      footer.append(feedback, actions);
      step.node.append(footer);
      step.ui = { meta, state, footer, criteria, status, actions, back, manual, incomplete, next };
    }

    prepareTasks(step) {
      step.tasks = [...step.node.querySelectorAll("[data-hara-task]")].map((task, index) => {
        const id = task.dataset.haraTask || `task-${index + 1}`;
        task.dataset.haraTask = id;
        task.classList.add("hara-lesson-task");
        task.setAttribute("role", "checkbox");
        task.tabIndex = 0;
        const toggle = () => this.toggleTask(step.id, id);
        task.addEventListener("click", (event) => {
          if (event.target.closest("a, button, input, select, textarea")) return;
          toggle();
        });
        task.addEventListener("keydown", (event) => {
          if (event.key !== " " && event.key !== "Enter") return;
          event.preventDefault();
          toggle();
        });
        return { id, node: task };
      });
    }

    attachRunner(step) {
      const bind = () => {
        const output = step.node.querySelector(OUTPUT_SELECTOR);
        if (!output || this.boundOutputs.has(output)) return false;
        this.boundOutputs.add(output);
        const editor = step.node.querySelector(EDITOR_SELECTOR);
        if (editor && step.runtime.baselineSource === null) {
          step.runtime.baselineSource = normalizeSource(editor.value);
          const updateChanged = () => {
            step.runtime.sourceChanged = normalizeSource(editor.value) !== step.runtime.baselineSource;
            this.renderStep(step);
          };
          editor.addEventListener("input", updateChanged);
        }

        const update = () => this.handleRunnerState(step, output, editor);
        const observer = new MutationObserver(update);
        observer.observe(output, {
          attributes: true,
          attributeFilter: ["class", "hidden", "data-state"],
          childList: true,
          characterData: true,
          subtree: true
        });
        this.runnerObservers.push(observer);
        update();
        return true;
      };

      if (bind()) return;
      const observer = new MutationObserver(() => {
        if (bind()) observer.disconnect();
      });
      observer.observe(step.node, { childList: true, subtree: true });
      this.runnerObservers.push(observer);
    }

    handleRunnerState(step, output, editor) {
      const state = classifyRunnerState(output);
      step.runtime.runnerState = state;
      if (state !== "success") {
        this.renderStep(step);
        return;
      }

      const source = normalizeSource(editor?.value ?? step.node.querySelector(EDITOR_SELECTOR)?.value);
      if (step.runtime.baselineSource === null) step.runtime.baselineSource = source;
      const changed = source !== step.runtime.baselineSource;
      step.runtime.sourceChanged ||= changed;
      step.runtime.ranAny = true;
      if (changed) step.runtime.ranChanged = true;
      else step.runtime.ranBaseline = true;

      if (completionSatisfied(step.mode, step.runtime, step.tasks.length, this.completedTaskCount(step))) {
        this.complete(step.id, step.mode);
      } else {
        this.renderStep(step);
      }
    }

    completedTaskCount(step) {
      const completed = this.taskState.get(step.id) ?? new Set();
      return step.tasks.filter((task) => completed.has(task.id)).length;
    }

    toggleTask(stepId, taskId) {
      const step = this.stepById.get(stepId);
      if (!step || this.isLocked(step) || this.completed.has(stepId)) return;
      const completed = this.taskState.get(stepId) ?? new Set();
      if (completed.has(taskId)) completed.delete(taskId);
      else completed.add(taskId);
      this.taskState.set(stepId, completed);
      this.save();

      if (completionSatisfied(step.mode, step.runtime, step.tasks.length, this.completedTaskCount(step))) {
        this.complete(stepId, "tasks");
      } else {
        this.render();
      }
    }

    criteriaFor(step) {
      if (step.mode === "run") {
        return [{ id: "run", label: "Run the example successfully", done: step.runtime.ranAny }];
      }
      if (step.mode === "edit-run") {
        return [
          { id: "edit", label: "Change the source", done: step.runtime.sourceChanged },
          { id: "changed-run", label: "Run the changed source successfully", done: step.runtime.ranChanged }
        ];
      }
      if (step.mode === "run-edit-run") {
        return [
          { id: "starter-run", label: "Run the starter example", done: step.runtime.ranBaseline },
          { id: "edit", label: "Change the source", done: step.runtime.sourceChanged },
          { id: "changed-run", label: "Run the changed source successfully", done: step.runtime.ranChanged }
        ];
      }
      return [];
    }

    statusFor(step) {
      if (this.completed.has(step.id)) return "Step complete. Continue when you are ready.";
      if (this.isLocked(step)) return "Complete the previous step to continue.";
      if (step.runtime.runnerState === "pending") return "Evaluating…";
      if (step.runtime.runnerState === "error") return "The example returned an error. Fix it and run again.";
      if (step.mode === "manual") return "Complete the instructions, then mark this step complete.";
      if (step.mode === "tasks") {
        return `${this.completedTaskCount(step)} / ${step.tasks.length} tasks complete`;
      }
      if (step.mode === "signal") {
        return step.node.dataset.haraWaitingLabel
          ?? `Waiting for ${step.signal || "the walkthrough action"}.`;
      }
      const remaining = this.criteriaFor(step).filter((criterion) => !criterion.done).length;
      return remaining
        ? `${remaining} ${remaining === 1 ? "requirement" : "requirements"} remaining`
        : "Completion detected.";
    }

    renderCriteria(step) {
      const criteria = this.criteriaFor(step);
      step.ui.criteria.hidden = criteria.length === 0;
      const stepComplete = this.completed.has(step.id);
      step.ui.criteria.replaceChildren(...criteria.map((criterion) => {
        const satisfied = stepComplete || criterion.done;
        const item = element("li", satisfied ? "is-complete" : "");
        const marker = element("span", "hara-lesson-criteria__marker", satisfied ? "✓" : "○");
        marker.setAttribute("aria-hidden", "true");
        item.append(marker, element("span", "", criterion.label));
        return item;
      }));
    }

    isLocked(step) {
      if (!this.sequential) return false;
      return this.steps.slice(0, step.index).some((candidate) => !this.completed.has(candidate.id));
    }

    renderStep(step) {
      if (!step.ui) return;
      const done = this.completed.has(step.id);
      const active = this.activeId === step.id;
      const locked = this.isLocked(step);
      const following = this.steps[step.index + 1];

      step.node.classList.toggle("is-complete", done);
      step.node.classList.toggle("is-active", active);
      step.node.classList.toggle("is-locked", locked);
      step.node.classList.toggle("is-ready", !done && !locked);
      step.node.setAttribute("aria-current", active ? "step" : "false");
      step.ui.state.textContent = done ? "Complete" : locked ? "Locked" : active ? "Current" : "Ready";
      step.ui.status.textContent = this.statusFor(step);
      this.renderCriteria(step);

      step.ui.back.hidden = step.index === 0;
      step.ui.back.disabled = step.index > 0 && this.isLocked(this.steps[step.index - 1]);
      step.ui.manual.hidden = done || step.mode !== "manual";
      step.ui.incomplete.hidden = !done;
      step.ui.next.hidden = !done || !following;
      step.ui.next.textContent = following ? `Continue to step ${following.index + 1}` : "Continue";

      const completedTasks = this.taskState.get(step.id) ?? new Set();
      for (const task of step.tasks) {
        const checked = completedTasks.has(task.id);
        task.node.classList.toggle("is-complete", checked);
        task.node.setAttribute("aria-checked", String(checked));
        task.node.setAttribute("aria-disabled", String(locked || done));
      }
    }

    render() {
      if (!this.steps.length) return;
      const done = this.steps.filter((step) => this.completed.has(step.id)).length;
      const active = this.stepById.get(this.activeId) ?? this.steps[0];
      this.progress.count.textContent = `${done} / ${this.steps.length} complete`;
      this.progress.current.textContent = `Step ${active.index + 1}: ${active.title}`;
      this.progress.bar.style.width = `${(done / this.steps.length) * 100}%`;
      this.progress.track.setAttribute("aria-valuenow", String(done));

      for (const [index, button] of this.progress.outlineButtons.entries()) {
        const step = this.steps[index];
        const complete = this.completed.has(step.id);
        const current = this.activeId === step.id;
        const locked = this.isLocked(step);
        button.classList.toggle("is-complete", complete);
        button.classList.toggle("is-current", current);
        button.classList.toggle("is-locked", locked);
        button.disabled = locked;
        button.setAttribute("aria-current", current ? "step" : "false");
        button.setAttribute(
          "aria-label",
          `${complete ? "Complete" : locked ? "Locked" : current ? "Current" : "Ready"}: step ${step.index + 1}, ${step.title}`
        );
      }

      this.steps.forEach((step) => this.renderStep(step));
      const complete = done === this.steps.length;
      this.root.classList.toggle("is-complete", complete);
      this.root.dataset.haraLessonState = complete ? "complete" : "in-progress";
      this.completionPanel.hidden = !complete;
    }

    stateSnapshot() {
      return {
        version: STORAGE_VERSION,
        completed: this.steps.filter((step) => this.completed.has(step.id)).map((step) => step.id),
        active: this.activeId,
        tasks: Object.fromEntries([...this.taskState.entries()]
          .map(([stepId, values]) => [stepId, [...values]]))
      };
    }

    save() {
      writeStorage(this.storageKey, this.stateSnapshot());
    }

    setActive(stepId, { scroll = false } = {}) {
      const step = this.stepById.get(stepId);
      if (!step || this.isLocked(step)) return false;
      this.activeId = stepId;
      this.save();
      this.render();
      if (scroll) {
        step.node.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
        const heading = step.node.querySelector("h2, h3, h4");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }
      return true;
    }

    complete(stepId, reason = "manual") {
      const step = this.stepById.get(stepId);
      if (!step || this.isLocked(step) || this.completed.has(stepId)) return false;
      this.completed.add(stepId);
      this.save();
      this.render();
      this.root.dispatchEvent(new CustomEvent("hara:lesson-progress", {
        bubbles: true,
        detail: {
          lessonId: this.id,
          stepId,
          reason,
          completed: this.stateSnapshot().completed,
          total: this.steps.length
        }
      }));
      return true;
    }

    markIncomplete(stepId) {
      const step = this.stepById.get(stepId);
      if (!step) return false;
      const affected = this.sequential ? this.steps.slice(step.index) : [step];
      for (const candidate of affected) {
        this.completed.delete(candidate.id);
        this.taskState.delete(candidate.id);
        const editor = candidate.node.querySelector(EDITOR_SELECTOR);
        Object.assign(candidate.runtime, {
          sourceChanged: candidate.runtime.baselineSource !== null
            && normalizeSource(editor?.value) !== candidate.runtime.baselineSource,
          ranAny: false,
          ranBaseline: false,
          ranChanged: false,
          signalMatched: false,
          runnerState: "idle"
        });
      }
      this.activeId = stepId;
      this.save();
      this.render();
      return true;
    }

    reset() {
      this.completed.clear();
      this.taskState.clear();
      this.activeId = this.steps[0]?.id ?? null;
      for (const step of this.steps) {
        Object.assign(step.runtime, {
          sourceChanged: false,
          ranAny: false,
          ranBaseline: false,
          ranChanged: false,
          signalMatched: false,
          runnerState: "idle"
        });
      }
      this.save();
      this.render();

      if (this.sessionGroup) {
        document.dispatchEvent(new CustomEvent("hara:reset-session", {
          detail: { groupName: this.sessionGroup, lessonId: this.id }
        }));
      }
      this.root.dispatchEvent(new CustomEvent("hara:lesson-reset", {
        bubbles: true,
        detail: { lessonId: this.id }
      }));
    }

    receiveSignal(detail = {}, target = null) {
      if (detail.lessonId && detail.lessonId !== this.id) return false;
      const inferred = target?.closest?.(STEP_SELECTOR)?.dataset.haraLessonStep;
      const step = this.stepById.get(detail.stepId ?? inferred ?? this.activeId);
      if (!step || this.isLocked(step)) return false;

      if (detail.taskId) {
        const task = step.tasks.find((candidate) => candidate.id === detail.taskId);
        if (!task) return false;
        const completed = this.taskState.get(step.id) ?? new Set();
        completed.add(task.id);
        this.taskState.set(step.id, completed);
      }

      const signal = String(detail.signal ?? "").trim();
      if (step.mode === "signal" && signal && (!step.signal || signal === step.signal)) {
        step.runtime.signalMatched = true;
      }

      if (detail.complete === true
          || completionSatisfied(step.mode, step.runtime, step.tasks.length, this.completedTaskCount(step))) {
        return this.complete(step.id, signal || "signal");
      }
      this.save();
      this.render();
      return true;
    }

    destroy() {
      this.destroyed = true;
      this.runnerObservers.forEach((observer) => observer.disconnect());
      controllers.delete(this.id);
    }
  }

  const mount = (root) => {
    if (!root?.matches?.(ROOT_SELECTOR)) return null;
    const existingId = root.dataset.haraLesson ?? root.dataset.haraSyllabus;
    const existing = existingId ? controllers.get(existingId) : null;
    if (existing?.root === root) return existing;
    existing?.destroy();
    const controller = new LessonController(root).mount();
    if (controller.id && controller.steps.length) controllers.set(controller.id, controller);
    return controller;
  };

  const mountAll = (scope = document) => [...scope.querySelectorAll(ROOT_SELECTOR)].map(mount);

  const api = {
    mount,
    mountAll,
    complete(lessonId, stepId, detail = {}) {
      return controllers.get(lessonId)?.complete(stepId, detail.reason ?? "api") ?? false;
    },
    reset(lessonId) {
      const controller = controllers.get(lessonId);
      if (!controller) return false;
      controller.reset();
      return true;
    },
    signal(detail = {}) {
      if (typeof document === "undefined") return false;
      document.dispatchEvent(new CustomEvent("hara:lesson-signal", { detail }));
      return true;
    },
    state(lessonId) {
      return controllers.get(lessonId)?.stateSnapshot() ?? null;
    },
    __testing: Object.freeze({
      normalizeSource,
      completionMode,
      classifyRunnerState,
      completionSatisfied,
      decodeStoredState
    })
  };

  globalThis.HaraLessons = api;

  ready(() => {
    mountAll(document);
    document.addEventListener("hara:lesson-signal", (event) => {
      for (const controller of controllers.values()) {
        controller.receiveSignal(event.detail, event.target);
      }
    });
  });
})();
