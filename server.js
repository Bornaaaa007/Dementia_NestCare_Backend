import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import connectDB from './config/db.js';
import { auth, db } from './lib/auth.js';
import patientsRouter from './routes/patients.js';
import patientPublicRouter from './routes/patientPublic.js';
import Patient from './models/Patient.js';
import PatientLink from './models/PatientLink.js';

const app = express();

const origins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
app.use(origins.length ? cors({ origin: origins, credentials: true }) : cors());

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'NestCare API running' }));

// quick-view routes — no auth, just to see what's in the DB
app.get('/api/users', async (req, res) => {
  const users = await db.collection('user').find({}, { projection: { password: 0 } }).toArray();
  res.json({ users });
});

app.get('/api/patients', async (req, res) => {
  const patients = await Patient.find();
  const links = await PatientLink.find();
  res.json({ patients, links });
});

app.use('/api/patients', patientsRouter);
app.use('/api/patient', patientPublicRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`)))
  .catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });