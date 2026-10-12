---
name: Aeon Angle
description: Weekly long-form article on a queued topic, framed through Aeon's wedges, paired with a paste-ready X thread
var: ""
tags: [content, positioning]
---

> **${var}** — Topic to cover. If empty, picks the next uncovered topic from `memory/topics/aeon-angle.md`.

Today is ${today}. Read `memory/MEMORY.md` for context on what's already been covered.
Read `memory/topics/aeon-wedges.md` — this is the **ground truth** for Aeon's differentiators. Never invent wedges not listed there.
Read `memory/topics/aeon-angle.md` for the topic queue, covered list, and blocklist.
If `soul/` files exist, read them (`soul/SOUL.md`, `soul/STYLE.md`) to match the operator's voice. If `soul/` is empty or absent, use a clear, concrete, terse voice — no marketing register.

## Goal

One weekly long-form article that reframes a topic (industry trend, competitor move, technical debate) through Aeon's wedges. Every article must connect the topic to **at least 2 wedges** from `aeon-wedges.md` with concrete links — never a generic essay with a bolted-on plug.

Two artifacts per run:
1. Long-form article committed to `articles/aeon-angle-${today}.md`
2. Paste-ready X thread saved to `.outputs/aeon-angle-thread.md`

Two separate `./notify` calls: article link + thread body.

## Steps

### 1. Pick today's topic

Priority order:

1. If `${var}` is non-empty, use `${var}` verbatim as `${TOPIC}`.
2. Else read `memory/topics/aeon-angle.md`. Pick the first entry under `## Queue` that is not under `## Covered (last 90 days)` and not under `## Blocklist`.
3. If the queue is exhausted, run `./notify "aeon-angle: no candidates — queue exhausted, extend memory/topics/aeon-angle.md"` and exit. No filler article.

### 2. Research

Use WebSearch + WebFetch to gather:
- The most recent developments (last 30 days) on `${TOPIC}`
- 2-3 primary sources (blog posts, papers, docs, tweets) — quote sparingly, cite always
- The main competing framings in circulation

If nothing fresh exists (nothing in the last 30 days), fall back to the topic's defining primary source and say so explicitly in the article.

### 3. Identify the Aeon angle

- Pick **at least 2 wedges** from `aeon-wedges.md` that the topic genuinely touches.
- For each picked wedge, write one sentence explaining the concrete link — cite the specific Aeon mechanism (skill name, file, `chains:` block, `reactive:` trigger, etc.).
- If you cannot honestly link 2 wedges to the topic, **abandon the topic**, add it to the blocklist section of `memory/topics/aeon-angle.md` with a one-line reason, and pick the next queue entry. A forced Aeon plug is worse than skipping the slot.

### 4. Write the article

600-900 words, markdown. Shape:

```
# ${TITLE}

*${today} — Aeon angle*

${INTRO — 2-3 sentences setting up the topic and the take}

## What's happening

${3-4 short paragraphs covering the developments, quoting sources inline}

## Why it matters

${1-2 paragraphs on the broader implication}

## The Aeon angle

${For each picked wedge, one paragraph. Concrete, not marketing. Name the specific Aeon mechanism.}

## Sources

- [Title](url)
- ...
```

Save to `articles/aeon-angle-${today}.md`.

### 5. Compose the X thread

Write `.outputs/aeon-angle-thread.md`. Numbered tweets, each ≤280 chars. Length: 4-6 tweets. Shape:

```
1/ ${HOOK — the sharpest take from the article, no hedging, no "🚀 Excited to share"}

2/ ${CONTEXT — what's happening, in one tweet}

3/ ${WEDGE_1 link — concrete example, not "Aeon does this"}

4/ ${WEDGE_2 link — concrete example}

5/ Full write-up: https://github.com/${GITHUB_REPOSITORY}/blob/main/articles/aeon-angle-${today}.md
```

Ruthless — cut anything that doesn't earn its tweet.

### 6. Update rotation state

Append to `memory/topics/aeon-angle.md` under `## Covered (last 90 days)`:
- `${today} — ${TOPIC}`

Prune entries older than 90 days from that section.

### 7. Log + notify

Log to `memory/logs/${today}.md`:
- Topic picked
- Wedges linked (list them)
- Sources used

Send two notifications via `./notify`:

```bash
./notify "aeon-angle article: ${TITLE}

https://github.com/${GITHUB_REPOSITORY}/blob/main/articles/aeon-angle-${today}.md"

./notify "aeon-angle thread ready to paste on X:

$(cat .outputs/aeon-angle-thread.md)"
```

## Sandbox note

Use **WebFetch** if outbound `curl` is blocked. For auth-required APIs, use the pre-fetch/post-process pattern (see CLAUDE.md).

## Anti-patterns

- **Forced plugs.** If wedges don't apply, skip the topic. Every article must earn its wedge links.
- **Generic industry commentary.** "AI is changing everything" is not an Aeon angle. Concrete mechanisms only.
- **Inventing wedges.** Read `aeon-wedges.md`. If a claim isn't there, don't make it.
- **Marketing register.** No "revolutionary," "game-changing," "leverage." Concrete verbs, cited mechanisms.
