#!/usr/bin/env python3
"""Read-only public-edge verification after deploying the map hotfix."""
from __future__ import annotations

import argparse
import hashlib
import json
import time
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any

PATCH_ID = "global-protection-map-autofix-20260825"
ROOT = Path(__file__).resolve().parents[1]
CONFIG = {
    "tw": {
        "base": "https://global-protection.jerryzuhow77.chatgpt.site",
        "js": "/assets/guardian-wall-D4pS1Kwy.js",
        "css": "/assets/index-1prVp_H8.css",
        "js_sha256": "1df97e33c6f583cb81d6530b4510fa0721bb9fb81f2e62c882b4784e256792b8",
        "css_sha256": "24451637a662b738ddc412c2823dcb18e4620bb65329ca592b4edfd1f13b6ac3",
    },
    "hk": {
        "base": "https://cn.globalprotectionwall.com",
        "js": "/assets/guardian-wall-2CHQLdmM.js",
        "css": "/assets/index-CA0ym-VZ.css",
        "js_sha256": "a3df847cdfe8c360fe8bca16ad80d0977036b1aea34ca7b58a2f20850565c98c",
        "css_sha256": "44599172f03721d477742123a6b3a0cac77d0cfff68d6a23daf952ecf6418457",
    },
}


def fetch(url: str, timeout: float) -> tuple[int, dict[str, str], bytes, str]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 GlobalProtectionMapVerify/20260825",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.status, dict(response.headers), response.read(), response.geturl()


def with_nonce(url: str) -> str:
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}map-autofix-verify={time.time_ns()}"


def sha256(body: bytes) -> str:
    return hashlib.sha256(body).hexdigest()


def verify_site(site: str, timeout: float) -> dict[str, Any]:
    cfg = CONFIG[site]
    result: dict[str, Any] = {"site": site, "base": cfg["base"], "checks": {}}
    try:
        _, _, html, _ = fetch(with_nonce(cfg["base"] + "/"), timeout)
        html_text = html.decode("utf-8", errors="replace")
        result["checks"]["homepage_references_expected_js"] = cfg["js"] in html_text
        result["checks"]["homepage_references_expected_css"] = cfg["css"] in html_text

        js_status, js_headers, js_body, js_url = fetch(with_nonce(cfg["base"] + cfg["js"]), timeout)
        css_status, css_headers, css_body, css_url = fetch(with_nonce(cfg["base"] + cfg["css"]), timeout)
        js_text = js_body.decode("utf-8", errors="replace")
        css_text = css_body.decode("utf-8", errors="replace")
        result["javascript"] = {
            "url": js_url,
            "status": js_status,
            "content_type": js_headers.get("Content-Type", ""),
            "bytes": len(js_body),
            "sha256": sha256(js_body),
        }
        result["stylesheet"] = {
            "url": css_url,
            "status": css_status,
            "content_type": css_headers.get("Content-Type", ""),
            "bytes": len(css_body),
            "sha256": sha256(css_body),
        }
        result["checks"]["javascript_patch_marker"] = PATCH_ID in js_text
        result["checks"]["stylesheet_patch_marker"] = PATCH_ID in css_text
        result["checks"]["javascript_sha_matches"] = sha256(js_body) == cfg["js_sha256"]
        result["checks"]["stylesheet_sha_matches"] = sha256(css_body) == cfg["css_sha256"]
        result["checks"]["london_target_present"] = "const LONDON={x:102,y:163,dx:-150,dy:-12}" in js_text
        result["checks"]["region_selector_present"] = "region-filter-select" in js_text
        result["checks"]["visibility_override_present"] = "mapAutofixVisible" in js_text

        _, _, message_body, _ = fetch(with_nonce(cfg["base"] + "/api/public/messages"), timeout)
        data = json.loads(message_body)
        messages = data.get("messages", [])
        counts = Counter(
            item.get("regionCode") for item in messages if item.get("regionCode") in {"GB", "TW", "CN"}
        )
        result["public_messages"] = {
            "total": len(messages),
            "mapped_counts": dict(sorted(counts.items())),
        }
        result["checks"]["public_data_unchanged"] = (
            len(messages) == 16 and counts.get("GB") == 1 and counts.get("TW") == 8 and counts.get("CN") == 5
        )
        result["pass"] = all(value is True for value in result["checks"].values())
    except Exception as exc:
        result["error"] = repr(exc)
        result["pass"] = False
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", choices=["auto", "tw", "hk"], default="auto")
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    sites = ["tw", "hk"] if args.site == "auto" else [args.site]
    report = {
        "patch_id": PATCH_ID,
        "mode": "read_only_public_edge_verification",
        "verified_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "sites": {site: verify_site(site, args.timeout) for site in sites},
    }
    report["pass"] = all(item["pass"] for item in report["sites"].values())
    output = args.output or (ROOT / "validation/live-verification-latest.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
