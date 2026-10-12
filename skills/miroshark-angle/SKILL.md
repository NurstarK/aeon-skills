---
name: MiroShark Angle
description: Long-form article on a queued topic, framed through MiroShark's wedges, paired with a paste-ready X thread. Article commits to the public NurstarK/MiroShark repo.
var: ""
tags: [content, positioning]
---

> **${var}** — Topic to cover. If empty, picks the next uncovered topic from `memory/topics/miroshark-angle.md`.

Today is ${today}. Read `memory/MEMORY.md` for context on what's already been covered.
Read `memory/topics/miroshark-wedges.md` — this is the **ground truth** for MiroShark's differentiators. Never invent wedges not listed there.
Read `memory/topics/miroshark-angle.md` for the topic queue, covered list, and blocklist.
If `soul/` files exist, read them (`soul/SOUL.md`, `soul/STYLE.md`) to match the operator's voice. If `soul/` is empty or absent, use a clear, concrete, terse voice — no marketing register.

## Goal

Long-form article that reframes a topic (industry trend, cultural moment, forecasting debate, simulation methodology question) through MiroShark's wedges. Every article must connect the topic to **at least 2 wedges** from `miroshark-wedges.md` with concrete links — never a generic essay with a bolted-on plug.

Two artifacts per run:
1. Long-form article **committed to the public NurstarK/MiroShark repo** at `content/miroshark-angle-${today}.md` (via `gh api`, no local checkout of MiroShark).
2. Paste-ready X thread saved locally to `.outputs/miroshark-angle-thread.md` for notify delivery.

Two separate `./notify` calls: article link + thread body.

## Steps

### 1. Pick today's topic

Priority order:

1. If `${var}` is non-empty, use `${var}` verbatim as `${TOPIC}`.
2. Else read `memory/topics/miroshark-angle.md`. Pick the first entry under `## Queue` that is not under `## Covered (last 90 days)` and not under `## Blocklist`.
3. If the queue is exhausted, run `./notify "miroshark-angle: no candidates — queue exhausted, extend memory/topics/miroshark-angle.md"` and exit. No filler article.

### 2. Research

Use WebSearch + WebFetch to gather:
- The most recent developments (last 30 days) on `${TOPIC}`
- 2-3 primary sources (blog posts, papers, docs, tweets) — quote sparingly, cite always
- The main competing framings in circulation

If nothing fresh exists, fall back to the topic's defining primary source and say so explicitly in the article.

### 3. Identify the MiroShark angle

- Pick **at least 2 wedges** from `miroshark-wedges.md` that the topic genuinely touches.
- For each picked wedge, write one sentence explaining the concrete link — cite the specific MiroShark mechanism (swarm role-play, fork probabilities, $1/<10min unit economics, fiction-safe framing, x402-callable, etc.).
- If you cannot honestly link 2 wedges to the topic, **abandon the topic**, add it to the blocklist section of `memory/topics/miroshark-angle.md` with a one-line reason, and pick the next queue entry.

### 4. Write the article

600-900 words, markdown. Shape:

```
# ${TITLE}

*${today} — MiroShark angle*

${INTRO — 2-3 sentences setting up the topic and the take}

## What's happening

${3-4 short paragraphs covering the developments, quoting sources inline}

## Why it matters

${1-2 paragraphs on the broader implication}

## The MiroShark angle

${For each picked wedge, one paragraph. Concrete, not marketing. Name the specific MiroShark mechanism.}

## Sources

- [Title](url)
- ...
```

Save locally to `.outputs/miroshark-angle-${today}.md` first (working copy), then push to MiroShark in step 6.

### 5. Compose the X thread

Write `.outputs/miroshark-angle-thread.md`. Numbered tweets, each ≤280 chars. Length: 4-6 tweets. Shape:

```
1/ ${HOOK — the sharpest take from the article, no hedging, no "🚀 Excited to share"}

2/ ${CONTEXT — what's happening, in one tweet}

3/ ${WEDGE_1 link — concrete example, not "MiroShark does this"}

4/ ${WEDGE_2 link — concrete example}

5/ Full write-up: https://github.com/NurstarK/MiroShark/blob/main/content/miroshark-angle-${today}.md
```

Ruthless — cut anything that doesn't earn its tweet.

### 6. Commit article to NurstarK/MiroShark

Push the article to the public MiroShark repo via `gh api` (no local clone). Base64-encode the file and PUT it to the Contents API:

```bash
CONTENT_B64=$(base64 < .outputs/miroshark-angle-${today}.md | tr -d '\n')
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/NurstarK/MiroShark/contents/content/miroshark-angle-${today}.md \
  -f message="miroshark-angle: ${TITLE} (${today})" \
  -f content="${CONTENT_B64}" \
  -f "committer[name]=aeonframework" \
  -f "committer[email]=aeonframework@proton.me"
```

If the file already exists (retry / same-day rerun), fetch its `sha` first and include `-f sha=<sha>` to update in place. If the push fails, run `./notify "miroshark-angle: MiroShark push failed — <error> — article kept at .outputs/miroshark-angle-${today}.md"` and continue to the thread step (do not abort — the local file is the fallback).

### 7. Update rotation state

Append to `memory/topics/miroshark-angle.md` under `## Covered (last 90 days)`:
- `${today} — ${TOPIC}`

Prune entries older than 90 days from that section.

### 8. Log + notify

Log to `memory/logs/${today}.md`:
- Topic picked
- Wedges linked (list them)
- Sources used
- MiroShark commit URL (if push succeeded)

Send two notifications via `./notify`:

```bash
./notify "miroshark-angle article: ${TITLE}

https://github.com/NurstarK/MiroShark/blob/main/content/miroshark-angle-${today}.md"

./notify "miroshark-angle thread ready to paste on X:

$(cat .outputs/miroshark-angle-thread.md)"
```

## Sandbox note

Use **WebFetch** if outbound `curl` is blocked. The `gh api` cross-repo push uses `GH_GLOBAL` — if that secret lacks write scope on NurstarK/MiroShark, the push step fails and the notify surfaces the local `.outputs/` fallback.

## Anti-patterns

- **Forced plugs.** If wedges don't apply, skip the topic. Every article must earn its wedge links.
- **Generic simulation commentary.** "Simulations are the future" is not a MiroShark angle. Concrete mechanisms only — swarm role-play, fork probabilities, unit economics.
- **Inventing wedges.** Read `miroshark-wedges.md`. If a claim isn't there, don't make it.
- **Marketing register.** No "revolutionary," "game-changing," "leverage," "unlock." Concrete verbs, cited mechanisms.
- **Ambiguous fiction framing.** MiroShark simulations are labeled simulations. Never write copy that could be mistaken for real reporting on real people.
