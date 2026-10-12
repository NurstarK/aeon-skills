#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
MSG="$(cat digest.md)"
./notify "$MSG"
