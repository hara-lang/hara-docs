// Hara documentation InstaREPL integration.
//
// The compatibility MkDocs runner already owns sessions and Ctrl-E form
// evaluation. This controller adds an explicit Eval control and turns a direct
// mobile tap into the same local-form operation without introducing a second
// kernel or editor implementation.
(async () => {
  const script = [...document.scripts].find((node) =>
    node.src.endsWith("/javascripts/instarepl.js")
  );
  if (!script) return;

  const asset = (path) => new URL(path, script.src);
  const [{ localFormAt }, hta] = await Promise.all([
    import(asset("www-editor.js").href),
    import("/runtime/hta.js?v=20260803-modular-kernel")
  ]);

  // The HTA codec deliberately keeps keyword/symbol wrappers tiny. Give them
  // their reader representations so the existing documentation printer and
  // nested HtaObject display never fall back to [object Object].
  hta.HtaKeyword.prototype.toString = function toString() {
    return `:${this.name}`;
  };
  hta.HtaSymbol.prototype.toString = function toString() {
    return this.name;
  };

  const trimmedSelection = (editor) => {
    const { value, selectionStart: start, selectionEnd: end } = editor;
    if (start === end) return null;
    const selected = value.slice(start, end);
    const leading = selected.match(/^\s*/)?.[0].length ?? 0;
    const trailing = selected.match(/\s*$/)?.[0].length ?? 0;
    const from = start + leading;
    const to = end - trailing;
    return from < to
      ? { source: value.slice(from, to), start: from, end: to }
      : null;
  };

  const formAtEditor = (editor, preferLine = false) => {
    const selected = trimmedSelection(editor);
    if (selected) return selected;

    const { value, selectionStart: caret } = editor;
    if (preferLine) {
      const lineStart = value.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
      const indentation = value.slice(lineStart).match(/^\s*/)?.[0].length ?? 0;
      const first = lineStart + indentation;
      const lineForm = localFormAt(value, first);
      if (lineForm?.start === first && lineForm.end >= caret) return lineForm;
    }
    return localFormAt(value, caret);
  };

  const dispatchEval = (editor, form = null, restoreCaret = null) => {
    if (form) editor.setSelectionRange(form.start, form.end);
    editor.dispatchEvent(new KeyboardEvent("keydown", {
      key: "e",
      code: "KeyE",
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    }));
    if (restoreCaret != null) editor.setSelectionRange(restoreCaret, restoreCaret);
  };

  const install = (cell) => {
    if (cell.dataset.haraInstarepl === "true") return;
    const toolbar = cell.querySelector(".hara-live-toolbar");
    const editor = cell.querySelector(".hara-live-editor");
    const run = cell.querySelector(".hara-live-run");
    if (!toolbar || !editor || !run) return;

    cell.dataset.haraInstarepl = "true";

    const evaluate = document.createElement("button");
    evaluate.className = "hara-live-eval";
    evaluate.type = "button";
    evaluate.textContent = "EVAL";
    evaluate.setAttribute("aria-label", "Evaluate the selected or current Hara form");
    toolbar.insertBefore(evaluate, run);

    evaluate.addEventListener("click", () => {
      const form = formAtEditor(editor, true);
      if (!form) return;
      dispatchEval(editor, form);
      editor.focus();
    });

    let lastTouchEvaluation = 0;
    editor.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "touch") return;
      if (editor.selectionStart !== editor.selectionEnd) return;
      const now = Date.now();
      if (now - lastTouchEvaluation < 350) return;

      const caret = editor.selectionStart;
      const form = formAtEditor(editor, true);
      if (!form?.source) return;
      lastTouchEvaluation = now;
      queueMicrotask(() => dispatchEval(editor, form, caret));
    });

    const footerHint = [...cell.querySelectorAll(".window-status span")]
      .find((node) => node.textContent.includes("CTRL-E FORM"));
    if (footerHint) footerHint.textContent = "TAP / CTRL-E FORM · CTRL-ENTER FILE";
  };

  const installAll = (root = document) => {
    for (const cell of root.querySelectorAll?.(".hara-live-example") ?? []) install(cell);
    if (root.matches?.(".hara-live-example")) install(root);
  };

  installAll();
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) installAll(node);
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
})();
