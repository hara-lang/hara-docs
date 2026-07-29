// Every Hara fence uses the www editor surface and one shared, page-local kernel.
(async () => {
  const content = document.querySelector("[data-hara-live-content]");
  const examples = [...content?.querySelectorAll(".highlight.language-hara code") ?? []];
  if (!examples.length) return;

  const script = [...document.scripts].find((node) =>
    node.src.endsWith("/javascripts/live-examples.js")
  );
  if (!script) return;

  const asset = (path) => new URL(path, script.src);
  const {
    applyCompletion,
    applyParedit,
    barfForward,
    completionTokenAt,
    insertIndent,
    killToFormEnd,
    localFormAt,
    slurpForward,
    structuralAlign
  } = await import(asset("www-editor.js").href);
  let kernelPromise = null;
  const isolatedKernels = new Set();
  let evaluationQueue = Promise.resolve();
  const cells = [];

  const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const highlightHara = (source, targetRange = null) => {
    let output = "";
    let depth = 0;
    let string = false;
    let comment = false;
    let escaped = false;
    const target = (index) =>
      targetRange && index >= targetRange.start && index < targetRange.end
        ? " eval-target"
        : "";

    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (comment) {
        output += `<span class="comment${target(index)}">${escapeHtml(character)}</span>`;
        if (character === "\n") comment = false;
        continue;
      }
      if (string) {
        output += `<span class="string${target(index)}">${escapeHtml(character)}</span>`;
        if (!escaped && character === '"') string = false;
        escaped = !escaped && character === "\\";
        continue;
      }
      if (character === ";") {
        comment = true;
        output += `<span class="comment${target(index)}">;</span>`;
        continue;
      }
      if (character === '"') {
        string = true;
        escaped = false;
        output += `<span class="string${target(index)}">"</span>`;
        continue;
      }
      if ("([{".includes(character)) {
        output += `<span class="paren-${depth % 6}${target(index)}">${character}</span>`;
        depth += 1;
        continue;
      }
      if (")]}".includes(character)) {
        depth -= 1;
        output += `<span class="${depth < 0 ? "unmatched" : `paren-${depth % 6}`}${target(index)}">${character}</span>`;
        continue;
      }
      if (character === ":") {
        const match = source.slice(index).match(/^:[A-Za-z*+!?._/-]+/);
        if (match) {
          output += `<span class="keyword${target(index)}">${escapeHtml(match[0])}</span>`;
          index += match[0].length - 1;
          continue;
        }
      }
      const number = source.slice(index).match(/^-?\d+(?:\.\d+)?(?![A-Za-z0-9_.-])/);
      if (number) {
        output += target(index) ? `<span class="eval-target">${number[0]}</span>` : number[0];
        index += number[0].length - 1;
        continue;
      }
      const atom = source.slice(index).match(/^[A-Za-z*+!?._/<>=-]+/);
      if (atom) {
        output += target(index)
          ? `<span class="eval-target">${escapeHtml(atom[0])}</span>`
          : escapeHtml(atom[0]);
        index += atom[0].length - 1;
        continue;
      }
      output += target(index)
        ? `<span class="eval-target">${escapeHtml(character)}</span>`
        : escapeHtml(character);
    }
    return output;
  };

  const keywordName = (value) =>
    value?.constructor?.name === "HtaKeyword" ? `:${value.name}` : null;

  const print = (value) => {
    const keyword = keywordName(value);
    if (keyword) return keyword;
    if (value?.constructor?.name === "HtaVar") return String(value);
    if (value?.constructor?.name === "HtaAtom") return String(value);
    if (value?.constructor?.name === "HtaArray") return String(value);
    if (value?.constructor?.name === "HtaObject") return String(value);
    if (value instanceof Map) {
      return `{${[...value].map(([key, item]) => `${print(key)} ${print(item)}`).join(" ")}}`;
    }
    if (value instanceof Set) return `#{${[...value].map(print).join(" ")}}`;
    if (Array.isArray(value)) return `[${value.map(print).join(" ")}]`;
    if (typeof value === "string") return JSON.stringify(value);
    if (value === null) return "nil";
    return String(value);
  };

  const setKernelStatus = (label, state = "") => {
    for (const cell of cells) {
      cell.status.textContent = label;
      cell.status.dataset.state = state;
    }
  };

  const createKernel = () =>
    import(asset("kernel.js?v=20260729-session-resources").href)
      .then(({ createDocsKernel }) => createDocsKernel({
        wasmUrl: asset("../rust/hara.wasm?v=20260729-session-resources"),
        workerUrl: asset("../rust/hta-worker.js?v=20260729-session-resources"),
        resources: {
          "studio.store": asset("../rust/studio/hal/store.hal"),
          "studio.fs": asset("../rust/studio/hal/fs.hal"),
          "studio.node": asset("../rust/studio/hal/node.hal"),
          "studio.draw": asset("../rust/studio/hal/draw.hal"),
          "std.substrate.frame": asset("../rust/studio/hal/std/substrate/frame.hal")
        }
      }));

  const getKernel = () => {
    if (!kernelPromise) {
      setKernelStatus("kernel loading", "loading");
      kernelPromise = createKernel()
        .then((kernel) => {
          setKernelStatus("kernel ready", "ready");
          return kernel;
        })
        .catch((error) => {
          kernelPromise = null;
          setKernelStatus("kernel unavailable", "error");
          throw error;
        });
    }
    return kernelPromise;
  };

  const sessionFor = (record) => {
    record.sessionPromise ??= (async () => {
      const isolated = record.kernelMode === "isolated";
      const kernel = isolated ? await createKernel() : await getKernel();
      if (isolated) isolatedKernels.add(kernel);
      const filesystem = record.filesystemKey
        ? `indexeddb:${record.filesystemKey}`
        : `memory:${location.pathname}:${record.sessionId}`;
      const session = await kernel.createSession(record.sessionId, { filesystem });
      record.kernel = kernel;
      record.session = session;
      record.status.textContent = isolated
        ? `isolated kernel · session ${record.sessionId}`
        : `page kernel · session ${record.sessionId}`;
      record.status.dataset.state = "ready";
      return session;
    })();
    return record.sessionPromise;
  };

  const syncEditor = (cell, targetRange = null) => {
    cell.highlight.innerHTML = highlightHara(cell.editor.value, targetRange);
    cell.highlight.scrollTop = cell.editor.scrollTop;
    cell.highlight.scrollLeft = cell.editor.scrollLeft;
    cell.editor.style.height = "0";
    cell.editor.style.height = `${cell.editor.scrollHeight}px`;
    cell.highlight.style.height = cell.editor.style.height;
    cell.lines.innerHTML = cell.editor.value.split("\n").map((_, index) => index + 1).join("\n");
    cell.lines.scrollTop = cell.editor.scrollTop;
  };

  const positionOutput = (cell, offset) => {
    const source = cell.editor.value.slice(0, offset);
    const line = source.split("\n").length - 1;
    const column = source.length - source.lastIndexOf("\n") - 1;
    cell.output.style.top = `${14 + line * 18 - cell.editor.scrollTop}px`;
    cell.output.style.left =
      `${62 + Math.min(column * 7.1, Math.max(30, cell.editor.clientWidth - 190))}px`;
  };

  const dismissOutput = (cell) => {
    if (cell.output.hidden) return;
    cell.output.hidden = true;
    cell.output.classList.remove("is-error", "is-pending");
    syncEditor(cell);
  };

  const dismissCompletions = (cell) => {
    cell.completions.hidden = true;
    cell.completions.replaceChildren();
    cell.completionItems = [];
    cell.completionIndex = 0;
    cell.completionToken = null;
  };

  const selectCompletion = (cell, index) => {
    if (!cell.completionItems.length) return;
    cell.completionIndex =
      (index + cell.completionItems.length) % cell.completionItems.length;
    [...cell.completions.children].forEach((item, itemIndex) => {
      item.setAttribute("aria-selected", String(itemIndex === cell.completionIndex));
    });
  };

  const acceptCompletion = (cell) => {
    const candidate = cell.completionItems[cell.completionIndex];
    if (!candidate || !cell.completionToken) return false;
    applyCompletion(cell.editor, cell.completionToken, candidate);
    dismissCompletions(cell);
    syncEditor(cell);
    return true;
  };

  const updateCompletions = async (cell) => {
    const token = completionTokenAt(cell.editor.value, cell.editor.selectionStart);
    const request = ++cell.completionRequest;
    if (!token || token.value.length < 2) {
      dismissCompletions(cell);
      return;
    }
    try {
      const session = await sessionFor(cell);
      const candidates = (await session.complete(token.value))
        .filter((candidate) => candidate !== token.value)
        .slice(0, 8);
      if (request !== cell.completionRequest) return;
      if (!candidates.length) {
        dismissCompletions(cell);
        return;
      }
      cell.completionItems = candidates;
      cell.completionIndex = 0;
      cell.completionToken = token;
      cell.completions.replaceChildren(...candidates.map((candidate, index) => {
        const item = document.createElement("li");
        item.textContent = candidate;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(index === 0));
        item.addEventListener("mousedown", (event) => {
          event.preventDefault();
          cell.completionIndex = index;
          acceptCompletion(cell);
        });
        return item;
      }));
      const source = cell.editor.value.slice(0, token.start);
      const line = source.split("\n").length - 1;
      const column = source.length - source.lastIndexOf("\n") - 1;
      const editorRect = cell.editor.getBoundingClientRect();
      const top = editorRect.top + 16 + (line + 1) * 18 - cell.editor.scrollTop;
      const left = editorRect.left + 16 + column * 7.1 - cell.editor.scrollLeft;
      cell.completions.style.top = `${Math.min(top, window.innerHeight - 72)}px`;
      cell.completions.style.left =
        `${Math.min(left, window.innerWidth - Math.min(360, window.innerWidth - 24) - 12)}px`;
      delete cell.completions.dataset.error;
      cell.completions.hidden = false;
    } catch (error) {
      cell.completions.dataset.error = String(error?.message ?? error);
      dismissCompletions(cell);
    }
  };

  const fsDrawer = document.createElement("aside");
  fsDrawer.className = "hara-fs-drawer";
  fsDrawer.setAttribute("aria-label", "Browser filesystem");
  fsDrawer.hidden = true;
  fsDrawer.innerHTML = `
    <header>
      <div><span>FILESYSTEM</span><small data-fs-scope>session memory · transient</small></div>
      <button type="button" data-fs-close aria-label="Close filesystem">×</button>
    </header>
    <div class="hara-fs-body">
      <nav aria-label="Files">
        <div class="hara-fs-nav-actions">
          <button type="button" data-fs-new>＋ NEW</button>
          <button type="button" data-fs-refresh>↻</button>
        </div>
        <ul data-fs-list></ul>
      </nav>
      <section class="hara-fs-editor">
        <label>PATH<input data-fs-path value="/notes.txt" spellcheck="false"></label>
        <textarea data-fs-content aria-label="File content" spellcheck="false"></textarea>
        <footer>
          <span data-fs-status>READY</span>
          <button type="button" data-fs-delete>DELETE</button>
          <button type="button" data-fs-save>SAVE</button>
        </footer>
      </section>
    </div>`;
  document.body.append(fsDrawer);

  const fsList = fsDrawer.querySelector("[data-fs-list]");
  const fsPath = fsDrawer.querySelector("[data-fs-path]");
  const fsContent = fsDrawer.querySelector("[data-fs-content]");
  const fsStatus = fsDrawer.querySelector("[data-fs-status]");
  const fsScope = fsDrawer.querySelector("[data-fs-scope]");
  let selectedFile = null;
  let fileSession = null;

  const setFsStatus = (message, error = false) => {
    fsStatus.textContent = message;
    fsStatus.dataset.state = error ? "error" : "";
  };

  const openFile = async (path) => {
    setFsStatus("LOADING");
    try {
      const value = await fileSession.readFile(path);
      selectedFile = path;
      fsPath.value = path;
      fsContent.value = value ?? "";
      setFsStatus("READY");
      [...fsList.children].forEach((item) =>
        item.setAttribute("aria-current", String(item.dataset.path === path)));
      fsContent.focus();
    } catch (error) {
      setFsStatus(String(error?.message ?? error), true);
    }
  };

  const refreshFiles = async () => {
    setFsStatus("REFRESHING");
    try {
      const files = await fileSession.listFiles();
      fsList.replaceChildren(...files.map((path) => {
        const item = document.createElement("li");
        item.dataset.path = path;
        item.textContent = path;
        item.tabIndex = 0;
        item.setAttribute("aria-current", String(path === selectedFile));
        item.addEventListener("click", () => openFile(path));
        item.addEventListener("keydown", (event) => {
          if (event.key === "Enter") openFile(path);
        });
        return item;
      }));
      setFsStatus(files.length ? "READY" : "EMPTY");
    } catch (error) {
      setFsStatus(String(error?.message ?? error), true);
    }
  };

  const openFsDrawer = async (record) => {
    fileSession = await sessionFor(record);
    fsScope.textContent = record.filesystemKey
      ? `${record.filesystemKey} · browser persistent`
      : `${record.sessionId} · session memory`;
    fsDrawer.hidden = false;
    document.body.classList.add("hara-fs-open");
    await refreshFiles();
  };

  fsDrawer.querySelector("[data-fs-close]").addEventListener("click", () => {
    fsDrawer.hidden = true;
    document.body.classList.remove("hara-fs-open");
  });
  fsDrawer.querySelector("[data-fs-refresh]").addEventListener("click", refreshFiles);
  fsDrawer.querySelector("[data-fs-new]").addEventListener("click", () => {
    selectedFile = null;
    fsPath.value = "/untitled.hara";
    fsContent.value = "";
    setFsStatus("NEW FILE");
    fsPath.focus();
    fsPath.select();
  });
  fsDrawer.querySelector("[data-fs-save]").addEventListener("click", async () => {
    const path = fsPath.value.trim();
    if (!path.startsWith("/")) {
      setFsStatus("PATH MUST START WITH /", true);
      return;
    }
    setFsStatus("SAVING");
    try {
      await fileSession.writeFile(path, fsContent.value);
      selectedFile = path;
      await refreshFiles();
      setFsStatus("SAVED");
    } catch (error) {
      setFsStatus(String(error?.message ?? error), true);
    }
  });
  fsDrawer.querySelector("[data-fs-delete]").addEventListener("click", async () => {
    const path = fsPath.value.trim();
    if (!path) return;
    setFsStatus("DELETING");
    try {
      await fileSession.deleteFile(path);
      selectedFile = null;
      fsContent.value = "";
      await refreshFiles();
      setFsStatus("DELETED");
    } catch (error) {
      setFsStatus(String(error?.message ?? error), true);
    }
  });

  const evaluate = (cell, form = null) => {
    const target = form ?? { source: cell.editor.value, start: 0, end: cell.editor.value.length };
    if (!target?.source.trim()) return Promise.resolve();
    if (cell.evaluateForm) return cell.evaluateForm(target);

    cell.run.disabled = true;
    cell.output.hidden = false;
    cell.output.classList.remove("is-error");
    cell.output.textContent = "=> evaluating…";
    cell.output.classList.add("is-pending");
    positionOutput(cell, target.end);
    syncEditor(cell, target);

    const task = async () => {
      try {
        const session = await sessionFor(cell);
        const result = await session.eval(target.source);
        cell.output.textContent = `=> ${result.label ?? print(result.value)}`;
        cell.output.classList.remove("is-pending");
      } catch (error) {
        cell.output.classList.add("is-error");
        cell.output.textContent = `ERROR => ${String(error?.message ?? error)}`;
        cell.output.classList.remove("is-pending");
      } finally {
        cell.run.disabled = false;
        syncEditor(cell);
      }
    };

    evaluationQueue = evaluationQueue.then(task, task);
    return evaluationQueue;
  };

  for (const [exampleIndex, code] of examples.entries()) {
    const original = code.closest(".highlight");
    if (!original) continue;

    const cell = document.createElement("section");
    cell.className = "hara-live-example hara-www-editor-window";
    cell.setAttribute("aria-label", "Live Hara example");

    const toolbar = document.createElement("div");
    toolbar.className = "window-toolbar editor-toolbar hara-live-toolbar";

    const run = document.createElement("button");
    run.className = "run-button hara-live-run";
    run.type = "button";
    run.textContent = "▶ RUN FILE";
    run.setAttribute("aria-label", "Run this entire example in its Hara session");

    const files = document.createElement("button");
    files.className = "hara-live-files";
    files.type = "button";
    files.textContent = "FILES";
    files.setAttribute("aria-label", "Open the shared browser filesystem");

    toolbar.append(files, run);

    const source = document.createElement("label");
    source.className = "editor-surface hara-live-source";

    const lines = document.createElement("span");
    lines.className = "line-numbers";
    lines.setAttribute("aria-hidden", "true");

    const syntax = document.createElement("pre");
    syntax.className = "code-highlight hara-live-highlight";
    syntax.setAttribute("aria-hidden", "true");

    const editor = document.createElement("textarea");
    editor.className = "hara-live-editor";
    editor.value = code.textContent.replace(/\n$/, "");
    editor.spellcheck = false;
    editor.setAttribute("aria-label", "Editable Hara source");

    const output = document.createElement("output");
    output.className = "inline-eval hara-live-output";
    output.setAttribute("aria-live", "polite");
    output.hidden = true;

    const completions = document.createElement("ul");
    completions.className = "hara-live-completions";
    completions.setAttribute("role", "listbox");
    completions.setAttribute("aria-label", "Hara completions");
    completions.hidden = true;
    source.append(lines, syntax, editor, output);
    document.body.append(completions);

    const footer = document.createElement("div");
    footer.className = "window-status";

    const status = document.createElement("span");
    status.className = "hara-live-status";
    status.textContent = "WAITING FOR RUNTIME";

    const shared = document.createElement("span");
    shared.textContent = "CTRL-E FORM · CTRL-ENTER FILE";
    footer.append(status, shared);

    cell.append(toolbar, source, footer);
    original.replaceWith(cell);

    const record = {
      cell,
      editor,
      highlight: syntax,
      lines,
      output,
      run,
      status,
      completions,
      completionItems: [],
      completionIndex: 0,
      completionRequest: 0,
      completionToken: null,
      sessionId: `example-${exampleIndex + 1}`,
      kernelMode: cell.closest("[data-hara-kernel]")?.dataset.haraKernel ?? "page",
      filesystemKey: cell.closest("[data-hara-filesystem]")?.dataset.haraFilesystem ?? null,
      sessionPromise: null
    };
    cells.push(record);
    syncEditor(record);

    // Every fence owns a session. Canvas stages add a session-scoped surface;
    // data-hara-kernel="isolated" moves the same session API to its own worker.
    const stage = cell.closest(".hara-canvas-stage");
    if (stage) {
      document.dispatchEvent(new CustomEvent("hara:live-cell", {
        detail: { stage, record, source: editor.value, getSession: () => sessionFor(record) }
      }));
    }

    editor.addEventListener("input", () => {
      output.hidden = true;
      syncEditor(record);
      updateCompletions(record);
    });
    editor.addEventListener("scroll", () => syncEditor(record));
    editor.addEventListener("keydown", (event) => {
      if (!record.completions.hidden) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          selectCompletion(
            record,
            record.completionIndex + (event.key === "ArrowDown" ? 1 : -1)
          );
          return;
        }
        if (event.key === "Tab" || event.key === "Enter") {
          event.preventDefault();
          acceptCompletion(record);
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          dismissCompletions(record);
          return;
        }
      }
      if (!["Alt", "Control", "Meta", "Shift"].includes(event.key)) {
        dismissOutput(record);
      }
      if (event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        const selection = editor.value.slice(editor.selectionStart, editor.selectionEnd).trim();
        const form = selection
          ? { source: selection, start: editor.selectionStart, end: editor.selectionEnd }
          : localFormAt(editor.value, editor.selectionStart);
        evaluate(record, form);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        (record.runFile ?? (() => evaluate(record)))();
        return;
      }
      if (event.ctrlKey && !event.metaKey && !event.altKey &&
          event.key.toLowerCase() === "k" && killToFormEnd(editor)) {
        event.preventDefault();
        return;
      }
      if (event.ctrlKey && !event.metaKey && !event.altKey) {
        const structuralEdit = event.key === "ArrowRight" ? slurpForward
          : event.key === "ArrowLeft" ? barfForward
          : null;
        if (structuralEdit?.(editor)) {
          event.preventDefault();
          return;
        }
      }
      if (!event.metaKey && !event.ctrlKey && !event.altKey &&
          applyParedit(editor, event.key)) {
        event.preventDefault();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) insertIndent(editor, true);
        else structuralAlign(editor);
      }
    });
    run.addEventListener("click", () => (record.runFile ?? (() => evaluate(record)))());
    files.addEventListener("click", () => openFsDrawer(record));
  }

  window.addEventListener("pagehide", () => {
    for (const record of cells) record.session?.close().catch(() => {});
    kernelPromise?.then((kernel) => kernel.close()).catch(() => {});
    for (const kernel of isolatedKernels) kernel.close();
  }, { once: true });
})();
