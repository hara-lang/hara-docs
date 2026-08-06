// Documentation-home adapter for the shared @hara-lang/live component.
//
// The component source is pinned through vendor/hara-ui. Hara Docs supplies
// only its browser-kernel facade and the snippet IDs declared in Markdown.
(async () => {
  const script = [...document.scripts].find((node) => {
    try {
      return new URL(node.src).pathname.endsWith("/javascripts/home-live.js");
    } catch (_) {
      return false;
    }
  });
  if (!script) return;

  const roots = [...document.querySelectorAll("[data-hara-live]")];
  if (!roots.length) return;

  const liveBase = new URL("../vendor/hara-ui/packages/live/src/", script.src);
  const runtimeBase = new URL("../rust/", script.src).href.replace(/\/$/, "");
  const [live, snippets, kernelModule] = await Promise.all([
    import(new URL("live-card.js", liveBase).href),
    import(new URL("snippets.js", liveBase).href),
    import(new URL("kernel.js", script.src).href)
  ]);

  const styleHref = new URL("style.css", liveBase).href;
  if (!document.querySelector(`link[data-hara-live-style="${styleHref}"]`)) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = styleHref;
    style.dataset.haraLiveStyle = styleHref;
    document.head.append(style);
  }

  let kernelPromise = null;
  const getKernel = () => {
    kernelPromise ??= kernelModule.createDocsKernel({
      wasmUrl: new URL("../rust/hara.wasm", script.src),
      workerUrl: new URL("../rust/hta-worker.js", script.src)
    });
    return kernelPromise;
  };

  for (const root of roots) {
    if (root.dataset.haraLiveMounted === "true") continue;
    const ids = root.dataset.haraLive
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const selected = ids
      .map((id) => snippets.getLiveSnippet(id))
      .filter(Boolean);

    if (!selected.length) {
      console.warn("[hara-docs] no @hara-lang/live snippets matched", ids);
      continue;
    }

    root.dataset.haraLiveMounted = "true";
    live.mountLiveCard(root, {
      snippets: selected,
      activeSnippet: selected[0].id,
      kernel: getKernel(),
      runtimeBase,
      playgroundUrl: "https://playground.hara-lang.org/"
    });
  }
})();
