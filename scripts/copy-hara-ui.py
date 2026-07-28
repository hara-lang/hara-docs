"""Copy the pinned hara-ui styles into the generated documentation site."""

from pathlib import Path
from shutil import copy2


def on_post_build(config, **_kwargs):
    project = Path(config.config_file_path).parent
    source = project / "vendor" / "hara-ui"
    target = Path(config.site_dir) / "vendor" / "hara-ui"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("tokens.css", "components.css"):
        copy2(source / name, target / name)
