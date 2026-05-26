import { Router } from 'express';
import { listProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);
router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
