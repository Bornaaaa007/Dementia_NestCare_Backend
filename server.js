import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import connectDB from './config/db.js';
import { auth } from './lib/auth.js';
import { requireAuth } from './middleware/requireAuth.js';
import patientRoutes from './routes/patients.js';

const app = express();

const origins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
app.use(origins.length ? cors({ origin: origins, credentials: true }) : cors());

// Better Auth handler MUST come before express.json()
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'NestCare API running' }));
app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user }));
app.use('/patients', requireAuth, patientRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`)))
  .catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
