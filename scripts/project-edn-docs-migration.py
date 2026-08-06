from pathlib import Path

root = Path.cwd()
mkdocs = root / "mkdocs.yml"
text = mkdocs.read_text()
marker = "          - Identity and packages: guides/tap-publishing.md\n          - Extension system: reference/extensions-contract.md"
replacement = "          - Identity and packages: guides/tap-publishing.md\n          - Project manifest: reference/project-manifest.md\n          - Extension system: reference/extensions-contract.md"
if marker not in text:
    raise SystemExit("mkdocs navigation marker changed")
mkdocs.write_text(text.replace(marker, replacement))

(root / "scripts/project-edn-docs-migration.py").unlink()
(root / ".github/workflows/project-edn-docs-migration.yml").unlink()
