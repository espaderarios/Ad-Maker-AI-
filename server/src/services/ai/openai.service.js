import { getOpenAiKey } from '../../config/openai.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateScript(prompt, options = {}) {
  const key = getOpenAiKey();

  const body = {
    model: options.model || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a creative assistant that writes short video scripts optimized for short-form social platforms. Output a JSON object with fields: title, scenes (array of {text, durationSeconds}), and a short callToAction.' },
      { role: 'user', content: prompt },
    ],
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 800,
  };

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI responded ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  return { raw: content, json: tryParseJson(content) };
}

function tryParseJson(text) {
  try {
    // Attempt to extract the first JSON object from the text
    const m = text.match(/\{[\s\S]*\}/);
    const j = m ? JSON.parse(m[0]) : JSON.parse(text);
    return j;
  } catch (err) {
    return null;
  }
}
