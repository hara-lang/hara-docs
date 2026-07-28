import { HtaContext } from "../rust/hta.js";

/**
 * A browser-local Hara kernel for documentation snippets. This intentionally
 * exposes only evaluation: no project store, workspace UI, host services, or
 * browser capabilities are installed.
 */
export async function createDocsKernel({ wasmUrl, workerUrl }) {
  const response = await fetch(wasmUrl);
  if (!response.ok) throw new Error(`hara.wasm: ${response.status}`);
  const worker = new Worker(workerUrl, { type: "module" });
  const context = new HtaContext({ worker, moduleBytes: await response.arrayBuffer() });
  await context.ready;
  return {
    eval(source) {
      return context.call("eval", [source]);
    },
    close() {
      context.close();
    }
  };
}
