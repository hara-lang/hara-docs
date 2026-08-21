import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const visualLanguageRevision = "9a88bddd7a539d7aa790e316ee169e8cc81886a4";
const packageRoot = resolve(appRoot, "packages/visual-language");
const manifestPath = resolve(packageRoot, "package.json");
const requiredExports = [
  "./theme.css",
  "./v2.css",
  "./theme.js",
  "./astro/v2/Shell.astro",
  "./astro/v2/Header.astro",
  "./astro/v2/PageHeader.astro"
];
const requiredDocuments = [
  "V2-THEME.md",
  "V2-GUIDE.md",
  "V2-WWW.md"
];
const requiredAssets = [
  "aperture-light-1280.avif",
  "aperture-light-1280.webp",
  "aperture-dark-1280.avif",
  "aperture-dark-1280.webp"
];

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

console.log(`using @hara-lang/visual-language ${manifest.version} v2 contract at ${visualLanguageRevision} from ${packageRoot}`);
