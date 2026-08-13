import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { appRoot } from "./docs-manifest.mjs";

const packageRoot = resolve(appRoot, "packages/visual-language");
const manifestPath = resolve(packageRoot, "package.json");
const requiredExports = ["./theme.css"];
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
    "CI checks out commit c49ad17d5052c8eeca0aff4a6146ff60b89ce88f before npm install"
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
for (const asset of requiredAssets) {
  await access(resolve(packageRoot, "assets/motifs/web", asset));
}

console.log(`using @hara-lang/visual-language ${manifest.version} from ${packageRoot}`);
