import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import guessRoutes from './routes/guess.js';
import saveRoutes from './routes/save.js';
import galleryRoutes from './routes/gallery.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api', guessRoutes);
app.use('/api', saveRoutes);
app.use('/api', galleryRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[UTEP Draw AI] Backend running on http://localhost:${PORT}`);
  console.log(`[UTEP Draw AI] Claude API key: ${process.env.ANTHROPIC_API_KEY ? 'configured' : 'MISSING — set ANTHROPIC_API_KEY in .env'}`);
});
