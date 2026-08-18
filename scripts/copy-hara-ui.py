"""Copy the pinned Hara UI and browser-runtime assets into the docs site."""

from pathlib import Path
from shutil import copy2, copytree


def on_post_build(config, **_kwargs):
    project = Path(config.config_file_path).parent
    source = project / "vendor" / "hara-ui"
    if not source.is_dir():
        source = project.parent / "website" / "vendor" / "hara-ui"
    target = Path(config.site_dir) / "vendor" / "hara-ui"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("tokens.css", "components.css"):
        copy2(source / name, target / name)

    # @hara-lang/live is owned by the pinned hara-ui repository. Publish its
    # framework-free ESM and scoped CSS verbatim so the MkDocs homepage and the
    # canonical Astro documentation can use the same component implementation.
    live_source = source / "packages" / "live" / "src"
    live_target = target / "packages" / "live" / "src"
    if not live_source.is_dir():
        raise FileNotFoundError(f"missing pinned @hara-lang/live sources: {live_source}")
    copytree(live_source, live_target, dirs_exist_ok=True)

    # The inline tutorials use a small subset of Studio's browser host. Keep
    # the portable frame source inside hara-docs so the compatibility build is
    # reproducible and never depends on an undeclared sibling Hara checkout.
    studio = project / "docs" / "rust" / "studio"
    substrate_source = project / "docs" / "rust" / "std" / "substrate" / "frame.hal"
    if not (studio / "broker.js").is_file():
        raise FileNotFoundError(f"missing checked-in Studio runtime: {studio}")
    if not substrate_source.is_file():
        raise FileNotFoundError(
            f"missing checked-in std.substrate.frame source: {substrate_source}"
        )
    runtime = Path(config.site_dir) / "rust" / "studio"
    (runtime / "hal").mkdir(parents=True, exist_ok=True)
    for name in ("broker.js", "canvas-runtime.js"):
        copy2(studio / name, runtime / name)
    for name in ("node.hal", "draw.hal"):
        copy2(studio / "hal" / name, runtime / "hal" / name)
    substrate = runtime / "hal" / "std" / "substrate"
    substrate.mkdir(parents=True, exist_ok=True)
    copy2(substrate_source, substrate / "frame.hal")
