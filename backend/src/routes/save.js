import { Router } from 'express';
import { insertDrawing } from '../services/db.js';

const router = Router();

// Sanitize name: strip HTML, trim, cap length
function sanitizeName(raw) {
  if (!raw || typeof raw !== 'string') return 'Anonymous Artist';
  const cleaned = raw.replace(/<[^>]*>/g, '').trim().slice(0, 30);
  return cleaned || 'Anonymous Artist';
}

router.post('/save', (req, res, next) => {
  try {
    const { name, image, guess, college, department, explanation, fun_fact } = req.body;

    if (!image || !guess) {
      return res.status(400).json({ error: 'Missing required fields (image, guess).' });
    }

    const result = insertDrawing({
      name: sanitizeName(name),
      image_b64: image,
      top_guess: guess,
      college: college || null,
      department: department || null,
      explanation: explanation || null,
      fun_fact: fun_fact || null,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
