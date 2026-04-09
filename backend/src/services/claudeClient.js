import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './promptBuilder.js';

const client = new Anthropic();

export async function analyzeDrawing(imageBase64) {
  const systemPrompt = buildSystemPrompt();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: 'What did I draw? Give me your top 3 guesses with confidence scores.',
          },
        ],
      },
    ],
  });

  const text = response.content.find(c => c.type === 'text')?.text || '{}';

  // Strip any accidental markdown fencing
  const cleaned = text.replace(/```json\s*|```\s*/g, '').trim();

  const result = JSON.parse(cleaned);

  // Validate expected structure
  if (!result.guesses || !Array.isArray(result.guesses) || !result.utep) {
    throw new Error('Unexpected response structure from Claude');
  }

  return result;
}
