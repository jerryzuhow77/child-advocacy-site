#!/usr/bin/env python3
"""Read-only desktop/mobile browser regression checks for the live globe repair."""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path
from typing import Any

from playwright.sync_api import Page, sync_playwright

PATCH_ID = "global-protection-map-autofix-20260825"
TARGETS = {
    "tw": "https://global-protection.jerryzuhow77.chatgpt.site/map",
    "hk": "https://cn.globalprotectionwall.com/map",
}
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1000},
    "mobile": {"width": 390, "height": 844},
}


def wait_select(page: Page, expected: str) -> None:
    page.wait_for_function(
        "expected => document.querySelector('.region-filter-select select')?.value === expected",
        arg=expected,
        timeout=8000,
    )


def wait_count(page: Page, expected: int) -> None:
    page.wait_for_function(
        "expected => Number(document.querySelector('.map-count strong')?.textContent?.trim()) === expected",
        arg=expected,
        timeout=8000,
    )


def verify_viewport(page: Page, site: str, viewport_name: str, output_dir: Path) -> dict[str, Any]:
    page.wait_for_selector(".map-stage", timeout=30000)
    page.wait_for_selector(".region-filter-select select", state="attached", timeout=30000)
    page.locator(".map-stage").scroll_into_view_if_needed()
    page.wait_for_timeout(2200)

    style = page.locator(".map-stage").evaluate(
        "el => { const s=getComputedStyle(el); const r=el.getBoundingClientRect(); "
        "return {opacity:s.opacity, visibility:s.visibility, display:s.display, "
        "width:r.width, height:r.height}; }"
    )
    select = page.locator(".region-filter-select select")
    options = select.locator("option").evaluate_all(
        "els => els.map(el => ({value:el.value,text:(el.textContent||'').trim()}))"
    )
    checks: dict[str, bool] = {
        "map_visible": (
            style["opacity"] == "1"
            and style["visibility"] == "visible"
            and style["display"] != "none"
            and style["height"] > 300
        ),
        "selector_present": select.count() == 1,
        "selector_options": {"all", "GB", "TW", "CN"}.issubset(
            {item["value"] for item in options}
        ),
    }

    if viewport_name == "desktop":
        london = page.locator(
            '.region-map-mark[aria-label*="伦敦"], '
            '.region-map-mark[aria-label*="倫敦"], '
            '.region-map-mark[aria-label*="London"]'
        ).first
        coords = london.evaluate(
            "el => { const h=el.querySelector('.mark-hit-overlay'); return {"
            "x:Number(el.dataset.mapAutofixX), y:Number(el.dataset.mapAutofixY), "
            "transform:el.getAttribute('transform')||'', r:Number(h?.getAttribute('r'))}; }"
        )
        london.evaluate(
            "el => el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))"
        )
        wait_select(page, "GB")
        wait_count(page, 1)
        select.select_option("TW")
        wait_select(page, "TW")
        wait_count(page, 8)
        select.select_option("CN")
        wait_select(page, "CN")
        wait_count(page, 5)
        select.select_option("all")
        wait_select(page, "all")
        wait_count(page, 16)
        checks["london_corrected"] = coords == {
            "x": 102,
            "y": 163,
            "transform": "translate(-150 -12)",
            "r": 30,
        }
        checks["marker_and_selector_filter_counts"] = True

    screenshot = output_dir / f"{site}-{viewport_name}-live.png"
    page.screenshot(path=str(screenshot), full_page=True)
    return {"style": style, "options": options, "checks": checks, "pass": all(checks.values())}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=Path("deploy-output"))
    parser.add_argument("--site", choices=["auto", "tw", "hk"], default="auto")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    sites = list(TARGETS) if args.site == "auto" else [args.site]
    report: dict[str, Any] = {"patch_id": PATCH_ID, "sites": {}, "pass": True}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        for site in sites:
            site_report: dict[str, Any] = {"viewports": {}}
            report["sites"][site] = site_report
            for viewport_name, viewport in VIEWPORTS.items():
                console_errors: list[str] = []
                page_errors: list[str] = []
                page = browser.new_page(viewport=viewport)
                page.on(
                    "console",
                    lambda message, bucket=console_errors: bucket.append(message.text)
                    if message.type == "error"
                    else None,
                )
                page.on("pageerror", lambda error, bucket=page_errors: bucket.append(str(error)))
                url = f"{TARGETS[site]}?map-autofix-live={time.time_ns()}"
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    result = verify_viewport(page, site, viewport_name, args.output_dir)
                    result.update(
                        {
                            "url": url,
                            "console_errors": console_errors,
                            "page_errors": page_errors,
                        }
                    )
                    result["pass"] = result["pass"] and not page_errors
                except Exception as exc:
                    result = {
                        "url": url,
                        "error": repr(exc),
                        "console_errors": console_errors,
                        "page_errors": page_errors,
                        "pass": False,
                    }
                site_report["viewports"][viewport_name] = result
                report["pass"] = report["pass"] and result["pass"]
                page.close()
        browser.close()

    report_path = args.output_dir / "live-browser-verification.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
