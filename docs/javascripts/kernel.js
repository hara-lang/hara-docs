import { HtaContext } from "../rust/hta.js?v=20260729-session-resources";
import { createHostServices } from "../rust/studio/host-services.js";

export function prepareDocsEval(source) {
  if (/^\(\s*fn(?:\s|\[)/.test(source.trim())) {
    return {
      source: `(do ${source}\n nil)`,
      label: "<function>"
    };
  }
  return { source, label: null };
}

/**
 * A browser-local Hara kernel for documentation snippets. It exposes the
 * Studio's persistent browser store and virtual filesystem, but no workspace
 * UI or ambient device capabilities.
 */
async function loadKernelAssets(wasmUrl, resources, fetchAsset) {
  const entries = Object.entries(resources);
  const [response, ...resourceResponses] = await Promise.all([
    fetchAsset(wasmUrl),
    ...entries.map(([, url]) => fetchAsset(url))
  ]);
  if (!response.ok) throw new Error(`hara.wasm: ${response.status}`);
  const moduleBytes = await response.arrayBuffer();
  const loadedResources = await Promise.all(resourceResponses.map(async (resourceResponse, index) => {
    const [name] = entries[index];
    if (!resourceResponse.ok) throw new Error(`${name}: ${resourceResponse.status}`);
    return [name, await resourceResponse.text()];
  }));
  return { moduleBytes, loadedResources };
}

export async function createDocsKernel({
  wasmUrl,
  workerUrl,
  resources = {},
  fetchAsset = fetch,
  WorkerClass = Worker,
  ContextClass = HtaContext
}) {
  // Fetch every startup dependency before constructing the worker. This keeps
  // the kernel from becoming observable while its require resources are still
  // in flight on a cold page load.
  const { moduleBytes, loadedResources } =
    await loadKernelAssets(wasmUrl, resources, fetchAsset);
  const worker = new WorkerClass(workerUrl, { type: "module" });
  const canvasRuntimes = new Map();
  const context = new ContextClass({
    worker,
    moduleBytes,
    kernelId: `docs-${Math.random().toString(36).slice(2)}`,
    hostCalls: createHostServices({
      dbName: "hara-docs",
      canvasRuntimeForSession: (sessionId) => canvasRuntimes.get(sessionId)
    })
  });
  await context.ready;
  if (loadedResources.length > 0) {
    await context.call("register-resources", [loadedResources]);
  }
  const string = (value) => JSON.stringify(String(value));
  return {
    context,
    async createSession(name, { filesystem = `memory:${name}` } = {}) {
      const session = await context.createSession(name);
      await session.attachFilesystem(filesystem);
      const fsEval = async (form) =>
        session.eval(`(do (require [studio.fs :as fs]) ${form})`);
      return {
        id: name,
        filesystem,
        async eval(source) {
          const prepared = prepareDocsEval(source);
          return { value: await session.eval(prepared.source), label: prepared.label };
        },
        evalRaw: (source) => session.eval(source),
        evalBound: (source, bindings = []) => session.evalBound(source, bindings),
        complete: (prefix) => session.complete(prefix),
        listFiles: (space = "guide") => fsEval(`(fs/list ${string(space)} "/")`),
        readFile: (path, space = "guide") =>
          fsEval(`(fs/read ${string(space)} ${string(path)})`),
        writeFile: (path, content, space = "guide") =>
          fsEval(`(fs/write! ${string(space)} ${string(path)} ${string(content)})`),
        deleteFile: (path, space = "guide") =>
          fsEval(`(fs/delete! ${string(space)} ${string(path)})`),
        registerCanvas(runtime) {
          canvasRuntimes.set(name, runtime);
          return () => canvasRuntimes.delete(name);
        },
        async close() {
          canvasRuntimes.delete(name);
          return session.close();
        }
      };
    },
    close() {
      context.close();
    }
  };
}
