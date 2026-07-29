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

async function stageKernel(asset, canvas, onDiagnostic) {
  const [{ createBrowserBroker }, { CanvasRuntime }, { createHostServices }, module] = await Promise.all([
    import(asset("../rust/studio/broker.js").href),
    import(asset("../rust/studio/canvas-runtime.js").href),
    import(asset("../rust/studio/host-services.js").href),
    fetch(asset("../rust/hara.wasm")).then((response) => {
      if (!response.ok) throw new Error(`unable to load Hara runtime (${response.status})`);
      return response.arrayBuffer();
    })
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
  const resources = Object.fromEntries(await Promise.all([
    ["studio.node", "../rust/studio/hal/node.hal"],
    ["studio.draw", "../rust/studio/hal/draw.hal"],
    ["std.substrate.frame", "../rust/studio/hal/std/substrate/frame.hal"]
  ].map(async ([name, path]) => [name, await fetch(asset(path)).then((response) => response.text())])));
  const broker = createBrowserBroker({
    workerUrl: asset("../rust/hta-worker.js"),
    moduleBytes: module,
    hostCalls: createHostServices({ canvasRuntime: runtime }),
    resources
  });
  return { broker, runtime, canvasId };
}

document.addEventListener("hara:live-cell", ({ detail }) => {
  const { stage, record, source } = detail;
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
  meta.innerHTML = "<span>CANVAS · STAGE-LOCAL KERNEL</span><output aria-live=\"polite\">loading</output>";
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
    active && service?.broker.releaseDocument("ROOT", "tictactoe");
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
      const result = await service.broker.evalForm("ROOT", "tictactoe", target.source);
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
    setStatus("loading", "loading");
    try {
      service ??= await stageKernel(asset, canvas, (error) => setStatus(message(error), "error"));
      const nodeId = `docs-tictactoe-${generation}`;
      service.runtime.stage(nodeId, service.canvasId);
      const candidate = await service.broker.prepareDocument("ROOT", "tictactoe", record.editor.value || await program(), { nodeId });
      const rendered = service.runtime.waitForFirstRender(nodeId, service.canvasId, 5000);
      // A node/start task is intentionally infinite. Start it without waiting
      // for its completion; first render is the activation handshake.
      service.broker.evalPreparedDocument(candidate, `(studio.node/run-task ${JSON.stringify(candidate.value)})`)
        .catch((error) => setStatus(message(error), "error"));
      await rendered;
      if (generation !== sequence) {
        service.broker.discardDocument(candidate);
        return;
      }
      service.runtime.commit(nodeId, service.canvasId);
      service.broker.commitDocument(candidate);
      active = candidate;
      setStatus("live · first frame rendered", "ready");
    } catch (error) {
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
