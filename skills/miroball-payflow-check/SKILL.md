---
name: miroball-payflow-check
description: Verifies MiroBall's visitor-paid run flow is actually live — config flag, Privy in the shipped bundle, and a real 402 challenge from the x402 relay. Silent when healthy; notifies on state change only.
var: ""
tags: [dev, monitoring, x402]
---
> **${var}** — Optional base URL to check. Defaults to `https://miroball.com`. Set to `dry-run` to run every check and report without notifying.

Today is ${today}. Read `memory/MEMORY.md` before starting.

## Why this skill exists

MiroBall's visitor-paid runs are gated on a **build-time** constant:
`accountsConfigured = NEXT_PUBLIC_PRIVY_APP_ID.length > 0`. `NEXT_PUBLIC_*` is
inlined by `next build`, and `.dockerignore` excludes `ui/.env.local` from the
Docker context, so the id only reaches a deploy via
`fly deploy --build-arg NEXT_PUBLIC_PRIVY_APP_ID=...`.

Forget that arg and **the build still succeeds** — it just ships with no
sign-in, no deposits, and no paid runs. There is no error, no warning, no log
line. That exact failure sat on production undetected: the flow worked on
`localhost` (where Next auto-loads `.env.local`) while the live site served a
bundle with zero Privy in it.

This skill is the detector for that silent mode, plus the two other ways the
paid path can die without anything looking broken.

## Guardrail: never spend money

The check sends **no `X-PAYMENT` header**, ever. An unpaid POST to the relay can
only ever collect a 402 challenge — that is the whole point of the test. Do not
sign a payment, do not call MiroShark directly, do not set `MIROBALL_LIVE`.

## Steps

### 1. Resolve the target

```bash
BASE="${var:-https://miroball.com}"
case "$BASE" in dry-run) BASE="https://miroball.com"; DRY=1 ;; esac
export BASE DRY
```

### 2. Site is up

```bash
curl -sL -o /tmp/mb.html --max-time 30 -w "%{http_code}" "$BASE"
```
Not 200 → record `SITE_DOWN` and skip to step 6. Everything downstream is moot.

### 3. Server-side flag

```bash
curl -s --max-time 25 "$BASE/api/config"
```
Expect `"visitorPay": true`.

- `visitorPay: false` → the deploy is missing the build-arg.
- key **absent entirely** → an image older than the account layer is deployed.

### 4. Privy is in the shipped bundle

This is a **separate** check from step 3 and both are needed. `visitorPay` is a
runtime env read by Express; the UI gate is baked into the client bundle at
build time. A deploy that sets the env var at runtime but not at build time
reports `visitorPay: true` while the browser still has no sign-in button.

```bash
for c in $(grep -oE '/_next/static/chunks/[A-Za-z0-9_.-]+\.js' /tmp/mb.html | sort -u | head -40); do
  curl -s --max-time 20 "$BASE$c" | grep -qi "privy" && { echo "FOUND $c"; break; }
done
```
No chunk mentions Privy → the bundle was built without the app id.

### 5. The relay returns a real 402

```bash
MID=$(curl -s --max-time 25 "$BASE/api/fixtures" | python3 -c "
import sys,json
d=json.load(sys.stdin)
def walk(o):
    if isinstance(o,dict):
        if 'id' in o and ('home' in o or 'homeFull' in o): yield o['id']
        for v in o.values(): yield from walk(v)
    elif isinstance(o,list):
        for v in o: yield from walk(v)
ids=list(walk(d)); print(ids[0] if ids else '')")

curl -s -D /tmp/mb.hdr -o /tmp/mb.402 --max-time 40 -w "%{http_code}" \
  -X POST -H 'content-type: application/json' \
  -d "{\"matchId\":\"$MID\",\"deepResearch\":false}" \
  "$BASE/api/x402/simulate"
```

A healthy answer is **HTTP 402** with a `payment-required` header and a body
carrying `x402Version: 1`, `network: "base"`, and a positive
`maxAmountRequired` (`1000000` = $1.00 USDC at the current price).

Read these as follows:

| Observed | Meaning |
|---|---|
| 402 + header + `network: base` | **Healthy.** The relay reached MiroShark and passed the challenge through. |
| 404 with `Unknown match id` | Route is live, the fixture id went stale. Re-run step 5 with the next id before calling it a failure. |
| 404 from Express (no JSON body) | An image older than the account layer is deployed. |
| 500 / 502 | Relay broke, or MiroShark's x402 host is down. Distinguish by curling `https://x402.miroshark.xyz/run` — a 402 there means the fault is MiroBall's. |
| **200 without a payment** | **Escalate immediately.** The paywall is bypassed and runs are free. This is the only finding worth waking someone for. |
| `maxAmountRequired` ≠ the amount in `/api/config` `price` | Price drift between the two surfaces. Report, don't fail. |

### 6. Verdict, issue, notify

Compose a status from steps 2–5: `HEALTHY`, `DEGRADED` (one check failing), or
`PAYWALL_OPEN` (step 5 returned 200 unpaid).

**Notify on state change only** — this runs on a schedule and a healthy site
must stay silent:

- Read `memory/issues/` for an open `miroball-payflow` issue.
- `HEALTHY` and no open issue → append one line to `memory/logs/${today}.md`
  (`MIROBALL_PAYFLOW_OK — visitorPay=true, bundle=privy, relay=402`) and **exit
  without notifying**.
- `HEALTHY` and an open issue → resolve the issue and `./notify` once that the
  paid flow recovered, naming how long it was broken.
- `DEGRADED` → file or bump the issue in `memory/issues/`. Notify on the first
  failure and then at most once every 24h while it stays broken. Name the failed
  check and its likely cause from the tables above, plus the fix:
  `fly deploy -a miroball --build-arg NEXT_PUBLIC_PRIVY_APP_ID=<id>`.
- `PAYWALL_OPEN` → notify immediately, every run, no 24h damping.
- `SITE_DOWN` → one notification; do not re-notify on consecutive down runs
  beyond the daily cadence. Fly health, not this flow.

## Voice

State the verdict first, then the evidence. Name the failing check and the exact
command that fixes it. No hedging, no "may be experiencing issues."
