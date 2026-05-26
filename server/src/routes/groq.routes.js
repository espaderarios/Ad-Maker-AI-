import { Router } from 'express';
import { generatePrompt } from '../controllers/groq.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);
router.post('/generate', generatePrompt);

export default router;
