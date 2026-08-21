import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const readRoot = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const acceptedRevision = "a2ab66d0fde79edb1cee46b79528098b3fda68cf";

test("the publishing workflow pins the accepted merged visual-language revision", async () => {
  const workflow = await readRoot(".github/workflows/pages-docs.yml");
  assert.match(workflow, /repository: hara-lang\/visual-language/);
  assert.match(workflow, new RegExp(`ref: ${acceptedRevision}`));
  assert.doesNotMatch(workflow, /ref: (?:c49ad17d5052c8eeca0aff4a6146ff60b89ce88f|9a88bddd7a539d7aa790e316ee169e8cc81886a4)/);
});

test("Starlight remains the renderer and loads the v2 product mapping after existing docs CSS", async () => {
  const config = await read("astro.config.mjs");
  assert.match(config, /starlight\(\{/);
  assert.match(config, /customCss: \["\.\/src\/styles\/docs\.css", "\.\/src\/styles\/v2-adoption\.css"\]/);
  assert.match(config, /routeMiddleware: \["\.\/src\/starlight-route-data\.mjs"\]/);
  assert.match(config, /sidebar: docsSidebar/);
  assert.match(config, /Header: "\.\/src\/components\/DocsHeader\.astro"/);
  assert.match(config, /PageFrame: "\.\/src\/components\/DocsPageFrame\.astro"/);
});

test("the Starlight frame uses the shared v2 header and section navigation", async () => {
  const [header, frame] = await Promise.all([
    read("src/components/DocsHeader.astro"),
    read("src/components/DocsPageFrame.astro")
  ]);
  assert.match(header, /@hara-lang\/visual-language\/astro\/v2\/Header\.astro/);
  assert.match(header, /data-hara-identity/);
  assert.match(frame, /@hara-lang\/visual-language\/astro\/v2\/ContextNav\.astro/);
  assert.match(frame, /class="hara-v2 hara-v2-shell docs-v2-shell"/);
  assert.match(frame, /Docs sections/);
});

test("the package verifier requires and materialises the accepted published boundary", async () => {
  const script = await read("scripts/verify-visual-language.mjs");
  assert.match(script, new RegExp(acceptedRevision));
  for (const value of [
    "./v2.css",
    "./v2-data.css",
    "./theme.js",
    "./astro/v2/Shell.astro",
    "./astro/v2/Header.astro",
    "./astro/v2/PageHeader.astro",
    "V2-THEME.md",
    "V2-GUIDE.md",
    "V2-WWW.md",
    "V2-DATA-VISUALISATION.md"
  ]) {
    assert.match(script, new RegExp(value.replaceAll(".", "\\.")));
  }
  assert.match(script, /manifest\.files/);
  assert.match(script, /node_modules\/@hara-lang\/visual-language/);
  assert.match(script, /await cp\(from, to, \{ recursive: true, dereference: true \}\)/);
  assert.match(script, /materialised @hara-lang\/visual-language/);
  assert.doesNotMatch(script, /await symlink/, "Docs must consume the package publication boundary, not the catalogue source tree");
});

test("the checked-out package source is not treated as Docs application source", async () => {
  const tsconfig = JSON.parse(await read("tsconfig.json"));
  assert.ok(tsconfig.exclude?.includes("packages/visual-language/**"));
  assert.equal(tsconfig.compilerOptions?.allowJs, true);
  assert.equal(tsconfig.compilerOptions?.checkJs, false);
});

test("the v2 mapping covers the information shell while preserving dark executable surfaces", async () => {
  const css = await read("src/styles/v2-adoption.css");
  assert.match(css, /@import "@hara-lang\/visual-language\/v2\.css"/);
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
  assert.match(document, new RegExp(acceptedRevision));
  for (const phrase of ["Starlight", "Pagefind", "REPL", "live-card", "canvas", "popup identity", "MkDocs compatibility", "does not close", "merged Visual Language revisions"]) {
    assert.match(document, new RegExp(phrase, "i"));
  }
});
