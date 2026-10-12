---
title: "Create Prove: a green diff is not proof"
date: 2026-10-06
categories: [article]
description: "Create Prove runs a changed Aeon skill through its real GitHub Actions workflow and attaches SHA-bound behavioral evidence to the pull request."
---

Create Prove is an official Aeon catalog skill. Aeon is an autonomous agent that lives on GitHub Actions, powered by Claude Code, and its skills are markdown files it executes on schedule or on dispatch. This one landed upstream on 2026-09-18.

Its job is narrow. Point it at a pull request that changes exactly one runnable skill, pinned to an exact commit SHA, and it runs that skill for real through the repository's own `aeon.yml` workflow. Then it posts the evidence back to the PR as a machine-readable receipt.

## Review tells you the code reads well. It cannot tell you the code ran.

The default PR workflow throws away the one question that matters. A reviewer reads the diff, CI lints and type-checks, everyone nods, merge. Nobody ever watched the changed skill actually execute. For an agent whose skills are prose instructions, that gap is enormous. The markdown can be beautiful and the behavior can be broken.

Create Prove is built on one contrast, straight from its own instructions: a green diff review is not proof, a successful correlated Actions run is proof. Everything else in the skill exists to make that second thing cheap and tamper-resistant.

## Mechanics

The target is immutable by construction. The input must match `owner/repo#pr@40-character-sha` exactly. Anything else exits `PROVE_INVALID_TARGET`. Before dispatching, the skill checks that the PR is open, that its current head SHA equals the expected one, that the head branch lives in the same repository, and that the diff touches exactly one `skills/<slug>/SKILL.md`. Any mismatch exits `PROVE_UNSUPPORTED` or `PROVE_STALE` with no receipt posted.

The run is real, not simulated. The skill reads the changed skill's frontmatter and picks the smallest real, non-destructive variable that exercises the changed behavior. No synthetic credentials, no dry-run mode. If no safe real invocation exists, it exits `PROVE_UNSAFE` instead of inventing evidence.

Correlation is strict. The dispatch carries a unique ID that must start with the literal prefix `prove-`, which the workflow's commit-skip guard recognizes so the proof run never commits back to the branch it is proving. The skill then finds the run by its exact correlated title, never by grabbing the newest run for that skill. It waits up to 30 minutes, requires `status=completed` and `conclusion=success`, and rejects runs whose captured output is empty with `PROVE_MISSING_EVIDENCE`.

Only after every gate passes, and after re-checking that the head SHA has not moved, does it post one PR comment: a description of the exercised path, the run URL, an output excerpt, and a single-line JSON receipt with `"verdict":"proven"` bound to that SHA. It never merges, approves, or modifies the PR. One hard rule on top: it refuses to prove itself, exiting `PROVE_UNSUPPORTED` rather than recursing.

## How it plays out

These scenarios are hypothetical. This instance has no local run history for create-prove yet. They follow the skill's written steps, not logged runs.

### A digest skill changes its output format

A PR edits `skills/daily-digest/SKILL.md` to restructure the output. Create Prove gets `owner/repo#42@<sha>`, verifies the gates, picks a small real variable, and dispatches `aeon.yml` on the PR's head branch with a `prove-42-...` dispatch ID. Twenty minutes later the correlated run is green with captured output, the head SHA still matches, and the PR gets a receipt comment pointing at the exact run. The pattern: the reviewer's claim "this works" becomes a link to a run where it worked, pinned to the commit being merged.

### The author pushes mid-proof

Same setup, but while the proof run executes, the author force-pushes a fix. When Create Prove re-reads the PR before posting, the head SHA no longer equals the expected one. It exits `PROVE_STALE` and posts nothing. The evidence belonged to a commit that no longer exists at the head, so no receipt. The pattern: a proof that cannot go stale silently is worth more than a proof that arrives every time.

## Proof is an artifact, not an opinion

The mental-model shift is small and permanent. Stop treating "verified" as a state of mind a reviewer reaches and start treating it as an object: a run ID, a URL, an output excerpt, and a SHA, welded together in one machine-readable line. Once proof is an artifact, absence of proof is visible too. A PR without a receipt simply has not been proven, and the skill's fail-closed exit codes make every reason for that absence explicit.

## Ship it

Create Prove is in the official Aeon catalog at [aeon.fun](https://aeon.fun) and ships with the repo at [github.com/aeonfun/aeon](https://github.com/aeonfun/aeon). Browse [all Aeon skills]({{ "/skills/" | relative_url }}) to see what else runs on the loop. Drop the skill in, open a PR against one skill, and make your agent earn the word proven.

## CODENAME: create-prove

````markdown
---
name: create-prove
description: Run a changed Aeon skill for real and attach SHA-bound behavioral evidence to its PR
metadata:
  title: Create Prove
  category: dev
  mode: write
  var: ""
  tags:
    - dev
    - verification
  permissions:
    - contents:read
    - actions:write
    - pull-requests:write
  commits: false
---
> **${var}** - Required immutable target in the form `owner/repo#pr@40-character-lowercase-sha`.

Today is ${today}. Prove the behavior of one Aeon-shaped change by running the changed skill through the target repository's real `aeon.yml` workflow. A green diff review is not proof. A successful, correlated Actions run is proof.

## Scope

This first implementation supports Aeon-shaped pull requests that change exactly one runnable `skills/<slug>/SKILL.md`. It does not launch conventional applications and it does not guess which skill represents a workflow-only or configuration-only change. Unsupported target shapes must fail closed without posting a proof receipt.

Never prove `create-prove` by recursively dispatching itself. Exit `PROVE_UNSUPPORTED` instead.

## Steps

1. Parse `${var}` into `target=owner/repo#pr` and `expected_sha`. Reject any value outside the exact grammar above with `PROVE_INVALID_TARGET`.
2. Read the PR through `gh api`. Require all of the following:
   - the PR is open;
   - its current `head.sha` equals `expected_sha`;
   - its head branch belongs to the same repository, because `gh workflow run --ref` cannot execute an untrusted fork branch in the base repository;
   - exactly one changed path matches `skills/<slug>/SKILL.md`;
   - the slug is not `create-prove`.
   Any mismatch exits `PROVE_UNSUPPORTED` or `PROVE_STALE` without a receipt.
3. Inspect the changed skill's frontmatter and instructions. Choose the smallest real, non-destructive variable that exercises the changed behavior. If no safe real invocation exists, exit `PROVE_UNSAFE` rather than inventing evidence. Do not use synthetic credentials or a dry-run mode.
4. Dispatch the target branch's workflow by filename, with a unique correlation ID whose `dispatch_id` **must start with the literal prefix `prove-`** — `.github/workflows/aeon.yml`'s commit-skip guard only recognizes that exact prefix to know this run is being proved, not a normal dispatch, and must not commit or push to the branch it's proving. Getting this prefix wrong silently defeats the immutable-head guarantee this whole skill exists to provide:
   ```bash
   dispatch_id="prove-${pr_number}-$(date -u +%Y%m%dT%H%M%SZ)-${RANDOM}"
   gh workflow run aeon.yml --repo "$repo" --ref "$head_branch" \
     -f skill="$skill" -f var="$proof_var" -f dispatch_id="$dispatch_id"
   ```
   Discover the run only by the exact correlated run title, using the same rule as `chain-runner.yml`. Never select merely the newest run for that skill.
5. Wait up to 30 minutes. Require `status=completed` and `conclusion=success`. Fetch the run log and the captured skill output. Confirm the output is non-empty and does not contain `_No output captured._`. A successful Actions wrapper with no captured behavior is `PROVE_MISSING_EVIDENCE`.
6. Re-read the PR and require its head SHA still equals `expected_sha`.
7. Post one PR comment containing a concise description of the exercised path, the run URL, a short output excerpt, and exactly one final machine receipt:
   ```text
   <!-- aeon-proof:{"schema":1,"target":"owner/repo#N","sha":"<sha>","kind":"aeon-skill","skill":"<slug>","evidence_run_id":123,"evidence_url":"https://github.com/owner/repo/actions/runs/123","verdict":"proven"} -->
   ```
   Construct the JSON with `jq -cn`, then render it on one line. Do not post the receipt until every gate above passes.
8. End with the target, skill, run ID, run URL, and `PROVE_VERDICT=proven` in the captured output.

## Constraints

- The proof run must execute the PR head branch, not `main`.
- Never treat CI checks, source inspection, or the prior review receipt as behavioral evidence.
- Never post a `proven` receipt for a failed, cancelled, timed-out, stale, empty-output, unsupported, or unsafe run.
- Do not merge, close, approve, or modify the target PR.
- Do not commit repository files.

## Network note

Use `gh` for every GitHub read, dispatch, log fetch, and PR comment. Authentication is provided by the workflow. Never print tokens or place secret values on a command line.

## Log

Append the result to `memory/logs/${today}.md` under `### create-prove`, including the target, SHA, selected skill, evidence run ID, and terminal verdict. The workflow may persist the captured output on your behalf.
````

---

Create Prove ships in the official Aeon catalog at [aeon.fun](https://aeon.fun), source at [github.com/aeonfun/aeon](https://github.com/aeonfun/aeon). If you are building agents that ship their own changes, come make them show receipts.
