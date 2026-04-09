import { Router } from 'express';
import { getGallery, getDrawingById, getTotalCount } from '../services/db.js';

const router = Router();

router.get('/gallery', (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 24, 100);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const drawings = getGallery(limit, offset);
    const total = getTotalCount();

    res.json({ drawings, total, limit, offset });
  } catch (err) {
    next(err);
  }
});

router.get('/gallery/:id', (req, res, next) => {
  try {
    const drawing = getDrawingById(parseInt(req.params.id));
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found.' });
    }
    res.json(drawing);
  } catch (err) {
    next(err);
  }
});

export default router;
