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
export async function createDocsKernel({ wasmUrl, workerUrl, resources = {} }) {
  const response = await fetch(wasmUrl);
  if (!response.ok) throw new Error(`hara.wasm: ${response.status}`);
  const worker = new Worker(workerUrl, { type: "module" });
  const canvasRuntimes = new Map();
  const context = new HtaContext({
    worker,
    moduleBytes: await response.arrayBuffer(),
    kernelId: `docs-${Math.random().toString(36).slice(2)}`,
    hostCalls: createHostServices({
      dbName: "hara-docs",
      canvasRuntimeForSession: (sessionId) => canvasRuntimes.get(sessionId)
    })
  });
  await context.ready;
  for (const [name, url] of Object.entries(resources)) {
    const resourceResponse = await fetch(url);
    if (!resourceResponse.ok) throw new Error(`${name}: ${resourceResponse.status}`);
    await context.call("register-resource", [name, await resourceResponse.text()]);
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
