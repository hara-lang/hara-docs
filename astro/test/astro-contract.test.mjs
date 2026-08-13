import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
  docsManifest,
  docsRedirects,
  docsRouteTrees,
  docsSidebar,
  manifestPath,
  repositoryRoot
} from "../scripts/docs-manifest.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("owns the renderer inside hara-docs with no workspace dependency", async () => {
  const prepare = await read("../scripts/prepare-docs.mjs");
  const manifest = await read("../scripts/docs-manifest.mjs");
  const packageJson = JSON.parse(await read("../package.json"));

  assert.equal(manifestPath, new URL("../../docs-manifest.json", import.meta.url).pathname);
  assert.match(prepare, /resolve\(repositoryRoot, "docs"\)/);
  assert.match(prepare, /src\/content\/docs/);
  assert.match(prepare, /vendor\/hara-ui\/packages\/live\/src/);
  assert.doesNotMatch(`${prepare}\n${manifest}`, /HARA_WORKSPACE_ROOT|website\/hara-docs|hara-www/);
  assert.equal(packageJson.dependencies["@hara-lang/live"], "file:../vendor/hara-ui/packages/live");
  assert.equal(packageJson.dependencies["@hara-lang/visual-language"], "file:packages/visual-language");
});

test("emits canonical /docs URLs while building at the artifact root", async () => {
  const config = await read("../astro.config.mjs");
  const flatten = await read("../scripts/flatten-artifact.mjs");
  assert.match(config, /site:\s*"https:\/\/www\.hara-lang\.org"/);
  assert.match(config, /base,\n\s*output:\s*"static"/);
  assert.match(config, /const base = "\/docs"/);
  assert.match(config, /outDir:\s*"\.\/dist"/);
  assert.match(config, /favicon:\s*"\/assets\/hara-favicon\.svg"/);
  assert.doesNotMatch(config, /favicon:\s*asset\(/);
  assert.match(config, /https:\/\/www\.hara-lang\.org\/docs\/assets\/og-hara-docs\.jpg/);
  assert.match(config, /asset\("\/docs-assets\/live\/style\.css"\)/);
  assert.match(flatten, /resolve\(dist, "docs"\)/);
  assert.doesNotMatch(config, /\/docs\/docs\//);
});

test("removes the base from source routes but keeps canonical redirect targets", () => {
  assert.equal(docsRedirects["/start/orientation/"], "/docs/learn/#why-hara");
  assert.equal(docsRedirects["/reference/runtime-benchmarks/"], "https://benchmarks.hara-lang.org/");
  assert.equal(docsRedirects["/docs/start/orientation/"], undefined);
  assert.ok(docsRouteTrees.every(({ prefix }) => prefix.startsWith("/docs/")));
  assert.ok(docsRouteTrees.every(({ items }) => items.every(({ href }) => href.startsWith("/docs/"))));
});

test("keeps the established navigation and isolated course trees", () => {
  assert.deepEqual(docsManifest.navigation.map(({ label }) => label), ["Learn Path", "Build", "Reference", "Self Learning"]);
  assert.deepEqual(docsManifest.routeTrees.map(({ id }) => id),
    ["foundations", "protocols", "tic-tac-toe", "little-book", "language-api"]);
  assert.equal(docsSidebar[0].items[0].slug, "learn");
  assert.equal(docsSidebar[3].items[1].slug, "books/the-little-book-of-hal/docs");
});

test("pins the visual-language checkout and exact theme assets", async () => {
  const workflow = await read("../../.github/workflows/pages-docs.yml");
  const verifier = await read("../scripts/verify-visual-language.mjs");
  assert.match(workflow, /repository: hara-lang\/visual-language[\s\S]*ref: c49ad17d5052c8eeca0aff4a6146ff60b89ce88f[\s\S]*path: astro\/packages\/visual-language/);
  assert.match(verifier, /c49ad17d5052c8eeca0aff4a6146ff60b89ce88f/);
  assert.match(verifier, /aperture-light-1280\.avif/);
  assert.match(verifier, /aperture-dark-1280\.webp/);
});

test("retains Hara theme, search, route middleware, and live hooks", async () => {
  const config = await read("../astro.config.mjs");
  const styles = await read("../src/styles/docs.css");
  const middleware = await read("../src/starlight-route-data.mjs");
  assert.match(config, /starlight\(/);
  assert.match(config, /routeMiddleware/);
  assert.match(config, /docs-repl\.js/);
  assert.match(styles, /@hara-lang\/visual-language\/theme\.css/);
  assert.doesNotMatch(styles, /@hara-lang\/visual-language\/motifs\.css/);
  assert.match(styles, /\/docs\/assets\/visual-language\/motifs\/web\/aperture-light-1280\.avif/);
  assert.match(styles, /\.sl-markdown-content \.hara-live-card-editor \.code-highlight/);
  assert.match(middleware, /← Back to Docs/);
  assert.match(middleware, /starlightRoute\.pagination/);
});

test("publishes source, live, and pinned visual assets", async () => {
  const prepare = await read("../scripts/prepare-docs.mjs");
  const verifyBuild = await read("../scripts/verify-build.mjs");
  assert.match(prepare, /copyFile\(input, output\)/);
  assert.match(prepare, /docs-assets/);
  assert.match(prepare, /resolve\(source, "rust"\)/);
  assert.match(prepare, /javascripts\/syllabus\.js/);
  assert.match(prepare, /stylesheets\/syllabus\.css/);
  assert.match(prepare, /canonicalizeDocsAssets/);
  assert.match(prepare, /visualLanguageBackdropAssets/);
  assert.match(prepare, /assets\/motifs\/web/);
  assert.match(verifyBuild, /__VITE_ASSET__/);
  assert.match(verifyBuild, /compiled Hara theme is missing its pinned aperture backdrop/);
});

test("serves both origin route shapes and proxies runtime only to the canonical host", async () => {
  const redirects = await read("../public/_redirects");
  assert.match(redirects, /^\/docs \/ 200!$/m);
  assert.match(redirects, /^\/docs\/ \/ 200!$/m);
  assert.match(redirects, /^\/docs\/\* \/:splat 200!$/m);
  assert.match(redirects, /^\/runtime\/\* https:\/\/www\.hara-lang\.org\/runtime\/:splat 200!$/m);
});

test("keeps the shared identity provider in hara-www while loading it from docs", async () => {
  const config = await read("../astro.config.mjs");
  const loader = await read("../public/assets/identity-loader.js");
  assert.match(config, /asset\("\/assets\/identity-loader\.js"\)/);
  assert.match(loader, /https:\/\/id\.hara-lang\.org/);
  assert.match(loader, /https:\/\/id\.testing\.hara-lang\.org/);
  assert.match(loader, /identity-client\.js/);
  assert.doesNotMatch(loader, /client_secret|access_token/);
});

test("reads the documentation landing page from this repository", async () => {
  const page = await readFile(resolve(repositoryRoot, "docs/index.md"), "utf8");
  assert.match(page, /Hara/);
  assert.doesNotMatch(page, /<\/a>\n\s*\n\s*<a class="hara-outcome-card"/);
});
