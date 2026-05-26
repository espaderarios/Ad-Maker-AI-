#!/usr/bin/env bash
set -euo pipefail

# Deploy script for Cloudflare Workers + D1
# Usage: ensure `wrangler` is installed and you're logged in (wrangler login) or set CLOUDFLARE_API_TOKEN.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR/workers"

echo "Installing worker dependencies..."
npm ci

echo "Building worker bundle..."
npm run build

echo "Ensure you're authenticated with Cloudflare (wrangler login) or set CLOUDFLARE_API_TOKEN."
echo "Publishing worker..."
wrangler publish

echo "Running D1 schema migration..."
if command -v wrangler >/dev/null 2>&1; then
  wrangler d1 execute --binding DB migrations/init.sql || true
  echo "(Optional) To import exported data run: wrangler d1 execute --binding DB migrations/import_data.sql"
else
  echo "wrangler not found; skipping D1 migration. Install wrangler to run migrations."
fi

echo "Deploy complete. Remember to set secrets before or after deploy:"
echo "  wrangler secret put JWT_SECRET"
echo "  wrangler secret put FRONTEND_URL"
