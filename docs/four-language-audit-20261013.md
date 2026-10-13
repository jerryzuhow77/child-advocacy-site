# 2026-10-13 homepage and four-language audit

The source snapshot contains 125 route groups and, after this change, 412 physical pages declared by the route manifest. This is a structural audit, not a complete legal or editorial review of every article.

## Implemented

- English and Japanese homepages now preserve the current 15-section homepage, latest news dates, case collections, memorial, social channels and activity entrances. Chinese-only article links are labelled rather than presented as translated editions.
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
| `features/social-observation/adoption-social-work-child-safety-20260918/` | en, ja |
| `features/social-observation/chen-shangjie-defense-testimony-20260924/` | en, ja |
| `features/social-observation/kaikai-intercountry-adoption-choices-20260920/` | en, ja |
| `features/social-observation/kaikai-warning-signals-review-20260922/` | en, ja |
| `features/social-observation/reporting-duty-question-20260919/` | en, ja |
| `features/social-observation/taiwan-child-placement-history-20260923/` | en, ja |
| `hearing-records/chen-shangjie-prep-hearing-20260917/` | en, ja |
| `news/chen-shangjie-high-court-protest-20260916/` | en, ja |
| `news/daily-child-protection-brief-20260918/` | en, ja |
| `news/daily-child-protection-brief-20260926/` | en, ja |
| `news/daily-child-protection-brief-20260927/` | en, ja |
| `news/daily-child-protection-brief-20260928/` | en, ja |
| `news/daily-child-protection-brief-20260930/` | en, ja |
| `news/guardian-alliance-statement-20260925/` | en, ja |
| `news/kaikai-multiview-report/` | en, ja, zh-Hant |
| `news/liangping-naimilk-jiajia-hearing-20261007/` | en, ja |
| `news/reporting-threshold-20260911/` | en, ja, zh-Hans |
| `news/taichung-infant-rescue-20260919/` | en, ja |

There are 24 incomplete route groups and 54 missing editions. Full translations must preserve source records, quotes, sources, qualifications, media and section anchors. The Hong Kong-only wrapper also requires a deliberate regional-equivalence decision.

## Rebuilding edited editions

Install `scripts/locale-build-requirements.txt`, then run `python scripts/build-activity-locales-20261013.py` followed by `python scripts/build-home-locales-20261013.py`. Translation tables are committed beside the generators.
