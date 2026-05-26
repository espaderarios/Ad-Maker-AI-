import { Router } from 'express';
import { generateImages } from '../services/stability.service.js';

const router = Router();

// Public test: generate images from prompt
router.post('/generate/test', async (req, res) => {
  try {
    const { prompt, samples } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const images = await generateImages(prompt, { samples: samples || 1 });
    res.json({ success: true, images });
  } catch (err) {
    console.error('Stability generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
