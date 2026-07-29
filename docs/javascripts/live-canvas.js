// Docs-native Hara canvas stages.  This is intentionally a thin host adapter:
// programs still execute in an HTA worker and speak to CanvasRuntime through
// studio.draw/studio.node, exactly as they do in the browser demos.

const localPointer = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.clientWidth / Math.max(1, rect.width);
  const scaleY = canvas.clientHeight / Math.max(1, rect.height);
  return {
    type: "pointer",
    phase: event.type === "pointerup" ? "up" : event.type === "pointermove" ? "move" : "down",
    x: Math.round((event.clientX - rect.left) * scaleX),
    y: Math.round((event.clientY - rect.top) * scaleY),
    button: event.button ?? 0,
    pointer: event.pointerType ?? "mouse"
  };
};

const message = (error) => String(error?.message ?? error).replace(/^Error: /, "");

async function stageRuntime(asset, canvas, onDiagnostic) {
  const [{ compileAnonymousDocument }, { CanvasRuntime }] = await Promise.all([
    import(asset("../rust/studio/broker.js").href),
    import(asset("../rust/studio/canvas-runtime.js").href)
  ]);
  const runtime = new CanvasRuntime({
    // Pointer listeners are intentionally local to this canvas.  A docs page
    // may contain several stages, and browser coordinates must not leak into
    // another stage's game.
    capabilities: ["canvas/2d"],
    onDiagnostic
  });
  const canvasId = "canvas/background";
  runtime.register(canvasId, canvas);
  return { runtime, canvasId, compileAnonymousDocument };
}

document.addEventListener("hara:live-cell", ({ detail }) => {
  const { stage, record, source, getSession } = detail;
  if (!stage.matches("[data-hara-canvas-stage]")) return;

  const script = [...document.scripts].find((node) => node.src.endsWith("/javascripts/live-canvas.js"));
  if (!script) return;
  const asset = (path) => new URL(path, script.src);
  const programUrl = stage.dataset.haraCanvasProgram;
  const canvas = document.createElement("canvas");
  canvas.className = "hara-live-canvas";
  canvas.width = 960;
  canvas.height = 600;
  canvas.setAttribute("aria-label", "Live Hara canvas output");
  canvas.tabIndex = 0;
  const panel = document.createElement("section");
  panel.className = "hara-live-canvas-panel";
  const meta = document.createElement("div");
  meta.className = "hara-live-canvas-meta";
  meta.innerHTML = "<span>PAGE KERNEL · PRIVATE SESSION · MEMORY FS</span><output aria-live=\"polite\">loading</output>";
  panel.append(meta, canvas);
  record.cell.after(panel);

  let service = null;
  let active = null;
  let sequence = 0;
  let closed = false;
  let programPromise = null;
  const status = meta.querySelector("output");
  const setStatus = (text, state = "") => {
    status.textContent = text;
    status.dataset.state = state;
  };
  const program = () => {
    if (!programUrl) return Promise.resolve(record.editor.value || source);
    programPromise ??= fetch(new URL(programUrl, document.baseURI))
      .then((response) => response.ok ? response.text() : Promise.reject(new Error(`unable to load tutorial source (${response.status})`)));
    return programPromise;
  };
  const close = () => {
    if (closed) return;
    closed = true;
    service?.runtime.close();
    active?.unregisterCanvas?.();
    active?.session?.close().catch(() => {});
  };
  record.evaluateForm = async (target) => {
    // `ns+` is document syntax, not an isolated expression.  Evaluating it
    // through the shared docs kernel would lose its stage-local resources.
    if (/^\s*\(ns\+\b/.test(target.source)) return record.runFile();
    record.output.hidden = false;
    record.output.classList.remove("is-error", "is-pending");
    record.output.classList.add("is-pending");
    record.output.textContent = "=> evaluating…";
    try {
      if (!active) throw new Error("run this stage before evaluating a form");
      const result = await active.session.evalRaw(target.source);
      record.output.textContent = `=> ${String(result)}`;
    } catch (error) {
      record.output.classList.add("is-error");
      record.output.textContent = `ERROR => ${message(error)}`;
    } finally {
      record.output.classList.remove("is-pending");
    }
  };
  window.addEventListener("pagehide", close, { once: true });
  for (const type of ["pointerdown", "pointermove", "pointerup"]) {
    canvas.addEventListener(type, (event) => {
      if (type === "pointerdown") canvas.setPointerCapture?.(event.pointerId);
      service?.runtime.pushEvent(localPointer(event, canvas));
    });
  }

  record.runFile = async () => {
    if (closed) return;
    record.run.disabled = true;
    const generation = ++sequence;
    let candidateSession = null;
    let candidateCanvas = null;
    let candidateNode = null;
    setStatus("loading", "loading");
    try {
      const baseSession = await getSession();
      service ??= await stageRuntime(asset, canvas, (error) => setStatus(message(error), "error"));
      const nodeId = `docs-tictactoe-${generation}`;
      candidateNode = nodeId;
      const documentSession = candidateSession = await record.kernel.createSession(
        `${record.sessionId}-document-${generation}`,
        { filesystem: baseSession.filesystem }
      );
      const unregisterCanvas = candidateCanvas = documentSession.registerCanvas(service.runtime);
      service.runtime.stage(nodeId, service.canvasId);
      const candidate = service.compileAnonymousDocument(
        record.editor.value || await program(),
        { documentId: `${record.sessionId}/document`, nodeId }
      );
      const taskId = await documentSession.evalRaw(candidate.source);
      const rendered = service.runtime.waitForFirstRender(nodeId, service.canvasId, 5000);
      // A node/start task is intentionally infinite. Start it without waiting
      // for its completion; first render is the activation handshake.
      documentSession.evalRaw(`(studio.node/run-task ${JSON.stringify(taskId)})`)
        .catch((error) => setStatus(message(error), "error"));
      await rendered;
      if (generation !== sequence) {
        unregisterCanvas();
        await documentSession.close();
        return;
      }
      service.runtime.commit(nodeId, service.canvasId);
      const previous = active;
      active = { session: documentSession, nodeId, unregisterCanvas };
      candidateSession = null;
      candidateCanvas = null;
      candidateNode = null;
      previous?.unregisterCanvas?.();
      previous?.session?.close().catch(() => {});
      const kernelLabel = record.kernelMode === "isolated" ? "ISOLATED KERNEL" : "PAGE KERNEL";
      const filesystemLabel = record.filesystemKey ? `PERSISTENT FS ${record.filesystemKey}` : "MEMORY FS";
      meta.querySelector("span").textContent =
        `${kernelLabel} · SESSION ${record.sessionId} · ${filesystemLabel}`;
      setStatus("live · first frame rendered", "ready");
    } catch (error) {
      if (candidateNode) service?.runtime.discard(candidateNode, service.canvasId);
      candidateCanvas?.();
      candidateSession?.close().catch(() => {});
      setStatus(message(error), "error");
    } finally {
      record.run.disabled = false;
    }
  };
  program().then((stageSource) => {
    // The visible editor is the stage's actual self-contained ns+ document;
    // it is never a fragment that relies on a hidden prior editor.
    record.editor.value = stageSource;
    record.editor.dispatchEvent(new Event("input", { bubbles: true }));
    record.runFile();
  }).catch((error) => setStatus(message(error), "error"));
});
