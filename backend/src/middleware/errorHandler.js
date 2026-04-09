export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (err.status === 429) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message,
  });
}
