import { APIClient } from './client.js';

export async function startRender(projectId, options = {}) {
  if (!projectId) {
    throw new Error('projectId is required');
  }

  return APIClient.post('/render/render', {
    projectId,
    templateId: options.templateId || 'default',
    duration: options.duration || 5,
    format: options.format || 'mp4',
  });
}

export async function getRenderStatus(renderId) {
  if (!renderId) {
    throw new Error('renderId is required');
  }

  return APIClient.get(`/render/status/${renderId}`);
}
