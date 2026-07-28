// The landing-card evaluator intentionally uses the same raw WASM broker as
// Studio. It is a small, self-contained first contact: edits are evaluated in
// the browser and never leave the visitor's device.
(() => {
  const card = document.querySelector("[data-hara-live]");
  if (!card) return;

  const source = card.querySelector("[data-hara-live-source]");
  const result = card.querySelector("[data-hara-live-result]");
  const status = card.querySelector("[data-hara-live-status]");
  const run = card.querySelector("[data-hara-live-run]");
  let broker = null;
  let timer = null;
  let revision = 0;

  const show = (value, error = false) => {
    result.textContent = value;
    result.classList.toggle("is-error", error);
  };

  const keywordName = (value) => value?.constructor?.name === "HtaKeyword" ? `:${value.name}` : null;
  const print = (value) => {
    const keyword = keywordName(value);
    if (keyword) return keyword;
    if (value instanceof Map) return `{${[...value].map(([key, item]) => `${print(key)} ${print(item)}`).join(" ")}}`;
    if (Array.isArray(value)) return `[${value.map(print).join(" ")}]`;
    if (typeof value === "string") return JSON.stringify(value);
    if (value === null) return "nil";
    return String(value);
  };

  const asset = (path) => new URL(path, document.baseURI);
  const boot = (async () => {
    try {
      const [{ createBrowserBroker }, { createHostServices }, wasm] = await Promise.all([
        import(asset("rust/studio/broker.js").href),
        import(asset("rust/studio/host-services.js").href),
        fetch(asset("rust/hara.wasm"))
      ]);
      if (!wasm.ok) throw new Error(`hara.wasm: ${wasm.status}`);
      broker = createBrowserBroker({
        workerUrl: asset("rust/hta-worker.js"),
        moduleBytes: new Uint8Array(await wasm.arrayBuffer()),
        hostCalls: createHostServices(),
        resources: {}
      });
      await broker.require("ROOT");
      status.textContent = "WASM · live";
    } catch (error) {
      status.textContent = "WASM · unavailable";
      show(`⇒ ${String(error?.message ?? error)}`, true);
    }
  })();

  async function evaluate() {
    const current = ++revision;
    try {
      await boot;
      if (!broker) return;
      status.textContent = "WASM · evaluating";
      const value = await broker.eval("ROOT", source.value);
      if (current !== revision) return;
      status.textContent = "WASM · live";
      show(`⇒ ${print(value)}`);
    } catch (error) {
      if (current !== revision) return;
      status.textContent = "WASM · live";
      show(`⇒ ${String(error?.message ?? error)}`, true);
    }
  }

  source.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(evaluate, 450);
  });
  source.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
      event.preventDefault();
      clearTimeout(timer);
      evaluate();
    }
  });
  run.addEventListener("click", evaluate);
  boot.then(() => evaluate());
})();
