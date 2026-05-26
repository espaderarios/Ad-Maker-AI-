import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Cloudflare Worker entry. Assumes D1 is bound as `env.DB` and JWT_SECRET is set in worker env.
// Note: This is a scaffold. Bundle dependencies with a build step before deploying.

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const renderJobs = new Map();

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

async function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) },
  });
}

async function queryDB(db, sql, params = []) {
  const res = await db.prepare(sql).bind(...params).all();
  return res.results;
}

function parseIdFromPath(path, base) {
  const re = new RegExp(`^${base}/(\\d+)$`);
  const m = path.match(re);
  return m ? Number(m[1]) : null;
}

function parseRenderIdFromPath(path) {
  const match = path.match(/^\/render\/status\/([^/]+)$/);
  return match ? match[1] : null;
}

function getAuthToken(request) {
  const auth = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.substring(7);
}

async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch (e) {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const db = env.DB;

    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: getCorsHeaders(request) });
      }

      if (request.method === 'POST' && path === '/auth/signup') {
        const { email, password, name } = await request.json();
        if (!email || !password) return jsonResponse(request, 400, { error: 'Email and password required' });

        const exists = await queryDB(db, 'SELECT id FROM users WHERE email = ?', [email]);
        if (exists.length) return jsonResponse(request, 409, { error: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        await db.prepare('INSERT INTO users (email, password, name, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').bind(email, hashed, name || null).run();

        const row = await queryDB(db, 'SELECT id, email, name FROM users WHERE email = ?', [email]);
        const user = row[0];
        const token = await new SignJWT({ userId: user.id, email: user.email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(new TextEncoder().encode(JWT_SECRET));
        return jsonResponse(request, 201, { token, user });
      }

      // Fal-only AI route kept at /ai/replicate for backward compatibility with the client.
      if (path === '/ai/replicate' && request.method === 'POST') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const body = await request.json();
        const falModel = body.falModel || 'fal-ai/veo3';
        const input = body.input || { prompt: body.prompt || '' };

        if (!env.FAL_API_TOKEN) {
          return jsonResponse(request, 501, { error: 'FAL_API_TOKEN not configured' });
        }

        try {
          const falResp = await fetch(`https://fal.run/${encodeURIComponent(falModel)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Key ${env.FAL_API_TOKEN}`,
            },
            body: JSON.stringify(input),
          });

          const text = await falResp.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = { raw: text };
          }

          return new Response(JSON.stringify({ model: falModel, data }), { status: falResp.status, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        } catch (err) {
          return jsonResponse(request, 500, { error: String(err) });
        }
      }

      // Fal status polling is model-specific. Keep endpoint but return clear guidance.
      if (path.startsWith('/ai/replicate/status/') && request.method === 'GET') {
        return jsonResponse(request, 501, {
          error: 'Status endpoint not supported for Fal.run via this proxy. Use model-specific Fal status APIs if needed.',
        });
      }

      // Direct Fal route.
      if (path === '/ai/fal' && request.method === 'POST') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const body = await request.json();
        const model = body.model || 'fal-ai/veo3';
        const input = body.input || body;

        if (!env.FAL_API_TOKEN) {
          return jsonResponse(request, 501, { error: 'FAL_API_TOKEN not configured' });
        }

        try {
          const resp = await fetch(`https://fal.run/${encodeURIComponent(model)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Key ${env.FAL_API_TOKEN}`,
            },
            body: JSON.stringify(input),
          });

          const text = await resp.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = { raw: text };
          }
          return new Response(JSON.stringify({ model, data }), { status: resp.status, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        } catch (err) {
          return jsonResponse(request, 500, { error: String(err) });
        }
      }

      if (request.method === 'POST' && path === '/auth/login') {
        const { email, password } = await request.json();
        if (!email || !password) return jsonResponse(request, 400, { error: 'Email and password required' });

        const rows = await queryDB(db, 'SELECT id, email, password, name FROM users WHERE email = ?', [email]);
        if (!rows.length) return jsonResponse(request, 401, { error: 'Invalid credentials' });
        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return jsonResponse(request, 401, { error: 'Invalid credentials' });
        const token = await new SignJWT({ userId: user.id, email: user.email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(new TextEncoder().encode(JWT_SECRET));
        delete user.password;
        return jsonResponse(request, 200, { token, user });
      }

      if (request.method === 'POST' && path === '/auth/forgot-password') {
        const { email } = await request.json();
        const rows = await queryDB(db, 'SELECT id FROM users WHERE email = ?', [email]);
        if (!rows.length) return jsonResponse(request, 404, { error: 'User not found' });
        const token = await new SignJWT({ userId: rows[0].id, type: 'reset' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(JWT_SECRET));
        const resetUrl = `${env.FRONTEND_URL || 'https://your-site.example'}/reset-password?token=${token}`;
        return jsonResponse(request, 200, { resetUrl });
      }

      if (path === '/render/render' && request.method === 'POST') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const { projectId, templateId, duration, format, resolution } = await request.json();
        if (!projectId) return jsonResponse(request, 400, { error: 'projectId is required' });

        const projectRows = await queryDB(db, 'SELECT id, user_id, title FROM projects WHERE id = ?', [projectId]);
        if (!projectRows.length) return jsonResponse(request, 404, { error: 'Project not found' });
        if (projectRows[0].user_id !== payload.userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const renderId = globalThis.crypto?.randomUUID?.() || `render_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const job = {
          id: renderId,
          projectId: String(projectId),
          templateId: templateId || 'default',
          duration: Number(duration) || 5,
          format: format || 'mp4',
          resolution: resolution || '1080x1920',
          status: 'queued',
          progress: 0,
          outputUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        renderJobs.set(renderId, job);

        return jsonResponse(request, 202, {
          message: 'Render queued',
          renderJob: job,
        });
      }

      if (path.startsWith('/render/status/') && request.method === 'GET') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const renderId = parseRenderIdFromPath(path);
        if (!renderId) return jsonResponse(request, 400, { error: 'renderId is required' });

        const job = renderJobs.get(renderId);
        if (!job) return jsonResponse(request, 404, { error: 'Render job not found' });

        const createdAt = new Date(job.createdAt).getTime();
        const elapsedSeconds = Math.max(0, (Date.now() - createdAt) / 1000);
        const nextProgress = Math.min(100, Math.floor(elapsedSeconds * 20));

        if (nextProgress >= 100) {
          job.status = 'completed';
          job.progress = 100;
          job.outputUrl = job.outputUrl || `/renders/${renderId}.${job.format || 'mp4'}`;
        } else if (nextProgress > 0) {
          job.status = 'rendering';
          job.progress = nextProgress;
        }

        job.updatedAt = new Date().toISOString();
        renderJobs.set(renderId, job);

        return jsonResponse(request, 200, {
          ...job,
        });
      }

      if (path === '/projects' && request.method === 'GET') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        const rows = await queryDB(db, 'SELECT id, title, description, status, created_at, updated_at FROM projects WHERE user_id = ?', [payload.userId]);
        return jsonResponse(request, 200, rows);
      }

      if (path === '/projects' && request.method === 'POST') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        const { title, description } = await request.json();
        const runRes = await db.prepare('INSERT INTO projects (title, description, user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').bind(title, description || null, payload.userId, 'draft').run();
        const id = runRes.lastRowId || runRes.lastInsertRowid || runRes.last_insert_rowid || null;
        const proj = await queryDB(db, 'SELECT id, title, description, status, created_at, updated_at FROM projects WHERE id = ?', [id]);
        return jsonResponse(request, 201, proj[0]);
      }

      const projectId = parseIdFromPath(path, '/projects');
      if (projectId && request.method === 'GET') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        const rows = await queryDB(db, 'SELECT id, title, description, status, created_at, updated_at, user_id FROM projects WHERE id = ?', [projectId]);
        if (!rows.length) return jsonResponse(request, 404, { error: 'Not found' });
        if (rows[0].user_id !== payload.userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        delete rows[0].user_id;
        return jsonResponse(request, 200, rows[0]);
      }

      if (projectId && request.method === 'PUT') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        const { title, description, status } = await request.json();
        const rows = await queryDB(db, 'SELECT user_id FROM projects WHERE id = ?', [projectId]);
        if (!rows.length) return jsonResponse(request, 404, { error: 'Not found' });
        if (rows[0].user_id !== payload.userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        await db.prepare('UPDATE projects SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(title, description || null, status || 'draft', projectId).run();
        const updated = await queryDB(db, 'SELECT id, title, description, status, created_at, updated_at FROM projects WHERE id = ?', [projectId]);
        return jsonResponse(request, 200, updated[0]);
      }

      if (projectId && request.method === 'DELETE') {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        const rows = await queryDB(db, 'SELECT user_id FROM projects WHERE id = ?', [projectId]);
        if (!rows.length) return jsonResponse(request, 404, { error: 'Not found' });
        if (rows[0].user_id !== payload.userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });
        await db.prepare('DELETE FROM projects WHERE id = ?').bind(projectId).run();
        return jsonResponse(request, 200, { message: 'Deleted' });
      }

      if (projectId && request.method === 'POST' && path.endsWith('/media')) {
        const token = getAuthToken(request);
        const payload = await verifyToken(token);
        if (!payload) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const rows = await queryDB(db, 'SELECT user_id FROM projects WHERE id = ?', [projectId]);
        if (!rows.length) return jsonResponse(request, 404, { error: 'Not found' });
        if (rows[0].user_id !== payload.userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) } });

        const { filename, contentBase64, contentType } = await request.json();
        if (!filename || !contentBase64) return jsonResponse(request, 400, { error: 'filename and contentBase64 required' });

        if (!env.MEDIA_BUCKET) {
          return jsonResponse(request, 501, { error: 'MEDIA_BUCKET not configured. Media uploads are disabled for this deployment.' });
        }

        const key = `${projectId}/${Date.now()}-${filename}`;
        const buffer = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
        await env.MEDIA_BUCKET.put(key, buffer, { httpMetadata: { contentType: contentType || 'application/octet-stream' } });

        await db.prepare('INSERT INTO media (project_id, url, type, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').bind(projectId, key, contentType || 'file').run();
        return jsonResponse(request, 201, { url: key });
      }

      return new Response('Not found', { status: 404, headers: getCorsHeaders(request) });
    } catch (err) {
      return jsonResponse(request, 500, { error: err.message });
    }
  }
};
