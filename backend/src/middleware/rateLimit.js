import rateLimit from 'express-rate-limit';

export const guessLimiter = rateLimit({
  windowMs: 5000,
  max: 1,
  message: { error: 'Please wait a few seconds between guesses.' },
  standardHeaders: true,
  legacyHeaders: false,
});
