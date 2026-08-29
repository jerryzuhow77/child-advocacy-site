from __future__ import annotations

import time
import urllib.error
import urllib.request

HANT = 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/'
HANS = 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/'
ASSETS = [
    'https://jerryzuhow77.github.io/child-advocacy-site/assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp',
    'https://jerryzuhow77.github.io/child-advocacy-site/assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp',
]


def fetch(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={'User-Agent': 'kaikai-public-verifier/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), response.headers.get_content_type()


for attempt in range(1, 91):
    token = f'{time.time_ns()}-{attempt}'
    try:
        hant_bytes, hant_type = fetch(f'{HANT}?qa={token}')
        hans_bytes, hans_type = fetch(f'{HANS}?qa={token}')
        hant = hant_bytes.decode('utf-8', errors='replace')
        hans = hans_bytes.decode('utf-8', errors='replace')
        page_ready = all([
            hant_type == 'text/html',
            hans_type == 'text/html',
            'class="responsibility-tree-pair"' in hant,
            'class="responsibility-tree-pair"' in hans,
            '../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp' in hant,
            '../../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp' in hans,
            'final-chapter.css?v=20260829-24' in hant,
            'final-chapter.css?v=20260829-24' in hans,
        ])
        asset_ready = True
        for asset in ASSETS:
            body, content_type = fetch(f'{asset}?qa={token}')
            if content_type != 'image/webp' or len(body) < 80_000:
                asset_ready = False
        if page_ready and asset_ready:
            print(f'Public bilingual layout is ready on attempt {attempt}.')
            raise SystemExit(0)
    except (urllib.error.URLError, TimeoutError, UnicodeError) as error:
        print(f'Attempt {attempt}: {error}')
    time.sleep(10)

raise SystemExit('Timed out before the corrected bilingual layout became public.')
