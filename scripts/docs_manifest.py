"""Load the shared documentation navigation and redirect graph for MkDocs."""

from json import loads
from pathlib import Path


def _mkdocs_nav(items):
    nav = []
    for item in items:
        if "path" in item:
            nav.append({item["label"]: item["path"]})
        elif "url" in item:
            nav.append({item["label"]: item["url"]})
        else:
            nav.append({item["label"]: _mkdocs_nav(item["items"])})
    return nav


def on_config(config, **_kwargs):
    project = Path(config.config_file_path).parent
    manifest = loads((project / "docs-manifest.json").read_text())
    config["nav"] = _mkdocs_nav(manifest["navigation"])

    redirects = config.plugins.get("redirects")
    if redirects is not None:
        redirects.config["redirect_maps"] = {
            redirect["source"]: redirect["to"].removeprefix("/docs/")
            for redirect in manifest["redirects"]
        }
    return config
