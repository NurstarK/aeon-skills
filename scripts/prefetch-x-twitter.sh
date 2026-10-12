#!/usr/bin/env bash
# Pre-fetch X API v2 recent-search results for reply-maker, outside the Claude sandbox.
# Writes to the same .xai-cache/reply-maker.json envelope shape that prefetch-xai.sh
# emits, so reply-maker/SKILL.md reads either source with no parsing change.
#
# Runs whenever X_BEARER_TOKEN is set. When both X_BEARER_TOKEN and XAI_API_KEY are
# set, prefetch-xai.sh runs lexicographically later and overwrites this cache — that
# is the intended precedence (Grok x_search includes curation; raw X API does not).
set -uo pipefail

SKILL="${1:-}"
VAR="${2:-}"

# Scope: reply-maker only for now. Extend the case block to add other skills.
if [ "$SKILL" != "reply-maker" ]; then
  echo "prefetch-x-twitter: skill=$SKILL not handled, skipping"
  exit 0
fi

if [ -z "${X_BEARER_TOKEN:-}" ]; then
  echo "prefetch-x-twitter: X_BEARER_TOKEN not set, skipping"
  exit 0
fi

mkdir -p .xai-cache

# 6h freshness window matches the SKILL.md reply window.
START_TIME=$(date -u -d "6 hours ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-6H +%Y-%m-%dT%H:%M:%SZ)

# Query strategy mirrors prefetch-xai.sh reply-maker case:
#   numeric var  → X list ID (Pro tier only; gracefully fails on Basic)
#   @-prefixed   → from:handle
#   topic string → boolean OR group
#   empty        → broad agentic-AI topic mix
if [ -n "$VAR" ] && echo "$VAR" | grep -Eq '^[0-9]+$'; then
  QUERY="list:${VAR} -is:reply -is:retweet"
elif [ -n "$VAR" ] && [ "${VAR#@}" != "$VAR" ]; then
  HANDLE="${VAR#@}"
  QUERY="from:${HANDLE} -is:reply -is:retweet"
elif [ -n "$VAR" ]; then
  QUERY="(${VAR}) lang:en -is:reply -is:retweet"
else
  QUERY='(agentic OR "AI agent" OR "agent commerce" OR "agentic commerce" OR autonomous) lang:en -is:reply -is:retweet'
fi

echo "prefetch-x-twitter: query=${QUERY}"

RESP=$(curl -s --max-time 60 -G "https://api.x.com/2/tweets/search/recent" \
  -H "Authorization: Bearer ${X_BEARER_TOKEN}" \
  --data-urlencode "query=${QUERY}" \
  --data-urlencode "start_time=${START_TIME}" \
  --data-urlencode "max_results=30" \
  --data-urlencode "tweet.fields=created_at,public_metrics,author_id" \
  --data-urlencode "expansions=author_id" \
  --data-urlencode "user.fields=username,public_metrics" 2>&1) || {
    echo "::warning::prefetch-x-twitter: curl failed"
    exit 0
  }

if ! echo "$RESP" | jq -e . >/dev/null 2>&1; then
  echo "::warning::prefetch-x-twitter: non-JSON response: $(echo "$RESP" | head -c 200)"
  exit 0
fi

if echo "$RESP" | jq -e '.errors // .title' >/dev/null 2>&1; then
  echo "::warning::prefetch-x-twitter: X API error: $(echo "$RESP" | jq -c '.errors // .title')"
  exit 0
fi

# Reshape into a numbered candidate list and wrap in the xai-cache envelope.
TEXT=$(echo "$RESP" | jq -r '
  ([.includes.users // [] | map({(.id): (.username // "unknown")}) | add] | first) as $users |
  if (.data // []) | length == 0 then
    "X API v2 recent-search returned zero tweets in the 6h window for this query."
  else
    [.data[] |
      "@" + (($users[.author_id]) // "unknown")
      + " — " + ((.public_metrics.like_count|tostring)) + " likes / "
      + ((.public_metrics.reply_count|tostring)) + " replies / "
      + ((.public_metrics.retweet_count|tostring)) + " RTs\n"
      + "posted_at: " + .created_at + "\n"
      + "url: https://x.com/" + (($users[.author_id]) // "i") + "/status/" + .id + "\n"
      + "text: " + (.text | gsub("\n"; " "))
    ] | to_entries | map("\(.key + 1). \(.value)") | join("\n\n")
  end
')

jq -n --arg t "$TEXT" '{
  output: [
    {
      type: "message",
      content: [
        { type: "output_text", text: $t }
      ]
    }
  ]
}' > .xai-cache/reply-maker.json

echo "prefetch-x-twitter: wrote .xai-cache/reply-maker.json ($(wc -c < .xai-cache/reply-maker.json | tr -d ' ') bytes)"
