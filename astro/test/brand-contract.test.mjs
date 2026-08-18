import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const docsMarkPath = "M15 12 33 24 15 36V12Zm18 0v24L15 24 33 12Z";

const assertEstablishedMark = (asset, label) => {
  assert.match(asset, /viewBox="0 0 48 48"/, `${label} must retain the established 48-unit view box`);
  assert.ok(asset.includes(`d="${docsMarkPath}"`), `${label} must retain the established Docs mark geometry`);
  assert.doesNotMatch(asset, /M10 8h13v18h18V8h13v48H41V38H23v18H10z/, `${label} must not fall back to the literal-H migration asset`);
  assert.doesNotMatch(asset, /M130 19 231 130 130 241 29 130/, `${label} must not fall back to the diamond migration asset`);
};

test("restores one established Hara Docs mark across favicon and header", async () => {
  const [legacyFavicon, astroFavicon, lightMark, darkMark] = await Promise.all([
    read("../../docs/assets/favicon-48.svg"),
    read("../public/assets/hara-favicon.svg"),
    read("../src/assets/hara-mark-light.svg"),
    read("../src/assets/hara-mark-dark.svg")
  ]);

  assert.equal(
    normalise(astroFavicon),
    normalise(legacyFavicon),
    "the deployed Astro favicon must remain identical to the retained Docs source asset"
  );

  assertEstablishedMark(astroFavicon, "favicon");
  assertEstablishedMark(lightMark, "light header mark");
  assertEstablishedMark(darkMark, "dark header mark");
  assert.match(lightMark, /stroke="#11151a"/);
  assert.match(darkMark, /stroke="#f4f6f8"/);
});

test("gates Docs checks, builds, and published artifacts on the brand contract", async () => {
  const [config, packageText, verifyBuild] = await Promise.all([
    read("../astro.config.mjs"),
    read("../package.json"),
    read("../scripts/verify-build.mjs")
  ]);
  const packageJson = JSON.parse(packageText);

  assert.match(config, /light:\s*"\.\/src\/assets\/hara-mark-light\.svg"/);
  assert.match(config, /dark:\s*"\.\/src\/assets\/hara-mark-dark\.svg"/);
  assert.match(config, /favicon:\s*"\/assets\/hara-favicon\.svg"/);

  assert.equal(packageJson.scripts["brand:check"], "node --test test/brand-contract.test.mjs");
  assert.match(packageJson.scripts.check, /npm run brand:check/);
  assert.match(packageJson.scripts.build, /npm run brand:check/);

  assert.match(verifyBuild, /assets\/hara-favicon\.svg/);
  assert.match(verifyBuild, /published Hara Docs favicon no longer matches the established mark/);
});
