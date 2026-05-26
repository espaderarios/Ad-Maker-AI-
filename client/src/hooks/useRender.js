import { useEffect, useRef, useState } from 'react';
import { fetchRenderStatus, getRenderDownloadUrl, queueRender } from '../services/render.service.js';

export function useRender() {
  const [isRendering, setIsRendering] = useState(false);
  const [renderJob, setRenderJob] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef(null);

  useEffect(() => () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  }, []);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const pollStatus = async (renderId) => {
    const status = await fetchRenderStatus(renderId);
    setRenderJob(status);
    setProgress(status.progress ?? (status.status === 'completed' ? 100 : 0));

    if (status.status === 'completed' || status.status === 'failed') {
      setIsRendering(false);
      stopPolling();
    }

    return status;
  };

  const start = async (projectId, options = {}) => {
    setError('');
    setIsRendering(true);
    setProgress(0);

    try {
      const response = await queueRender(projectId, options);
      setRenderJob(response.renderJob);
      setProgress(response.renderJob?.progress ?? 0);

      if (response.renderJob?.id) {
        stopPolling();
        const latestStatus = await pollStatus(response.renderJob.id);

        if (latestStatus.status !== 'completed' && latestStatus.status !== 'failed') {
          pollingRef.current = setInterval(() => {
            pollStatus(response.renderJob.id).catch((pollError) => {
              setError(pollError.message);
              setIsRendering(false);
              stopPolling();
            });
          }, 2000);
        }
      } else {
        setIsRendering(false);
      }

      return response;
    } catch (pollError) {
      setError(pollError.message);
      setIsRendering(false);
      stopPolling();
      throw pollError;
    }
  };

  const downloadUrl = renderJob?.outputUrl ? getRenderDownloadUrl(renderJob.outputUrl) : '';

  return {
    startRender: start,
    isRendering,
    renderJob,
    error,
    progress,
    downloadUrl,
    refreshRenderStatus: renderJob?.id ? () => pollStatus(renderJob.id) : async () => null,
  };
}
