import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitGuess = useCallback(async (imageBase64) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDrawing = useCallback(async (data) => {
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Fire-and-forget — don't block UI on save failure
    }
  }, []);

  const fetchGallery = useCallback(async (limit = 24, offset = 0) => {
    const res = await fetch(`/api/gallery?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Failed to load gallery');
    return await res.json();
  }, []);

  return { loading, error, setError, submitGuess, saveDrawing, fetchGallery };
}
