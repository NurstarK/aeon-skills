---
name: Daily Outreach
description: Send the operator the next vuln-disclosure target of the day — ready tweet + DM — via Telegram, advancing a cursor through targets.json
var: ""
tags: [social, outreach, security]
---
> **${var}** — Optional. A number (1-based) jumps to that target for this run without advancing the saved cursor (preview a specific one). `peek` shows the current target without advancing. Empty = normal daily behavior.

One vulnerability reach-out per day. This skill walks a fixed, ordered queue of disclosure targets (`skills/daily-outreach/targets.json`), sends the operator the next one — repo, ready-to-post tweet, and ready-to-send DM — over Telegram, then advances a cursor so tomorrow's run picks the next target. It does **not** post anything itself; the operator copy-pastes. This is a delivery skill, not an autoposter.

## Inputs

Read in this order:
1. `skills/daily-outreach/targets.json` — the ordered queue. Each entry:
   - `n` — 1-based position in the queue.
   - `repo`, `handle` (null if the maintainer has no X account), `days_open`, `channel`, `tier`, `maintainer`, `status`.
   - `tweet` — the ready public tweet for @aeonframework.
   - `dm` — the ready X DM (empty string when `handle` is null).
2. `memory/outreach-cursor.json` — `{ "index": <int>, "last_date": "<YYYY-MM-DD>" }`. `index` is the 0-based position of the **next** target to send. If the file is missing, treat as `{ "index": 0, "last_date": "" }`.

## Steps

### 1. Resolve which target to send

- `${var}` is a number `k` → set `pick = k - 1` (convert 1-based to 0-based). This is a **preview**: do not advance or write the cursor. Skip step 4.
- `${var}` is `peek` → set `pick = cursor.index`. Preview only: do not advance. Skip step 4.
- `${var}` empty (normal run):
  - Idempotency guard: if `cursor.last_date` equals today's date (`date -u +%F`), the target for today already went out — exit `DAILY_OUTREACH_ALREADY_SENT` with no notification. This prevents a double-send if the workflow re-runs.
  - Otherwise `pick = cursor.index`.

### 2. Bounds check

- If `pick` is greater than or equal to the number of entries in `targets.json`, the queue is exhausted. Send a short Telegram note via `./notify` — "Daily outreach queue complete — all N targets delivered. Add more to targets.json or refresh the list." — then exit `DAILY_OUTREACH_QUEUE_DONE`. Do not advance the cursor past the end.

### 3. Format and send the Telegram message

Load `target = targets[pick]`. Build one concise Telegram message and send it with a single `./notify "..."` call. Keep the tweet and DM verbatim from the JSON — do not rewrite, re-personalize, or "improve" them. Preserve exact punctuation and line breaks; they are already reviewed copy.

Message template (fill from the target; omit the DM section entirely when `handle` is null):

```
🛡️ Outreach — day {n}/{total} · {tier} · {days_open}d open

Repo: {repo}
Maintainer: {maintainer}  {handle}
Channel: {channel}
{status → prefixed "Note: {status}" only if non-empty}

— TWEET (@aeonframework) —
{tweet}

— DM ({handle}) —
{dm}
```

When `handle` is null, replace the DM section with a single line: `No X account — {channel} only, no DM.`

Sandbox note: `./notify` is generated at runtime and writes to the notify queue; it does not need outbound network from bash. No WebFetch fallback required. If `./notify` is absent (local dry-run without the generated script), print the message to stdout instead and continue.

### 4. Advance the cursor (normal runs only)

Only when `${var}` was empty (not a preview): write `memory/outreach-cursor.json` with:
- `index` = `pick + 1`
- `last_date` = today (`date -u +%F`)

Write the file even if `./notify` printed to stdout in a local dry-run, so the queue still advances. (For `${var}` = number or `peek`, leave the cursor untouched.)

### 5. Log

Append to `memory/logs/${today}.md` under a `## daily-outreach` section: the target number, repo, tier, and which channels the copy covers (tweet always; DM when a handle exists). One or two lines. Do not paste the full tweet/DM into the log.

## Rules

- Never post the tweet or send the DM automatically — this skill only delivers the copy to the operator. The human sends it.
- Never alter the queue order. Targets go out in the exact order stored in `targets.json`.
- Do not skip a target because it was previously contacted; the `status` field already records prior contact and the operator decides whether to re-send.
- One target per day. The `last_date` guard enforces this.

## Output

End with a `## Summary`: which target (n/total, repo) was delivered, whether a DM was included, the new cursor index, and any exit sentinel.
