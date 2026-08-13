import {
  copyFile,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { appRoot, docsRouteTrees, redirectSources, repositoryRoot } from "./docs-manifest.mjs";

const source = resolve(repositoryRoot, "docs");
const contentDestination = resolve(appRoot, "src/content/docs");
const publicRoot = resolve(appRoot, "public");
const runtimeDestination = resolve(publicRoot, "docs-assets");
const generatedStaticManifest = resolve(appRoot, ".generated-doc-static.json");
const routeTreeDestination = resolve(appRoot, "src/generated-doc-route-trees.json");
const visualLanguageRoot = resolve(appRoot, "packages/visual-language");
const visualLanguageBackdropDestination = resolve(
  publicRoot,
  "assets/visual-language/motifs/web"
);
const visualLanguageBackdropAssets = [
  "aperture-light-1280.avif",
  "aperture-light-1280.webp",
  "aperture-dark-1280.avif",
  "aperture-dark-1280.webp"
];
const rendererOwnedStatic = new Set([
  "_redirects",
  "assets/docs-repl.js",
  "assets/docs-repl-state.js",
  "assets/hara-favicon.svg",
  "assets/identity-loader.js",
  "assets/live-surface.css"
]);

function titleFor(body, file) {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.replace(/[`*_]/g, "").trim();
  if (heading) return heading;
  return basename(file, extname(file)).split(/[-_]/).map((word) =>
    word ? word[0].toUpperCase() + word.slice(1) : word).join(" ");
}

function hasTitle(body) {
  return body.startsWith("---\n") && /^title\s*:/m.test(body.slice(0, body.indexOf("\n---", 4)));
}

function normalizeMkDocsFrontmatter(body) {
  if (!body.startsWith("---\n")) return body;
  const end = body.indexOf("\n---", 4);
  if (end < 0) return body;
  const lines = body.slice(4, end).split("\n");
  const kept = [];
  let skippingList = false;
  for (const line of lines) {
    if (/^(template|hara_kernel_loading):/.test(line)) continue;
    if (/^hide:/.test(line)) {
      skippingList = true;
      continue;
    }
    if (skippingList && /^\s+-\s/.test(line)) continue;
    skippingList = false;
    kept.push(line);
  }
  return `---\n${kept.join("\n")}\n---${body.slice(end + 4)}`;
}

function canonicalizeDocsAssets(body) {
  return body
    .replace(/([("'=:\s])\/(assets|rust|javascripts|stylesheets)(?=\/)/g, "$1/docs/$2")
    .replace(/([("'=:\s])\/javadoc-theme\.css\b/g, "$1/docs/javadoc-theme.css")
    .replaceAll("/vendor/hara-ui/packages/live/src/", "/docs/docs-assets/live/");
}

async function previousStaticFiles() {
  try {
    const parsed = JSON.parse(await readFile(generatedStaticManifest, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function removePreviousStaticFiles() {
  const previous = await previousStaticFiles();
  for (const path of previous) {
    const target = resolve(publicRoot, path);
    if (target === publicRoot || !target.startsWith(`${publicRoot}${sep}`)) {
      throw new Error(`refusing to remove generated path outside public/: ${path}`);
    }
    await rm(target, { force: true });
  }
}

async function prepareMarkdown(input, rel) {
  if (redirectSources.has(rel)) return;
  const output = resolve(contentDestination, rel);
  let body = await readFile(input, "utf8");
  body = normalizeMkDocsFrontmatter(body);
  body = canonicalizeDocsAssets(body);

  // Shiki does not yet ship a Hara grammar. Clojure is the closest reader
  // grammar and preserves useful highlighting until the dedicated grammar lands.
  // Preserve evaluator scope metadata such as `eval global` and
  // `eval group=lesson` while changing only the fence language.
  body = body.replace(/^```(?:hara|hal)(?=\s|$)([^\r\n]*)$/gm, "```clojure$1");
  if (!hasTitle(body)) {
    body = `---\ntitle: ${JSON.stringify(titleFor(body, input))}\n---\n\n${body}`;
  }

  const frontmatterEnd = body.indexOf("\n---", 4) + 4;
  const afterFrontmatter = body.slice(frontmatterEnd).replace(/^\s*#\s+[^\n]+\n+/, "\n");
  body = body.slice(0, frontmatterEnd) + afterFrontmatter;

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, body);
}

const generatedStatic = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const input = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(input);
      continue;
    }
    if (!entry.isFile()) continue;

    const rel = relative(source, input).split(sep).join("/");
    if (/\.mdx?$/.test(entry.name)) {
      await prepareMarkdown(input, rel);
      continue;
    }
    if (entry.name === ".DS_Store" || rendererOwnedStatic.has(rel)) continue;

    const output = resolve(publicRoot, rel);
    await mkdir(dirname(output), { recursive: true });
    await copyFile(input, output);
    generatedStatic.push(rel);
  }
}

await mkdir(dirname(routeTreeDestination), { recursive: true });
await writeFile(routeTreeDestination, `${JSON.stringify(docsRouteTrees, null, 2)}\n`);

await rm(contentDestination, { recursive: true, force: true });
await mkdir(contentDestination, { recursive: true });
await removePreviousStaticFiles();
await walk(source);
await writeFile(generatedStaticManifest, `${JSON.stringify(generatedStatic.sort(), null, 2)}\n`);

// Vite cannot reliably resolve image-set() package URLs held in CSS custom
// properties. Publish the exact pinned aperture artwork explicitly so the
// compiled theme never contains unresolved __VITE_ASSET__ placeholders.
await rm(visualLanguageBackdropDestination, { recursive: true, force: true });
await mkdir(visualLanguageBackdropDestination, { recursive: true });
for (const asset of visualLanguageBackdropAssets) {
  await copyFile(
    resolve(visualLanguageRoot, "assets/motifs/web", asset),
    resolve(visualLanguageBackdropDestination, asset)
  );
}

// Keep hara-docs authoritative for the browser kernel and course assets while
// retaining the compatibility URLs used by @hara-lang/live.
await rm(runtimeDestination, { recursive: true, force: true });
await mkdir(join(runtimeDestination, "javascripts"), { recursive: true });
await mkdir(join(runtimeDestination, "stylesheets"), { recursive: true });
await cp(resolve(source, "rust"), join(runtimeDestination, "rust"), { recursive: true });
await copyFile(resolve(source, "javascripts/kernel.js"), join(runtimeDestination, "javascripts/kernel.js"));
await copyFile(resolve(source, "javascripts/syllabus.js"), join(runtimeDestination, "javascripts/syllabus.js"));
await copyFile(resolve(source, "stylesheets/syllabus.css"), join(runtimeDestination, "stylesheets/syllabus.css"));

// Publish @hara-lang/live from the pinned hara-ui submodule as static assets.
await cp(
  resolve(repositoryRoot, "vendor/hara-ui/packages/live/src"),
  join(runtimeDestination, "live"),
  { recursive: true }
);
