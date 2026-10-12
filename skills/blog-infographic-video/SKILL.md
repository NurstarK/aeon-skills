---
name: Blog Infographic Video
description: Turn the next aeon.fun blog article into a high-quality branded Remotion infographic video — storyboard built only from the article's verified facts, bespoke animated scenes committed to aeon-remotion-listing/, rendered and delivered asynchronously by the render-blog-video workflow
var: ""
tags: [content, video]
---

> **${var}** — Selector:
>
> - **empty** → next uncovered slug from `memory/topics/blog-infographic-videos.md`
> - **`<slug>`** → force that article (e.g. `aeon-connect`), even if already Done (re-authors it)
> - **`fix <slug>`** → repair the most recent failed render for that slug (read the failing run log, fix the scene code, recommit)
> - **`status`** → report queue progress via `./notify`, change nothing, exit

Today is ${today}. Read `memory/MEMORY.md` and `memory/topics/blog-infographic-videos.md` first. If `soul/` files exist, read them — all on-screen copy is in the operator's voice.

## Goal

One article per run becomes one **infographic video**: 60–90 seconds, 1920×1080 @ 30 fps, silent (motion carries it), in the Aeon brand system already defined in `aeon-remotion-listing/src/theme.ts`. This skill only AUTHORS the video (storyboard + React scene code + registration). It never renders the MP4 — the `render-blog-video.yml` workflow does that automatically after this run's changes are auto-committed to main, then uploads the MP4 to the `blog-videos` GitHub release and sends it to Telegram.

## Steps

### 1. Pick the article

Apply the `${var}` selector above. If the Queue is exhausted (everything in Done): edit `aeon.yml` to set `blog-infographic-video: enabled: false`, run `./notify "blog-infographic-video: all queued articles done — schedule disabled. Re-enable in aeon.yml after adding new slugs to memory/topics/blog-infographic-videos.md"`, and exit.

### 2. Fetch and extract (receipts-first — never skip)

Fetch `https://www.aeon.fun/blog/<slug>` **now** with WebFetch. Extract:

- The core claim in one sentence (this becomes the title card).
- 5–8 concrete, visualizable facts: numbers, prices, comparisons, step sequences, dates, named components. **Every number and claim that appears on screen must literally appear in the article.** No invented stats, no remembered stats, no "roughly".
- The article's own caveats/limits (if present — they make one honest beat).
- If the article is a "Aeon vs X" comparison, the comparison axes are the spine of the video.

If the fetch fails twice, log the failure to `memory/logs/${today}.md`, `./notify` a one-line error, and exit without touching the queue.

### 3. Storyboard

Write the storyboard as a comment block at the top of the scene file. Canonical arc — adapt to the material, don't force it:

1. **Cold open (3–5s)** — the single most concrete, surprising fact from the article. A number or a blunt claim. No logo yet, no greeting.
2. **Title card (3–4s)** — article title (shortened to ≤8 words if needed) + Aeon mark.
3. **3–5 infographic beats (8–12s each)** — pick the forms that fit the content:
   - big-number counter (animate 0 → value with `interpolate`)
   - side-by-side comparison columns (Aeon vs X: price, ownership, autonomy…)
   - step/flow diagram with staggered node reveals (for how-it-works articles)
   - timeline with sliding markers (for retrospectives like 60-days)
   - checklist with sequential tick animations (for security/receipts articles)
4. **Straight-talk beat (4–6s)** — one honest limit from the article, flat delivery. Include it whenever the article has one.
5. **CTA (4–5s)** — `aeon.fun/blog/<slug>` in mono font + Aeon logo. One action only. **Never show localhost URLs, port numbers, or any dev/internal addresses anywhere in the video** (e.g. `localhost:5555`) — public URLs only.

### 4. Quality bar (what "very high quality" means here)

- **Theme only.** Import colors and fonts exclusively from `../theme`: `BLACK`, `CREAM`, `REMOTION_BLUE`, `HEADLINE_FONT` (Space Grotesk — headlines), `MONO_FONT` (IBM Plex Mono — data, URLs, labels). No other colors except opacity variants of these.
- **≤12 words on screen per beat.** If a beat needs more, split it into two beats.
- **Everything moves.** Every element enters with an animation (spring scale-in, slide, fade+rise 20–30px). Stagger sibling elements 4–6 frames apart. Counters count. Bars grow. Nothing pops in at full opacity on frame 0 of its scene.
- **Follow the house motion style.** Open `src/scenes/AeonHook.tsx`, `src/scenes/Listing.tsx`, `src/scenes/Cta.tsx` and `src/AeonRemotionListing.tsx` and copy their exact import patterns and easing conventions (`Easing.bezier(0.16, 1, 0.3, 1)` entrances, `Easing.spring({ damping: 14 })` pops, `TransitionSeries` with `fade()`/`slide()` between scenes, 15-frame transitions). Use only APIs that already appear in those files plus standard Remotion (`AbsoluteFill`, `Sequence`, `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`). **Do not invent APIs.**
- **Layout discipline.** ≥120px margin from every edge; one focal element per beat; mono font for every number and URL; headline font never below 48px; body/label never below 32px (unreadable on mobile).
- **Assets.** Only files already in `aeon-remotion-listing/public/` via `staticFile()` (`logo.png`, `aeon-mark.jpg`). No remote URLs, no new binary assets.

### 5. Implement

- Create `aeon-remotion-listing/src/videos/<slug>.tsx` — storyboard comment on top, one exported component per beat-scene plus a default-exported `TransitionSeries` assembly, all durations in frames with the math in a comment (like `AeonRemotionListing.tsx` does).
- Register it in `aeon-remotion-listing/src/Root.tsx`: add a `<Composition id="<slug>" ...>` inside a `<Folder name="BlogVideos">` (create the folder on first run), `fps={30} width={1920} height={1080}`, `durationInFrames` matching the assembly math exactly.

### 6. Verify

Try `cd aeon-remotion-listing && npm ci --prefer-offline --no-audit`. 

- **If it succeeds:** run `npx tsc --noEmit` and fix every error. Then render 3 check stills — `npx remotion still <slug> /tmp/check-<n>.png --frame=<f>` at the cold open, the densest infographic beat, and the CTA — Read each PNG and check: no text overflow or clipping, contrast is readable, no typos, layout matches the storyboard. Iterate until clean.
- **If npm/network is blocked (sandbox):** do a strict manual pass instead — every import exists in the project, every API call appears in the reference scenes or core Remotion, durations sum correctly, no stray TypeScript syntax. Be conservative: when unsure between two APIs, use the one from the reference scenes.

### 7. Bookkeeping

- Move the slug from `## Queue` to `## Done` in `memory/topics/blog-infographic-videos.md` with today's date.
- Append to `memory/logs/${today}.md`: slug, beat count, duration, facts used (with the article as source).
- Do **not** git commit/push — the workflow's auto-commit step lands the changes on main, which triggers the render workflow.

### 8. Notify

```bash
./notify "blog-infographic-video: authored <slug> (<duration>s, <N> beats).
Beats: <one line, comma-separated>.
Render + MP4 delivery incoming via render-blog-video workflow (~10 min).
Release: https://github.com/${GITHUB_REPOSITORY}/releases/tag/blog-videos
Article: https://www.aeon.fun/blog/<slug>"
```

## `fix <slug>` mode

1. `gh run list --workflow=render-blog-video.yml --limit 5` → find the failed run → `gh run view <id> --log-failed`.
2. Fix the root cause in `src/videos/<slug>.tsx` / `Root.tsx` (typical: type error, wrong composition id, duration mismatch, non-existent API — replace with a reference-scene pattern).
3. Update `## Failed renders` in the queue file, log it, `./notify` a one-liner. The recommit triggers a fresh render automatically.

## Sandbox note

Use **WebFetch** for the article (curl may be blocked). Use **`gh`** (never curl) for all GitHub API access. `npm ci` may fail in the sandbox — that is expected; follow the manual verify path in Step 6 and let CI be the real compile check.

## Anti-patterns

- **Invented numbers.** If the article doesn't state it, it doesn't go on screen.
- **Text walls.** An infographic video is not a slideshow of paragraphs.
- **Generic template reuse.** Each article gets bespoke beats chosen for ITS content; comparison articles get comparison layouts, how-tos get flow diagrams. Never the same five scenes with different strings.
- **Marketing register.** No "revolutionary", "game-changer", "🚀". The receipts are the flex.
- **Rendering the MP4 in this run.** Costs the whole timeout and duplicates the render workflow. Author, verify, commit, exit.
