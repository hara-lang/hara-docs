import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import docsRouteTrees from "./generated-doc-route-trees.json";

function normalized(pathname) {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function link(label, href, pathname, attrs = {}) {
  return {
    type: "link",
    label,
    href,
    isCurrent: normalized(href) === normalized(pathname),
    badge: undefined,
    attrs
  };
}

export const onRequest = defineRouteMiddleware((context, next) => {
  const pathname = normalized(context.url.pathname);
  const tree = docsRouteTrees.find(({ prefix }) => pathname.startsWith(normalized(prefix)));
  if (!tree) return next();

  const courseLinks = tree.items.map((item) => link(item.label, item.href, pathname));
  context.locals.starlightRoute.sidebar = [
    link("← Back to Docs", "/docs/", pathname, { class: "hara-sidebar-back" }),
    ...courseLinks
  ];

  const current = courseLinks.findIndex((item) => item.isCurrent);
  context.locals.starlightRoute.pagination = {
    prev: current > 0 ? courseLinks[current - 1] : undefined,
    next: current >= 0 && current < courseLinks.length - 1 ? courseLinks[current + 1] : undefined
  };
  return next();
});
