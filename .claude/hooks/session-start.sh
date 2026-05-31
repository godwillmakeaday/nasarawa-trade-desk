#!/usr/bin/env bash
# SessionStart hook: prepare a fresh container so Claude Code can lint,
# typecheck, test, and build before pushing. Safe to run repeatedly.
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# Install dependencies only when missing or stale.
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "[session-start] Installing dependencies..."
  npm install --no-audit --no-fund
else
  echo "[session-start] Dependencies present; skipping install."
fi

# Generate the Prisma client so type-aware code and builds work offline.
echo "[session-start] Generating Prisma client..."
npm run db:generate >/dev/null 2>&1 || echo "[session-start] prisma generate failed (continuing)."

echo "[session-start] Ready: npm run lint | typecheck | test | build"
