import { APIClient } from './client.js';
import { env } from '../config/env.js';

const WORKER_BASE = env.workerBase || '';

function baseUrl(path) {
  if (WORKER_BASE) return `${WORKER_BASE}${path}`;
  return path; // APIClient will prefix with API_BASE
}

export async function getProjects() {
  if (WORKER_BASE) {
    const res = await fetch(baseUrl('/projects'), { headers: APIClient.getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  return APIClient.get('/projects');
}

export async function createProject(title, description) {
  if (WORKER_BASE) {
    const res = await fetch(baseUrl('/projects'), {
      method: 'POST',
      headers: APIClient.getHeaders(),
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  return APIClient.post('/projects', { title, description });
}

export async function getProject(id) {
  return APIClient.get(`/projects/${id}`);
}

export async function updateProject(id, data) {
  return APIClient.put(`/projects/${id}`, data);
}

export async function deleteProject(id) {
  return APIClient.delete(`/projects/${id}`);
}

export async function uploadMediaBase64(projectId, filename, contentBase64, contentType) {
  return APIClient.post(`/projects/${projectId}/media`, { filename, contentBase64, contentType });
}
