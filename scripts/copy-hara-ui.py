"""Copy the pinned Hara UI and browser-runtime assets into the docs site."""

from pathlib import Path
from shutil import copy2


def on_post_build(config, **_kwargs):
    project = Path(config.config_file_path).parent
    source = project / "vendor" / "hara-ui"
    target = Path(config.site_dir) / "vendor" / "hara-ui"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("tokens.css", "components.css"):
        copy2(source / name, target / name)

    # The inline tutorial uses Studio's browser host without exposing Studio.
    repository = project.parent
    studio = repository / "rust" / "web" / "studio"
    runtime = Path(config.site_dir) / "rust" / "studio"
    (runtime / "hal").mkdir(parents=True, exist_ok=True)
    for name in ("broker.js", "canvas-runtime.js"):
        copy2(studio / name, runtime / name)
    for name in ("node.hal", "draw.hal"):
        copy2(studio / "hal" / name, runtime / "hal" / name)
    substrate = runtime / "hal" / "std" / "substrate"
    substrate.mkdir(parents=True, exist_ok=True)
    copy2(repository / "lib" / "src" / "std" / "substrate" / "frame.hal",
          substrate / "frame.hal")
