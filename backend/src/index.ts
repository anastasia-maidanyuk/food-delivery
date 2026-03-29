import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate';

import shopsRouter from './routes/shops';
import ordersRouter from './routes/orders';
import couponsRouter from './routes/coupons';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/shops', shopsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await runMigrations();
    console.log('Migrations done');
  } catch (err) {
    console.error('Migration error:', err);
  }
});

export default app;