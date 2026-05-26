import { startRender as apiStartRender, getRenderStatus as apiGetRenderStatus } from '../api/render.api.js';
import { env } from '../config/env.js';

export async function queueRender(projectId, options = {}) {
  return apiStartRender(projectId, options);
}

export async function fetchRenderStatus(renderId) {
  return apiGetRenderStatus(renderId);
}

export function getRenderDownloadUrl(outputUrl) {
  if (!outputUrl) {
    return '';
  }

  if (outputUrl.startsWith('http://') || outputUrl.startsWith('https://')) {
    return outputUrl;
  }

  return `${env.apiUrl}${outputUrl}`;
}
