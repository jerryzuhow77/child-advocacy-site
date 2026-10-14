# 2026-10-13 homepage and four-language audit

The PR #543 source snapshot contains 125 route groups and 412 physical pages declared by the route manifest. The follow-up batches below bring the branch total to 425 physical pages. This is a structural audit, not a complete legal or editorial review of every article.

## Implemented

- English and Japanese homepages now preserve the current 15-section homepage, latest news dates, case collections, memorial, social channels and activity entrances. Chinese-only article links are labelled rather than presented as translated editions.
- Shared article language menus now disable missing editions with an unavailable label instead of silently redirecting readers to a homepage; the route manifest overrides stale alternate links.
- Homepage language selection keeps the regional origin and respects explicit Traditional/Simplified choices. Mobile brand text wraps instead of forcing overflow.
- Three October activity notices now have full Simplified Chinese, English and Japanese pages. The Liu Zongxin observation notice qualifies the supplied date and courtroom as unverified in every edition. Chinese posters remain originals and are identified as such in translated alternative text.
- Memorial English/Japanese editions now retain all source paragraphs and the three protective-action cards, with four-language toolbars and their existing view-count integration.
- The already translated Liu Zongxin feature no longer bypasses locale completeness checks.
- Responsive CI covers both regions, four locales and widths 320, 375, 390, 768, 1024 and 1440.

## Verification

Passed locally: default route completeness and full-record anchor checks; homepage section/date/resource/script parity; cross-origin routing regression; 27 Jiajia qualifier checks; view-counter coverage for the homepage and 388 public article documents. Browser screenshots and overflow assertions remain subject to GitHub Actions; no local visual acceptance is claimed.

`python scripts/verify-four-language-completeness.py --strict` fails on the following existing untranslated groups. Default success is explicitly labelled as allowing legacy exceptions. No all-site four-language completion or deployment is claimed.

## Remaining full translations

| Source route | Missing editions |
|---|---|
| `activity-records/20260908-chen-shangjie-hearing-street-advocacy/` | en, ja |
| `activity-records/20260908-kaikai-cemetery-memorial/` | en, ja |
| `cases/kaikai/features/final-24-hours/` | en, ja, zh-Hans |
| `cases/kaikai/features/final-24-hours/dialogues/` | en, ja, zh-Hans |
| `cases/kaikai/features/liu-sisters-dialogues/` | en, ja, zh-Hans |
| `cases/kaikai/features/rescue-windows/` | en, ja, zh-Hans |
| `features/social-observation/chen-shangjie-defense-testimony-20260924/` | en, ja |
| `features/social-observation/kaikai-warning-signals-review-20260922/` | en, ja |
| `features/social-observation/taiwan-child-placement-history-20260923/` | en, ja |
| `hearing-records/chen-shangjie-prep-hearing-20260917/` | en, ja |
| `news/daily-child-protection-brief-20260918/` | en, ja |
| `news/daily-child-protection-brief-20260926/` | en, ja |
| `news/daily-child-protection-brief-20260927/` | en, ja |
| `news/daily-child-protection-brief-20260928/` | en, ja |
| `news/daily-child-protection-brief-20260930/` | en, ja |
| `news/guardian-alliance-statement-20260925/` | en, ja |
| `news/kaikai-multiview-report/` | en, ja, zh-Hant |
| `news/liangping-naimilk-jiajia-hearing-20261007/` | en, ja |

There are 18 incomplete route groups and 41 missing editions on this branch, down from 24 groups / 54 editions after PR #543. Full translations must preserve source records, quotes, sources, qualifications, media and section anchors. The Hong Kong-only wrapper still needs equivalent full editions that preserve the existing regional source labels. This is not all-site completion, a merge, or evidence of live regional deployment.

## Follow-up full-translation batches

Base: main `50b26526eff87decfbb37308f7f64a6a7d2f9c39` (includes PR #543 and the subsequent Hong Kong sitemap packaging fix).

| Batch | Complete English and Japanese editions | Strict remainder |
|---|---|---|
| 1 | Adoption social work and child safety; reporting-duty question | 22 groups / 50 editions |
| 2 | September 16 High Court protest record; September 19 Taichung infant rescue | 20 groups / 46 editions |
| 3 | Kaikai intercountry-adoption choices | 19 groups / 44 editions |
| 4 | Reporting-threshold feature (Simplified Chinese, English and Japanese) | 18 groups / 41 editions |

Each English/Japanese page retains every source text node in order, headings, section structure, anchors, links and images. The translation table includes descriptions and image accessibility text. Original Chinese diagrams remain original images and are identified as such in their translated alternative text. The adoption article retains the domestic-priority principle, institutional-versus-case-causation distinction, Control Yuan administrative-versus-criminal-responsibility limitation, decision tree and all references. The published Chinese text, images and source links are unchanged; metadata gains reciprocal English/Japanese alternates and missing canonical links. Browser CI exposed two pre-existing bad GSAP URLs in the intercountry-adoption Simplified Chinese page; those two script URLs now use the correct absolute asset paths. Narrow English headings gain wrapping and a smaller minimum font size, following the 320px browser failure.

Local checks passed: `python scripts/verify-full-locales-20261013.py`; default structural completeness (explicitly reports 18 legacy gaps); cross-origin toolbar regression; homepage and 401 public article counter-loader coverage; JavaScript syntax; and `git diff --check`. All six completed groups were removed from the legacy-exception set. No new exceptions were added.

`python scripts/verify-four-language-completeness.py --strict` still exits nonzero and lists all 18 remaining groups. Strict results are also explicitly reported in the batch CI summary; the reporting step does not turn the site into an all-site PASS.

Local Chromium launch was blocked by the execution environment (`socket() failed: Operation not permitted`), so no mobile screenshot or live view-count acceptance is claimed. A dedicated CI workflow renders the checkout under both regional origins, all four locales and six widths (320, 375, 390, 768, 1024, 1440), checks image decoding, locale, toolbar availability, counter DOM integration and horizontal overflow, and uploads mobile screenshots. These browser tests use intercepted checkout resources; they do not prove either production deployment or the live counter API. The later browser result is recorded below; production verification remains outstanding.

Rebuild these batches with `python scripts/build-full-locales-20261013.py`. The route list and complete paragraph translations are committed in `scripts/full-locales-routes-20261013.json` and `scripts/full-locales-20261013.tsv`. The generator fails before writing any pages if source text or accessibility metadata lacks a translation.

## Rebuilding edited editions

Install `scripts/locale-build-requirements.txt`, then run `python scripts/build-activity-locales-20261013.py` followed by `python scripts/build-home-locales-20261013.py`. Translation tables are committed beside the generators.

### Browser follow-up

First browser run: https://github.com/jerryzuhow77/child-advocacy-site/actions/runs/38349315362. Full-record/metadata checks passed. Browser assertions found the intercountry-adoption Simplified Chinese GSAP URLs resolving to `features/assets/vendor/` and English heading overflow at 320px. The URLs and translated-heading CSS have been corrected; the next run must verify these fixes. Strict reporting now runs even if another step fails. No final browser or live deployment PASS is claimed here.

### Verified batch browser result

Code commit `f5b1f13b6a8c8f427c95822b268868c221ed2ecd`: https://github.com/jerryzuhow77/child-advocacy-site/actions/runs/38350098160. Full-record/reciprocal-metadata and counter-loader checks passed. All **288** regional/locale/width browser checks passed after extending long-word wrapping to English prose/cards. The same log explicitly shows strict completeness exiting 1, listing **18 groups / 41 missing editions**, and the summary records `Strict check outcome: failure`. The batch job success is not all-site strict success. Production deployment and live counter API verification are not claimed. Other homepage/September QA runs were still in progress when this record was written.
