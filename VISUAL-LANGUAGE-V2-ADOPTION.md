# Hara Docs — Visual Language v2 adoption

## Accepted source

The Astro/Starlight build pins `hara-lang/visual-language` at merged revision:

```text
a2ab66d0fde79edb1cee46b79528098b3fda68cf
```

The pin is represented in the publishing workflow checkout. The build verifier requires the v2 stylesheet, Astro document primitives, merged theme/catalogue/WWW contracts and the accessible evidence/data-visualisation contract.

## This first adoption slice

- keeps Starlight as the document renderer and route owner;
- loads the shared `v2.css` document language through Starlight `customCss`;
- maps Starlight header, sidebar, content, right outline, cards, tables and pagination to v2 tokens;
- preserves dark code, REPL editor and canvas surfaces in both themes;
- gives shared documentation controls visible focus and 44-pixel compact touch targets;
- hides the right outline first and keeps dense tables locally scrollable;
- records reduced-motion and sticky-anchor behavior;
- verifies the accepted document and data-visualisation exports before build without transferring content or methodology authority.

## Preserved product behavior

This visual adoption does not change:

- generated or hand-written documentation routes;
- sidebar manifest generation or redirects;
- Pagefind search;
- browser-local REPL session behavior;
- live-card source, execution or result behavior;
- canvas commands, output or annotations;
- popup identity loading, sign-in, logout or origin trust;
- Hara Studio runtime download and verification;
- MkDocs compatibility output;
- canonical and social metadata.

## Ownership boundary

Visual Language owns shared tokens, information-shell geometry, state presentation, focus, responsive grammar and the reference acceptance guide. Starlight remains the documentation framework. `hara-docs` owns routes, generated content, search, navigation data, REPL and canvas behavior, identity integration and publication.

`astro/src/styles/v2-adoption.css` is a product mapping layer. It may consume `--hara-v2-*` values and set Starlight variables, but it does not redefine the protected Hara token contract or fork Starlight rendering.

## Remaining issue #38 work

This PR begins but does not close the complete Docs adoption. Follow-on PRs should:

1. compare prose, API, REPL and canvas pages against the accepted `/v2/www/docs/` laboratory;
2. attach light/dark desktop and mobile screenshots for each representative page;
3. refine search, pagination, local navigation and code-example density only after visual evidence is recorded;
4. adopt evidence graphics where documentation needs benchmark, package or runtime views while keeping data and methodology product-owned;
5. keep runtime and identity mechanics unchanged unless a separately reviewed product issue explicitly requires them;
6. pin only merged Visual Language revisions.
