import { Router } from 'express';
import { getTotalCount } from '../services/db.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const count = await getTotalCount();
    res.json({
      status: 'ok',
      db: 'ok',
      drawings: count,
      claude: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'error', message: err.message });
  }
});

export default router;
