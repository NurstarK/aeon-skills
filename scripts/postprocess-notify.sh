#!/usr/bin/env bash
# postprocess-notify.sh — Relay staged notification payloads via ./notify after Claude finishes.
# Called automatically by the workflow via: bash scripts/postprocess-notify.sh
# Sandbox note: Claude's Bash tool has a static analyzer that rejects arguments containing
# a newline immediately followed by '#' (Markdown headings), and rejects command
# substitution — so multi-line Markdown messages cannot be passed to ./notify inline.
# This post-run step runs in the real workflow shell (no analyzer, full env), so the send
# happens here: each file in .pending-notify/ is relayed verbatim, then removed.
set -euo pipefail

PENDING_DIR=".pending-notify"

if [ ! -d "$PENDING_DIR" ] || [ -z "$(ls -A "$PENDING_DIR" 2>/dev/null)" ]; then
  exit 0
fi

for payload in "$PENDING_DIR"/*; do
  [ -f "$payload" ] || continue
  echo "postprocess-notify: relaying $(basename "$payload")"
  ./notify "$(cat "$payload")"
  rm -f "$payload"
done
