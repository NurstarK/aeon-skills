---
name: MiroBall Matchday
description: Pick the weekend's marquee fixtures from MiroBall's dataset and launch one paid MiroShark simulation per match through MiroBall's prompt builder (pinned "Will X beat Y?" market + affiliate field), then collect share links and recap cards
var: ""
tags: [miroball, miroshark, simulation, x402, football]
---

> **${var}** — Optional. Empty = the top 3 marquee fixtures of the upcoming weekend across all covered leagues. Set to a number (`1`–`5`) to change the batch size, to a comma-separated list of MiroBall match ids to force specific fixtures, or to `dry-run` to build and report the payloads without paying.

Today is ${today}. If `${today}` was not substituted by the runtime, use `date +%F` instead.

## Environment requirement — runs on the operator's Mac, not in CI

This skill spends real USDC. It needs the **awal Coinbase agentic wallet** CLI session (`npx awal@2.10.0`) signed in on the local machine, and the MiroBall checkout at `~/projects/miroball`. If a preflight fails in a sandboxed/CI run, send ONE notify explaining the skill must run locally and exit. Never attempt to pay from CI.

**Spend cap: $1 × batch size, max $5 per run of this skill.** Each sim is a flat $1.00 USDC (x402, Base mainnet, gas sponsored). At most one retry of one failed *launch* (a 402/network error before settle). A run that failed AFTER payment settled is reported with its `run_id`, never re-paid.

## Steps

### 1. Preflight

- `npx awal@2.10.0 status` — signed in, else notify + exit.
- `npx awal@2.10.0 balance` — at least $1 × batch size, else notify with balance + exit.
- `~/projects/miroball/data/fixtures.json` exists and `updatedAt` is within 7 days; otherwise run the `miroball-fixtures` skill logic first (or use the bundled sample only if `${var}` is `dry-run`).

### 2. Select fixtures

Marquee = earliest-kickoff weekend matches involving title contenders, derbies, or top-6 clashes. Prefer one match per league over three from the same league. List the selection with one-line reasons before paying anything.

### 3. Build payloads

For each selected match, build the `/run` body exactly the way MiroBall's `lib/promptBuilder.js` does — same prompt template, `prediction_market.question` = `Will <home> beat <away> in the <league> on <date>?`, `affiliate` = the operator's awal Base address. The fastest way: `cd ~/projects/miroball && curl -s -X POST localhost:4402/api/simulate -d '{"matchId":"<id>"}'` against a running dev server, or import the module in a one-off `node -e` script.

### 4. Pay and launch (skip if dry-run)

`npx awal@2.10.0 x402 pay https://x402.miroshark.xyz/run --body '<payload JSON>'` — launch the batch, capture each `run_id`, `wait_url`, `status_url`.

### 5. Collect

Poll each `status_url` (runs take ~10–25 min). On completion grab `share_url` and the recap card `https://x402.miroshark.xyz/api/simulation/<sim_id>/share-card.png`. Save reports to `~/projects/miroball/output/${today}-<matchid>-report.md` via `/report/<run_id>?format=md`.

### 6. Notify

One message: per-match share links + recap card URLs, total spent, anything that failed with its `run_id`.

## Notes

- This is the MiroBall-flavored sibling of `miroshark-matchday` (league-level bulk sims + video renders). This one is per-match, driven by the fixtures dataset, and always carries the affiliate field. Don't run both on the same day without checking total spend.
