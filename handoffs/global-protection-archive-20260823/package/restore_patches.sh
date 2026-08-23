#!/usr/bin/env bash
set -Eeuo pipefail

PACKAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
PARTS_DIR="$PACKAGE_DIR/patch-parts"
PATCHES_DIR="$PACKAGE_DIR/patches"
mkdir -p "$PATCHES_DIR"

restore_one() {
  local name="$1"
  local expected="$2"
  local output="$PATCHES_DIR/$name"
  local parts=("$PARTS_DIR/$name.part-"*)

  [[ -e "${parts[0]}" ]] || { echo "Missing payload parts for $name" >&2; exit 3; }
  cat "${parts[@]}" | base64 -d | gzip -dc > "$output"
  local actual
  actual="$(sha256sum "$output" | awk '{print $1}')"
  [[ "$actual" == "$expected" ]] || {
    echo "Checksum mismatch for $name: expected $expected, got $actual" >&2
    rm -f "$output"
    exit 4
  }
  printf 'Restored %s (%s)\n' "$output" "$actual"
}

restore_one "guardian-wall.archive.patch" "05b1a742ccb782eb92e5fbca199d4a60eef28ed1391628d0175f5a725f37eeca"
restore_one "globals.archive.patch" "5b9a335bd5d58bff7be6c8132174f1eed2bbaad461f64c7fb9a2883fcd2f7820"

echo 'Both repository-relative patches were restored and verified.'
