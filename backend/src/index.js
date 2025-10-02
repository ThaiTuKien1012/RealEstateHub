import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WatchTime API - Luxury Watch Marketplace',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    console.log('\n🌱 Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!\n');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
});
