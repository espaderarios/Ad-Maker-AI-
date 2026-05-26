// Reads OpenAI API key from environment
export function getOpenAiKey() {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY is not set in environment');
  }
  return key;
}
