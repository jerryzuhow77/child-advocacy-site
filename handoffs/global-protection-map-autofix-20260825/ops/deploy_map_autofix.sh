#!/usr/bin/env bash
set -Eeuo pipefail

PATCH_ID="global-protection-map-autofix-20260825"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
MODE="dry-run"
SITE="auto"
APP_DIR=""
PURGE_CACHE="auto"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

log() { printf '[map-autofix] %s\n' "$*"; }
warn() { printf '[map-autofix] WARNING: %s\n' "$*" >&2; }
die() { printf '[map-autofix] ERROR: %s\n' "$*" >&2; exit 1; }
usage() {
  cat <<'EOF'
Usage:
  deploy_map_autofix.sh [--site auto|tw|hk] [--app-dir DIR] [--execute]
                         [--purge-cache auto|yes|no]

Default mode is read-only dry-run. Use --execute only after the dry-run identifies
exactly one JS and one CSS target per site.

Cloudflare cache purge (optional):
  CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID_TW=... \
  CLOUDFLARE_ZONE_ID_HK=... sudo -E bash ops/deploy_map_autofix.sh --execute

The token is never printed. CLOUDFLARE_ZONE_ID is accepted as a fallback for either site.
EOF
}

while (($#)); do
  case "$1" in
    --execute) MODE="execute"; shift ;;
    --site) SITE="${2:-}"; shift 2 ;;
    --app-dir) APP_DIR="${2:-}"; shift 2 ;;
    --purge-cache) PURGE_CACHE="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown argument: $1" ;;
  esac
done
[[ "$SITE" =~ ^(auto|tw|hk)$ ]] || die "--site must be auto, tw, or hk"
[[ "$PURGE_CACHE" =~ ^(auto|yes|no)$ ]] || die "--purge-cache must be auto, yes, or no"
[[ -z "$APP_DIR" || -d "$APP_DIR" ]] || die "--app-dir does not exist: $APP_DIR"
command -v sha256sum >/dev/null || die "sha256sum is required"
command -v node >/dev/null || die "node is required for JavaScript syntax verification"

# Live filenames and integrity anchors captured read-only on 2026-08-25.
declare -A JS_NAME CSS_NAME JS_ORIGINAL CSS_ORIGINAL JS_PATCHED CSS_PATCHED DOMAIN
JS_NAME[tw]="guardian-wall-D4pS1Kwy.js"
CSS_NAME[tw]="index-1prVp_H8.css"
JS_ORIGINAL[tw]="010d6fd66c40c0e1247980a944792718c2c97f9437fc1b47b58d0557e35c2fbf"
CSS_ORIGINAL[tw]="5afbe1fcbfc606a23a4ea79fca43047b29bfca8ad0f7dfb5b759fd2f84c9a2a0"
JS_PATCHED[tw]="1df97e33c6f583cb81d6530b4510fa0721bb9fb81f2e62c882b4784e256792b8"
CSS_PATCHED[tw]="24451637a662b738ddc412c2823dcb18e4620bb65329ca592b4edfd1f13b6ac3"
DOMAIN[tw]="global-protection.jerryzuhow77.chatgpt.site"

JS_NAME[hk]="guardian-wall-2CHQLdmM.js"
CSS_NAME[hk]="index-CA0ym-VZ.css"
JS_ORIGINAL[hk]="03fc9fc35842cb683232f001ca1301988dcc01a1a1a614e8ec45ada13184a3cf"
CSS_ORIGINAL[hk]="0253e679100042694f818d74aaee4685cb1ff832712060d1b8e57d3133fe6224"
JS_PATCHED[hk]="a3df847cdfe8c360fe8bca16ad80d0977036b1aea34ca7b58a2f20850565c98c"
CSS_PATCHED[hk]="44599172f03721d477742123a6b3a0cac77d0cfff68d6a23daf952ecf6418457"
DOMAIN[hk]="cn.globalprotectionwall.com"

sha() { sha256sum "$1" | awk '{print $1}'; }

search_roots() {
  if [[ -n "$APP_DIR" ]]; then
    printf '%s\n' "$APP_DIR"
  else
    for root in /opt /srv /var/www /home/ubuntu; do
      [[ -d "$root" ]] && printf '%s\n' "$root"
    done
  fi
}

find_exact() {
  local name="$1" root
  while IFS= read -r root; do
    find "$root" \
      \( -path '*/node_modules' -o -path '*/.git' -o -path '*/.cache' -o \
         -path '*/.next/cache' -o -path '*/.map-autofix-backups' -o \
         -path '*/Global-Protection_Map-Autofix_20260825' \) -prune -o \
      -type f -name "$name" -print 2>/dev/null
  done < <(search_roots)
}

select_single_target() {
  local name="$1" kind="$2" site="$3"
  local -a found=()
  mapfile -t found < <(find_exact "$name" | sort -u)
  if ((${#found[@]} == 0)); then
    return 1
  fi
  if ((${#found[@]} > 1)); then
    warn "$site $kind has multiple candidates:"
    printf '  %s\n' "${found[@]}" >&2
    die "Re-run with --app-dir set to the exact deployed application directory."
  fi
  printf '%s\n' "${found[0]}"
}

check_target() {
  local file="$1" expected_original="$2" expected_patched="$3" kind="$4"
  local actual
  actual="$(sha "$file")"
  if [[ "$actual" == "$expected_patched" ]]; then
    grep -q "$PATCH_ID" "$file" || die "$kind has patched SHA but patch marker is missing: $file"
    printf 'patched\n'
    return 0
  fi
  [[ "$actual" == "$expected_original" ]] || die \
    "$kind SHA is neither the captured original nor the verified patch: $file ($actual)"
  if [[ "$kind" == "JS" ]]; then
    grep -q 'paper-globe-texture-v2.png' "$file" || die "Globe texture anchor missing: $file"
    grep -q 'region-map-mark' "$file" || die "Marker anchor missing: $file"
    grep -q 'map-stage' "$file" || die "Map-stage anchor missing: $file"
  else
    grep -q 'map-stage' "$file" || die "Map-stage CSS anchor missing: $file"
    grep -q 'region-map-mark' "$file" || die "Marker CSS anchor missing: $file"
  fi
  printf 'original\n'
}

replace_atomically() {
  local target="$1" source="$2" kind="$3"
  local dir tmp
  dir="$(dirname "$target")"
  [[ -w "$target" && -w "$dir" ]] || [[ ${EUID:-$(id -u)} -eq 0 ]] || \
    die "No write permission for $target. Re-run the verified command with sudo."
  tmp="$(mktemp "$dir/.${PATCH_ID}.${kind}.XXXXXX.js")"
  cp -p -- "$target" "$tmp"
  cat -- "$source" > "$tmp"
  touch -r "$target" "$tmp" 2>/dev/null || true
  if [[ "$kind" == "JS" ]]; then
    node --check "$tmp" >/dev/null
  fi
  mv -f -- "$tmp" "$target"
}

refresh_precompressed() {
  local target="$1" tmp
  if [[ -e "$target.gz" ]]; then
    if command -v gzip >/dev/null; then
      tmp="$target.gz.${STAMP}.tmp"; gzip -9 -c "$target" > "$tmp"; mv -f "$tmp" "$target.gz"
    else
      warn "gzip unavailable; removing stale $target.gz"
      rm -f "$target.gz"
    fi
  fi
  if [[ -e "$target.br" ]]; then
    if command -v brotli >/dev/null; then
      tmp="$target.br.${STAMP}.tmp"; brotli -q 11 -c "$target" > "$tmp"; mv -f "$tmp" "$target.br"
    else
      warn "brotli unavailable; removing stale $target.br"
      rm -f "$target.br"
    fi
  fi
}

verify_public_assets() {
  local site="$1" js_name="$2" css_name="$3"
  if ! command -v curl >/dev/null; then
    warn "curl unavailable; skipping public asset verification for ${DOMAIN[$site]}."
    return 0
  fi
  local nonce js_url css_url js_body css_body
  nonce="$(date +%s)"
  js_url="https://${DOMAIN[$site]}/assets/${js_name}?map-autofix=${nonce}"
  css_url="https://${DOMAIN[$site]}/assets/${css_name}?map-autofix=${nonce}"
  js_body="$(mktemp)"; css_body="$(mktemp)"
  if curl -fsSL --retry 3 --retry-delay 2 --connect-timeout 10 --max-time 45 "$js_url" -o "$js_body" \
    && curl -fsSL --retry 3 --retry-delay 2 --connect-timeout 10 --max-time 45 "$css_url" -o "$css_body" \
    && grep -q "$PATCH_ID" "$js_body" && grep -q "$PATCH_ID" "$css_body"; then
    log "Public cache-busted asset verification passed for ${DOMAIN[$site]}."
  else
    warn "Local files are verified, but the public edge has not yet served the patch for ${DOMAIN[$site]}."
    warn "Purge CDN cache, then run this script again in --execute mode (it is idempotent)."
  fi
  rm -f "$js_body" "$css_body"
}

purge_cloudflare() {
  local site="$1" js_name="$2" css_name="$3"
  [[ "$PURGE_CACHE" != "no" ]] || return 0
  local token="${CLOUDFLARE_API_TOKEN:-}" zone=""
  if [[ "$site" == "tw" ]]; then zone="${CLOUDFLARE_ZONE_ID_TW:-${CLOUDFLARE_ZONE_ID:-}}"; fi
  if [[ "$site" == "hk" ]]; then zone="${CLOUDFLARE_ZONE_ID_HK:-${CLOUDFLARE_ZONE_ID:-}}"; fi
  if [[ -z "$token" || -z "$zone" ]]; then
    [[ "$PURGE_CACHE" == "yes" ]] && die "Cache purge requested but Cloudflare token/zone ID is missing."
    warn "Cloudflare credentials not supplied; edge cache was not purged for ${DOMAIN[$site]}."
    warn "Because the hotfix replaces existing hashed assets in place, purge those two asset URLs before final verification."
    return 0
  fi
  command -v curl >/dev/null || die "curl is required for cache purge"
  local body result
  body="$(printf '{\"files\":[\"https://%s/assets/%s\",\"https://%s/assets/%s\"]}' \
    "${DOMAIN[$site]}" "$js_name" "${DOMAIN[$site]}" "$css_name")"
  result="$(curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/$zone/purge_cache" \
    -H "Authorization: Bearer $token" -H 'Content-Type: application/json' --data "$body")" || \
    die "Cloudflare cache purge request failed for ${DOMAIN[$site]}"
  printf '%s' "$result" | grep -q '"success":true' || die "Cloudflare did not confirm cache purge for ${DOMAIN[$site]}"
  log "Cloudflare edge cache purged for ${DOMAIN[$site]} (token not printed)."
}

process_site() {
  local site="$1"
  local source_js="$PACKAGE_ROOT/assets/$site/${JS_NAME[$site]}"
  local source_css="$PACKAGE_ROOT/assets/$site/${CSS_NAME[$site]}"
  [[ -f "$source_js" && -f "$source_css" ]] || die "Package assets missing for $site"
  [[ "$(sha "$source_js")" == "${JS_PATCHED[$site]}" ]] || die "Packaged JS integrity mismatch for $site"
  [[ "$(sha "$source_css")" == "${CSS_PATCHED[$site]}" ]] || die "Packaged CSS integrity mismatch for $site"
  node --check "$source_js" >/dev/null

  local target_js target_css state_js state_css
  target_js="$(select_single_target "${JS_NAME[$site]}" JS "$site")" || die "$site JS target not found"
  target_css="$(select_single_target "${CSS_NAME[$site]}" CSS "$site")" || die "$site CSS target not found"
  state_js="$(check_target "$target_js" "${JS_ORIGINAL[$site]}" "${JS_PATCHED[$site]}" JS)"
  state_css="$(check_target "$target_css" "${CSS_ORIGINAL[$site]}" "${CSS_PATCHED[$site]}" CSS)"

  log "$site target JS : $target_js ($state_js)"
  log "$site target CSS: $target_css ($state_css)"
  log "$site safety scope: static JS/CSS only; no database, API, auth, moderation, or integration files."

  if [[ "$MODE" == "dry-run" ]]; then
    log "$site dry-run passed. Re-run with --execute to back up and replace these exact files."
    return 0
  fi
  if [[ "$state_js" == "patched" && "$state_css" == "patched" ]]; then
    log "$site is already patched; no file replacement needed."
    purge_cloudflare "$site" "${JS_NAME[$site]}" "${CSS_NAME[$site]}"
    verify_public_assets "$site" "${JS_NAME[$site]}" "${CSS_NAME[$site]}"
    return 0
  fi

  local common_parent backup_dir
  common_parent="$(dirname "$(dirname "$target_js")")"
  backup_dir="$common_parent/.map-autofix-backups/${STAMP}-${site}"
  mkdir -p "$backup_dir"
  cp -a -- "$target_js" "$backup_dir/${JS_NAME[$site]}.before"
  cp -a -- "$target_css" "$backup_dir/${CSS_NAME[$site]}.before"
  printf '%s\n' "$target_js" > "$backup_dir/target-js.path"
  printf '%s\n' "$target_css" > "$backup_dir/target-css.path"

  replace_atomically "$target_js" "$source_js" JS
  replace_atomically "$target_css" "$source_css" CSS
  refresh_precompressed "$target_js"
  refresh_precompressed "$target_css"

  [[ "$(sha "$target_js")" == "${JS_PATCHED[$site]}" ]] || die "$site JS post-write verification failed"
  [[ "$(sha "$target_css")" == "${CSS_PATCHED[$site]}" ]] || die "$site CSS post-write verification failed"
  grep -q "$PATCH_ID" "$target_js" || die "$site JS patch marker verification failed"
  grep -q "$PATCH_ID" "$target_css" || die "$site CSS patch marker verification failed"
  node --check "$target_js" >/dev/null

  cat > "$backup_dir/ROLLBACK.sh" <<EOF
#!/usr/bin/env bash
set -Eeuo pipefail
cp -a -- '$backup_dir/${JS_NAME[$site]}.before' '$target_js'
cp -a -- '$backup_dir/${CSS_NAME[$site]}.before' '$target_css'
printf 'Rolled back $site map hotfix from $backup_dir\n'
EOF
  chmod 700 "$backup_dir/ROLLBACK.sh"
  log "$site replacement and local integrity verification passed."
  log "$site rollback: sudo '$backup_dir/ROLLBACK.sh'"
  purge_cloudflare "$site" "${JS_NAME[$site]}" "${CSS_NAME[$site]}"
  verify_public_assets "$site" "${JS_NAME[$site]}" "${CSS_NAME[$site]}"
}

log "Mode: $MODE; site: $SITE; app-dir: ${APP_DIR:-automatic search}"
log "Package root: $PACKAGE_ROOT"
processed=0
if [[ "$SITE" == "auto" || "$SITE" == "tw" ]]; then
  process_site tw
  processed=$((processed + 1))
fi
if [[ "$SITE" == "auto" || "$SITE" == "hk" ]]; then
  process_site hk
  processed=$((processed + 1))
fi
((processed > 0)) || die "No matching deployed target was found. Connect the authorized host or pass --app-dir."
if [[ "$MODE" == "dry-run" ]]; then
  log "Dry-run complete: $processed site target(s) verified; production was not changed."
else
  log "Execution complete: $processed site target(s) verified after write."
  log "Final browser checks: map remains visible; marker click selects GB/TW/CN; selector counts 1/8/5; clear returns 16."
fi
