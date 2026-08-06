# Identity and packages

Hara's official tap is a contributor-publishing system whose authority is accepted Git history.

| Origin | Responsibility |
| --- | --- |
| `id.hara-lang.org` | GitHub identity, repository ownership, publisher keys, namespace grants, and revocation |
| `packages.hara-lang.org` | package discovery, publication status, verification records, and immutable `.harp` objects |

The portal is a convenience layer. Git repositories, exact commits, protected workflows, and accepted registry records remain the source of truth.

## One manifest

Every publication starts from `project.edn` at an exact Git commit. It contains package identity, version, dependencies, build declarations, extension namespaces, remote artifacts, capabilities, licence, and entry points.

```text
GitHub repository + tag
          │
          ├── exact project.edn
          ├── generated project.lock.edn
          └── declared source and artifacts
                       │
                       ▼
             deterministic .harp
                       │
                       └── generated package.edn
```

## GitHub sign-in

The Netlify portal can use GitHub OAuth as the contributor sign-in. The session records the stable numeric GitHub user identifier and current login.

A separately installed GitHub App should perform repository-scoped operations. It verifies that the contributor can publish from the selected repository and opens the registry pull request without asking for a broad personal access token.

## Trust model

A publication intent binds:

- tap and package coordinate;
- semantic version;
- numeric GitHub repository identifier;
- immutable tag and commit;
- exact `project.edn` SHA-256 digest;
- identity-policy revision.

Protected automation then:

1. verifies GitHub repository authority and the namespace grant;
2. checks out the exact commit;
3. parses `project.edn` without evaluating Hara code;
4. reconciles and verifies `project.lock.edn`;
5. fetches only digest-pinned remote artifacts;
6. builds without protected registry credentials;
7. checks deterministic output;
8. uploads digest-addressed objects in a protected finalizer;
9. proposes or merges the accepted release record in Git.

A release becomes visible only after the protected registry change is accepted. Repeating identical content is idempotent. Reusing a coordinate and version for different bytes is rejected. Yanking records state without deleting history.

## CLI lifecycle

Bootstrap and verify the official tap:

```shell
HARA_OFFICIAL_ROOT_SHA256=<64-lowercase-hex> hara tap bootstrap hara
hara tap verify hara
```

Authenticate with GitHub and enroll a publisher identity:

```shell
hara id login
hara id enroll --owner YOUR_GITHUB_OWNER
hara id status
```

Prepare and publish the project:

```shell
hara project check
hara project sync
hara package check
hara package build
hara package test
hara package publish --tap hara
hara package status
```

The portal performs the same checks when publication is initiated through `packages.hara-lang.org`.

## Netlify boundary

The Netlify deployment contains the static package browser and narrow API functions for OAuth callbacks, sessions, repository selection, validation, and publication submission. It does not become a mutable package database.

Large `.harp` and WASM objects may be served from immutable object storage or a CDN, but every accepted object is addressed and verified by digest. The registry Git record identifies the exact object, source commit, project digest, and attestation.

## Normative specifications

The numbered platform specification family defines the CLI, tap trust, identity, artifacts, HARP, projects and packages, extension declarations, publishing, distribution, and mirroring. `project.edn` is the shared authoring boundary across those contracts.
