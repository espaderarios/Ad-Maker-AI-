# Security checklist

1. Rotate exposed credentials immediately
   - In Atlas: change the DB user password that was posted publicly.
   - Regenerate any API keys (OpenAI) shown in `server/.env`.

2. Remove secrets from the repository
   - `server/.env` should contain only placeholders; secrets must be set in your host environment.
   - Keep `.env` listed in `.gitignore` (already present).

3. Use a secrets manager for production
   - Use Vercel/Netlify/Heroku/AWS/Azure secret storage instead of committed files.

4. Lock down network access
   - Do not use `0.0.0.0/0` in Atlas Network Access for production. Whitelist specific IPs or use VPC peering.

5. JWT & auth
   - Set a strong `JWT_SECRET` in production and rotate if leaked.
   - Implement email verification and password reset flows (scaffolding added in `server/src/controllers/auth.controller.js`).

6. Additional hardening
   - Enable Atlas backups and alerts.
   - Add rate limiting to auth endpoints and logging for suspicious activity.

Follow these steps now to secure your project.
