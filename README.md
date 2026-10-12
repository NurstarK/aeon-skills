# aeon-skills

A snapshot of the skills and dashboard code from my [Aeon](https://github.com/aeonfun/aeon)
instance — 156 agent skills covering research, monitoring, content, crypto/DeFi
tracking, security scanning, and release workflows, plus the dashboard that renders
their output.

## Credit

Aeon is created and maintained by **Aaron Jardine-Mars**
([@aaronjmars](https://x.com/aaronjmars)). The canonical repository is
**[aeonfun/aeon](https://github.com/aeonfun/aeon)** — go there for the framework
itself, its documentation, and the official skill catalog. I'm a contributor to
that project; this repository is the set of skills I've built on top of it, not
the framework and not a replacement for it. Skills that ship with Aeon upstream
are deliberately excluded here — get those from the canonical repo, where they
stay current.

Licensed MIT, copyright Aaron Mars — see [LICENSE](LICENSE).

## Layout

| Path | Contents |
|---|---|
| `skills/` | 156 skills, one directory each, `SKILL.md` per skill |
| `dashboard/` | Next.js app that renders skill output |
| `aeon-remotion-listing/` | Remotion video templates |
| `docs/` | notes and posts |
| `scripts/` | helper scripts, including a dry-run harness |
| `templates/`, `examples/`, `workflows/` | scaffolding |

## What's deliberately not here

This repository contains skill definitions and application code only. Operational
output — run logs, agent memory, drafts, and scan results — stays private.

That matters most for the security skills (`vuln-scanner`, `vuln-tracker`,
`disclosure-tracker`). The methodology is public here; individual findings are not.
`vuln-scanner` routes each finding by type — dependency CVEs to a public patch PR,
unpatched code flaws to GitHub Private Vulnerability Reporting, and nothing at all
when no safe channel exists. Findings are published only after maintainers have
been contacted and a fix has shipped.

## Status

A snapshot, not a maintained distribution. Skills reference paths, environment
variables, and external services specific to my setup; expect to adapt them.
