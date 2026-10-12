#!/usr/bin/env bash
# postprocess-resend.sh — Send pending morning-brief emails via Resend after Claude finishes.
# Called automatically by the workflow via: bash scripts/postprocess-resend.sh
# Sandbox note: env vars (RESEND_API_KEY, BRIEF_RECIPIENTS) are unavailable to Claude's
# bash but ARE available in this post-run step, so the actual send happens here.
set -euo pipefail

PENDING_DIR=".pending-resend"

if [ ! -d "$PENDING_DIR" ] || [ -z "$(ls -A "$PENDING_DIR" 2>/dev/null)" ]; then
  exit 0
fi

if [ -z "${RESEND_API_KEY:-}" ]; then
  echo "postprocess-resend: RESEND_API_KEY not set, skipping (leaving payloads for retry)"
  exit 0
fi

if [ -z "${BRIEF_RECIPIENTS:-}" ]; then
  echo "postprocess-resend: BRIEF_RECIPIENTS not set, skipping (leaving payloads for retry)"
  exit 0
fi

# Build a JSON array of recipient addresses from the comma-separated BRIEF_RECIPIENTS.
TO_JSON=$(printf '%s' "$BRIEF_RECIPIENTS" | jq -R -c 'split(",") | map(gsub("^\\s+|\\s+$";"")) | map(select(length > 0))')

for payload in "$PENDING_DIR"/*.json; do
  [ -f "$payload" ] || continue

  echo "postprocess-resend: sending $(basename "$payload")"

  body=$(jq -c \
    --argjson to "$TO_JSON" \
    '{from: "Aeon Briefings <onboarding@resend.dev>", to: $to, subject: .subject, html: .html, text: .text}' \
    "$payload")

  response=$(curl -s -w "\n%{http_code}" \
    -X POST "https://api.resend.com/emails" \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$body")

  http_code=$(echo "$response" | tail -1)
  resp_body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
    email_id=$(echo "$resp_body" | jq -r '.id // "unknown"')
    echo "postprocess-resend: sent → id=${email_id}"
    rm -f "$payload"
  else
    # Fail loudly per skill spec — surface the full error body and keep the payload.
    echo "postprocess-resend: FAILED with HTTP $http_code"
    echo "$resp_body"
    exit 1
  fi
done

rmdir "$PENDING_DIR" 2>/dev/null || true
