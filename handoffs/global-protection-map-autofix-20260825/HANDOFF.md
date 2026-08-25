# Global Protection Map Autofix · 2026-08-25

## Status

- Repair assets and an idempotent deployment package are complete.
- Browser regression validation: PASS.
- Static integrity and syntax validation: PASS.
- Production write: **not yet executed**. At package time, both authorized Desktop Commander devices were offline and no SSH or cloud deployment secret was available in this repository.
- The read-only probe workflows on this branch did not mutate production, DNS, data, accounts, moderation, or integrations.

## User-visible fixes

1. Keep the large desktop paper globe visible instead of flashing and disappearing after hydration.
2. Clicking a glowing marker immediately reuses the existing React region state to filter message cards and counts.
3. Add an accessible region selector immediately after search; marker, selector, clear chip, and message count stay synchronized.
4. Calibrate London to the paper texture's effective coordinate `x=102, y=163`.
5. Expand the marker hit target to SVG radius 30 for mouse and touch use.

## Root cause

The live client bundle includes `.map-stage` in a generic GSAP reveal that initializes elements with `autoAlpha: 0`. If ScrollTrigger misses or recalculates its threshold during initial layout/sticky-header setup, server-rendered content briefly appears and is then hidden by client initialization.

The original marker click handler and message filter already supported region filtering, but there was no explicit selector showing the active region. London's old effective position was around `252,175`, which lands in Central Asia on the artistic paper texture.

## Public snapshot used for validation

- Total public messages: 16.
- Mapped lights: GB/London 1, TW 8, CN 5.
- Hidden or unmapped: 2.
- TW client assets captured read-only:
  - `/assets/guardian-wall-D4pS1Kwy.js`
  - `/assets/index-1prVp_H8.css`
- HK client assets captured read-only:
  - `/assets/guardian-wall-2CHQLdmM.js`
  - `/assets/index-CA0ym-VZ.css`

## Canonical package

Persistent Library path:

`/Sites/Global-Protection/Global-Protection_Map-Autofix_20260825.zip`

ZIP SHA-256:

`6845fe41cb98ca65154da82ac01f7f581cc86c312397938590b6ffe691cac4da`

The package contains patched TW/HK assets, dry-run-by-default deployment and rollback automation, desktop/mobile screenshots, public snapshots, integrity manifests, an offline Playwright regression harness, and permanent source-rebuild guidance.

## Authorized-host deployment

After materializing the package on the authorized origin host:

```bash
bash ops/deploy_map_autofix.sh --site auto
```

The dry run searches only for the exact live filenames and verifies captured original SHA-256 values. It aborts on ambiguous candidates.

After the detected paths are confirmed:

```bash
sudo bash ops/deploy_map_autofix.sh \
  --site auto \
  --app-dir /actual/deployed/application \
  --execute
```

The script creates timestamped backups, performs same-directory atomic replacement, runs JavaScript syntax checks, refreshes or removes stale `.gz`/`.br` assets, verifies patched SHA values and markers, generates `ROLLBACK.sh`, and attempts cache-busted public-edge verification.

For immediate edge delivery, provide Cloudflare token/zone IDs through environment variables or purge the two asset URLs in the authorized control plane. Secrets are never printed.

Post-deploy read-only check:

```bash
python3 ops/verify_live_after_deploy.py --site auto
```

## Safety boundary

The hotfix changes only the two existing JavaScript/CSS static assets per site. It does not change messages, database state, API routes, authentication, email, moderation, review queues, cross-region synchronization, DNS, TLS, or environment variables.

Do not deploy the structural client-only reference patch. It is preserved only as analysis evidence because changing client JSX without rebuilding the server render would create a hydration mismatch.

## Permanent source rebuild

The long-term implementation should remove `.map-stage` from generic `autoAlpha:0` reveal initialization, bind a source-level region `<select>` directly to the existing selected-region state, write London's calibrated coordinate into region metadata, add a transparent hit circle in marker JSX, and rebuild server/client bundles together with new hashes.