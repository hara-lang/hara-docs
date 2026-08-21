import { access, cp, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const visualLanguageRevision = "a2ab66d0fde79edb1cee46b79528098b3fda68cf";
const packageRoot = resolve(appRoot, "packages/visual-language");
const installedRoot = resolve(appRoot, "node_modules/@hara-lang/visual-language");
const manifestPath = resolve(packageRoot, "package.json");
const requiredExports = [
  "./theme.css",
  "./v2.css",
  "./v2-data.css",
  "./theme.js",
  "./astro/v2/Shell.astro",
  "./astro/v2/Header.astro",
  "./astro/v2/ContextNav.astro",
  "./astro/v2/PageHeader.astro"
];
const requiredDocuments = [
  "V2-THEME.md",
  "V2-GUIDE.md",
  "V2-WWW.md",
  "V2-DATA-VISUALISATION.md"
];
const requiredAssets = [
  "aperture-light-1280.avif",
  "aperture-light-1280.webp",
  "aperture-dark-1280.avif",
  "aperture-dark-1280.webp"
];

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

try {
  await access(manifestPath);
} catch {
  throw new Error(
    `missing pinned @hara-lang/visual-language checkout at ${packageRoot}; ` +
    `CI checks out commit ${visualLanguageRevision} before npm install`
  );
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (manifest.name !== "@hara-lang/visual-language") {
  throw new Error(`wrong visual-language package at ${packageRoot}: ${manifest.name}`);
}
for (const name of requiredExports) {
  const exported = manifest.exports?.[name];
  if (typeof exported !== "string") {
    throw new Error(`@hara-lang/visual-language is missing ${name}`);
  }
  await access(resolve(packageRoot, exported));
}
for (const document of requiredDocuments) {
  await access(resolve(packageRoot, document));
}
for (const asset of requiredAssets) {
  await access(resolve(packageRoot, "assets/motifs/web", asset));
}

// A local file dependency is installed as a symlink to packages/visual-language.
// Astro's strict project scan follows that link and treats the catalogue site,
// tests and repository tooling as hara-docs source. Replace the link with the
// package's declared publication boundary before `astro check`: package.json
// plus the manifest's `files` entries only.
const packageEntries = ["package.json", ...new Set(manifest.files ?? [])];
await rm(installedRoot, { recursive: true, force: true });
await mkdir(installedRoot, { recursive: true });
for (const entry of packageEntries) {
  if (typeof entry !== "string" || entry.includes("*") || entry.includes("\0")) {
    throw new Error(`unsupported visual-language package entry: ${String(entry)}`);
  }
  const from = resolve(packageRoot, entry);
  const to = resolve(installedRoot, entry);
  if (from !== packageRoot && !from.startsWith(`${packageRoot}${sep}`)) {
    throw new Error(`visual-language package entry escapes its root: ${entry}`);
  }
  if (!(await exists(from))) {
    throw new Error(`visual-language package entry is missing: ${entry}`);
  }
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, dereference: true });
}

console.log(
  `using materialised @hara-lang/visual-language ${manifest.version} v2 contract at ` +
  `${visualLanguageRevision} from ${packageRoot} (${packageEntries.length} package entries)`
);
