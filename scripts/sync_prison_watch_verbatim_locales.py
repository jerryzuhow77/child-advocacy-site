#!/usr/bin/env python3
"""Preserve the Traditional-Chinese source transcript in English/Japanese hearing pages."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DAYS = {
    6: "20250430",
    7: "20250502",
    8: "20250505",
    9: "20250506",
    10: "20250507",
}
STYLE = (
    '<link rel="stylesheet" '
    'href="/child-advocacy-site/hearing-records/prison-watch/pw-verbatim.css'
    '?v=20260909-inline-dialogue-3">'
)
INTEGRATION_SCRIPT = (
    '<script src="/child-advocacy-site/hearing-records/prison-watch/pw-verbatim.js'
    '?v=20260909-inline-dialogue-3"></script>'
)
STANDALONE_SCRIPT = (
    '<script src="/child-advocacy-site/hearing-records/prison-watch/'
    'pw-verbatim-standalone.js?v=20260911-1"></script>'
)
SECTION_TOKEN = re.compile(r"<section\b[^>]*>|</section>", re.IGNORECASE)
ID_TOKEN = re.compile(r'\bid="([^"]+)"')


def extract_section(text: str, section_id: str) -> str:
    start_match = re.search(
        rf'<section\b[^>]*\bid="{re.escape(section_id)}"[^>]*>',
        text,
        re.IGNORECASE,
    )
    if not start_match:
        raise RuntimeError(f"missing section #{section_id}")
    depth = 0
    for match in SECTION_TOKEN.finditer(text, start_match.start()):
        if match.group(0).lower().startswith("<section"):
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return text[start_match.start() : match.end()]
    raise RuntimeError(f"unclosed section #{section_id}")


def insert_before_source(text: str, block: str) -> str:
    match = re.search(r'<section\b[^>]*\bid="source"[^>]*>', text, re.IGNORECASE)
    if match:
        return text[: match.start()] + block + "\n" + text[match.start() :]
    marker = "</main>"
    if marker not in text:
        raise RuntimeError("missing #source and </main> insertion point")
    return text.replace(marker, block + "\n" + marker, 1)


def main() -> None:
    updated = []
    for day, date in DAYS.items():
        slug = f"kaikai-day{day}-{date}"
        source_path = ROOT / "hearing-records/prison-watch" / slug / "index.html"
        source_text = source_path.read_text(encoding="utf-8")
        source_block = extract_section(source_text, "verbatim-source")
        source_ids = set(ID_TOKEN.findall(source_block))

        for locale in ("en", "ja"):
            target_path = ROOT / locale / "hearing-records/prison-watch" / slug / "index.html"
            original_target = target_path.read_text(encoding="utf-8")
            target_text = original_target

            label = (
                "Original Traditional Chinese source transcript"
                if locale == "en"
                else "繁体字中国語による原資料全文"
            )
            localized_block = re.sub(
                r'<section\b[^>]*\bid="verbatim-source"[^>]*>',
                f'<section class="pw-verbatim-source" id="verbatim-source" '
                f'lang="zh-Hant" aria-label="{label}">',
                source_block,
                count=1,
                flags=re.IGNORECASE,
            )
            if STYLE not in target_text:
                target_text = target_text.replace("</head>", STYLE + "\n</head>", 1)
            if 'id="verbatim-source"' in target_text:
                existing_block = extract_section(target_text, "verbatim-source")
                target_text = target_text.replace(existing_block, localized_block, 1)
            else:
                target_text = insert_before_source(target_text, localized_block)

            # The Traditional-Chinese pages use pw-verbatim.js to heuristically
            # pair same-language rows with editorial cards. That heuristic must
            # not run across languages, where it can create false pairings.
            target_text = target_text.replace(INTEGRATION_SCRIPT + "\n", "")
            target_text = target_text.replace(INTEGRATION_SCRIPT, "")
            if STANDALONE_SCRIPT not in target_text:
                target_text = target_text.replace("</body>", STANDALONE_SCRIPT + "\n</body>", 1)

            missing = source_ids - set(ID_TOKEN.findall(target_text))
            if missing:
                raise RuntimeError(f"{target_path}: failed to preserve {len(missing)} source IDs")
            if extract_section(target_text, "verbatim-source") != localized_block:
                raise RuntimeError(f"{target_path}: source transcript is not byte-for-byte current")
            if target_text != original_target:
                target_path.write_text(target_text, encoding="utf-8")
                updated.append(target_path.relative_to(ROOT).as_posix())

    print(f"Updated {len(updated)} locale pages")
    for path in updated:
        print(path)


if __name__ == "__main__":
    main()
