# Reconcile PRs 538, 539, 541 and 542 after PR 543

Baseline: main `50b26526eff87decfbb37308f7f64a6a7d2f9c39` (includes merged PRs 543, 544 and 545).
PR 543 merge: `1e294064ca260a7a5382fbe1fbc1e58752d6abe6`.

| PR | Original head | Baseline coverage and disposition |
| --- | --- | --- |
| 538 | `1db31543259c89a841245debc0c5edf5fc06f53f` | Both memorial editions have the toolbar and four hreflang links; the October 12 brief has English/Japanese physical editions and four-language manifest entries. Covered by current main; close as superseded. Keep the newer complete memorial text. |
| 539 | `9608f0dafed8d9e44d64ef2341dc35a9aafc2c5b` | The single-language exception was already removed. Both localized overview links still incorrectly said Chinese; the five-test file and its two workflow hooks were absent. Transfer only those four files; close the old PR after the replacement is recorded. |
| 541 | `ecd351bad0a38e5049ab037747ca99f14c88adb8` | Base is PR 538's branch, not main. All three activities now have four physical editions, toolbar and reciprocal metadata at current manifest routes. Old diff also contains erroneous `e/` and `j/` paths and obsolete prefixed en/ja routes; do not merge it. Close as superseded. |
| 542 | `ba0e4092d89ac3ca9186c458bbc1f10565a8862e` | Four activity editions already explicitly mark the schedule unverified, but the court lookup link was absent. Preserve the newer multilingual pages, add only the official lookup link in each edition, and add one regression test. Close the old PR after recording the replacement. |

The replacement changes neither homepage nor route manifest, verifier exceptions, poster assets, translations or date/time facts. The existing five PR 539 tests remain intact; a sixth checks pending-status text and official lookup links in the four activity editions using current manifest routes.

Local validation on the replacement:

- `python3 scripts/test-liu-hearing-localization.py -v`: six tests passed, including simulated missing en/ja manifest entries and physical files.
- `python3 scripts/verify-four-language-completeness.py`: passed, 125 route groups / 412 physical pages. **24 incomplete legacy groups remain**; this is not strict full-site completeness.
- `python3 .github/scripts/audit-page-view-coverage.py`: homepage and 388 public articles covered.
- `node .github/scripts/test-four-language-cross-origin-routing.mjs`: passed.
- `node scripts/verify-four-language-view-keys.mjs`: passed.
- `python3 .github/scripts/sync-zh-hans-content.py --check`: 85 physical Simplified pages and manifest mirrors passed.
- `python3 scripts/verify-jiajia-hearing-qualifiers.py`: 27 checks passed.
- `python3 scripts/test-hk-nginx-isolation.py`: passed.
- `git diff --check`: passed.

These are source/local checks, not proof of production deployment. Replacement PR CI and post-merge regional deployment results must be distinguished from these checks.
