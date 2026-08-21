import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const readRoot = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const acceptedRevision = "9a88bddd7a539d7aa790e316ee169e8cc81886a4";

test("the publishing workflow pins the accepted merged visual-language revision", async () => {
  const workflow = await readRoot(".github/workflows/pages-docs.yml");
  assert.match(workflow, /repository: hara-lang\/visual-language/);
  assert.match(workflow, new RegExp(`ref: ${acceptedRevision}`));
  assert.doesNotMatch(workflow, /ref: c49ad17d5052c8eeca0aff4a6146ff60b89ce88f/);
});

test("Starlight remains the renderer and loads the v2 product mapping after existing docs CSS", async () => {
  const config = await read("astro.config.mjs");
  assert.match(config, /starlight\(\{/);
  assert.match(config, /customCss: \["\.\/src\/styles\/docs\.css", "\.\/src\/styles\/v2-adoption\.css"\]/);
  assert.match(config, /routeMiddleware: \["\.\/src\/starlight-route-data\.mjs"\]/);
  assert.match(config, /sidebar: docsSidebar/);
});

test("the package verifier requires the accepted v2 exports, guide and Docs reference contract", async () => {
  const script = await read("scripts/verify-visual-language.mjs");
  assert.match(script, new RegExp(acceptedRevision));
  for (const value of ["./v2.css", "./theme.js", "./astro/v2/Shell.astro", "./astro/v2/Header.astro", "./astro/v2/PageHeader.astro", "V2-THEME.md", "V2-GUIDE.md", "V2-WWW.md"]) {
    assert.match(script, new RegExp(value.replaceAll(".", "\\.")));
  }
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
