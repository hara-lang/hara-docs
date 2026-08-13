import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const dist = resolve(appRoot, "dist");
const required = [
  "index.html",
  "learn/index.html",
  "hal-intro/01-basic-data/index.html",
  "books/the-little-book-of-hal/docs/index.html",
  "api/index.html",
  "start/orientation/index.html",
  "assets/og-hara-docs.jpg",
  "assets/visual-language/motifs/web/aperture-light-1280.avif",
  "assets/visual-language/motifs/web/aperture-light-1280.webp",
  "assets/visual-language/motifs/web/aperture-dark-1280.avif",
  "assets/visual-language/motifs/web/aperture-dark-1280.webp",
  "docs-assets/live/live-card.js",
  "docs-assets/live/kernel.js",
  "docs-assets/rust/hara.wasm",
  "rust/hara.wasm",
  "_redirects"
];

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

for (const path of required) {
  const info = await stat(resolve(dist, path));
  assert.ok(info.isFile() && info.size > 0, `missing non-empty Astro artifact: ${path}`);
}

const allFiles = await filesUnder(dist);
const relativeFiles = allFiles.map((path) => relative(dist, path).split(sep).join("/"));
assert.ok(
  relativeFiles.some((path) => /(^|\/)pagefind\/pagefind\.js$/.test(path)),
  "Starlight Pagefind assets were not generated"
);

let hasPinnedBackdrop = false;
for (const path of allFiles) {
  if (!/\.(?:css|html|js|mjs|json|xml|txt)$/.test(path) && !path.endsWith("_redirects")) continue;
  const text = await readFile(path, "utf8");
  assert.doesNotMatch(
    text,
    /__VITE_ASSET__/,
    `unresolved Vite asset placeholder survived in ${relative(dist, path)}`
  );
  if (path.endsWith(".css") && text.includes(
    "/docs/assets/visual-language/motifs/web/aperture-light-1280.avif"
  )) {
    hasPinnedBackdrop = true;
  }
}
assert.ok(hasPinnedBackdrop, "the compiled Hara theme is missing its pinned aperture backdrop");

const root = await readFile(resolve(dist, "index.html"), "utf8");
assert.match(
  root,
  /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/www\.hara-lang\.org\/docs\/["']/i,
  "root canonical URL must be exactly https://www.hara-lang.org/docs/"
);
assert.match(root, /<meta[^>]+name=["']generator["'][^>]+content=["']Astro\s/i);
assert.match(root, /pagefind/i);
assert.match(root, /(?:sidebar-pane|data-has-sidebar|aria-label=["']Main navigation)/i);
assert.match(root, /\/docs\/assets\/hara-favicon\.svg/);
assert.match(root, /\/docs\/assets\/docs-repl\.js/);
assert.match(root, /\/docs\/assets\/identity-loader\.js/);
assert.match(root, /\/docs\/assets\/live-surface\.css/);
assert.match(root, /\/docs\/_astro\//);
assert.doesNotMatch(root, /(?:href|src)=["']\/(?:_astro|assets\/docs-repl|docs-assets)\//);

const htmlFiles = allFiles.filter((path) => path.endsWith(".html"));
let hasLiveEvaluator = false;
for (const path of htmlFiles) {
  const html = await readFile(path, "utf8");
  assert.doesNotMatch(html, /https:\/\/www\.hara-lang\.org\/docs\/docs\//);
  assert.doesNotMatch(html, /(?:href|src)=["']\/docs\/docs\//);
  if (/data-hara-eval|data-hara-live|data-hara-canvas-stage/.test(html)) {
    hasLiveEvaluator = true;
  }
}
assert.ok(hasLiveEvaluator, "no live evaluator hooks survived the Astro build");

const redirects = await readFile(resolve(dist, "_redirects"), "utf8");
assert.match(redirects, /^\/runtime\/\* https:\/\/www\.hara-lang\.org\/runtime\/:splat 200!$/m);
assert.match(redirects, /^\/docs\/\* \/:splat 200!$/m);

console.log(`verified ${relativeFiles.length} Astro artifact files at ${dist}`);
