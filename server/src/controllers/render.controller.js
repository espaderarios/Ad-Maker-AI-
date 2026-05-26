import { prisma } from '../config/db.js';
import { renderJob } from '../jobs/render.job.js';

const renderJobs = new Map();

function saveJob(job) {
  renderJobs.set(job.id, job);
  return job;
}

export async function renderTest(_request, response) {
  try {
    const job = saveJob(await renderJob({ projectId: 'test', duration: 5, format: 'mp4' }));
    response.json({ success: true, renderJob: job });
  } catch (err) {
    console.error('Test render failed:', err);
    response.status(500).json({ error: 'Test render failed' });
  }
}

export async function renderVideo(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId, templateId, duration, format } = request.body;

    if (!projectId) {
      return response.status(400).json({ error: 'projectId is required' });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { media: true },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    // Kick off a render job (placeholder using ffmpeg)
    const job = saveJob(await renderJob({ projectId, duration, format, templateId }));

    response.status(200).json({
      success: true,
      renderJob: job,
      message: 'Video render completed',
    });
  } catch (error) {
    console.error('Error rendering video:', error);
    response.status(500).json({ error: 'Failed to queue render job' });
  }
}

export async function getRenderStatus(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { renderId } = request.params;

    const job = renderJobs.get(renderId);

    if (!job) {
      return response.status(404).json({ error: 'Render job not found' });
    }

    response.json({
      ...job,
      progress: job.status === 'completed' ? 100 : 0,
    });
  } catch (error) {
    console.error('Error fetching render status:', error);
    response.status(500).json({ error: 'Failed to fetch render status' });
  }
}
