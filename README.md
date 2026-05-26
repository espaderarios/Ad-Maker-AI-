# AI Video Ad Maker

Monorepo scaffold for a React + Express + Remotion video ad maker.

## Workspace

- `client/` React + Vite frontend
- `server/` Node.js + Express backend
- `remotion/` dedicated rendering project
- `shared/` shared constants, schemas, types, and prompts

## Getting started

Install dependencies in each package, then run the client and server dev scripts.

## Cloudflare Workers + D1 (optional)

This repo includes a scaffold to migrate the backend to Cloudflare Workers + D1 under `workers/`.
See [docs/CLOUDFLARE_MIGRATION.md](docs/CLOUDFLARE_MIGRATION.md) for steps to deploy.
