Param()

Write-Host "Deploy script for Cloudflare Workers + D1 (PowerShell)"

Push-Location -Path (Join-Path $PSScriptRoot "..")
Set-Location -Path "workers"

Write-Host "Installing worker dependencies..."
npm ci

Write-Host "Building worker bundle..."
npm run build

Write-Host "Ensure you're authenticated with Cloudflare (wrangler login) or set CLOUDFLARE_API_TOKEN."
Write-Host "Publishing worker..."
wrangler publish

Write-Host "Running D1 schema migration..."
try {
  wrangler d1 execute --binding DB migrations/init.sql
  Write-Host "(Optional) To import exported data run: wrangler d1 execute --binding DB migrations/import_data.sql"
} catch {
  Write-Warning "wrangler d1 execute failed or wrangler not available. Install Wrangler and try again."
}

Write-Host "Deploy complete. Remember to set secrets before or after deploy:"
Write-Host "  wrangler secret put JWT_SECRET"
Write-Host "  wrangler secret put FRONTEND_URL"

Pop-Location
