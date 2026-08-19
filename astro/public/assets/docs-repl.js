import { createLiveKernel } from "/docs/docs-assets/live/kernel.js";
import { mountLiveWorkbench } from "/docs/docs-assets/live/workbench.js";
import { getLiveSnippet } from "/docs/docs-assets/live/snippets.js";
import {
  createDocsSessionRegistry,
  describeDocsSession
} from "./docs-repl-state.js";

const errorMessage = (error) => String(error?.message ?? error).replace(/^Error: /, "");

function createKernelProgress() {
  const toast = document.createElement("div");
  toast.className = "hara-kernel-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `<i></i><span>Preparing Hara kernel</span><b>0%</b>`;
  document.body.append(toast);

  return {
    toast,
    report(message, percent = 0) {
      toast.querySelector("span").textContent = message;
      toast.querySelector("b").textContent = `${percent}%`;
      toast.style.setProperty("--kernel-progress", `${percent}%`);
    }
  };
}

function createKernelPromise(progress) {
  return createLiveKernel({
    onProgress: (message, percent) => progress.report(message, percent)
  })
    .then((kernel) => {
      progress.toast.remove();
      document.dispatchEvent(new CustomEvent("hara:kernel-ready", {
        detail: { artifact: "hara-wasm-core" }
      }));
      return kernel;
    })
    .catch((error) => {
      progress.toast.dataset.state = "error";
      progress.toast.querySelector("span").textContent = "Kernel unavailable";
      progress.toast.querySelector("b").textContent = "";
      console.error(error);
      throw error;
    });
}

function sourceFromFrame(frame) {
  if (frame.dataset.haraSource) return decodeURIComponent(frame.dataset.haraSource);
  const code = frame.querySelector("pre > code, code");
  return code?.textContent?.replace(/\n$/, "") ?? "";
}

function createMount(frame, className = "hara-docs-live") {
  const mount = document.createElement("div");
  mount.className = className;
  frame.replaceWith(mount);
  return mount;
}

function pageNavigation() {
  return [...document.querySelectorAll("main :is(h2, h3)[id]")]
    .slice(0, 12)
    .map((heading) => ({
      id: heading.id,
      label: heading.textContent?.trim() || heading.id,
      href: `#${heading.id}`
    }));
}

function sessionFrontmatter(descriptor, fileName, kind) {
  return [
    { label: "Scope", value: descriptor.label },
    { label: "Session", value: descriptor.id },
    { label: "Filesystem", value: descriptor.filesystem },
    { label: "Shared with", value: descriptor.sharedWith },
    { label: "File", value: fileName },
    { label: "Surface", value: kind === "canvas" ? "Canvas / 2D" : "Live code" }
  ];
}

function controlPaneFor(descriptor, fileName, kind, getWorkbench) {
  const canvas = kind === "canvas"
    ? [
        { id: "stop", label: "Execution", type: "action", actionLabel: "Stop" },
        { id: "reset", label: "Surface", type: "action", actionLabel: "Reset" }
      ]
    : false;
  return {
    open: false,
    sessions: [{
      id: descriptor.id,
      label: descriptor.label,
      value: descriptor.id,
      status: "ready"
    }],
    files: [{
      id: fileName,
      label: fileName,
      value: descriptor.filesystem,
      status: "current"
    }],
    canvas,
    threeD: false,
    onControl({ group, id }) {
      const workbench = getWorkbench();
      if (group !== "canvas" || !workbench) return;
      if (id === "stop") workbench.interrupt();
      if (id === "reset") workbench.reset();
    }
  };
}

function sessionProxyKernel(sessions, descriptor) {
  return {
    async createSession() {
      return {
        async eval(source) {
          return (await sessions.get(descriptor)).eval(source);
        },
        close() {
          // The page registry owns shared and grouped documentation sessions.
        }
      };
    }
  };
}

function directSessionKernel(sessions, descriptor) {
  return {
    createSession() {
      return sessions.get(descriptor);
    }
  };
}

function docsSnippet(descriptor, source, kind = "console") {
  return Object.freeze({
    id: descriptor.id,
    title: descriptor.label,
    kind,
    source
  });
}

function mountDocsRunner(frame, descriptor, sessions) {
  const source = sourceFromFrame(frame);
  if (!source.trim()) return null;

  const mount = createMount(frame);
  const fileName = frame.dataset.haraFile || `${descriptor.id}.hal`;
  let workbench = null;
  workbench = mountLiveWorkbench(mount, {
    snippets: [docsSnippet(descriptor, source)],
    activeSnippet: descriptor.id,
    kernel: sessionProxyKernel(sessions, descriptor),
    activeSection: "code",
    navigation: pageNavigation(),
    frontmatter: sessionFrontmatter(descriptor, fileName, "console"),
    controlPane: controlPaneFor(descriptor, fileName, "console", () => workbench)
  });

  return {
    descriptor,
    card: workbench,
    beginReset() {
      // reset() increments the card operation counter, so stale evaluations
      // cannot repaint the surface after the shared session has been replaced.
      workbench.reset();
    }
  };
}

async function sourceForCanvasStage(stage, fallback) {
  const program = stage.dataset.haraCanvasProgram;
  if (!program) return fallback;
  const response = await fetch(new URL(program, document.baseURI));
  if (!response.ok) throw new Error(`unable to load tutorial source (${response.status})`);
  return response.text();
}

async function mountCanvasStage(stage, index, sessions) {
  const frame = stage.querySelector(".expressive-code, .highlight, pre");
  if (!frame) return null;

  const descriptor = describeDocsSession({
    pagePath: `${location.pathname}/canvas`,
    sequence: index + 1
  });
  const fallback = sourceFromFrame(frame);
  let source = fallback;
  try {
    source = await sourceForCanvasStage(stage, fallback);
  } catch (error) {
    console.error("[hara docs canvas]", error);
  }
  if (!source.trim()) return null;

  const fileName = stage.dataset.haraCanvasProgram?.split("/").pop() || `${descriptor.id}.hal`;
  const mount = createMount(frame, "hara-docs-live hara-docs-live-canvas");
  let workbench = null;
  workbench = mountLiveWorkbench(mount, {
    snippets: [docsSnippet(descriptor, source, "canvas")],
    activeSnippet: descriptor.id,
    graphicsSnippet: descriptor.id,
    kernel: directSessionKernel(sessions, descriptor),
    activeSection: "graphics",
    navigation: pageNavigation(),
    frontmatter: sessionFrontmatter(descriptor, fileName, "canvas"),
    controlPane: controlPaneFor(descriptor, fileName, "canvas", () => workbench)
  });
  workbench.run().catch((error) => {
    console.error("[hara docs canvas]", errorMessage(error));
  });

  return { descriptor, card: workbench };
}

const frames = [...document.querySelectorAll("main [data-hara-eval]")];
const canvasStages = [...document.querySelectorAll("main [data-hara-canvas-stage]")];

if (frames.length > 0 || canvasStages.length > 0) {
  const progress = createKernelProgress();
  const kernelPromise = createKernelPromise(progress);
  const sessions = createDocsSessionRegistry(kernelPromise);
  const runners = frames.map((frame, index) => {
    const descriptor = describeDocsSession({
      scope: frame.dataset.haraScope,
      groupName: frame.dataset.haraGroup,
      pagePath: location.pathname,
      sequence: index + 1
    });
    return mountDocsRunner(frame, descriptor, sessions);
  }).filter(Boolean);

  for (const [index, stage] of canvasStages.entries()) {
    mountCanvasStage(stage, index, sessions).catch((error) => {
      console.error("[hara docs canvas]", errorMessage(error));
    });
  }

  document.addEventListener("hara:reset-session", async (event) => {
    const groupName = String(event.detail?.groupName ?? "").trim();
    if (!groupName) return;

    const matching = runners.filter(({ descriptor }) =>
      descriptor.scope === "group" && descriptor.groupName === groupName);
    if (!matching.length) return;

    const descriptor = matching[0].descriptor;
    matching.forEach((runner) => runner.beginReset());
    try {
      await sessions.reset(descriptor);
      document.dispatchEvent(new CustomEvent("hara:session-reset", {
        detail: { groupName, sessionId: descriptor.id }
      }));
    } catch (error) {
      document.dispatchEvent(new CustomEvent("hara:session-reset-error", {
        detail: { groupName, sessionId: descriptor.id, error: errorMessage(error) }
      }));
      console.error("[hara docs session reset]", error);
    }
  });
}

// Curated live cards and runnable documentation fences mount the same shared
// calm workbench. createLiveKernel caches the underlying page kernel.
for (const mount of document.querySelectorAll("main [data-hara-live]")) {
  const selected = String(mount.dataset.haraLive ?? "")
    .split(",")
    .map((id) => getLiveSnippet(id.trim()))
    .filter(Boolean);
  if (!selected.length) continue;
  const canvasSnippet = selected.find(({ kind }) => kind === "canvas");
  const descriptor = describeDocsSession({
    pagePath: `${location.pathname}/curated`,
    sequence: [...document.querySelectorAll("main [data-hara-live]")].indexOf(mount) + 1
  });
  const fileName = `${selected[0].id}.hal`;
  let workbench = null;
  workbench = mountLiveWorkbench(mount, {
    snippets: selected,
    activeSnippet: selected[0].id,
    graphicsSnippet: canvasSnippet?.id,
    activeSection: canvasSnippet ? "graphics" : "code",
    navigation: pageNavigation(),
    frontmatter: sessionFrontmatter(descriptor, fileName, canvasSnippet ? "canvas" : "console"),
    controlPane: controlPaneFor(descriptor, fileName, canvasSnippet ? "canvas" : "console", () => workbench)
  });
}
