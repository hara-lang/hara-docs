/* Hara Studio bootstrap (live wasm runtime).

   Fetches the raw HTA wasm module and the four studio hal resources, creates
   the kernel broker with the browser host services, and mounts the shared
   studio UI (rust/web/studio/ui.js) into the mount point in studio.html.

   All paths resolve against the site root derived from import.meta.url, so
   the module works under any base path (the site deploys to a project page,
   e.g. /hara.lang/, where root-absolute "/rust/..." URLs would break).
   Deploy layout (see .github/workflows/pages.yml):
     /rust/hara.wasm            raw wasm module (hara_wasm_raw.wasm)
     /rust/hta.js               HTA codec + HtaContext
     /rust/hta-worker.js        kernel worker script
     /rust/studio/*.js          broker, host services, boot template, UI
     /rust/studio/studio.css    studio styles (@imported by hara.css)
     /rust/studio/hal/*.hal     store/fs/space/boot resources              */

const siteRoot = new URL("../", import.meta.url);
const asset = (path) => new URL(path, siteRoot);

const mount = document.getElementById("hara-studio-mount");

function fail(error) {
  const message = String(error?.message ?? error);
  const shell = document.createElement("div");
  shell.className = "hara-studio";
  const head = document.createElement("div");
  head.className = "hara-studio-head";
  const kicker = document.createElement("span");
  kicker.className = "hara-kicker";
  kicker.textContent = "HARA STUDIO";
  const index = document.createElement("span");
  index.className = "hara-index";
  index.textContent = "BOOT FAILED";
  head.append(kicker, index);
  const strip = document.createElement("div");
  strip.className = "hara-strip hara-studio-status";
  const runtime = document.createElement("span");
  const bold = document.createElement("b");
  bold.textContent = `WASM · ERROR — ${message}`;
  runtime.append("RUNTIME ", bold);
  strip.appendChild(runtime);
  shell.append(head, strip);
  mount.replaceChildren(shell);
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch ${url.pathname} failed: ${response.status}`);
  return response.text();
}

async function loadProjects() {
  const response = await fetch(asset("examples/index.json"));
  if (!response.ok) throw new Error(`fetch examples/index.json failed: ${response.status}`);
  const index = await response.json();
  const projects = await Promise.all(index.projects.map(async (project) => {
    const root = project.project.slice(0, project.project.lastIndexOf("/") + 1);
    const entries = await Promise.all(project.files.map(async (path) => {
      const source = await fetchText(asset(path));
      return [path.startsWith(root) ? path.slice(root.length) : path, source];
    }));
    const projectMain = entries.map(([path]) => path).find((path) =>
      path.startsWith("src/") && path.endsWith("main.hal")
    ) ?? entries.map(([path]) => path).find((path) => path.endsWith(".hal"));
    return { ...project, files: Object.fromEntries(entries), main: projectMain };
  }));
  return { version: index.version, projects };
}

try {
  const [
    { createBrowserBroker },
    { createHostServices },
    { mountStudio },
    { CanvasRuntime }
  ] = await Promise.all([
    import(asset("rust/studio/broker.js").href),
    import(asset("rust/studio/host-services.js").href),
    import(asset("rust/studio/ui.js").href),
    import(asset("rust/studio/canvas-runtime.js").href)
  ]);
  const [graphModule, sessionModule, registryModule, canvasModule, clockModule] = await Promise.all([
    import(asset("rust/studio/graph-host.js").href),
    import(asset("rust/studio/session-router.js").href),
    import(asset("rust/studio/capability-registry.js").href),
    import(asset("rust/studio/capabilities/canvas.js").href),
    import(asset("rust/studio/capabilities/clock.js").href)
  ]).catch(() => [null, null, null, null, null]);

  const [{ version: runtimeVersion, projects }, wasmResponse] = await Promise.all([
    loadProjects(),
    fetch(asset("rust/hara.wasm"))
  ]);
  if (!wasmResponse.ok) throw new Error(`fetch hara.wasm failed: ${wasmResponse.status}`);
  const moduleBytes = new Uint8Array(await wasmResponse.arrayBuffer());

  const resources = {};
  for (const name of ["store", "fs", "space", "boot", "node", "draw", "program", "graph", "session"]) {
    resources[`studio.${name}`] = await fetchText(asset(`rust/studio/hal/${name}.hal`));
  }
  resources["std.substrate"] = await fetchText(asset("rust/studio/hal/substrate.hal"));
  resources["std.substrate.frame"] = await fetchText(asset("rust/studio/hal/substrate-frame.hal"));
  resources["std.substrate.protocol"] = await fetchText(asset("rust/studio/hal/substrate-protocol.hal"));

  const canvasRuntime = new CanvasRuntime();
  const sessionRouter = sessionModule ? new sessionModule.SessionRouter() : null;
  const capabilityRegistry = registryModule ? new registryModule.CapabilityRegistry({ adapters: {
    "surface/canvas-2d": canvasModule.createCanvasCapability(canvasRuntime),
    "clock/frame": clockModule.createClockCapability()
  } }) : null;
  const graphHost = graphModule ? new graphModule.GraphHost({
    workerUrl: asset("rust/studio/program-worker.js"), sessionRouter, capabilityRegistry
  }) : null;
  const broker = createBrowserBroker({
    workerUrl: asset("rust/hta-worker.js"),
    moduleBytes,
    hostCalls: createHostServices({
      canvasRuntime,
      ...(graphHost ? { graphHost, graphHostOptions: { sessionRouter } } : {})
    }),
    resources,
    ...(sessionRouter ? {
      onKernelCreated: async (kernel) => sessionRouter.register(kernel.name, kernel.context, {
        onRelease: (sessionId) => graphHost.releaseSession(sessionId)
      }),
      onKernelClosed: (kernel) => sessionRouter.unregister(kernel.name)
    } : {})
  });

  mountStudio(mount, { broker, projects, runtimeVersion, canvasRuntime });
} catch (error) {
  fail(error);
}
