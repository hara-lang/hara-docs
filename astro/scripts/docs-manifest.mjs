import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repositoryRoot = resolve(appRoot, "..");
export const manifestPath = resolve(repositoryRoot, "docs-manifest.json");
export const docsManifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function slugFor(path) {
  return path
    .replace(/\.md$/, "")
    .replace(/\/(?:index|README)$/i, "")
    .replace(/^(?:index|README)$/i, "");
}

function hrefFor(path) {
  const slug = slugFor(path).replace(/\/$/, "");
  const normalized = path.startsWith("api/") ? slug.replaceAll(".", "") : slug;
  return normalized ? `/docs/${normalized}/` : "/docs/";
}

function sidebarItem(item) {
  if (item.path) return { label: item.label, slug: slugFor(item.path) };
  if (item.url) return { label: item.label, link: item.url };
  return {
    label: item.label,
    collapsed: item.collapsed ?? false,
    items: item.items.map(sidebarItem)
  };
}

function routeWithoutBase(path) {
  const route = String(path).replace(/^\/docs(?=\/|$)/, "");
  return route || "/";
}

export const docsSidebar = docsManifest.navigation.map(sidebarItem);
export const docsRouteTrees = (docsManifest.routeTrees ?? []).map((tree) => ({
  ...tree,
  items: tree.items.map((item) => ({ ...item, href: hrefFor(item.path) }))
}));
export const docsRedirects = Object.fromEntries(
  docsManifest.redirects.map(({ from, to }) => [routeWithoutBase(from), to])
);
export const redirectSources = new Set(
  docsManifest.redirects.map(({ source }) => source).filter((source) => source)
);
