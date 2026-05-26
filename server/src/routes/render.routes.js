import { Router } from 'express';
import { renderVideo, getRenderStatus, renderTest } from '../controllers/render.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Public test route to quickly generate a placeholder render
router.get('/test', renderTest);

router.use(verifyToken);
router.post('/render', renderVideo);
router.get('/status/:renderId', getRenderStatus);

export default router;
