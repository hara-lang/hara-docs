# Identity, packages, and assets

Hara's official tap is a self-publishing system with one authority: accepted
Git history. It has three public service names:

| Origin | Responsibility |
| --- | --- |
| `id.hara-lang.org` | GitHub ownership enrollment and signed public-key policy |
| `packages.hara-lang.org` | package discovery, verification records, and immutable code objects |
| `assets.hara-lang.org` | immutable file, image, 3D, audio, and video objects |

Artifact manifests, HARP archives, extensions, publishing, distribution, and
mirroring are parts of the protocol. They are not separate official domains.
There is no ledger.

## Trust model

An owner enrolls a GitHub namespace and an Ed25519 public key. The matching
private key stays behind an external signer selected with `HARA_SIGNER`; Hara
does not write it to a project, config file, service, or iterator cache.

A release intent binds the coordinate, version, exact Git commit, recipe
digest, and identity-policy revision. Protected automation verifies the
signature and namespace grant, builds the exact input without protected
credentials, checks deterministic output, uploads digest-addressed objects,
and merges the accepted record into Git. Publication is automatic after
enrollment, but a record is visible only after that protected Git change.

Repeating the same signed release is idempotent. Reusing a coordinate and
version for different content is rejected. A yank adds state; it never deletes
the historical release.

## CLI lifecycle

Bootstrap the official trust profile using a root fingerprint obtained through
an authenticated release channel:

```shell
HARA_OFFICIAL_ROOT_SHA256=<64-lowercase-hex> hara tap bootstrap hara
hara tap verify hara
```

Enroll using an external signer:

```shell
export HARA_SIGNER=/path/to/ed25519-sign-command
export HARA_SIGNER_PUBLIC_KEY=<64-lowercase-hex>
hara id login
hara id enroll --owner YOUR_GITHUB_OWNER
hara id status
```

Check and publish code:

```shell
hara package check
hara package build
hara package publish --tap hara
hara package status
```

Build a versioned asset collection:

```shell
hara asset check
hara asset build
hara asset inspect
hara asset publish --tap hara
```

`asset.edn` declares originals and deterministic derivatives. Delivery serves
only recorded immutable objects; it does not run arbitrary transformations on
request.

## Normative specifications

The numbered `specs/02-platform` family defines CLI routing, tap discovery,
identity, artifact manifests, HARP, packages, extensions, assets, publishing,
distribution, and mirroring. The shared tap metaspec makes their roles,
entities, operations, invariants, and conformance corpora machine-checkable.

The Cloudflare implementation in `platform/cloudflare` is a reference delivery
edge. It streams the authoritative Git documents and digest-addressed R2
objects, and deliberately exposes no mutation endpoint. Protected GitHub
workflows own enrollment and release finalization.
