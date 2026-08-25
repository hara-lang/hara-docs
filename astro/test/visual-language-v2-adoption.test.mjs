import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const readRoot = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("the publishing workflow uses the independently packaged Hara UI", async () => {
  const workflow = await readRoot(".github/workflows/pages-docs.yml");
  assert.match(workflow, /repository: hara-lang\/hara-ui/);
  assert.match(workflow, /technology\/hara-ui/);
  assert.doesNotMatch(workflow, /repository: hara-lang\/visual-language/);
});

test("Starlight remains the renderer and loads v2 mapping layers after existing docs CSS", async () => {
  const config = await read("astro.config.mjs");
  assert.match(config, /starlight\(\{/);
  assert.match(config, /customCss: \[[\s\S]*?"\.\/src\/styles\/docs\.css"[\s\S]*?"\.\/src\/styles\/v2-adoption\.css"/);
  assert.match(config, /routeMiddleware: \["\.\/src\/starlight-route-data\.mjs"\]/);
  assert.match(config, /sidebar: docsSidebar/);
  assert.match(config, /Header: "\.\/src\/components\/DocsHeader\.astro"/);
  assert.match(config, /PageFrame: "\.\/src\/components\/DocsPageFrame\.astro"/);
});

test("the Starlight frame uses the shared Hara UI header and section navigation", async () => {
  const [header, frame] = await Promise.all([
    read("src/components/DocsHeader.astro"),
    read("src/components/DocsPageFrame.astro")
  ]);
  assert.match(header, /@hara-lang\/ui-astro\/astro\/v2\/Header\.astro/);
  assert.match(header, /homeHref="https:\/\/hara-lang\.org\/"/);
  assert.match(header, /data-hara-identity/);
  assert.match(frame, /@hara-lang\/ui-astro\/astro\/v2\/Shell\.astro/);
  assert.match(frame, /@hara-lang\/ui-astro\/astro\/v2\/ContextNav\.astro/);
  assert.match(frame, /class="docs-v2-shell"/);
  assert.match(frame, /<Fragment slot="header"><slot name="header" \/><\/Fragment>/);
  assert.match(frame, /variant="document"/);
  assert.match(frame, /sidebar=\{hasSidebar\}/);
  assert.match(frame, /Docs sections/);
});

test("the package verifier materialises the UI publication boundary", async () => {
  const script = await read("scripts/verify-ui.mjs");
  assert.match(script, /@hara-lang\/ui/);
  assert.match(script, /@hara-lang\/ui-astro/);
  assert.match(script, /technology\/hara-ui/);
  assert.match(script, /manifest\.files/);
  assert.match(script, /node_modules\/\@hara-lang\/ui/);
  assert.match(script, /await cp\(from, to, \{ recursive: true, dereference: true \}\)/);
  assert.match(script, /using materialised \$\{entry\.name\}/);
  assert.doesNotMatch(script, /await symlink/, "Docs must consume a materialised package boundary");
});

test("the checked-out package source is not treated as Docs application source", async () => {
  const tsconfig = JSON.parse(await read("tsconfig.json"));
  assert.ok(tsconfig.exclude?.includes("packages/visual-language/**"));
  assert.equal(tsconfig.compilerOptions?.allowJs, true);
  assert.equal(tsconfig.compilerOptions?.checkJs, false);
});

test("the v2 mapping consumes the Hara UI foundation while preserving dark executable surfaces", async () => {
  const css = await read("src/styles/v2-adoption.css");
  assert.match(css, /@import "@hara-lang\/ui\/v2\.css"/);
  for (const selector of [".header", ".sidebar-pane", ".main-pane", ".right-sidebar", ".sl-markdown-content", ".pagination-links", ".hara-repl", ".hara-live-card", ".hara-live-canvas-panel"]) {
    assert.match(css, new RegExp(selector.replace(".", "\\.")));
  }
  assert.match(css, /color-scheme:\s*dark/);
  assert.match(css, /@media \(max-width: 1120px\)[\s\S]*?\.right-sidebar \{ display: none; \}/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "Docs may consume but not redefine protected v2 tokens");
});

test("the adoption note preserves routes, runtime, identity, search and compatibility boundaries", async () => {
  const document = await readRoot("VISUAL-LANGUAGE-V2-ADOPTION.md");
  assert.match(document, /@hara-lang\/ui/);
  for (const phrase of ["Starlight", "Pagefind", "REPL", "live-card", "canvas", "popup identity", "MkDocs compatibility", "do not close", "Hara UI package revisions"]) {
    assert.match(document, new RegExp(phrase, "i"));
  }
});
