#!/usr/bin/env python3
"""Apply the first high-impact homepage optimization pass.

This script is intentionally idempotent. It can be rerun safely during future
maintenance and uses only the Python standard library.
"""
from __future__ import annotations

import html as html_lib
import re
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / "index.html"
EN_HOME = ROOT / "en" / "index.html"
JA_HOME = ROOT / "ja" / "index.html"
GSAP_JS = ROOT / "assets" / "home-gsap.js"
SW_JS = ROOT / "sw.js"
OPT_CSS = ROOT / "assets" / "home-first-round-optimization.css"
GENERATED_LIST = ROOT / ".home-optimization-generated-files"

PRIORITY_HTML = '''<section class="home-priority-strip" aria-labelledby="homePriorityTitle">
<div class="container home-priority-shell">
<header><span aria-hidden="true">!</span><div><small>IMPORTANT · 近期重要入口</small><h2 id="homePriorityTitle">先看最新進度，再一起行動</h2></div></header>
<div class="home-priority-links">
<a class="is-hearing" href="./activity-records/20260820-taipei-station-advocacy/"><time datetime="2026-09-16">09.16</time><span><small>二審開庭倡議</small><strong>為 9/16 二審開庭發聲</strong><em>查看北車宣傳行動與開庭資訊</em></span><b aria-hidden="true">→</b></a>
<a href="./hearing-records/prison-watch/kaikai-day4-20250428/"><span class="home-priority-icon" aria-hidden="true">記</span><span><small>最新重製編輯筆記</small><strong>第四次審判期日</strong><em>兩位證人、三處動線與傷勢通報</em></span><b aria-hidden="true">→</b></a>
<a class="is-guest" href="#guest-message-home"><span class="home-priority-icon" aria-hidden="true">♡</span><span><small>免登入即可參與</small><strong>留下訪客守護留言</strong><em>祝福、意見與照片皆可投稿</em></span><b aria-hidden="true">↓</b></a>
</div>
</div>
</section>
'''

GUARD_HTML = '''<section class="home-guard-actions" id="home-guard-actions" aria-labelledby="homeGuardActionsTitle">
<div class="container">
<header class="home-guard-actions-head"><div><small>TAKE ACTION · 一起守護</small><h2 id="homeGuardActionsTitle">用適合你的方式，留下一份守護</h2></div><p>訪客可免登入留下簡短留言；一般會員則可建立完整文章、保存草稿並追蹤審核進度。</p></header>
<div class="home-guard-actions-grid">
<a class="home-guard-action-card is-guest" href="#guest-message-home"><span class="home-guard-action-icon" aria-hidden="true">♡</span><span><strong>訪客留言投稿</strong><em>免登入，約 30 秒即可留下祝福、關心或倡議。</em></span><b aria-hidden="true">↓</b></a>
<a class="home-guard-action-card" href="https://global-protection.jerryzuhow77.chatgpt.site/submit" target="_blank" rel="noopener noreferrer"><span class="home-guard-action-icon" aria-hidden="true">✎</span><span><strong>一般會員投稿</strong><em>建立守護文章、附加照片，並在會員中心追蹤審核。</em></span><b aria-hidden="true">↗</b></a>
</div>
<details class="home-guard-safety"><summary>投稿前的安全提醒</summary><p>請移除兒少、證人或第三人的姓名、學校、地址、聯絡方式與未公開案情。所有公開內容均先經人工審核。</p></details>
</div>
</section>
'''

DAY4_FEATURE_HTML = '''<div class="home-hearing-zone-feature home-hearing-zone-feature-prison-watch home-hearing-zone-feature-day4">
<a class="home-hearing-zone-poster" href="./hearing-records/prison-watch/kaikai-day4-20250428/" aria-label="閱讀護童行動聯盟重製的2025年4月28日第四次審判期日編輯筆記">
<img src="./assets/art/prison-watch-day4-hearing-poster-20260821.svg" alt="第四日第四次審判期日重製編輯筆記主視覺" loading="lazy" decoding="async">
<span>最新重製編輯筆記</span>
</a>
<div class="home-hearing-zone-copy">
<div class="home-hearing-zone-meta"><time datetime="2025-04-28">2025.04.28</time><span>第四次審判期日</span><span>國民法官審理</span></div>
<h3>剴剴案｜第四日庭審紀錄</h3>
<p class="home-hearing-zone-lead">兩位證人、三處托育動線，以及傷勢通報與照顧方式的法庭追問。</p>
<p>依監所關注小組原始紀錄整理，將綑綁與澡盆、冷靜區與罰站、傷勢觀察、照顧交接及法官追問重製為可核對的編輯筆記。</p>
<ul>
<li><b>兩位證人</b><span>不同照顧場域、關係與觀察範圍</span></li>
<li><b>三處動線</b><span>住處、托育環境與照顧交接脈絡</span></li>
<li><b>核心追問</b><span>照顧方式、傷勢辨識及資訊是否被通報</span></li>
</ul>
<div class="home-hearing-zone-actions"><a class="btn home-hearing-zone-primary" href="./hearing-records/prison-watch/kaikai-day4-20250428/">閱讀第四日編輯筆記 <span>→</span></a><a href="#news-flash">返回最新快報</a></div>
</div>
<div class="home-hearing-zone-stamp" aria-hidden="true"><span>DAY 4</span><strong>重製</strong><small>PRISON WATCH</small></div>
</div>
'''

HEARING_ARCHIVE_HTML = '''<nav class="home-hearing-archive-links" aria-label="較早的剴剴案授權旁聽紀錄">
<div><small>EARLIER AUTHORIZED RECORDS</small><strong>依審判日期繼續閱讀</strong><span>最新一日保留完整主卡，較早紀錄改為清楚、輕量的閱讀入口。</span></div>
<a href="./hearing-records/prison-watch/kaikai-day3-20250425/"><span>DAY 3</span><strong>第三次審判期日</strong><small>三位證人與法官追問重點</small><b aria-hidden="true">→</b></a>
<a href="./hearing-records/prison-watch/kaikai-day2-20250423/"><span>DAY 2</span><strong>第二次審判期日</strong><small>證人交互詰問與國民法官提問</small><b aria-hidden="true">→</b></a>
<a href="./hearing-records/prison-watch/kaikai-day1-20250422/"><span>DAY 1</span><strong>第一次審判期日</strong><small>開審陳述、爭點確認與證據調查</small><b aria-hidden="true">→</b></a>
<a class="is-all" href="./hearing-records/"><span aria-hidden="true">◫</span><strong>查看全部旁聽紀錄</strong><b aria-hidden="true">→</b></a>
</nav>
'''

HEADER_MENU_SCRIPT = '''<script id="guardian-action-nav-script">
(()=>{const menu=document.querySelector('.guardian-action-nav');if(!menu)return;const summary=menu.querySelector(':scope>summary');const sync=()=>summary?.setAttribute('aria-expanded',String(menu.open));menu.addEventListener('toggle',sync);document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;summary?.focus();}});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));sync();})();
</script>
'''

OPTIMIZATION_CSS = r'''/* Homepage first-round optimization — 2026-08-21 */
.home-priority-strip{padding:18px 0 10px;background:linear-gradient(180deg,#fffaf6 0%,#f7eee8 100%);position:relative;z-index:2}
.home-priority-shell{display:grid;gap:14px}.home-priority-shell>header{display:flex;align-items:center;gap:12px;color:#3f342e}.home-priority-shell>header>span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#823f39;color:#fff;font-weight:950;box-shadow:0 8px 22px rgba(89,47,42,.18)}.home-priority-shell>header small{display:block;color:#9d6254;font-size:.72rem;font-weight:900;letter-spacing:.12em}.home-priority-shell>header h2{margin:2px 0 0;font-size:clamp(1.18rem,2.2vw,1.62rem);line-height:1.25;color:#3d302a}
.home-priority-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.home-priority-links>a{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;min-height:92px;padding:15px 16px;border:1px solid rgba(103,70,57,.14);border-radius:18px;background:rgba(255,255,255,.9);color:#44352f;text-decoration:none;box-shadow:0 10px 28px rgba(72,48,40,.07);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.home-priority-links>a:hover,.home-priority-links>a:focus-visible{transform:translateY(-2px);border-color:rgba(135,70,59,.35);box-shadow:0 14px 32px rgba(72,48,40,.12);outline:3px solid rgba(157,92,78,.18);outline-offset:2px}.home-priority-links time,.home-priority-icon{display:grid;place-items:center;min-width:52px;height:52px;border-radius:15px;background:#efe1d9;color:#7a453c;font-weight:950;font-size:.95rem}.home-priority-links .is-hearing time{background:#803e39;color:#fff}.home-priority-links .is-guest .home-priority-icon{background:#f6dcd4;color:#a34f48;font-size:1.2rem}.home-priority-links small,.home-priority-links strong,.home-priority-links em{display:block}.home-priority-links small{color:#936052;font-size:.68rem;font-weight:900;letter-spacing:.06em}.home-priority-links strong{margin-top:2px;font-size:.96rem;line-height:1.35}.home-priority-links em{margin-top:3px;color:#77675f;font-size:.76rem;font-style:normal;line-height:1.4}.home-priority-links>a>b{font-size:1.15rem;color:#9c5c50}
.home-guard-actions{padding:22px 0 28px;background:linear-gradient(180deg,#f7eee8,#eee6df)}.home-guard-actions-head{display:flex;align-items:end;justify-content:space-between;gap:22px;margin-bottom:15px}.home-guard-actions-head small{color:#9a6354;font-weight:900;letter-spacing:.1em}.home-guard-actions-head h2{margin:.15rem 0;color:#4f3c34;font-size:clamp(1.55rem,3vw,2.25rem)}.home-guard-actions-head p{max-width:680px;margin:0;color:#74645c}.home-guard-actions-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.home-guard-action-card{display:grid;grid-template-columns:54px 1fr auto;gap:14px;align-items:center;min-height:118px;padding:20px;border:1px solid rgba(111,73,60,.16);border-radius:24px;background:rgba(255,255,255,.82);color:#4a3932;text-decoration:none;box-shadow:0 14px 34px rgba(78,54,45,.08);transition:transform .2s ease,box-shadow .2s ease}.home-guard-action-card:hover,.home-guard-action-card:focus-visible{transform:translateY(-3px);box-shadow:0 20px 42px rgba(78,54,45,.14);outline:3px solid rgba(165,83,72,.2);outline-offset:2px}.home-guard-action-card.is-guest{background:linear-gradient(135deg,#fff7f2,#f8e0d5)}.home-guard-action-icon{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;background:#f0d9cf;color:#985649;font-size:1.45rem;font-weight:900}.home-guard-action-card strong{display:block;font-size:1.08rem}.home-guard-action-card em{display:block;margin-top:5px;color:#76665e;font-size:.82rem;font-style:normal;line-height:1.5}.home-guard-action-card b{color:#95584b;font-size:1.1rem}.home-guard-safety{margin-top:12px;border:1px solid rgba(111,73,60,.13);border-radius:18px;background:rgba(255,255,255,.66);overflow:hidden}.home-guard-safety summary{padding:13px 17px;color:#654b40;font-weight:850;cursor:pointer}.home-guard-safety p{margin:0;padding:0 17px 16px;color:#75655e;font-size:.85rem;line-height:1.65}
.home-hearing-archive-links{display:grid;grid-template-columns:1.15fr repeat(3,1fr) auto;gap:12px;align-items:stretch;margin:18px 0 28px;padding:14px;border:1px solid rgba(72,84,101,.13);border-radius:20px;background:linear-gradient(135deg,rgba(248,250,252,.96),rgba(239,244,248,.96));box-shadow:0 12px 30px rgba(22,42,61,.07)}.home-hearing-archive-links>div{padding:10px 12px}.home-hearing-archive-links>div small{display:block;color:#7a5960;font-size:.68rem;font-weight:900;letter-spacing:.08em}.home-hearing-archive-links>div strong{display:block;margin-top:3px;color:#20394d;font-size:1rem}.home-hearing-archive-links>div span{display:block;margin-top:4px;color:#657583;font-size:.76rem;line-height:1.45}.home-hearing-archive-links>a{display:grid;grid-template-columns:1fr auto;align-content:center;gap:2px 10px;min-height:78px;padding:12px 14px;border:1px solid rgba(51,79,101,.12);border-radius:14px;background:#fff;color:#253f53;text-decoration:none}.home-hearing-archive-links>a:hover,.home-hearing-archive-links>a:focus-visible{border-color:rgba(126,71,66,.35);background:#fff9f5;outline:3px solid rgba(139,76,69,.14);outline-offset:2px}.home-hearing-archive-links>a>span{grid-column:1;color:#9a6255;font-size:.66rem;font-weight:950;letter-spacing:.08em}.home-hearing-archive-links>a>strong{font-size:.88rem}.home-hearing-archive-links>a>small{grid-column:1;color:#70808c;font-size:.69rem;line-height:1.35}.home-hearing-archive-links>a>b{grid-column:2;grid-row:1/4;align-self:center}.home-hearing-archive-links .is-all{grid-template-columns:auto 1fr auto;min-width:150px}.home-hearing-archive-links .is-all>span,.home-hearing-archive-links .is-all>strong,.home-hearing-archive-links .is-all>b{grid-column:auto;grid-row:auto;align-self:center}
.home-disc-motion-control{position:absolute;top:16px;right:16px;z-index:12;display:inline-flex;align-items:center;justify-content:center;min-height:44px;max-width:min(70%,290px);margin:0;padding:9px 13px;border:1px solid rgba(35,67,86,.18);border-radius:999px;background:rgba(255,255,255,.9);color:#25485e;font:inherit;font-size:.74rem;font-weight:900;line-height:1.3;box-shadow:0 7px 20px rgba(23,48,65,.11);backdrop-filter:blur(8px)}button.home-disc-motion-control{cursor:pointer}.home-disc-motion-control:hover,.home-disc-motion-control:focus-visible{background:#fff;outline:3px solid rgba(42,94,124,.18);outline-offset:2px}
#guest-message-home,#news-flash{scroll-margin-top:100px}.home-art-footer,.belief-footer-section,.social-preview-section,.primary-brand-section{content-visibility:auto;contain-intrinsic-size:900px}
@media (min-width:801px) and (max-width:1400px){.art-header .container.nav{gap:8px}.art-header .container.nav>nav{gap:5px;font-size:.75rem}.art-header .container.nav>nav>a,.art-header .social-case-nav-toggle,.art-header .guardian-action-nav>summary{padding:.43rem .54rem}.art-header .site-qr-trigger span,.art-header .pwa-nav-install .pwa-install-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.art-header .site-qr-trigger{padding:.24rem}.art-header .pwa-nav-install{min-width:42px;padding:.48rem}}
@media(max-width:980px){.home-priority-links{grid-template-columns:1fr}.home-priority-links>a{min-height:78px}.home-hearing-archive-links{grid-template-columns:1fr 1fr}.home-hearing-archive-links>div{grid-column:1/-1}.home-hearing-archive-links .is-all{grid-column:1/-1}.home-guard-actions-head{display:block}.home-guard-actions-head p{margin-top:5px}}
@media(max-width:760px){.home-priority-strip{padding:12px 0 6px}.home-priority-shell>header{align-items:flex-start}.home-priority-links>a{padding:13px;min-height:76px}.home-priority-links time,.home-priority-icon{min-width:46px;height:46px}.home-hearing-archive-links{grid-template-columns:1fr;padding:10px;border-radius:16px}.home-hearing-archive-links>div,.home-hearing-archive-links .is-all{grid-column:1}.home-disc-motion-control{top:10px;right:10px;min-height:40px;max-width:72%;font-size:.68rem}.home-document-disc-control{min-width:44px;min-height:44px}.home-guard-actions-grid{grid-template-columns:1fr}.home-guard-action-card{grid-template-columns:48px 1fr auto;padding:17px}.home-guard-action-icon{width:48px;height:48px}}
@media(prefers-reduced-motion:reduce){.home-priority-links>a,.home-guard-action-card{transition:none}.home-priority-links>a:hover,.home-priority-links>a:focus-visible,.home-guard-action-card:hover,.home-guard-action-card:focus-visible{transform:none}.home-document-disc-shell{height:auto!important;min-height:0!important;padding:14px 0 4px;touch-action:auto}.home-document-disc-shell::before,.home-document-disc-shell::after,.home-document-disc-shell .home-document-disc-center,.home-document-disc-shell .home-ferris-stand,.home-document-disc-shell .home-ferris-spokes,.home-document-disc-shell .home-sea-art,.home-document-disc-shell .home-ferris-cloud,.home-document-disc-shell .home-ferris-bubbles,.home-document-disc-shell .home-document-disc-control{display:none!important}.home-document-disc-shell .home-document-disc-orbit{position:relative!important;inset:auto!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;transform:none!important}.home-document-disc-shell .home-document-disc-card{position:relative!important;left:auto!important;top:auto!important;width:auto!important;min-height:0!important;transform:none!important;border-radius:20px;transition:none!important}.home-document-disc-shell .home-document-disc-card img{height:130px}.home-disc-motion-control{position:static;max-width:100%;margin:10px auto}}
@media(max-width:620px) and (prefers-reduced-motion:reduce){.home-document-disc-shell .home-document-disc-orbit{grid-template-columns:1fr}}
'''


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def element_bounds(text: str, marker: str, tag: str) -> tuple[int, int]:
    marker_pos = text.find(marker)
    if marker_pos < 0:
        raise ValueError(f"Marker not found for <{tag}>: {marker[:100]}")
    start = text.rfind(f"<{tag}", 0, marker_pos + 1)
    if marker.startswith(f"<{tag}"):
        start = marker_pos
    if start < 0:
        raise ValueError(f"Opening <{tag}> not found before marker: {marker[:100]}")
    token_re = re.compile(rf"<{tag}\b[^>]*>|</{tag}\s*>", re.IGNORECASE)
    depth = 0
    for match in token_re.finditer(text, start):
        token = match.group(0)
        if token.lower().startswith(f"</{tag}"):
            depth -= 1
            if depth == 0:
                return start, match.end()
        else:
            depth += 1
    raise ValueError(f"Unbalanced <{tag}> block at marker: {marker[:100]}")


def remove_element(text: str, marker: str, tag: str, required: bool = False) -> str:
    if marker not in text:
        if required:
            raise ValueError(f"Required marker missing: {marker[:100]}")
        return text
    start, end = element_bounds(text, marker, tag)
    return text[:start] + text[end:]


def remove_anchor_by_href(text: str, href: str) -> str:
    needle = f'href="{href}"'
    while needle in text:
        start, end = element_bounds(text, needle, "a")
        text = text[:start] + text[end:]
    return text


def insert_stylesheet(doc: str, href: str) -> str:
    if href.split("?", 1)[0] in doc:
        return doc
    return doc.replace("</head>", f'<link rel="stylesheet" href="{href}">\n</head>', 1)


def upsert_meta(doc: str, attr: str, key: str, value: str) -> str:
    escaped = html_lib.escape(value, quote=True)
    pattern = re.compile(rf'<meta\b(?=[^>]*\b{re.escape(attr)}=["\']{re.escape(key)}["\'])[^>]*>', re.IGNORECASE)
    match = pattern.search(doc)
    tag = f'<meta {attr}="{key}" content="{escaped}">'
    if match:
        return doc[:match.start()] + tag + doc[match.end():]
    return doc.replace("</head>", tag + "\n</head>", 1)


def upsert_canonical(doc: str, href: str) -> str:
    tag = f'<link rel="canonical" href="{href}">'
    pattern = re.compile(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>', re.IGNORECASE)
    match = pattern.search(doc)
    if match:
        return doc[:match.start()] + tag + doc[match.end():]
    return doc.replace("</head>", tag + "\n</head>", 1)


def set_alternates(doc: str) -> str:
    doc = re.sub(r'\s*<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=)[^>]*>', "", doc, flags=re.IGNORECASE)
    links = "\n".join([
        '<link rel="alternate" hreflang="zh-Hant" href="https://jerryzuhow77.github.io/child-advocacy-site/">',
        '<link rel="alternate" hreflang="zh-Hans" href="https://jerryzuhow77.github.io/child-advocacy-site/">',
        '<link rel="alternate" hreflang="en" href="https://jerryzuhow77.github.io/child-advocacy-site/en/">',
        '<link rel="alternate" hreflang="ja" href="https://jerryzuhow77.github.io/child-advocacy-site/ja/">',
        '<link rel="alternate" hreflang="x-default" href="https://jerryzuhow77.github.io/child-advocacy-site/">',
    ])
    canonical = re.search(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>', doc, re.IGNORECASE)
    if canonical:
        return doc[:canonical.end()] + "\n" + links + doc[canonical.end():]
    return doc.replace("</head>", links + "\n</head>", 1)


def set_title(doc: str, title: str) -> str:
    return re.sub(r"<title>.*?</title>", f"<title>{html_lib.escape(title)}</title>", doc, count=1, flags=re.DOTALL | re.IGNORECASE)


def patch_homepage(doc: str) -> str:
    for marker in ('<section class="home-priority-strip"', '<section class="home-guard-actions"'):
        doc = remove_element(doc, marker, "section")

    guest_marker = '<section class="home-guest-message-section"'
    protection_marker = '<section class="home-protection-wall"'
    news_marker = '<section aria-labelledby="newsFlashTitle"'

    g_start, g_end = element_bounds(doc, guest_marker, "section")
    guest = doc[g_start:g_end]
    doc = doc[:g_start] + doc[g_end:]

    p_start, p_end = element_bounds(doc, protection_marker, "section")
    protection = doc[p_start:p_end]
    doc = doc[:p_start] + doc[p_end:]
    protection = remove_element(protection, '<aside class="home-member-submission"', "aside")

    n_start, n_end = element_bounds(doc, news_marker, "section")
    news = doc[n_start:n_end]
    doc = doc[:n_start] + doc[n_end:]

    for href in (
        "./hearing-records/prison-watch/kaikai-day3-20250425/",
        "./hearing-records/prison-watch/kaikai-day2-20250423/",
        "./hearing-records/prison-watch/kaikai-day1-20250422/",
    ):
        news = remove_anchor_by_href(news, href)
    news = news.replace("./activity-records/20260801-ketagal-rally/images/rally-01.png", "./assets/art/rally-20260801-ai-poster.jpg")
    news = re.sub(r"[十十一]+份近期更新內容，依上傳日期由新到舊排列", "近期更新內容，依更新時間排序", news)
    news = re.sub(r"最近更新[十十一]+份內容", "近期更新內容", news)

    _, hero_end = element_bounds(doc, '<section class="art-hero premium-home-hero"', "section")
    opening = "\n" + PRIORITY_HTML + news + "\n" + GUARD_HTML + guest + "\n" + protection + "\n"
    doc = doc[:hero_end] + opening + doc[hero_end:]

    hearing_marker = '<section class="home-hearing-zone"'
    if hearing_marker in doc:
        h_start, h_end = element_bounds(doc, hearing_marker, "section")
        hearing = doc[h_start:h_end]
        for marker in (
            '<div class="home-hearing-zone-feature home-hearing-zone-feature-prison-watch home-hearing-zone-feature-day2 home-hearing-zone-feature-day3">',
            '<div class="home-hearing-zone-feature home-hearing-zone-feature-prison-watch home-hearing-zone-feature-day2">',
            '<div class="home-hearing-zone-feature home-hearing-zone-feature-prison-watch">',
            '<div class="home-hearing-zone-feature home-hearing-zone-feature-prison-watch home-hearing-zone-feature-day4">',
        ):
            hearing = remove_element(hearing, marker, "div")
        _, head_end = element_bounds(hearing, '<div class="home-hearing-zone-head">', "div")
        hearing = hearing[:head_end] + "\n" + DAY4_FEATURE_HTML + HEARING_ARCHIVE_HTML + hearing[head_end:]
        doc = doc[:h_start] + hearing + doc[h_end:]

    special_marker = '<section class="home-special-zone home-crafted-zone"'
    if special_marker in doc:
        s_start, s_end = element_bounds(doc, special_marker, "section")
        special = doc[s_start:s_end]
        for href in (
            "./hearing-records/prison-watch/kaikai-day4-20250428/",
            "./hearing-records/prison-watch/kaikai-day3-20250425/",
            "./hearing-records/prison-watch/kaikai-day2-20250423/",
            "./hearing-records/prison-watch/kaikai-day1-20250422/",
        ):
            special = remove_anchor_by_href(special, href)
        special = special.replace("特別專題文章，依上傳時間由新到舊排列", "文化記憶、制度觀察與敘事型特別專題")
        doc = doc[:s_start] + special + doc[s_end:]

    doc = doc.replace('<summary aria-label="開啟一起守護專區">', '<summary aria-label="開啟一起守護專區" aria-expanded="false">', 1)
    if "guardian-action-nav-script" not in doc:
        doc = doc.replace("</body>", HEADER_MENU_SCRIPT + "</body>", 1)
    doc = insert_stylesheet(doc, "./assets/home-first-round-optimization.css?v=20260821-2")
    return set_alternates(doc)


def patch_document_disc_js(source: str) -> str:
    start = source.find("  function initDocumentDisc()")
    end = source.find("\n\n  function initActivityRecordScroller", start)
    if start < 0 or end < 0:
        raise ValueError("Could not isolate initDocumentDisc in assets/home-gsap.js")
    block = source[start:end]
    if "home-disc-motion-control" in block:
        return source
    block = block.replace("    var autoTween;\n    var dragging = false;", "    var autoTween;\n    var motionPaused = reduceMotion;\n    var dragging = false;", 1)
    old_rotate = '''    function rotateBy(delta) {
      if (reduceMotion) return;
      if (autoTween) autoTween.pause();
      gsap.to(orbit, {
        rotation: function () { return (Number(gsap.getProperty(orbit, 'rotation')) || 0) + delta; },
        duration: 0.72,
        ease: 'power2.inOut',
        onUpdate: keepCardsUpright,
        onComplete: function () { if (autoTween) autoTween.resume(); }
      });
    }
'''
    new_rotate = '''    function rotateBy(delta) {
      if (reduceMotion) return;
      if (autoTween) autoTween.pause();
      gsap.to(orbit, {
        rotation: function () { return (Number(gsap.getProperty(orbit, 'rotation')) || 0) + delta; },
        duration: 0.72,
        ease: 'power2.inOut',
        onUpdate: keepCardsUpright,
        onComplete: function () { if (autoTween && !motionPaused) autoTween.resume(); }
      });
    }
'''
    if old_rotate not in block:
        raise ValueError("Expected rotateBy implementation not found")
    block = block.replace(old_rotate, new_rotate, 1)
    control_code = '''    var motionControl = document.createElement(reduceMotion ? 'p' : 'button');
    motionControl.className = 'home-disc-motion-control';
    if (reduceMotion) {
      motionControl.textContent = '已依系統設定改為靜態列表；所有內容仍可直接閱讀';
      motionControl.setAttribute('role', 'status');
    } else {
      motionControl.type = 'button';
      motionControl.textContent = '暫停自動輪播';
      motionControl.setAttribute('aria-pressed', 'false');
      motionControl.addEventListener('click', function () {
        motionPaused = !motionPaused;
        motionControl.setAttribute('aria-pressed', String(motionPaused));
        motionControl.textContent = motionPaused ? '繼續自動輪播' : '暫停自動輪播';
        if (motionPaused) autoTween?.pause();
        else autoTween?.resume();
      });
    }
    shell.appendChild(motionControl);
    if (!shell.hasAttribute('tabindex')) shell.tabIndex = 0;
    shell.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); rotateBy(step); }
      if (event.key === 'ArrowRight') { event.preventDefault(); rotateBy(-step); }
    });

'''
    block = block.replace("    layout();\n", control_code + "    layout();\n", 1)
    block = block.replace("      autoTween = gsap.to(orbit, {", "      motionPaused = false;\n      autoTween = gsap.to(orbit, {", 1)
    block = block.replace("        if (!dragging) autoTween.resume();", "        if (!dragging && !motionPaused) autoTween.resume();", 1)
    block = block.replace("        autoTween.resume();\n      });\n      shell.addEventListener('pointercancel', function () { dragging = false; autoTween.resume(); });", "        if (!motionPaused) autoTween.resume();\n      });\n      shell.addEventListener('pointercancel', function () { dragging = false; if (!motionPaused) autoTween.resume(); });", 1)
    return source[:start] + block + source[end:]


def patch_english(doc: str) -> str:
    title = "Child Protection Action Alliance | Court observation, case tracking and child protection"
    description = "Official website of the Child Protection Action Alliance. We document court hearings, track child-protection cases, support victims and advocate for stronger safeguards for children."
    doc = set_title(doc, title)
    doc = upsert_meta(doc, "name", "description", description)
    doc = upsert_meta(doc, "name", "keywords", "Child Protection Action Alliance, Kaikai case, Chen Shangjie case, court observation, child protection, case tracking")
    doc = upsert_canonical(doc, "https://jerryzuhow77.github.io/child-advocacy-site/en/")
    doc = upsert_meta(doc, "property", "og:title", title)
    doc = upsert_meta(doc, "property", "og:description", description)
    doc = upsert_meta(doc, "property", "og:url", "https://jerryzuhow77.github.io/child-advocacy-site/en/")
    doc = upsert_meta(doc, "property", "og:locale", "en_US")
    doc = upsert_meta(doc, "name", "twitter:title", title)
    doc = upsert_meta(doc, "name", "twitter:description", description)
    doc = upsert_meta(doc, "name", "twitter:image:alt", "Child Protection Action Alliance official website")
    doc = set_alternates(doc)
    doc = insert_stylesheet(doc, "../assets/home-first-round-optimization.css?v=20260821-2")
    return doc.replace("court audits", "court observation").replace("Court audit", "Court observation").replace("Victim support", "victim support").replace("divorce case", "Kaikai case")


def patch_japanese(doc: str) -> str:
    title = "児童保護行動連盟｜裁判傍聴・事件追跡・児童保護"
    description = "児童保護行動連盟の公式サイト。裁判傍聴記録、事件追跡、被害者支援、制度監督と提言を通じて、子どもの安全を最優先に考えます。"
    doc = set_title(doc, title)
    doc = upsert_meta(doc, "name", "description", description)
    doc = upsert_canonical(doc, "https://jerryzuhow77.github.io/child-advocacy-site/ja/")
    doc = upsert_meta(doc, "property", "og:title", title)
    doc = upsert_meta(doc, "property", "og:description", description)
    doc = upsert_meta(doc, "property", "og:url", "https://jerryzuhow77.github.io/child-advocacy-site/ja/")
    doc = upsert_meta(doc, "property", "og:locale", "ja_JP")
    doc = upsert_meta(doc, "name", "twitter:card", "summary_large_image")
    doc = upsert_meta(doc, "name", "twitter:title", title)
    doc = upsert_meta(doc, "name", "twitter:description", description)
    doc = upsert_meta(doc, "name", "twitter:image", "https://jerryzuhow77.github.io/child-advocacy-site/assets/brand/primary-logo-02.jpg")
    doc = upsert_meta(doc, "name", "twitter:image:alt", "児童保護行動連盟の公式サイト")
    doc = set_alternates(doc)
    return insert_stylesheet(doc, "../assets/home-first-round-optimization.css?v=20260821-2")


def update_pwa_cache(source: str) -> str:
    source = re.sub(r"const VERSION = '[^']+';", "const VERSION = '2026-08-21-home-first-round-2';", source, count=1)
    if "./assets/home-first-round-optimization.css" not in source:
        source = source.replace("  './assets/home-gsap.css',", "  './assets/home-gsap.css',\n  './assets/home-first-round-optimization.css',", 1)
    return source


def assert_order(doc: str, markers: Iterable[str]) -> None:
    positions = [doc.find(marker) for marker in markers]
    if any(position < 0 for position in positions) or positions != sorted(positions):
        raise ValueError(f"Homepage section order check failed: {list(zip(markers, positions))}")


def add_home_image_hints(doc: str) -> str:
    heavy_sources = (
        "./assets/art/chen-shangjie-case-poster.png", "./assets/art/dui-police-killing-poster.png", "./assets/art/lin-xinci-missing-four-days-universal.png", "./assets/art/social-cases-guardian-emblem-paper-art.png", "./activity-records/20260801-ketagal-rally/images/rally-01.png", "./activity-records/20260801-ketagal-rally/images/rally-02.png", "./assets/brand/primary-logo-01.jpg", "./assets/brand/primary-logo-03.jpg", "./assets/brand/primary-logo-04.jpg",
    )
    for source in heavy_sources:
        pattern = re.compile(rf'<img\b[^>]*\bsrc=["\']{re.escape(source)}["\'][^>]*>', re.IGNORECASE)
        def patch(match: re.Match[str]) -> str:
            tag = match.group(0)
            if not re.search(r"\bloading=", tag, re.IGNORECASE):
                tag = tag[:-1] + ' loading="lazy">'
            if not re.search(r"\bdecoding=", tag, re.IGNORECASE):
                tag = tag[:-1] + ' decoding="async">'
            return tag
        doc = pattern.sub(patch, doc)
    return doc


def validate(home: str, en: str, ja: str, gsap: str) -> None:
    assert_order(home, ('class="art-hero premium-home-hero"', 'class="home-priority-strip"', 'id="news-flash"', 'class="home-guard-actions"', 'id="guest-message-home"', 'id="global-protection-wall"'))
    if 'class="home-member-submission"' in home:
        raise ValueError("Legacy long member-submission panel remains on homepage")
    news_start, news_end = element_bounds(home, '<section aria-labelledby="newsFlashTitle"', "section")
    news = home[news_start:news_end]
    if any(day in news for day in ("kaikai-day1-20250422", "kaikai-day2-20250423", "kaikai-day3-20250425")):
        raise ValueError("Day 1/2/3 still duplicated in Latest Reports")
    if "kaikai-day4-20250428" not in news:
        raise ValueError("Day 4 is missing from Latest Reports")
    if "home-hearing-archive-links" not in home or "home-hearing-zone-feature-day4" not in home:
        raise ValueError("Day 4 feature or compact hearing archive links were not added")
    if "home-disc-motion-control" not in gsap:
        raise ValueError("Carousel motion controls were not installed")
    if 'href="https://jerryzuhow77.github.io/child-advocacy-site/en/"' not in en or 'content="en_US"' not in en:
        raise ValueError("English canonical or locale is incorrect")
    if 'content="ja_JP"' not in ja:
        raise ValueError("Japanese Open Graph locale is incorrect")
    if "home-first-round-optimization.css" not in home:
        raise ValueError("Optimization stylesheet is not linked")


def main() -> None:
    home = add_home_image_hints(patch_homepage(read(HOME)))
    en = patch_english(read(EN_HOME))
    ja = patch_japanese(read(JA_HOME))
    gsap = patch_document_disc_js(read(GSAP_JS))
    sw = update_pwa_cache(read(SW_JS))
    home = home.replace("./assets/home-gsap.js?v=20260820-activity-loop-2", "./assets/home-gsap.js?v=20260821-a11y-2")
    validate(home, en, ja, gsap)
    write(HOME, home)
    write(EN_HOME, en)
    write(JA_HOME, ja)
    write(GSAP_JS, gsap)
    write(SW_JS, sw)
    write(OPT_CSS, OPTIMIZATION_CSS.strip() + "\n")
    write(GENERATED_LIST, "")
    print("Applied homepage first-round optimization")


if __name__ == "__main__":
    main()
