const CONNECTION_LABELS = Object.freeze({
  idle: "Idle",
  loading: "Connecting",
  ready: "Connected",
  busy: "Evaluating",
  error: "Unavailable"
});

const text = (value, fallback = "") => String(value ?? fallback).trim() || fallback;

export function describeDocsRuntimeEvidence(descriptor, {
  revision = 0,
  route = "/",
  capabilities = ["eval", "observations"]
} = {}) {
  const generation = Math.max(1, Number(revision) + 1 || 1);
  return Object.freeze({
    scope: text(descriptor?.scope, "isolated"),
    scopeLabel: text(descriptor?.label, "isolated"),
    sessionId: text(descriptor?.id, "unassigned"),
    filesystem: text(descriptor?.filesystem, "unavailable"),
    sharedWith: text(descriptor?.sharedWith, "this runner only"),
    generation,
    route: text(route, "/"),
    capabilities: [...new Set(capabilities.map((item) => text(item)).filter(Boolean))]
  });
}

function addField(list, label, value, marker = "") {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  if (marker) description.setAttribute(marker, "");
  row.append(term, description);
  list.append(row);
  return description;
}

export function mountDocsRuntimeEvidence(mount, descriptor, options = {}) {
  const card = mount?.querySelector?.(".hara-live-card");
  if (!(card instanceof HTMLElement)) return null;

  const model = describeDocsRuntimeEvidence(descriptor, options);
  const evidence = document.createElement("details");
  evidence.className = "hara-docs-runtime-evidence";
  evidence.dataset.docsRuntimeEvidence = "";
  evidence.dataset.state = card.dataset.connectionState || "idle";

  const summary = document.createElement("summary");
  const kicker = document.createElement("span");
  const state = document.createElement("strong");
  const identity = document.createElement("code");
  const chevron = document.createElement("i");
  kicker.textContent = "Runtime context";
  state.textContent = CONNECTION_LABELS[evidence.dataset.state] ?? evidence.dataset.state;
  state.dataset.docsRuntimeState = "";
  identity.textContent = `${model.scopeLabel} · ${model.sessionId}`;
  chevron.setAttribute("aria-hidden", "true");
  summary.append(kicker, state, identity, chevron);

  const list = document.createElement("dl");
  addField(list, "Scope", model.scopeLabel);
  addField(list, "Session", model.sessionId);
  addField(list, "Generation", String(model.generation), "data-docs-runtime-generation");
  addField(list, "Filesystem", model.filesystem);
  addField(list, "Shared with", model.sharedWith);
  addField(list, "Route", model.route);
  addField(list, "Declared surface", model.capabilities.length ? model.capabilities.join(" · ") : "none declared");

  const note = document.createElement("p");
  note.textContent = "The runtime owns connection state and evaluation results. This row exposes the exact documentation session fence without changing evaluator behavior.";
  evidence.append(summary, list, note);

  const header = card.querySelector(".hara-live-card-header");
  if (header) header.after(evidence);
  else card.prepend(evidence);

  const updateConnection = () => {
    const connection = card.dataset.connectionState || "idle";
    const liveLabel = card.querySelector("[data-live-connection-label]")?.textContent?.trim();
    evidence.dataset.state = connection;
    state.textContent = liveLabel || CONNECTION_LABELS[connection] || connection;
  };
  const observer = new MutationObserver(updateConnection);
  observer.observe(card, { attributes: true, attributeFilter: ["data-connection-state"] });
  updateConnection();

  const generation = evidence.querySelector("[data-docs-runtime-generation]");
  return {
    element: evidence,
    setRevision(revision) {
      if (generation) generation.textContent = String(Math.max(1, Number(revision) + 1 || 1));
    },
    destroy() {
      observer.disconnect();
      evidence.remove();
    }
  };
}
