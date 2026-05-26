import { generateScript } from '../services/ai/openai.service.js';

export async function generate(_request, response) {
  try {
    const { prompt } = _request.body;
    if (!prompt) return response.status(400).json({ error: 'prompt is required' });

    const result = await generateScript(prompt);
    response.json({ success: true, result });
  } catch (err) {
    console.error('AI generate error:', err);
    response.status(500).json({ error: err.message });
  }
}
