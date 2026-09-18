#!/usr/bin/env bash
# Mirrors public/media to the Cloudflare R2 bucket. Run by the pre-push hook on
# every push, and by hand with: npm run media:sync
#
# Only git-tracked files go up (never the HEIC/MOV originals or .DS_Store that
# sit beside them on disk), and anything in the bucket that git no longer
# tracks is deleted, so the bucket is always exactly the repo.
#
# Needs rclone with an S3 remote for the Cloudflare account (default name "r2").
# Every object is uploaded as immutable for a year; that is safe because every
# URL carries ?v=<manifest hash> (lib/media.ts). The manifest itself is the one
# object that is never cached, so the build can always check it.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

REMOTE="${R2_RCLONE_REMOTE:-r2}"
BUCKET="${R2_BUCKET:-finbar-studio-images}"
DRY=""; [ "${1:-}" = "--dry-run" ] && DRY="--dry-run"

command -v rclone >/dev/null || { echo "✖ rclone is not installed (brew install rclone)"; exit 1; }
rclone listremotes | grep -qx "${REMOTE}:" || { echo "✖ rclone has no remote called '${REMOTE}'. See AGENTS.md, The media rule."; exit 1; }

node scripts/media-manifest.mjs --check

LIST="$(mktemp)"; trap 'rm -f "$LIST"' EXIT
git ls-files -z -- public/media | tr '\0' '\n' \
  | grep -vE '(^|/)(\.DS_Store|\.gitignore|README\.md)$' \
  | sed 's#^public/media/##' > "$LIST"

echo "→ syncing $(wc -l < "$LIST" | tr -d ' ') files to ${REMOTE}:${BUCKET}"
rclone sync public/media "${REMOTE}:${BUCKET}" $DRY \
  --files-from-raw "$LIST" --delete-excluded \
  --checksum --fast-list --transfers 32 --checkers 64 \
  --header-upload "Cache-Control: public, max-age=31536000, immutable" \
  --stats 15s --stats-one-line

[ -n "$DRY" ] && exit 0
# Last, and unconditionally: a same-size manifest would be skipped by a sync.
rclone copyto content/media-manifest.json "${REMOTE}:${BUCKET}/manifest.json" \
  --ignore-times --header-upload "Cache-Control: no-cache"
echo "✓ bucket matches the repo ($(node -p "require('./content/media-manifest.json').hash"))"
