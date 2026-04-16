import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, getValidDepartments } from './promptBuilder.js';

const client = new Anthropic();

// Generic fallback if everything fails
const FALLBACK_RESPONSE = {
  guesses: [
    { label: 'abstract art', confidence: 0.70 },
    { label: 'creative doodle', confidence: 0.20 },
    { label: 'something amazing', confidence: 0.10 },
  ],
  utep: {
    icon: '🎨',
    college: 'College of Liberal Arts',
    department: 'Art',
    research_area: 'Visual Arts',
    explanation: 'Every doodle is art! UTEP\'s art department reflects the border region\'s rich cultural identity.',
    fun_fact: 'UTEP\'s Stanlee and Gerald Rubin Center for the Visual Arts hosts world-class contemporary art exhibitions on campus.',
    speech: 'You drew something creative! UTEP artists celebrate El Paso\'s unique border culture!',
  },
};

function parseResponse(text) {
  // Strip any accidental markdown fencing
  const cleaned = text.replace(/```json\s*|```\s*/g, '').trim();
  const result = JSON.parse(cleaned);

  if (!result.guesses || !Array.isArray(result.guesses) || !result.utep) {
    throw new Error('Unexpected response structure');
  }

  return result;
}

function validateAgainstKB(result) {
  const deptMap = getValidDepartments();
  const dept = result.utep?.department;
  const college = result.utep?.college;

  if (dept && deptMap[dept]) {
    // Fix college if it doesn't match the department
    if (college !== deptMap[dept]) {
      console.warn(`[KB mismatch] Claude said "${dept}" is in "${college}", correcting to "${deptMap[dept]}"`);
      result.utep.college = deptMap[dept];
    }
  } else if (dept) {
    console.warn(`[KB miss] Department "${dept}" not found in knowledge base`);
  }

  return result;
}

async function callClaude(imageBase64) {
  const systemPrompt = buildSystemPrompt();

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
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
  return parseResponse(text);
}

export async function analyzeDrawing(imageBase64) {
  // Attempt 1
  try {
    const result = await callClaude(imageBase64);
    return validateAgainstKB(result);
  } catch (err) {
    console.warn(`[Attempt 1 failed] ${err.message}`);
  }

  // Attempt 2 (retry once)
  try {
    const result = await callClaude(imageBase64);
    return validateAgainstKB(result);
  } catch (err) {
    console.warn(`[Attempt 2 failed] ${err.message}`);
  }

  // Both failed — return hardcoded fallback
  console.error('[Claude] Both attempts failed, returning fallback response');
  return FALLBACK_RESPONSE;
}
