# Cloudflare Workers + D1 Migration Guide

This guide scaffolds a migration from the current Node + Prisma + MongoDB backend to Cloudflare Workers + D1 (SQLite).

Overview
- Workers will host auth endpoints: `/auth/signup`, `/auth/login`, `/auth/forgot-password`.
- D1 will store `users`, `projects`, and `media` in SQL tables (see `workers/migrations/init.sql`).
- You'll need to bundle dependencies (bcryptjs, jsonwebtoken) and deploy with Wrangler.

Steps
1. Install Wrangler

```bash
npm install -g wrangler
# or add dev dep
npm install -D wrangler
```

2. Create a D1 database in Cloudflare Dashboard
- Cloudflare Dashboard -> D1 -> Create database -> name `ad_maker_ai_d1`.
- Note the `wrangler.toml` example in `workers/wrangler.toml`; bind the D1 as `DB`.

3. Run the initial SQL migration
- Use the Cloudflare UI or Wrangler CLI to run `workers/migrations/init.sql` against your D1 database.

4. Bundle and publish Worker
- Project should have a build step that bundles `workers/src/index.js` into `workers/dist/index.js` (esbuild/rollup). Example build script:

```json
"scripts": {
  "build:workers": "esbuild workers/src/index.js --bundle --outfile=workers/dist/index.js --platform=browser --format=esm"
}
```

- Set required environment variables and secrets in Cloudflare (JWT_SECRET, FRONTEND_URL):
  - `wrangler secret put JWT_SECRET` or configure via Cloudflare UI.

- Publish:
```bash
cd workers
wrangler publish
```

5. Migrate existing data from MongoDB
- Export users/projects from MongoDB to JSON with `mongoexport` or a small script.
- Transform JSON to SQL `INSERT` statements (or write a script to insert via D1 REST API or Wrangler).
- Pay attention to id types: Mongo ObjectId -> integer autoincrement in D1 (IDs will change).

6. Update frontend
- Point client API calls to the Worker domain (e.g. `https://ad-maker-ai-workers.<your-subdomain>.workers.dev/auth/login`).
- Frontend auth still stores JWT and uses `Authorization: Bearer <token>` for protected requests.

Notes & Caveats
- D1 is SQLite-based (not Mongo), so complex queries may need rewriting. Prisma is not supported for D1 — use direct SQL queries or a lightweight query builder.
- Bcryptjs and jsonwebtoken are usable but must be bundled. Consider using Web Crypto + jose for JWTs for better worker compatibility.
- Cloudflare Workers have CPU and execution limits — for heavy workloads consider keeping long-running jobs on dedicated servers.

If you want, I can:
- Scaffold the `workers/package.json` with build scripts and dependencies.
- Provide an esbuild config and a simple migration script to move users from Mongo to D1.
- Implement more endpoints (projects CRUD, media uploads wired to R2).

Which of those should I generate next? 
