import { prisma } from '../config/db.js';

export async function uploadMedia(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId, url, type, name } = request.body;

    if (!projectId || !url || !type) {
      return response.status(400).json({ error: 'projectId, url, and type are required' });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    // Create media record
    const media = await prisma.media.create({
      data: {
        projectId,
        url,
        type, // 'image', 'video', 'audio', 'text'
      },
    });

    response.status(201).json({ success: true, media });
  } catch (error) {
    console.error('Error uploading media:', error);
    response.status(500).json({ error: 'Failed to upload media' });
  }
}

export async function getMediaByProject(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId } = request.params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    const media = await prisma.media.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    response.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    response.status(500).json({ error: 'Failed to fetch media' });
  }
}

export async function deleteMedia(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { mediaId } = request.params;

    // Check media ownership via project
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: { project: true },
    });

    if (!media || media.project.userId !== userId) {
      return response.status(404).json({ error: 'Media not found' });
    }

    await prisma.media.delete({ where: { id: mediaId } });
    response.json({ message: 'Media deleted' });
  } catch (error) {
    console.error('Error deleting media:', error);
    response.status(500).json({ error: 'Failed to delete media' });
  }
}
