# Hara Docs — Visual Language v2 adoption

## Accepted source

The Astro/Starlight build pins `hara-lang/visual-language` at merged revision:

```text
a2ab66d0fde79edb1cee46b79528098b3fda68cf
```

The pin is represented in the publishing workflow checkout. The build verifier requires the v2 stylesheet, Astro document primitives, merged theme/catalogue/WWW contracts and the accessible evidence/data-visualisation contract.

## Baseline adoption slice

- keeps Starlight as the document renderer and route owner;
- loads the shared `v2.css` document language through Starlight `customCss`;
- maps Starlight header, sidebar, content, right outline, cards, tables and pagination to v2 tokens;
- preserves dark code, REPL editor and canvas surfaces in both themes;
- gives shared documentation controls visible focus and 44-pixel compact touch targets;
- hides the right outline first and keeps dense tables locally scrollable;
- records reduced-motion and sticky-anchor behavior;
- verifies the accepted document and data-visualisation exports before build without transferring content or methodology authority.

## Executable runtime-evidence slice

Runnable documentation fences and tutorial canvases now expose one collapsed runtime-context row immediately below the shared live-card header. It records:

- isolated, global or named-group scope;
- exact session identifier;
- monotonic session generation;
- memory-filesystem identity;
- session sharing boundary;
- documentation route;
- the declared surface for evaluation, observations, memory filesystem and canvas where applicable;
- the shared live-card connection word: Idle, Connecting, Connected, Evaluating or Unavailable.

The row mirrors the live card's authoritative connection state through its existing `data-connection-state` contract. It does not add a competing live region, invent runtime observations or alter evaluation, reset, canvas or session-registry behavior. Named-group resets update the visible generation only after the replacement session succeeds.

The evidence is a native disclosure with an equivalent text ledger, non-colour state structure, compact one-column reflow, 44-pixel phone target and reduced-motion treatment.

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

Visual Language owns shared tokens, information-shell geometry, state presentation, focus, responsive grammar and the reference acceptance guide. Starlight remains the documentation framework. `hara-docs` owns routes, generated content, search, navigation data, session grouping and documentation composition. The shared live/runtime packages remain authoritative for kernel connection, capabilities, evaluation, observations and results.

`astro/src/styles/v2-adoption.css` and `astro/src/styles/v2-runtime-evidence.css` are product mapping layers. They may consume `--hara-v2-*` values and set Starlight or Docs composition styles, but they do not redefine the protected Hara token contract or fork Starlight/live-card rendering.

## Remaining issue #38 work

These slices begin but do not close the complete Docs adoption. Follow-on PRs should:

1. compare prose, API, REPL and canvas pages against the accepted `/v2/www/docs/` laboratory;
2. attach light/dark desktop and mobile screenshots for each representative page;
3. refine search, pagination, local navigation and code-example density only after visual evidence is recorded;
4. adopt evidence graphics where documentation needs benchmark, package or runtime views while keeping data and methodology product-owned;
5. keep runtime and identity mechanics unchanged unless a separately reviewed product issue explicitly requires them;
6. pin only merged Visual Language revisions.
