---
name: AEON + MiroShark Recap
description: Single synthesized brief for AEON framework + MiroShark — chatter + repo activity + ship signals, one message. Consumes tweet-roundup and repo-pulse outputs.
schedule: "0 4 * * *"
commits: true
tags: [ai, dev, recap]
permissions:
  - contents:write
---

> Daily recap of everything happening around the AEON framework and MiroShark — repo activity, X chatter, ship signals, ecosystem moves.

Today is ${today}. Read `memory/MEMORY.md` for context. Read the last **14 days** of `memory/logs/` and extract every prior `### aeon-miroshark-recap` entry — you will use them as a hard dedup baseline (see step 3), not just a heuristic.

## Goal

Ship **one** message that answers: "what changed for AEON + MiroShark in the last 24h, and what should I do about it?" Not a news dump. Not a metric snapshot. A decision-grade recap.

A line earns its place only if it teaches you something new or implies an action.

## Inputs

This skill runs as the synthesizer step of the `aeon-miroshark-recap` chain. Two prior step outputs are injected into your context:

1. **`tweet-roundup` output** — scoped to AEON + MiroShark (signal-scored, clustered tweets from the last 24h).
2. **`repo-pulse` output** — last-24h commits, PRs, releases, stars, forks, growth verdict for `aaronjmars/aeon` and `aaronjmars/miroshark-aeon`.

If chain context is missing (running standalone), fall back to:
- Read `skills/tweet-roundup/SKILL.md` and execute inline with `var="@aaronjmars OR @aeonframework OR aeon framework OR miroshark"`.
- Read `skills/repo-pulse/SKILL.md` and execute inline for both repos.

## Steps

### 1. Parse inputs

From the tweet-roundup output, extract: top 3-5 clusters/threads, named drivers (handles), direct links, sub-narratives. Discard low-signal items.

From the repo-pulse output, extract per repo: stargazers delta, forks delta, new releases, notable commits, growth verdict (QUIET/STEADY/ACTIVE/SURGE).

### 2. Cross-reference

Look for connections between the two:
- Is a tweet thread driven by a repo release or commit landing today?
- Is a repo getting starred by accounts that are talked about in the tweet roundup?
- Is there a divergence (loud chatter, quiet repo — or shipping fast, no one talking yet)?

Connections are the highest-value finding. Surface them explicitly.

### 3. Dedup against the last 14 days (hard rule)

Before ranking anything, walk the last **14 days** of `memory/logs/*.md`, read every `### aeon-miroshark-recap` entry, and collect the set of dedup keys already surfaced. Read them from the `<!-- dedup-keys: ... -->` line that step 6 appends to every log entry.

**Dedup keys:**
- **Tweet URLs** (e.g. `https://x.com/foo/status/123`) — for chatter clusters. If the *top* tweet URL of today's cluster is in the set, drop the entire cluster.
- **Release tags** (e.g. `v1.4.0`) — for repo releases.
- **Commit SHAs** (first 7 chars, e.g. `abc1234`) — for notable commits.

This is a hard filter, not a heuristic. No LLM discretion. No "materially escalated" carve-outs. If a viral tweet keeps trending after 14 days, that is a separate signal we can revisit outside this recap — do not re-surface the same URL here.

Why the hard rule: 2026-05-23 pause was caused by the same Miroshark launch tweet re-surfacing daily because the previous "materially escalated" heuristic kept re-ranking it as top signal. Never again.

If dedup removes *everything* from a category, the recap can either omit that section or send the QUIET one-liner (step 4). Do not pad with weaker items.

### 4. Format the notification

Keep under 3500 chars. Format:

```
*AEON + MiroShark Recap — ${today}*

*Repo activity*
• aaronjmars/aeon — ${verdict} (+${stars_d} ⭐, +${forks_d} forks, ${releases_count} release)
  ${one_line_summary_of_what_shipped_or_landed}
• aaronjmars/miroshark-aeon — ${verdict} (+${stars_d} ⭐, +${forks_d} forks)
  ${one_line_summary}

*Chatter* (top 3, dedup'd)
• ${cluster_label} — ${driver_handles} — ${one_line_thesis}
  ${top_tweet_url}
• ${cluster_label} — ${driver_handles} — ${one_line_thesis}
  ${top_tweet_url}

*Cross-signals* (omit if nothing notable)
• ${repo_event} ↔ ${tweet_thread} — ${what_this_means}

*Action items* (omit if nothing actionable)
• ${one_line_what_to_do_today_about_aeon_or_miroshark}
```

If both inputs are quiet (no notable activity, no chatter worth surfacing): send a one-liner — `*AEON + MiroShark Recap — ${today}*: quiet 24h — both repos ${verdict_aeon}/${verdict_miroshark}, no notable chatter.`

### 5. Send via `./notify`

### 6. Log to `memory/logs/${today}.md`

Append a `### aeon-miroshark-recap` section with the full structured output (including dropped items + reason).

**Required last line of the entry** — a machine-readable dedup manifest that step 3 of future runs will parse:

```
<!-- dedup-keys: url:https://x.com/foo/status/123, url:https://x.com/bar/status/456, release:v1.4.0, sha:abc1234 -->
```

Include one comma-separated `key:value` per item that was actually *surfaced* in today's recap (skip dropped items — they're already in an older manifest). Prefixes: `url:` for tweet URLs, `release:` for release tags, `sha:` for 7-char commit SHAs. If today was a QUIET one-liner with nothing surfaced, still write the comment with no entries: `<!-- dedup-keys: -->`.

Never remove or rewrite older `<!-- dedup-keys: ... -->` lines in past logs — the 14-day dedup baseline depends on them being append-only.

## Guidelines

- Cross-signals first. The whole point of merging tweet + repo signals is to catch the moments where the story and the code line up (or don't).
- Action items are gold. If you can write one, write it. If you can't honestly, omit the section — don't pad.
- Dedup hard. Same release surfaced as both a repo event and a tweet cluster = one line, not two.
- Names matter. Always cite handles for chatter drivers and commit authors for repo events.
- Never invent activity. If repo-pulse says QUIET, the recap says QUIET. Don't dress it up.

## Sandbox note

This skill primarily reads chain context (already in scope). No external API calls required in the chain path. The standalone fallback uses `WebSearch` + `WebFetch` (always work in sandbox) plus `gh api` (works for GitHub).

## Environment Variables Required

- Notification channels configured via repo secrets (see CLAUDE.md).
- `XAI_API_KEY` — only needed if running standalone fallback (which invokes tweet-roundup inline).
