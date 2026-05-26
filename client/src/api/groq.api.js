import { APIClient } from './client.js';

export async function generatePrompt(topic, style, targetAudience) {
  return APIClient.post('/groq/generate', {
    topic,
    style: style || 'professional',
    targetAudience: targetAudience || 'general',
  });
}
