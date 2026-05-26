export function validatePrompt(prompt) {
  return typeof prompt === 'string' && prompt.trim().length > 0;
}
