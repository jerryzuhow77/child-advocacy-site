#!/usr/bin/env bash
set -Eeuo pipefail

RELEASE_ID="global-protection-jungein-prologue-hd-audio-20260829-v2"
RAW_BASE="${RAW_BASE:-https://raw.githubusercontent.com/jerryzuhow77/child-advocacy-site/ops/jungein-hd-release-20260829-v2/handoffs/jungein-hd-release-20260829-v2/generated}"
APP_ROOT="${APP_ROOT:-/opt/global-protection}"
CLIENT_ROOT="${CLIENT_ROOT:-$APP_ROOT/dist/client}"
ASSET_DIR="$CLIENT_ROOT/assets"
BACKUP_ROOT="${BACKUP_ROOT:-$APP_ROOT/backups}"
DRY_RUN="${DRY_RUN:-0}"
CONFIRM_PRODUCTION="${CONFIRM_PRODUCTION:-NO}"
RUN_HTTP_CHECK="${RUN_HTTP_CHECK:-1}"
HEALTHCHECK_ORIGIN="${HEALTHCHECK_ORIGIN:-http://127.0.0.1:8787}"

JS_NAME="page-CXpiX5_u.js"
CSS_NAME="index-C4x89g2N.css"
VIDEO_NAME="jungein-prologue-hd-20260829.mp4"
POSTER_NAME="jungein-prologue-hd-poster-20260829.webp"
ORIGINAL_JS_SHA="f3042267b8c4c517d8e24cf3d95e910f0ab1f6b1b95d92eb543540b38dd41a81"
ORIGINAL_CSS_SHA="9ddfef636e0ebc054af60502a3a0c02e009a96be527285e091cf403382011628"
MARKER="global-protection-jungein-prologue-hd-audio-20260829"

TARGET_JS="$ASSET_DIR/$JS_NAME"
TARGET_CSS="$ASSET_DIR/$CSS_NAME"
TARGET_VIDEO="$CLIENT_ROOT/$VIDEO_NAME"
TARGET_POSTER="$CLIENT_ROOT/$POSTER_NAME"
TMP="$(mktemp -d)"
BACKUP_DIR=""
DEPLOY_STARTED=0
VIDEO_EXISTED=0
POSTER_EXISTED=0

log(){ printf '[%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
sha(){ sha256sum -- "$1" | awk '{print $1}'; }
die(){ log "ERROR: $*" >&2; return 1; }
cleanup(){ rm -rf "$TMP"; }
rollback(){
  local rc=$?
  trap - ERR INT TERM
  set +e
  if [[ "$DEPLOY_STARTED" == 1 && -n "$BACKUP_DIR" ]]; then
    log "Failure detected; restoring $BACKUP_DIR"
    cp -a "$BACKUP_DIR/assets/$JS_NAME" "$TARGET_JS"
    cp -a "$BACKUP_DIR/assets/$CSS_NAME" "$TARGET_CSS"
    [[ "$VIDEO_EXISTED" == 1 ]] && cp -a "$BACKUP_DIR/media/$VIDEO_NAME" "$TARGET_VIDEO" || rm -f "$TARGET_VIDEO"
    [[ "$POSTER_EXISTED" == 1 ]] && cp -a "$BACKUP_DIR/media/$POSTER_NAME" "$TARGET_POSTER" || rm -f "$TARGET_POSTER"
    sync
    log "Rollback completed"
  fi
  cleanup
  exit "$rc"
}
trap rollback ERR INT TERM

for cmd in curl sha256sum awk grep cp mv rm mkdir mktemp date sync; do
  command -v "$cmd" >/dev/null 2>&1 || die "Missing command: $cmd"
done
for file in "$TARGET_JS" "$TARGET_CSS"; do [[ -f "$file" ]] || die "Missing production file: $file"; done

log "Downloading verified HD release payload"
for name in MANIFEST.sha256 "$JS_NAME" "$CSS_NAME" "$VIDEO_NAME" "$POSTER_NAME"; do
  curl -fsSL --retry 4 --retry-all-errors --max-time 180 "$RAW_BASE/$name?fetch=$(date +%s)" -o "$TMP/$name"
done
(cd "$TMP" && sha256sum -c MANIFEST.sha256)
grep -Fq "$MARKER" "$TMP/$JS_NAME" || die "HD JS marker missing"
grep -Fq "$MARKER" "$TMP/$CSS_NAME" || die "HD CSS marker missing"

PATCHED_JS_SHA="$(sha "$TMP/$JS_NAME")"
PATCHED_CSS_SHA="$(sha "$TMP/$CSS_NAME")"
VIDEO_SHA="$(sha "$TMP/$VIDEO_NAME")"
POSTER_SHA="$(sha "$TMP/$POSTER_NAME")"
CURRENT_JS_SHA="$(sha "$TARGET_JS")"
CURRENT_CSS_SHA="$(sha "$TARGET_CSS")"
CURRENT_VIDEO_SHA="missing"; [[ -f "$TARGET_VIDEO" ]] && CURRENT_VIDEO_SHA="$(sha "$TARGET_VIDEO")"
CURRENT_POSTER_SHA="missing"; [[ -f "$TARGET_POSTER" ]] && CURRENT_POSTER_SHA="$(sha "$TARGET_POSTER")"

log "Production preflight"
log "  current JS: $CURRENT_JS_SHA"
log "  current CSS: $CURRENT_CSS_SHA"
log "  current HD video: $CURRENT_VIDEO_SHA"
log "  current HD poster: $CURRENT_POSTER_SHA"
log "  payload JS: $PATCHED_JS_SHA"
log "  payload CSS: $PATCHED_CSS_SHA"
log "  payload video: $VIDEO_SHA"
log "  payload poster: $POSTER_SHA"

if [[ "$CURRENT_JS_SHA" == "$PATCHED_JS_SHA" && "$CURRENT_CSS_SHA" == "$PATCHED_CSS_SHA" && \
      "$CURRENT_VIDEO_SHA" == "$VIDEO_SHA" && "$CURRENT_POSTER_SHA" == "$POSTER_SHA" ]]; then
  log "Release already present; no files changed."
  cleanup
  trap - ERR INT TERM
  exit 0
fi
[[ "$CURRENT_JS_SHA" == "$ORIGINAL_JS_SHA" ]] || die "Unexpected current JS; refusing overwrite"
[[ "$CURRENT_CSS_SHA" == "$ORIGINAL_CSS_SHA" ]] || die "Unexpected current CSS; refusing overwrite"
[[ "$CURRENT_VIDEO_SHA" == "missing" || "$CURRENT_VIDEO_SHA" == "$VIDEO_SHA" ]] || die "Unknown HD video already exists"
[[ "$CURRENT_POSTER_SHA" == "missing" || "$CURRENT_POSTER_SHA" == "$POSTER_SHA" ]] || die "Unknown HD poster already exists"

if [[ "$DRY_RUN" == 1 ]]; then
  log "Dry-run passed. No files changed."
  cleanup
  trap - ERR INT TERM
  exit 0
fi
[[ "$CONFIRM_PRODUCTION" == "YES" ]] || die "Set CONFIRM_PRODUCTION=YES to deploy"

STAMP="$(date -u +'%Y%m%dT%H%M%SZ')"
BACKUP_DIR="$BACKUP_ROOT/jungein-hd-audio-$STAMP"
mkdir -p "$BACKUP_DIR/assets" "$BACKUP_DIR/media"
cp -a "$TARGET_JS" "$BACKUP_DIR/assets/$JS_NAME"
cp -a "$TARGET_CSS" "$BACKUP_DIR/assets/$CSS_NAME"
if [[ -f "$TARGET_VIDEO" ]]; then cp -a "$TARGET_VIDEO" "$BACKUP_DIR/media/$VIDEO_NAME"; VIDEO_EXISTED=1; fi
if [[ -f "$TARGET_POSTER" ]]; then cp -a "$TARGET_POSTER" "$BACKUP_DIR/media/$POSTER_NAME"; POSTER_EXISTED=1; fi
cat > "$BACKUP_DIR/manifest.env" <<EOF
RELEASE_ID=$RELEASE_ID
CLIENT_ROOT=$CLIENT_ROOT
VIDEO_EXISTED=$VIDEO_EXISTED
POSTER_EXISTED=$POSTER_EXISTED
EOF
printf '%s\n' "$BACKUP_DIR" > "$BACKUP_ROOT/jungein-hd-audio-latest.txt"
log "Backup created: $BACKUP_DIR"

atomic_replace(){
  local src=$1 dst=$2 tmp
  tmp="$(mktemp --tmpdir="$(dirname "$dst")" ".$(basename "$dst").tmp.XXXXXX")"
  cp "$src" "$tmp"
  chmod --reference="$dst" "$tmp"
  chown --reference="$dst" "$tmp" 2>/dev/null || true
  mv -f "$tmp" "$dst"
}
atomic_install(){
  local src=$1 dst=$2 ref=$3 tmp
  tmp="$(mktemp --tmpdir="$(dirname "$dst")" ".$(basename "$dst").tmp.XXXXXX")"
  cp "$src" "$tmp"
  chmod 0644 "$tmp"
  chown --reference="$ref" "$tmp" 2>/dev/null || true
  mv -f "$tmp" "$dst"
}

DEPLOY_STARTED=1
atomic_replace "$TMP/$JS_NAME" "$TARGET_JS"
atomic_replace "$TMP/$CSS_NAME" "$TARGET_CSS"
atomic_install "$TMP/$VIDEO_NAME" "$TARGET_VIDEO" "$TARGET_CSS"
atomic_install "$TMP/$POSTER_NAME" "$TARGET_POSTER" "$TARGET_CSS"
sync
[[ "$(sha "$TARGET_JS")" == "$PATCHED_JS_SHA" ]] || die "On-disk JS verification failed"
[[ "$(sha "$TARGET_CSS")" == "$PATCHED_CSS_SHA" ]] || die "On-disk CSS verification failed"
[[ "$(sha "$TARGET_VIDEO")" == "$VIDEO_SHA" ]] || die "On-disk video verification failed"
[[ "$(sha "$TARGET_POSTER")" == "$POSTER_SHA" ]] || die "On-disk poster verification failed"

http_hash(){
  local path=$1 expected=$2 label=$3 file got
  file="$(mktemp)"
  curl -fsSL --retry 4 --retry-all-errors --max-time 180 "$HEALTHCHECK_ORIGIN$path?release=$STAMP" -o "$file"
  got="$(sha "$file")"
  rm -f "$file"
  [[ "$got" == "$expected" ]] || die "$label HTTP hash mismatch: $got"
  log "HTTP verified: $label"
}
if [[ "$RUN_HTTP_CHECK" == 1 ]]; then
  sleep 2
  curl -fsSL --retry 4 --max-time 60 "$HEALTHCHECK_ORIGIN/historical-cases/korea/jungein?skipIntro=1&release=$STAMP" >/dev/null
  http_hash "/assets/$JS_NAME" "$PATCHED_JS_SHA" "page JS"
  http_hash "/assets/$CSS_NAME" "$PATCHED_CSS_SHA" "stylesheet"
  http_hash "/$VIDEO_NAME" "$VIDEO_SHA" "HD prologue video"
  http_hash "/$POSTER_NAME" "$POSTER_SHA" "HD prologue poster"
fi

DEPLOY_STARTED=0
trap - ERR INT TERM
cleanup
log "DEPLOYMENT SUCCEEDED: $RELEASE_ID"
log "Rollback backup: $BACKUP_DIR"
