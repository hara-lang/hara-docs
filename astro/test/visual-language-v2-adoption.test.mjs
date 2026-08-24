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

test("Starlight remains the renderer and loads v2 mapping layers after existing docs CSS", async () => {
  const config = await read("astro.config.mjs");
  assert.match(config, /starlight\(\{/);
  assert.match(config, /customCss: \[[\s\S]*?"\.\/src\/styles\/docs\.css"[\s\S]*?"\.\/src\/styles\/v2-adoption\.css"[\s\S]*?"\.\/src\/styles\/navigation\.css"/);
  assert.match(config, /routeMiddleware: \["\.\/src\/starlight-route-data\.mjs"\]/);
  assert.match(config, /sidebar: docsSidebar/);
  assert.match(config, /Header: "\.\/src\/components\/DocsHeader\.astro"/);
  assert.match(config, /PageFrame: "\.\/src\/components\/DocsPageFrame\.astro"/);
  assert.match(config, /@hara-lang\/ui\/v2\/header\.js/);
});

test("the Starlight frame uses the merged Hara UI product header and one non-floating context shell", async () => {
  const [header, frame, secondary] = await Promise.all([
    read("src/components/DocsHeader.astro"),
    read("src/components/DocsPageFrame.astro"),
    read("src/components/DocsSecondaryNav.astro")
  ]);
  assert.match(header, /vendor\/hara-ui\/foundation\/astro\/v2\/Header\.astro/);
  assert.match(header, /menuMode="product"/);
  assert.match(header, /menuControls="hara-docs-product-menu"/);
  assert.match(header, /hara:header-menu-request/);
  assert.match(header, /data-docs-menu-tree/);
  assert.match(header, /\.docs-v2-sidebar \.sidebar-content a\[href\]/);
  assert.match(header, /data-hara-identity/);
  assert.match(frame, /\.\/DocsSecondaryNav\.astro/);
  assert.match(frame, /class="hara-v2 hara-v2-shell docs-v2-shell"/);
  assert.doesNotMatch(frame, /ContextNav\.astro/);
  assert.match(secondary, /data-docs-group-trigger/);
  assert.match(secondary, /data-docs-section-trigger/);
  assert.match(secondary, /data-sticky="false"/);
  assert.match(secondary, /if \(open\) setSectionOpen\(false\)/);
  assert.match(secondary, /if \(open\) setGroupOpen\(false\)/);
  assert.match(secondary, /event\.key !== "Escape"/);
  assert.doesNotMatch(secondary, /matchMedia/);
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
  const [css, navigation] = await Promise.all([
    read("src/styles/v2-adoption.css"),
    read("src/styles/navigation.css")
  ]);
  assert.match(css, /@import "@hara-lang\/visual-language\/v2\.css"/);
  for (const selector of [".header", ".sidebar-pane", ".main-pane", ".right-sidebar", ".sl-markdown-content", ".pagination-links", ".hara-repl", ".hara-live-card", ".hara-live-canvas-panel"]) {
    assert.match(css, new RegExp(selector.replace(".", "\\.")));
  }
  assert.match(css, /color-scheme:\s*dark/);
  assert.match(css, /@media \(max-width: 1120px\)[\s\S]*?\.right-sidebar \{ display: none; \}/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.docs-v2-sidebar \{[\s\S]*?top: var\(--hara-v2-header-height\);[\s\S]*?height: calc\(100svh - var\(--hara-v2-header-height\)\);/);
  assert.match(css, /scroll-margin-top: calc\(var\(--hara-v2-header-height\) \+ 1rem\)/);
  assert.doesNotMatch(css, /docs-v2-sidebar[\s\S]{0,220}--hara-v2-context-height/);
  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "Docs may consume but not redefine protected v2 tokens");

  const shellStart = navigation.indexOf(".hara-docs-secondary {");
  const shellEnd = navigation.indexOf("}", shellStart);
  const shellRule = navigation.slice(shellStart, shellEnd + 1);
  assert.match(shellRule, /position: relative/);
  assert.match(shellRule, /top: auto/);
  assert.match(shellRule, /isolation: isolate/);
  assert.match(shellRule, /min-height: 48px/);
  assert.match(shellRule, /max-height: 48px/);
  assert.doesNotMatch(shellRule, /position:\s*(?:sticky|fixed)/);
  assert.match(navigation, /left: clamp\(12px, 2vw, 28px\)/);
  assert.match(navigation, /width: min\(360px, calc\(100vw - 56px\)\)/);
  assert.match(navigation, /@media \(max-width: 840px\)[\s\S]*?\.hara-docs-secondary__panel \{[\s\S]*?left: 0;[\s\S]*?width: 100%;/);
  assert.match(navigation, /\.docs-v2-sidebar \{[\s\S]*?top: var\(--hara-v2-header-height\);/);
  assert.match(navigation, /scroll-margin-top: calc\(var\(--hara-v2-header-height\) \+ 1rem\)/);
  assert.match(navigation, /html\[data-docs-navigation-ready="true"\][\s\S]*?starlight-menu-button/);
  assert.match(navigation, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(navigation, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "Docs navigation may consume but not redefine protected v2 tokens");
});

test("the adoption note preserves routes, runtime, identity, search and compatibility boundaries", async () => {
  const document = await readRoot("VISUAL-LANGUAGE-V2-ADOPTION.md");
  assert.match(document, new RegExp(acceptedRevision));
  for (const phrase of ["Starlight", "Pagefind", "REPL", "live-card", "canvas", "popup identity", "MkDocs compatibility", "do not close", "merged Visual Language revisions"]) {
    assert.match(document, new RegExp(phrase, "i"));
  }
});
