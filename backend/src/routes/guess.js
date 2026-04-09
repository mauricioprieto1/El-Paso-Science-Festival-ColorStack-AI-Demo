import { Router } from 'express';
import { analyzeDrawing } from '../services/claudeClient.js';
import { guessLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Basic profanity filter for the speech field (defense in depth)
const BLOCKED_WORDS = /\b(damn|hell|shit|fuck|ass|bitch|crap|stupid|idiot|hate|kill|die|dead|blood|gun|bomb|sex|drugs?|alcohol|beer|wine)\b/gi;

function sanitizeSpeech(text) {
  return text.replace(BLOCKED_WORDS, 'something cool');
}

router.post('/guess', guessLimiter, async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid image data.' });
    }

    // Check size (~5 MB base64 limit)
    if (image.length > 7_000_000) {
      return res.status(400).json({ error: 'Image too large. Max 5 MB.' });
    }

    // Basic base64 validation
    if (!/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 100))) {
      return res.status(400).json({ error: 'Invalid image encoding.' });
    }

    const result = await analyzeDrawing(image);

    // Sanitize the speech field before sending to client
    if (result.utep?.speech) {
      result.utep.speech = sanitizeSpeech(result.utep.speech);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
