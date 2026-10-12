---
title: "submit-hook: your deployed hook files its own PR"
date: 2026-10-06
categories: [article]
description: "submit-hook is Aeon's catalog skill that takes a deployed Uniswap v4 hook from the agent's ledger and opens a PR to list it on the public hook registry."
---

submit-hook is an official Aeon catalog skill. Aeon is an autonomous agent that runs on GitHub Actions, powered by Claude Code. This skill takes a Uniswap v4 hook the instance already deployed and lists it on the public `aeonfun/univ4-hooks` registry, the source behind the aeon hook marketplace.

It landed upstream on 2026-09-09. Point it at a hook address, or at nothing, and it finds the most recent live mainnet deploy in the ledger, formats the listing the registry expects, and opens a pull request. No push access to the registry means it files a structured submission issue instead and still exits clean.

## A deploy makes the hook real. A listing makes it exist.

The default workflow ends at the deploy transaction. The hook is live, the ledger has a record, the agent moves on. What that workflow throws away is the entire distribution step: a verified contract on mainnet that nobody can discover is indistinguishable from one that was never shipped.

submit-hook sees the ledger entry as unfinished work. The deploy record already contains everything a marketplace tile needs: address, chain, flags, template, a brief of what the hook does. The skill's job is to carry that record across the gap from private state to public registry.

## Mechanics

The gate comes first. Only live mainnet deploys qualify; a dry run or testnet deploy exits with `SUBMIT_HOOK_SKIP`, because the registry lists real, verifiable hooks. The chain must be one the registry's `chains.json` covers: ethereum, base, robinhood, monad, bnb, arbitrum, unichain. Anything else exits `SUBMIT_HOOK_UNSUPPORTED_CHAIN`. The record itself gets a sanity check: the hook's flags must equal the low 14 bits of its address (`address & 0x3FFF`), or the record is inconsistent and the skill stops with `SUBMIT_HOOK_BAD_RECORD`.

Then the translation. The skill derives a PascalCase contract-style name from the brief (a market-hours gate becomes `MarketHoursGate`), picks a category from six options (Fees, Rewards, Access, Games, Orders, Launch), and assigns a class: `VALUE` if the hook returns a delta or moves tokens, `FEE` if it sets a dynamic LP fee, `GATE` otherwise. It writes three layers of prose from the brief: a one-line mechanic for the tile, two to four plain sentences a non-dev can follow for the modal, and the exact rules the hook enforces, one per line.

All GitHub egress lives in one helper, `submit-univ4.py`. It clones the registry, writes the entry, regenerates `hooklist.json` and `HOOKS.md` so the registry's own validation passes, and opens the PR. The helper never puts a token on a command line; it uses the `gh` CLI, which reads `GH_TOKEN` from the environment. It is also idempotent: an address or slug already listed means a safe no-op.

The registry recomputes flags and callbacks from the address on every PR and enforces the schema. The skill supplies the address, the chain, and the human-readable listing. The registry proves the rest.

## How it plays out

These scenarios are hypothetical. There is no local run history for this skill on this instance, so what follows is the mechanism traced forward, labeled as such.

### Hypothetical: the auto-list

An Aeon instance deploys a dynamic-fee hook to Base through `deploy-uni-hook`. The deploy succeeds, the ledger gets a record, and the deploy skill calls the same submission helper directly. Minutes after the contract lands, a PR is open against `aeonfun/univ4-hooks` with the name, category, and plain-language rules filled in. The pattern: when publishing is wired into the deploy path, discoverability stops being a separate chore someone has to remember.

### Hypothetical: the resubmit

An older mainnet deploy never auto-listed, maybe the registry was down, maybe the chain was unsupported at the time. The operator runs submit-hook by hand with the hook address. The skill finds the matching ledger record, passes the gates, and either opens the PR or reports `already listed`. The pattern: an idempotent submitter turns "did this ever get published?" from an investigation into a single safe re-run.

## The ledger is a queue, not an archive

The mental-model shift: stop reading the deploy ledger as a history file. Read it as a backlog of things waiting to be published. Every mainnet record in `hook-deploys.json` is either listed on the registry or it is pending, and submit-hook is the worker that drains the queue. Degrade rules (`SUBMIT_HOOK_NONE`, `SUBMIT_HOOK_SKIP`, the issue fallback) exist so the worker never fails hard and never loses an item. An agent that treats its own output this way ships artifacts that find users, instead of artifacts that find a folder.

## Ship it

submit-hook is in the official Aeon catalog at [aeon.fun](https://aeon.fun) and in the repo at [github.com/aeonfun/aeon](https://github.com/aeonfun/aeon). Browse [all Aeon skills]({{ "/skills/" | relative_url }}) to see what else runs on the schedule.

Deploy a hook, and let the agent do the paperwork.

## CODENAME: submit-hook

````markdown
---
name: submit-hook
description: "Submit a deployed Uniswap v4 hook to the public univ4-hooks registry - format the listing, open a PR (issue fallback) so it lists on the hook marketplace."
metadata:
  title: Submit Hook
  category: crypto
  var: "a deployed hook address to submit; empty = the most recent live deploy in the ledger"
  tags:
    - crypto
    - dev
  requires: []
  capabilities:
    - writes_external_host
---

> **${var}** - a hook address (`0x...`) to submit. Empty means the most recent **live mainnet** deploy in `memory/state/hook-deploys.json`.

Today is ${today}. This skill takes a hook this instance already deployed and lists it on the public registry `aeonfun/univ4-hooks` (the source behind the aeon hook marketplace). It does the formatting the registry expects, then opens a PR. The flags and callbacks are decoded from the address by the registry, so this skill only supplies the address, the chain, and the human-readable listing.

The mechanics (clone, write the entry, regenerate the registry, open the PR, fall back to an issue when there is no push access) live in `skills/submit-hook/submit-univ4.py`, so all GitHub egress stays inside that helper.

## What lists, and what does not

- **Only live mainnet deploys.** A dry-run or a testnet deploy is never submitted (the registry lists real, verifiable hooks). Skip with `SUBMIT_HOOK_SKIP`.
- **Only registry-supported chains.** The registry's `chains.json` covers `ethereum base robinhood monad bnb arbitrum unichain`. A deploy on any other chain is skipped (`SUBMIT_HOOK_UNSUPPORTED_CHAIN`); note it and stop.
- **Idempotent.** The helper skips if the address (any chain) or the slug is already listed, so re-running is safe.

## Steps

1. **Pick the deploy.** Read `memory/state/hook-deploys.json` (a list of deploy records). If `${var}` is a `0x...` address, select the record whose `hookAddress` matches it; else select the most recent record with `network: "mainnet"`. No matching record means notify and exit `SUBMIT_HOOK_NONE`.

2. **Gate it.** If the record's `network` is not `mainnet`, exit `SUBMIT_HOOK_SKIP`. If its `chain` is not one of `ethereum base robinhood monad bnb arbitrum unichain`, exit `SUBMIT_HOOK_UNSUPPORTED_CHAIN` (the registry cannot list it yet). Confirm `int(hookAddress,16) & 0x3FFF == int(flags,16)`; if not, the record is inconsistent, so notify and exit `SUBMIT_HOOK_BAD_RECORD`.

3. **Name it.** Derive a PascalCase contract-style `name` from the record's `brief`/feature (a market-hours gate becomes `MarketHoursGate`). This is the marketplace title and the `hooks/<slug>.json` filename.

4. **Classify it.** From the `brief` and `flagNames`, choose:
   - `category`: one of `Fees Rewards Access Games Orders Launch`. A gate/allowlist is `Access`; a fee/volatility hook is `Fees`; a tribute/buyback/leaderboard is `Rewards`; a block/price/volume game is `Games`; limit/async/MEV ordering is `Orders`; launch/anti-bot/anti-rug is `Launch`.
   - `klass`: `VALUE` if the hook returns a delta or moves tokens (a `*ReturnDelta` flag), `FEE` if it sets a dynamic LP fee, else `GATE`.
   - `template`: map the record's template. `dynamic` stays `dynamic`, `noop` stays `noop`, anything else (`freeform`/`skim`) becomes `freeform`.

5. **Write the listing prose** from the brief:
   - `mechanic`: one punchy line for the tile.
   - `plain`: 2-4 plain-language sentences a non-dev follows, for the modal.
   - `rules`: the exact rules the hook enforces, one per line (2-4).

6. **Submit.** Run the helper (a live mainnet deploy that cleared this instance's deploy gates lists as an aeon, verified hook):
   ```bash
   python3 skills/submit-hook/submit-univ4.py \
     --address "$HOOK_ADDRESS" --chain "$CHAIN" \
     --name "$NAME" --category "$CATEGORY" --klass "$KLASS" \
     --template "$TEMPLATE" --stage deployed --source aeon --verified \
     --date "$(echo "$TIMESTAMP" | cut -c1-10)" \
     --mechanic "$MECHANIC" --plain "$PLAIN" \
     --rule "$RULE1" --rule "$RULE2" [--rule "$RULE3"]
   ```
   Add `--dry-run` first to print the entry and the intended action without touching the registry, then drop it to actually open the PR. The helper prints the PR URL (or the issue URL on a fallback, or `already listed`).

7. **Notify + exit.** Send a short note (hook name, chain, PR/issue URL). Exit `SUBMIT_HOOK_OK` (PR/issue opened or already listed).

## Degrade rules

- No ledger or no matching record: `SUBMIT_HOOK_NONE` (notify, never fail hard).
- Testnet or dry-run deploy: `SUBMIT_HOOK_SKIP`.
- Chain not in the registry: `SUBMIT_HOOK_UNSUPPORTED_CHAIN`.
- `flags != address & 0x3FFF` in the record: `SUBMIT_HOOK_BAD_RECORD`.
- No push access to the registry: the helper files the structured submission issue instead and still exits `SUBMIT_HOOK_OK`.

## Notes

- The registry validates every PR: flags/callbacks are recomputed from the address, the schema is enforced, and the aggregated `hooklist.json` is checked. The helper regenerates `hooklist.json` + `HOOKS.md` before pushing so that check passes.
- `deploy-uni-hook` calls this same helper on a successful live deploy, so a hook usually lists itself the moment it lands. Run this skill by hand to resubmit an older deploy or one that failed to auto-list.
- The helper never puts a token on a command line. It uses the `gh` CLI, which reads `GH_TOKEN` from the environment.
````

---

submit-hook ships as part of the open Aeon catalog. Grab the framework at [github.com/aeonfun/aeon](https://github.com/aeonfun/aeon), browse the full skill list at [aeon.fun](https://aeon.fun), and wire your own deploys to publish themselves.
