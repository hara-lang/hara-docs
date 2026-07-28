import { HtaContext } from "../rust/hta.js";
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
  const context = new HtaContext({
    worker,
    moduleBytes: await response.arrayBuffer(),
    hostCalls: createHostServices({ dbName: "hara-docs" })
  });
  await context.ready;
  for (const [name, url] of Object.entries(resources)) {
    const resourceResponse = await fetch(url);
    if (!resourceResponse.ok) throw new Error(`${name}: ${resourceResponse.status}`);
    await context.call("register-resource", [name, await resourceResponse.text()]);
  }
  const fsEval = async (form) =>
    context.call("eval", [`(do (require [studio.fs :as fs]) ${form})`]);
  const string = (value) => JSON.stringify(String(value));
  return {
    async eval(source) {
      const prepared = prepareDocsEval(source);
      return {
        value: await context.call("eval", [prepared.source]),
        label: prepared.label
      };
    },
    async complete(prefix) {
      return context.call("complete", [prefix]);
    },
    async listFiles(space = "guide") {
      return fsEval(`(fs/list ${string(space)} "/")`);
    },
    async readFile(path, space = "guide") {
      return fsEval(`(fs/read ${string(space)} ${string(path)})`);
    },
    async writeFile(path, content, space = "guide") {
      return fsEval(`(fs/write! ${string(space)} ${string(path)} ${string(content)})`);
    },
    async deleteFile(path, space = "guide") {
      return fsEval(`(fs/delete! ${string(space)} ${string(path)})`);
    },
    close() {
      context.close();
    }
  };
}
