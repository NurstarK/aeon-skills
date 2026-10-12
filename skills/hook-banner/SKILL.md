---
name: Hook Banner
description: Produce the retro pop-art announcement kit for a new Aeon hook — verified mechanics, 16:9 still, 6s animated banner, and a pasteable launch tweet
var: ""
tags: [content, hooks, visuals]
---

> **${var}** — Hook name as the operator wants it branded (e.g. `BuyerWins`). If empty, ask which hook is launching.

Today is ${today}. This skill runs **locally on the operator's Mac** — it needs the `higgsfield` CLI (authed) and `ffmpeg`. It is not a cron skill.

## Goal

One announcement kit per hook, in the house pop-up comic style (sunburst rays, red ribbon, AEON orbit logo, yellow starburst title, mono stat chips, bottom caption box):

1. Still banner → `~/Desktop/Aeon/${today}-hook-<slug>-banner-vN.png`
2. Animated banner → `~/Desktop/Aeon/${today}-hook-<slug>-banner-animated.mp4`
3. Pasteable launch tweet (plain text block in chat, no file)

Reference output: `~/Desktop/Aeon/2026-10-09-hook-buyerwins-banner-v3.png` + `-animated.mp4` (BuyerWins, 2026-10-09).

## Steps

### 1. Verify the hook on aeon.fun/hooks

Fetch https://aeon.fun/hooks and pull the hook's exact entry: name, tagline, every number (fee schedule, thresholds, caps, timers, payout splits).

- If the operator's name for the hook (`${var}`) differs from the name on the page, **flag it once and use the operator's name on the banner** — but say which page entry the mechanics came from.
- Never put a number on the banner or in the tweet that isn't on the page. If a number is missing, leave it off rather than guessing.

### 2. Distill to two stat chips + one caption

The structure that makes these banners land (stolen from pump.fun-style "Underwater Hook" banners): concrete numbers in small mono chips, not adjectives.

- **Chip 1** — the player benefit with its numbers. Format: short ALL-CAPS label line + mono number line. Example: `FEES SINK` / `0.30% to 0.04%`.
- **Chip 2** — the twist. Example: `BREAK THE STREAK` / `the pot pays its buyers`.
- **Caption** — one or two short sentences of plain mechanics, ending with `— aeon.fun/hooks`.

Keep total on-image text minimal; every extra word raises the chance of a rendering typo.

### 3. Generate the still (GPT Image 2)

Proven prompt — fill the slots, change nothing else structurally:

```
higgsfield generate create gpt_image_2 --prompt "Retro comic book pop-art promotional banner, 1960s halftone print style, aged cream paper texture, bold sunburst rays in orange, red and golden yellow radiating from center, scattered sparkle stars and a small comic meteor doodle. TOP LEFT: a red folded ribbon banner with cream lettering 'NEW AEON HOOK'. TOP RIGHT: the word 'AEON' in cream retro comic lettering with a swooshing orbit ring around it and small plain gold coin doodles with no letters or symbols on them. CENTER: a huge yellow comic starburst explosion shape with thick navy outline, containing the giant title '<HOOKNAME>' in massive navy-blue chunky comic block letters with cream outline, slightly arched and dynamic. BELOW THE TITLE, inside the lower part of the banner: two small rounded-rectangle stat chips side by side with thin navy outlines on cream background, first chip reads '<CHIP1_LABEL>' on top line and '<CHIP1_VALUE>' below in monospace-style lettering, second chip reads '<CHIP2_LABEL>' on top line and '<CHIP2_VALUE>' below. BOTTOM: a cream rectangular caption box with navy border spanning the width, navy bold text reading '<CAPTION>'. Thick navy outer frame border around the whole banner. Vintage comic advertisement aesthetic, crisp legible typography, high detail." --aspect_ratio 16:9 --resolution 2k --wait --wait-timeout 15m
```

Download the result URL to `~/Desktop/Aeon/${today}-hook-<slug>-banner-v1.png`.

### 4. QA the still, patch with Nano Banana 2

Read the full image and check: title spelled right, both chips verbatim, caption verbatim, URL correct. Then zoom-crop any decorative detail that could carry stray glyphs (coins are the known offender):

```
sips -c 700 700 --cropOffset <y> <x> banner.png --out crop.png
```

House rule: **coins and props carry no letters, numbers, or symbols.** Fix defects with a targeted edit, not a regen:

```
higgsfield generate create nano_banana_2 --prompt "Edit this image: <specific defect and fix>. Change absolutely nothing else — all text, colors, layout, texture and every other element stay exactly identical." --image <banner.png> --aspect_ratio 16:9 --wait
```

Re-crop to verify. Faint embossed ghosts survive the first pass about half the time — budget for two passes. Bump the version number each pass; the last clean file is the master still.

### 5. Animate (Seedance 2.0)

```
higgsfield generate create seedance_2_0 --prompt "Animate this retro comic pop-art banner with lively but controlled motion graphics: the orange and red sunburst rays slowly rotate behind the artwork, the yellow starburst explosion shape pulses gently like a heartbeat, the big navy <HOOKNAME> lettering does a quick comic pop (scales up slightly and settles with a bounce), the plain gold coins spin and wobble in place staying blank with no letters appearing on them, the small meteor streaks with a flickering flame trail, sparkle stars twinkle on and off, subtle halftone dot shimmer across the paper texture. Camera completely static, no zoom, no pan. All text stays perfectly crisp, unchanged and legible at all times. Flat 2D vintage comic print animation style, seamless loop feel." --start-image <master-still.png> --duration 6 --aspect_ratio 16:9 --resolution 1080p --wait --wait-timeout 25m
```

Run in the background; download when done.

### 6. QA frames + freeze-patch any text drift

Extract check frames across the clip:

```
for t in 0 2 4 5.5; do ffmpeg -y -v error -ss $t -i banner.mp4 -frames:v 1 frame_$t.png; done
```

**Known failure mode:** Seedance drifts small mono text late in the clip (BuyerWins run: `0.04%` became `0.44%` by the 4s mark). Because the camera is static, the fix is deterministic — freeze the affected region with a patch from a clean early frame:

```
ffmpeg -y -i frame_2.png -vf "crop=<w>:<h>:<x>:<y>" chip_patch.png
ffmpeg -y -i banner.mp4 -i chip_patch.png -filter_complex "[0:v][1:v]overlay=<x>:<y>" -c:v libx264 -crf 17 -pix_fmt yuv420p -movflags +faststart banner_fixed.mp4
```

Pad the crop a few px beyond the chip border; the starburst pulse under it is invisible once frozen. Re-extract frames (include one near the end) and confirm the text reads correctly in all of them. Final file: `~/Desktop/Aeon/${today}-hook-<slug>-banner-animated.mp4`.

### 7. Launch tweet

Underwater-Hook cadence: short declarative lines, one number pair max, blank line between beats, no hashtags, no emoji, no "we're excited". Shape:

```
<HookName> is live on aeon.fun/hooks

<player benefit, with the number>.

<the twist, in plain words>.

<one quotable closer>.
```

Offer 2–3 options, recommend one, and deliver the winner as a plain pasteable text block. Accuracy guard: stay vague-but-truthful on fine print (pro-rata splits, minimum ages, caps) rather than cramming it in or overstating.

## Notes

- GPT Image 2 for stills with text, Nano Banana 2 for localized edits, Seedance 2.0 for animation — don't swap models, this trio is proven for this format.
- One hook per banner. Multi-hook roundups use the same style but a different composition (see `~/Desktop/Aeon/2026-10-07-three-hooks-banner.png`).
- Don't regenerate a clean still to fix the animation; fix the video in post.
