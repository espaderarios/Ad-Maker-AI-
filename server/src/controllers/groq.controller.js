export async function generatePrompt(request, response) {
  try {
    const { topic, style, targetAudience } = request.body;

    if (!topic) {
      return response.status(400).json({ error: 'Topic is required' });
    }

    // Build prompt for Groq
    const prompt = `Create a compelling ad copy for the following:
Topic: ${topic}
Style: ${style || 'engaging and professional'}
Target Audience: ${targetAudience || 'general'}

Generate a short, catchy ad copy (2-3 sentences) that would work well for video ads.`;

    // TODO: Integrate with actual Groq API when credentials are available
    // For now, return a mock response
    const mockAdCopy = `Transform your ${topic.toLowerCase()} experience today! 🚀 Join thousands of satisfied customers who've already made the switch. Don't miss out on the revolution!`;

    response.json({
      success: true,
      adCopy: mockAdCopy,
      prompt: prompt,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    response.status(500).json({ error: 'Failed to generate prompt' });
  }
}
