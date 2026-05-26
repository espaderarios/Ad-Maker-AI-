import { prisma } from '../config/db.js';

export async function listProjects(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });

    response.json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    response.status(500).json({ error: 'Failed to list projects' });
  }
}

export async function createProject(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description } = request.body;
    if (!title) {
      return response.status(400).json({ error: 'Title is required' });
    }

    const project = await prisma.project.create({
      data: { title, description, userId },
    });

    response.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    response.status(500).json({ error: 'Failed to create project' });
  }
}

export async function getProject(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = request.params;
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: { media: true },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    response.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    response.status(500).json({ error: 'Failed to get project' });
  }
}

export async function updateProject(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = request.params;
    const { title, description, status } = request.body;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { title: title || project.title, description, status },
    });

    response.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    response.status(500).json({ error: 'Failed to update project' });
  }
}

export async function deleteProject(request, response) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = request.params;
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return response.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({ where: { id } });
    response.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    response.status(500).json({ error: 'Failed to delete project' });
  }
}
