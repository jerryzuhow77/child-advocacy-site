#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'EOF'
Usage:
  deploy_archive_merge_only.sh --app-dir /absolute/current/app/path \
    --package-dir /absolute/package/path [--execute]

Default mode is read-only dry-run. --execute applies only when both patches apply
cleanly, the Git worktree is clean, and CONFIRM_GLOBAL_PROTECTION_DEPLOY=YES.
The script builds the app but does not restart production services.
EOF
}

APP_DIR=""
PACKAGE_DIR=""
EXECUTE=false
while (($#)); do
  case "$1" in
    --app-dir) APP_DIR="${2:-}"; shift 2 ;;
    --package-dir) PACKAGE_DIR="${2:-}"; shift 2 ;;
    --execute) EXECUTE=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 2 ;;
  esac
done

[[ -n "$APP_DIR" && -n "$PACKAGE_DIR" ]] || { usage; exit 2; }
APP_DIR="$(cd "$APP_DIR" && pwd -P)"
PACKAGE_DIR="$(cd "$PACKAGE_DIR" && pwd -P)"
COMPONENT_PATCH="$PACKAGE_DIR/patches/guardian-wall.archive.patch"
CSS_PATCH="$PACKAGE_DIR/patches/globals.archive.patch"

if [[ ! -f "$COMPONENT_PATCH" || ! -f "$CSS_PATCH" ]]; then
  [[ -x "$PACKAGE_DIR/restore_patches.sh" || -f "$PACKAGE_DIR/restore_patches.sh" ]] || {
    echo 'Patch files are absent and restore_patches.sh was not found.' >&2
    exit 3
  }
  bash "$PACKAGE_DIR/restore_patches.sh"
fi

for f in "$COMPONENT_PATCH" "$CSS_PATCH" "$APP_DIR/components/guardian-wall.tsx" "$APP_DIR/app/globals.css"; do
  [[ -f "$f" ]] || { echo "Required file missing: $f" >&2; exit 3; }
done

cd "$APP_DIR"
command -v git >/dev/null || { echo 'git is required' >&2; exit 3; }
command -v patch >/dev/null || { echo 'patch is required' >&2; exit 3; }
git rev-parse --is-inside-work-tree >/dev/null
[[ -z "$(git status --porcelain)" ]] || { echo 'Abort: production worktree has uncommitted changes.' >&2; exit 4; }

printf 'Current commit: '; git rev-parse HEAD
printf 'Current branch: '; git branch --show-current
printf 'App directory: %s\nPackage directory: %s\n' "$APP_DIR" "$PACKAGE_DIR"
patch --dry-run -p1 < "$COMPONENT_PATCH"
patch --dry-run -p1 < "$CSS_PATCH"
echo 'Patch dry-run passed. No database migration is included.'

if [[ "$EXECUTE" != true ]]; then
  echo 'Dry-run complete; production was not modified.'
  exit 0
fi
[[ "${CONFIRM_GLOBAL_PROTECTION_DEPLOY:-}" == 'YES' ]] || { echo 'Abort: set CONFIRM_GLOBAL_PROTECTION_DEPLOY=YES.' >&2; exit 5; }

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_BRANCH="backup/global-protection-before-archive-${STAMP}"
FEATURE_BRANCH="feature/global-protection-archive-${STAMP}"
git branch "$BACKUP_BRANCH" HEAD
git switch -c "$FEATURE_BRANCH"

rollback() {
  rc=$?
  if ((rc != 0)); then git reset --hard "$BACKUP_BRANCH" >/dev/null 2>&1 || true; fi
  exit "$rc"
}
trap rollback EXIT

patch -p1 < "$COMPONENT_PATCH"
patch -p1 < "$CSS_PATCH"
git diff --check
if [[ -f pnpm-lock.yaml ]] && command -v pnpm >/dev/null; then
  pnpm install --frozen-lockfile && pnpm run build
elif [[ -f yarn.lock ]] && command -v yarn >/dev/null; then
  yarn install --frozen-lockfile && yarn build
elif command -v npm >/dev/null; then
  if [[ -f package-lock.json ]]; then npm ci; else npm install; fi
  npm run build
else
  echo 'No supported Node package manager is available.' >&2
  exit 6
fi

git add components/guardian-wall.tsx app/globals.css
git commit -m 'Add guardian archive and old-post rediscovery'
trap - EXIT
echo "Build passed on $FEATURE_BRANCH; backup is $BACKUP_BRANCH."
echo 'No production service was restarted.'
