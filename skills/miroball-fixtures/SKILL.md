---
name: MiroBall Fixtures
description: Run a MiroBall fixtures-oracle pass — pull the real football calendar (national teams + club competitions) from the keyless ESPN scoreboard API, write data/fixtures.json in the MiroBall repo, and report what the window looks like
var: ""
tags: [miroball, miroshark, football, data, oracle]
---

> **${var}** — Optional. Empty = full oracle sweep. Set to a number to override the days-ahead window (e.g. `14`).

Today is ${today}. If `${today}` was not substituted by the runtime, use `date +%F` instead.

## Environment requirement

Needs the MiroBall project checkout with npm deps installed. On the operator's Mac that is `~/projects/miroball`; in CI it would be a checkout of the MiroBall repo. **No API key needed** — the oracle uses ESPN's public scoreboard API. If the checkout is missing, send ONE notify explaining that and exit — do not fabricate fixture data.

## Steps

1. **Preflight.** Confirm the checkout exists. `cd` into it. If `${var}` is a number, export `MIROBALL_ORACLE_DAYS=${var}`.
2. **Oracle pass.** Run `npm run refresh-fixtures`. It sweeps every registered competition (UEFA Nations League, International Friendlies, WC Qualifiers, Champions/Europa League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga) day-by-day and writes `data/fixtures.json`. The script throws rather than writing an empty dataset if ESPN is unreachable.
3. **Window read.** From the output, say what the window actually is: international break (national fixtures dominate the next ~4 days) or club matchweek, and when the other side resumes.
4. **Diff check.** If a competition that previously had fixtures now returns 0 inside its active season, flag it as a possible API problem.
5. **Commit.** If the checkout has a remote, commit `data/fixtures.json` with message `oracle: fixtures pass ${today}` and push.
6. **Notify.** One message: total fixtures, per-competition counts (non-zero only), the window read from step 3, any anomalies.

## Notes

- Never call MiroShark from this skill — it only maintains the fixtures dataset. Paid simulations belong to `miroball-matchday`.
- The competition registry lives in `lib/oracle.js` (`COMPETITIONS`). Adding a league = adding a line there, not editing this skill.
- The MiroBall server runs this same oracle in-process every 3 h; this skill is the out-of-band backstop + reporter.
