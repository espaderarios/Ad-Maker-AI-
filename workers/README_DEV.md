Local dev notes for the Worker

Required bindings and secrets
- D1 database: binding `DB` (already configured in `wrangler.toml`)
- R2 bucket (optional for media upload): binding `MEDIA_BUCKET` (add to `wrangler.toml` under `r2_buckets`)
- Secrets / env vars:
  - `JWT_SECRET` (must be set in production)
  - `FRONTEND_URL` (optional, used for password reset links)

How to set local dev vars
- Create `workers/.dev.vars` with entries like:
  JWT_SECRET=your-local-secret
  FRONTEND_URL=http://localhost:5173

Set production secrets
- Run from repo root:
  ```powershell
  # set JWT_SECRET for production
  echo -n "your-production-secret" | npx wrangler secret put JWT_SECRET --env production
  # set FRONTEND_URL
  echo -n "https://your-frontend.example" | npx wrangler secret put FRONTEND_URL --env production
  ```

Add an R2 binding in `wrangler.toml` (example):

[r2_buckets]
# Replace with your bucket name and binding
# binding = "MEDIA_BUCKET"
# bucket_name = "your-r2-bucket-name"

Bundling for production
- From `workers/` run `npm install` then `npm run build` to produce `dist/index.js` (bundled with esbuild).
- Then `npx wrangler publish --env production` to deploy.
