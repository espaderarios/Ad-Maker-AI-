export function getStabilityKey() {
  const key = process.env.STABILITY_API_KEY || process.env.STABILITY_KEY;
  if (!key) throw new Error('STABILITY_API_KEY is not set in environment');
  return key;
}

export function getStabilityModel() {
  return process.env.STABILITY_MODEL || 'stable-diffusion-2-1';
}
