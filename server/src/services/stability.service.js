import fs from 'fs';
import path from 'path';
import { getStabilityKey, getStabilityModel } from '../config/stability.js';

const STABILITY_API_BASE = 'https://api.stability.ai/v1/generation';

export async function generateImages(prompt, { samples = 1, width = 1024, height = 1024, steps = 30, cfg = 7 } = {}) {
  const key = getStabilityKey();
  const model = getStabilityModel();

  const url = `${STABILITY_API_BASE}/${model}/text-to-image`;
  const body = {
    text_prompts: [{ text: prompt }],
    cfg_scale: cfg,
    clip_guidance_preset: 'FAST_BLUE',
    height,
    width,
    samples,
    steps,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Stability API ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const images = [];
  const outDir = path.join(process.cwd(), 'server', 'src', 'temp', 'images');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  (data.artifacts || []).forEach((art, idx) => {
    if (!art.base64) return;
    const buf = Buffer.from(art.base64, 'base64');
    const filename = `stability-${Date.now()}-${idx}.png`;
    const filePath = path.join(outDir, filename);
    fs.writeFileSync(filePath, buf);
    images.push({ filePath, url: `/temp/images/${filename}` });
  });

  return images;
}
