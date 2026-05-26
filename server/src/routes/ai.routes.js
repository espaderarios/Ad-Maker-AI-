import { Router } from 'express';
import { generate } from '../controllers/ai.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


const router = Router();

// Public test endpoint (useful during local development)
router.post('/generate/test', async (req, res) => generate(req, res));

// Protected generation endpoint
router.use(verifyToken);
router.post('/generate', generate);

export default router;
