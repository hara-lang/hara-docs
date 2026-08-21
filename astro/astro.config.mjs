import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import remarkHaraEval from "./scripts/remark-hara-eval.mjs";
import { docsRedirects, docsSidebar } from "./scripts/docs-manifest.mjs";

const base = "/docs";
const asset = (path) => `${base}${path}`;
const docsCard = "https://www.hara-lang.org/docs/assets/og-hara-docs.jpg";

export default defineConfig({
  site: "https://www.hara-lang.org",
  base,
  output: "static",
  outDir: "./dist",
  trailingSlash: "always",
  redirects: docsRedirects,
  markdown: { remarkPlugins: [remarkHaraEval] },
  integrations: [
    sitemap(),
    starlight({
      title: "Hara",
      logo: {
        light: "./src/assets/hara-mark-light.svg",
        dark: "./src/assets/hara-mark-dark.svg",
        alt: "Hara"
      },
      description: "A small, high-performance Lisp for learning to build software from first principles.",
      // Starlight applies Astro's base to favicon paths itself.
      favicon: "/assets/hara-favicon.svg",
      head: [
        { tag: "meta", attrs: { name: "hara-identity-auto", content: "starlight" } },
        { tag: "script", attrs: { type: "module", src: asset("/assets/identity-loader.js") } },
        { tag: "link", attrs: { rel: "stylesheet", href: asset("/docs-assets/stylesheets/syllabus.css") } },
        { tag: "link", attrs: { rel: "stylesheet", href: asset("/docs-assets/live/style.css") } },
        { tag: "link", attrs: { rel: "stylesheet", href: asset("/assets/live-surface.css") } },
        { tag: "script", attrs: { type: "module", src: asset("/assets/docs-repl.js") } },
        { tag: "script", attrs: { type: "module", src: asset("/docs-assets/javascripts/syllabus.js") } },
        { tag: "meta", attrs: { property: "og:site_name", content: "Hara / Docs" } },
        { tag: "meta", attrs: { property: "og:image", content: docsCard } },
        { tag: "meta", attrs: { property: "og:image:secure_url", content: docsCard } },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/jpeg" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Hara Docs — build live, across every host" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: docsCard } },
        { tag: "meta", attrs: { name: "twitter:image:alt", content: "Hara Docs — build live, across every host" } }
      ],
      customCss: ["./src/styles/docs.css", "./src/styles/v2-adoption.css"],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/hara-lang/hara" }],
      routeMiddleware: ["./src/starlight-route-data.mjs"],
      sidebar: docsSidebar
    })
  ]
});
