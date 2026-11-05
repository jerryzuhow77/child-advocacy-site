#!/usr/bin/env python3
"""Download a self-contained mirror of the missed-warning-signals public site."""

from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ORIGIN = "https://missed-warning-signals.yayungrikit.chatgpt.site/"
DESTINATION = Path("missed-warning-signals")
FILES = (
    "index.html",
    "styles.css",
    "script.js",
    "assets/favicon.svg",
    "assets/editorial-concept.png",
    "assets/hero-editorial-v2.png",
    "assets/hero-editorial-motion-v3.gif",
    "assets/hero-editorial-motion-v4.gif",
)


def download(relative_path: str) -> None:
    request = Request(
        ORIGIN + relative_path,
        headers={"User-Agent": "child-advocacy-site-hk-mirror/1.0"},
    )
    try:
        with urlopen(request, timeout=45) as response:
            if response.status != 200:
                raise RuntimeError(f"{relative_path}: HTTP {response.status}")
            data = response.read()
    except (HTTPError, URLError) as error:
        raise RuntimeError(f"Could not mirror {relative_path}: {error}") from error

    if not data:
        raise RuntimeError(f"Could not mirror {relative_path}: empty response")

    output = DESTINATION / relative_path
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(data)


for path in FILES:
    download(path)

index = (DESTINATION / "index.html").read_text(encoding="utf-8")
for required in ("styles.css", "script.js", "hero-editorial-motion-v4.gif"):
    if required not in index:
        raise RuntimeError(f"Mirrored index is missing expected reference: {required}")
