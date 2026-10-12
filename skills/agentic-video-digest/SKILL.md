---
name: Agentic Video Digest
description: Curated picks from the agentic-AI video/podcast space from the last 48h — signal-scored, dedup'd, one-line why-watch each
schedule: "0 9 1/2 * *"
commits: true
tags: [ai, video, podcast]
permissions:
  - contents:write
---

> **${var}** — Optional topic to bias toward (e.g. "agent frameworks", "evals", "MCP"). If empty, covers the agentic space broadly.

Today is ${today}. Read `memory/MEMORY.md` for context. Read `memory/topics/podcasts.md` for the tracked channel list (create it from the defaults below if it does not exist).

Read the last 7 days of `memory/logs/` and extract every `https://(www\.)?(youtube\.com|youtu\.be|spotify\.com|podcasts\.apple\.com)/...` URL already posted by this skill. Treat those as a dedup set — do not re-list them.

## Goal

Ship **3-5 picks** of high-signal agentic-AI video or podcast content released in the last 48h. Curation, not aggregation. Better to ship 3 sharp picks than 5 mediocre ones.

A pick is worth listing only if:
- It's from a tracked channel **or** it's getting outsized engagement from builders/researchers (>50k views in 48h, or surfaced by 2+ tracked accounts on X).
- It teaches something concrete about agent design, evals, deployment, business model, or a recent shipped product — not a generic "AI is changing the world" take.
- The host is a builder/researcher/investor or interviews one. Pure commentary channels are skipped unless the episode has a domain-expert guest.

## Steps

### 1. Load tracked channels

Read `memory/topics/podcasts.md`. The file should list channels and their YouTube/podcast handles, one per line. If the file is missing or empty, create it with this seed list (then continue with these):

```
# Tracked podcast + video sources for agentic-video-digest

## Podcasts (also on YouTube)
- Latent Space — @LatentSpacePod
- No Priors — @NoPriorsPod
- Cognitive Revolution — @CogRev_Podcast
- AI Daily Brief — Nathaniel Whittemore
- Dwarkesh Podcast — @dwarkesh_sp
- Lex Fridman Podcast — @lexfridman
- Machine Learning Street Talk — MLST
- TWIML AI Podcast — Sam Charrington
- Practical AI — Daniel Whitenack
- Lenny's Podcast — @lennysan (agentic episodes only)
- a16z Podcast — a16z
- 20VC — Harry Stebbings (agentic episodes only)

## YouTube channels (research / builder)
- a16z — @a16z
- Sequoia Capital — @sequoiacapital
- Y Combinator — @ycombinator
- Two Minute Papers — @TwoMinutePapers
- Sam Witteveen — @samwitteveenai
- AI Jason — @AIJasonZ
- AssemblyAI — @AssemblyAI
- Wes Roth — @WesRoth
- Matt Wolfe — @mreflow
- David Ondrej — @DavidOndrej
- Anthropic — @anthropic-ai
```

### 2. Fetch candidates

**a. YouTube + tracked channels (primary).** For each channel in the tracked list, use `WebSearch` to find recent uploads:

```
site:youtube.com <channel name> agent OR agentic OR LLM OR MCP <recent date range>
```

Aim for one query per top tracked channel (cap at 12 queries). Capture: title, channel, published date, URL, duration if visible, view count if visible.

**b. Broad agentic search (secondary).** Run 2-3 `WebSearch` queries to catch viral episodes from outside the tracked list:
- `agentic AI podcast new episode ${this_week}`
- `AI agents YouTube best ${this_week}`
- `MCP OR agent framework podcast ${this_week}`

For each hit, capture the same fields. Discard anything published more than 48h before `${today}`.

**c. X corroboration (tertiary).** If `XAI_API_KEY` is configured, do one x_search call for the last 48h: which agentic AI YouTube/podcast episodes are tracked builder/researcher accounts sharing? This is the signal multiplier — episodes endorsed by 2+ tracked accounts get a +2 score boost. Skip silently if no key.

### 3. Score each candidate

Filter aggressively before scoring. Drop candidates that fail any of these:
- Published more than 48h before `${today}`
- Already in the dedup set
- Title is generic AI hype with no specific subject ("The Future of AI", "Why AI Changes Everything")
- Channel is a content farm (>1 upload/day with shallow takes)

For each surviving candidate:

| Field | Scale | How to decide |
|---|---|---|
| **Source authority** | 0-3 | 3 = tracked channel with strong builder/researcher track record. 2 = tracked but commentary-leaning. 1 = untracked but credible host/guest. 0 = drop. |
| **Topic relevance** | 0-3 | 3 = directly about agent design, evals, deployment, business model. 2 = adjacent (general LLMs, infra). 1 = tangentially relevant. 0 = drop. |
| **Recency** | 0-2 | 2 = published in the last 24h. 1 = 24-48h. 0 = older (drop). |
| **Builder endorsement** | 0-2 | +2 if 2+ tracked accounts on X are sharing it; +1 if 1 account; 0 otherwise. |

**Total score: sum.** Keep the top 3-5 with score ≥ 6. If fewer than 3 qualify, ship what you have — never pad with low-signal picks.

### 4. Write a 1-line "why watch"

For each pick, write a single line (≤20 words) explaining the concrete thing the listener will learn. Not "great conversation about AI" — "Anthropic researcher on why long-horizon tool use breaks at 12+ steps and the eval they built for it."

If you can't write a sharp why-watch from the title + channel context alone, fetch the episode description/transcript via WebFetch and try again. If still can't, drop the pick.

### 5. Format the notification

Keep under 3500 chars. Format:

```
*Agentic Video Digest — ${today}*

1. [${duration}] **${title}** — ${channel}
   ${why_watch}
   ${url}

2. [${duration}] **${title}** — ${channel}
   ${why_watch}
   ${url}

...

(Top sources: ${tracked_channel_count}/${total_picks} from tracked list)
```

If zero picks qualify: send a one-liner — `*Agentic Video Digest — ${today}*: quiet 48h, no picks meeting the bar. Next run ${next_date}.`

### 6. Send via `./notify`

### 7. Log to `memory/logs/${today}.md`

Append a `### agentic-video-digest` section with all picks (including any dropped close-calls and why they were dropped, so tomorrow's run can learn). Include the score breakdown for each kept pick.

## Guidelines

- Aggressive dedup. Same episode under a different URL = one pick.
- Tracked channels first, virality second. Don't list a no-name uploader just because their video has 100k views — quality of host > view count.
- Why-watch is mandatory. No exceptions. Generic = drop.
- Skip podcast episodes that haven't shipped a YouTube/web version yet (the user listens via desktop browser, audio-only Apple/Spotify-only links break the workflow).
- If `${var}` is set, bias scoring toward that topic but do not force a pick if nothing qualifies.

## Sandbox note

The sandbox blocks outbound curl in many cases. Use **WebSearch** for queries (always works) and **WebFetch** for individual URLs (always works). XAI corroboration is optional — if the curl fails inside the sandbox, log `VIDEO_DIGEST_XAI_SKIP` and continue without the endorsement signal.

## Environment Variables Required

- `XAI_API_KEY` — optional, used for builder-endorsement signal. Skill degrades gracefully if absent.
- Notification channels configured via repo secrets (see CLAUDE.md).
