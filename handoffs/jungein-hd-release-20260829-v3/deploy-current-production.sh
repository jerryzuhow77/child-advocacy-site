#!/usr/bin/env bash
set -Eeuo pipefail

RELEASE_ID="global-protection-jungein-prologue-hd-audio-20260829-v3"
PINNED_PAYLOAD="8402771625c14254fb67a18ec4c8e9bf1d411192"
RAW_BASE="https://raw.githubusercontent.com/jerryzuhow77/child-advocacy-site/${PINNED_PAYLOAD}/handoffs/jungein-hd-release-20260829-v3/generated"
APP="${APP:-/opt/global-protection}"
CLIENT="$APP/dist/client"
ASSETS="$CLIENT/assets"
JS_NAME="page-CXpiX5_u.js"
CSS_NAME="index-6Q3hBOgO.css"
VIDEO_NAME="jungein-prologue-hd-20260829.mp4"
POSTER_NAME="jungein-prologue-hd-poster-20260829.webp"
SOURCE_JS_SHA="a1654892a294c6f94422881f3b9c4f3e78133deadc94641cfebe66b9856743ed"
SOURCE_CSS_SHA="359dc736190407f3b0e972ff23e5585498d0137d13792ed0ea70d2d2b0ad2ff9"
TARGET_JS_SHA="404d67dc2046f374da81218196a164d82fc6f964406c07ae58ed4058fde90450"
TARGET_CSS_SHA="1ac7a89022098aeb29522bc1e8d0888536462936f2317ebd4b9f1bf77f87f0b4"
VIDEO_SHA="0baf83f177a1abc282cce6bd66838e1fc75c0c4be8322df49cc6261dfc36bf90"
POSTER_SHA="742499e4f8d4bcda9979e0ad0b4484b1e8c21f155228979bb8536fd226c231ad"
MARKER="global-protection-jungein-prologue-hd-audio-20260829"
TARGET_JS="$ASSETS/$JS_NAME"
TARGET_CSS="$ASSETS/$CSS_NAME"
TARGET_VIDEO="$CLIENT/$VIDEO_NAME"
TARGET_POSTER="$CLIENT/$POSTER_NAME"
TMP="$(mktemp -d)"
STAMP="$(date -u +'%Y%m%dT%H%M%SZ')"
BACKUP_ROOT="$APP/.release-backups"
BACKUP="$BACKUP_ROOT/jungein-hd-v3-$STAMP"
CHANGED=0
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
  if [[ "$CHANGED" == 1 && -d "$BACKUP" ]]; then
    log "Failure detected; restoring $BACKUP"
    cp -a "$BACKUP/assets/$JS_NAME" "$TARGET_JS"
    cp -a "$BACKUP/assets/$CSS_NAME" "$TARGET_CSS"
    if [[ "$VIDEO_EXISTED" == 1 ]]; then
      cp -a "$BACKUP/media/$VIDEO_NAME" "$TARGET_VIDEO"
    else
      rm -f "$TARGET_VIDEO"
    fi
    if [[ "$POSTER_EXISTED" == 1 ]]; then
      cp -a "$BACKUP/media/$POSTER_NAME" "$TARGET_POSTER"
    else
      rm -f "$TARGET_POSTER"
    fi
    sync
    log "Rollback completed"
  fi
  cleanup
  exit "$rc"
}
trap rollback ERR INT TERM

for cmd in curl sha256sum awk grep cp mv rm mkdir mktemp date sync systemctl; do
  command -v "$cmd" >/dev/null 2>&1 || die "Missing command: $cmd"
done
[[ -f "$TARGET_JS" ]] || die "Missing production JS: $TARGET_JS"
[[ -f "$TARGET_CSS" ]] || die "Missing production CSS: $TARGET_CSS"

mkdir -p "$TMP/payload"
log "Downloading pinned verified payload $PINNED_PAYLOAD"
for name in MANIFEST.sha256 "$JS_NAME" "$CSS_NAME" "$VIDEO_NAME" "$POSTER_NAME"; do
  curl -fsSL --retry 4 --retry-all-errors --max-time 300 \
    "$RAW_BASE/$name?release=$STAMP" -o "$TMP/payload/$name"
done
(cd "$TMP/payload" && sha256sum -c MANIFEST.sha256)
grep -Fq "$MARKER" "$TMP/payload/$JS_NAME" || die "HD marker missing from payload JS"
grep -Fq "$MARKER" "$TMP/payload/$CSS_NAME" || die "HD marker missing from payload CSS"
grep -Fq "/$VIDEO_NAME" "$TMP/payload/$JS_NAME" || die "HD media path missing from payload JS"

CURRENT_JS_SHA="$(sha "$TARGET_JS")"
CURRENT_CSS_SHA="$(sha "$TARGET_CSS")"
CURRENT_VIDEO_SHA="missing"
CURRENT_POSTER_SHA="missing"
[[ -f "$TARGET_VIDEO" ]] && CURRENT_VIDEO_SHA="$(sha "$TARGET_VIDEO")"
[[ -f "$TARGET_POSTER" ]] && CURRENT_POSTER_SHA="$(sha "$TARGET_POSTER")"
log "Production preflight"
log "  current JS: $CURRENT_JS_SHA"
log "  current CSS: $CURRENT_CSS_SHA"
log "  current video: $CURRENT_VIDEO_SHA"
log "  current poster: $CURRENT_POSTER_SHA"

http_hash(){
  local origin=$1 path=$2 expected=$3 label=$4 file got
  file="$(mktemp)"
  curl -fsSL --retry 4 --retry-all-errors --max-time 180 \
    "$origin$path?verify=$STAMP" -o "$file"
  got="$(sha "$file")"
  rm -f "$file"
  [[ "$got" == "$expected" ]] || die "$label HTTP hash mismatch: $got"
  log "HTTP verified: $label"
}
verify_http(){
  local origin=$1 label=$2
  curl -fsSL --retry 4 --retry-all-errors --max-time 90 \
    "$origin/historical-cases/korea/jungein?skipIntro=1&verify=$STAMP" >/dev/null
  http_hash "$origin" "/assets/$JS_NAME" "$TARGET_JS_SHA" "$label page JS"
  http_hash "$origin" "/assets/$CSS_NAME" "$TARGET_CSS_SHA" "$label stylesheet"
  http_hash "$origin" "/$VIDEO_NAME" "$VIDEO_SHA" "$label HD video"
  http_hash "$origin" "/$POSTER_NAME" "$POSTER_SHA" "$label HD poster"
}

if [[ "$CURRENT_JS_SHA" == "$TARGET_JS_SHA" && "$CURRENT_CSS_SHA" == "$TARGET_CSS_SHA" && \
      "$CURRENT_VIDEO_SHA" == "$VIDEO_SHA" && "$CURRENT_POSTER_SHA" == "$POSTER_SHA" ]]; then
  log "Release already present; verifying without rewriting"
  verify_http "http://127.0.0.1:8787" "local"
  verify_http "https://cn.globalprotectionwall.com" "public"
  systemctl is-active global-protection.service
  cleanup
  trap - ERR INT TERM
  log "JUNGEIN_HD_RELEASE_ALREADY_PRESENT"
  exit 0
fi

[[ "$CURRENT_JS_SHA" == "$SOURCE_JS_SHA" ]] || die "Unexpected current JS; refusing overwrite"
[[ "$CURRENT_CSS_SHA" == "$SOURCE_CSS_SHA" ]] || die "Unexpected current CSS; refusing overwrite"
[[ "$CURRENT_VIDEO_SHA" == "missing" || "$CURRENT_VIDEO_SHA" == "$VIDEO_SHA" ]] || die "Unknown HD video already exists"
[[ "$CURRENT_POSTER_SHA" == "missing" || "$CURRENT_POSTER_SHA" == "$POSTER_SHA" ]] || die "Unknown HD poster already exists"
log "Dry-run passed. No unrelated asset will be changed."

mkdir -p "$BACKUP/assets" "$BACKUP/media"
cp -a "$TARGET_JS" "$BACKUP/assets/$JS_NAME"
cp -a "$TARGET_CSS" "$BACKUP/assets/$CSS_NAME"
if [[ -f "$TARGET_VIDEO" ]]; then
  cp -a "$TARGET_VIDEO" "$BACKUP/media/$VIDEO_NAME"
  VIDEO_EXISTED=1
fi
if [[ -f "$TARGET_POSTER" ]]; then
  cp -a "$TARGET_POSTER" "$BACKUP/media/$POSTER_NAME"
  POSTER_EXISTED=1
fi
cat > "$BACKUP/release.env" <<EOF
RELEASE_ID=$RELEASE_ID
SOURCE_JS_SHA=$SOURCE_JS_SHA
SOURCE_CSS_SHA=$SOURCE_CSS_SHA
TARGET_JS_SHA=$TARGET_JS_SHA
TARGET_CSS_SHA=$TARGET_CSS_SHA
VIDEO_EXISTED=$VIDEO_EXISTED
POSTER_EXISTED=$POSTER_EXISTED
EOF
log "Backup created: $BACKUP"

atomic_replace(){
  local src=$1 dst=$2 temp
  temp="$(mktemp "$(dirname "$dst")/.$(basename "$dst").tmp.XXXXXX")"
  cp "$src" "$temp"
  chmod --reference="$dst" "$temp"
  mv -f "$temp" "$dst"
}
atomic_install(){
  local src=$1 dst=$2 temp
  temp="$(mktemp "$(dirname "$dst")/.$(basename "$dst").tmp.XXXXXX")"
  cp "$src" "$temp"
  chmod 0644 "$temp"
  mv -f "$temp" "$dst"
}

CHANGED=1
atomic_replace "$TMP/payload/$JS_NAME" "$TARGET_JS"
atomic_replace "$TMP/payload/$CSS_NAME" "$TARGET_CSS"
atomic_install "$TMP/payload/$VIDEO_NAME" "$TARGET_VIDEO"
atomic_install "$TMP/payload/$POSTER_NAME" "$TARGET_POSTER"
sync
[[ "$(sha "$TARGET_JS")" == "$TARGET_JS_SHA" ]] || die "On-disk JS verification failed"
[[ "$(sha "$TARGET_CSS")" == "$TARGET_CSS_SHA" ]] || die "On-disk CSS verification failed"
[[ "$(sha "$TARGET_VIDEO")" == "$VIDEO_SHA" ]] || die "On-disk video verification failed"
[[ "$(sha "$TARGET_POSTER")" == "$POSTER_SHA" ]] || die "On-disk poster verification failed"

grep -Fq "$MARKER" "$TARGET_JS" || die "On-disk JS marker missing"
grep -Fq "$MARKER" "$TARGET_CSS" || die "On-disk CSS marker missing"
sleep 2
verify_http "http://127.0.0.1:8787" "local"
verify_http "https://cn.globalprotectionwall.com" "public"
systemctl is-active global-protection.service
mkdir -p "$BACKUP_ROOT"
printf '%s\n' "$BACKUP" > "$BACKUP_ROOT/jungein-hd-v3-latest.txt"
CHANGED=0
trap - ERR INT TERM
cleanup
log "JUNGEIN_HD_RELEASE_SUCCEEDED"
log "Rollback backup: $BACKUP"
