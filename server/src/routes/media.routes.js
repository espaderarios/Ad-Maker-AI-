import { Router } from 'express';
import { uploadMedia, getMediaByProject, deleteMedia } from '../controllers/media.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);
router.post('/upload', uploadMedia);
router.get('/project/:projectId', getMediaByProject);
router.delete('/:mediaId', deleteMedia);

export default router;
