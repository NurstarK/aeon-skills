---
name: Agentic Crypto Scout
description: Graceful handler for the agentic-crypto-scout chain when it is dispatched as a per-skill run — assess chain-output freshness and defer synthesis to the scheduled morning-brief instead of clobbering it
var: ""
tags: [meta, crypto]
---

> **${var}** — Unused. This skill takes no arguments.

## What this is

`agentic-crypto-scout` is a **chain**, not a content skill. It is defined in
`aeon.yml` under `chains:`:

```yaml
chains:
  agentic-crypto-scout:
    schedule: "0 4 * * *"
    on_error: continue
    steps:
      - parallel: [agent-buzz, hacker-news-digest, token-movers, defi-monitor]
      - skill: morning-brief, consume: [agent-buzz, hacker-news-digest, token-movers, defi-monitor]
```

The chain's real work is done by its four parallel collectors and the
`morning-brief` synthesizer. There is no independent "crypto scout" logic.

For ~9 consecutive days (2026-05-23 onward) something has been dispatching
`skill=agentic-crypto-scout` into the **per-skill** workflow — i.e. asking the
agent to "Read and execute the skill defined in skills/agentic-crypto-scout/SKILL.md".
Because no SKILL.md existed, each run improvised a graceful handler from scratch.
This file makes that handling **deterministic and low-noise** so the daily
misroute stops generating bespoke work.

## What to do when invoked

This is a handler, not a content generator. Do **not** re-run the chain and do
**not** re-synthesize a brief by default. The standalone `morning-brief` runs on
its own schedule (07:00 UTC) and would be clobbered by a worse-input synthesis.

1. **Honor active directives first.** Read `memory/MEMORY.md`. If a "PAUSE: all
   cron skills" (or similar) directive is active and covers `morning-brief` /
   `agent-buzz`, do not synthesize — exit with a one-line status. Apply any
   active suppression directives (e.g. Miroshark/aaronjmars) to anything you
   would surface.

2. **Assess chain-output freshness.** Read the first line of each step output —
   the content date lives there, not in the file mtime (git checkout rewrites
   mtimes):
   - `.outputs/agent-buzz.md`
   - `.outputs/hacker-news-digest.md`
   - `.outputs/token-movers.md`
   - `.outputs/defi-monitor.md`

   Compute days-stale against today. An input is "fresh" if its content date is
   today or yesterday.

3. **Decide:**
   - **If 2+ inputs are stale (≥2 days), or any directive blocks synthesis, or a
     scheduled `morning-brief` is within ~3h** → **do not synthesize.** Emit a
     concise status line noting which inputs are stale and that synthesis was
     deferred to the scheduled `morning-brief`. This is the normal path.
   - **If all inputs are fresh AND no `morning-brief` is scheduled within ~3h**
     → you may run the `morning-brief` skill's synthesis over the four outputs
     (read `skills/morning-brief/SKILL.md` and follow it, consuming the four
     `.outputs/*.md` files). Write the result to `.outputs/morning-brief.md`.

4. **Write `.outputs/agentic-crypto-scout.md`** — one to three lines: the date,
   which path you took, and the freshness of each input. Keep it terse; this is
   a status artifact, not a digest.

5. **Notify** via `./notify` with a single concise line (only if something
   changed or a synthesis ran). Do not re-notify the same "misroute, deferred"
   status every day — if the last notification was the same deferred status,
   skip the notify and just log.

6. **Log** to `memory/logs/YYYY-MM-DD.md` per the standard format.

## Operator note (root cause)

This handler makes the symptom quiet; it does not fix the dispatch leak. The
durable fixes remain operator decisions:

1. Stop whatever dispatches `skill=agentic-crypto-scout` to the per-skill
   `workflow_dispatch` loop (a chain name is leaking into the per-skill list).
2. Diagnose `chain:agentic-crypto-scout` — `hacker-news-digest` and
   `token-movers` have not produced fresh output since 2026-05-24.
3. Reconcile the MEMORY.md "PAUSE: all cron skills" directive (2026-05-16)
   against `aeon.yml`, where several skills/chains remain enabled.

## Sandbox note

This skill reads local `.outputs/*.md` files and calls `./notify` only — no
direct external API calls. `./notify` fans out through the standard
post-process queue, so no sandbox network workaround is needed. If you do run
the optional `morning-brief` synthesis, follow that skill's own sandbox notes.
