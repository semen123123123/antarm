import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './api/auth.js';
import productRoutes from './api/products.js';
import orderRoutes from './api/orders.js';
import categoryRoutes from './api/categories.js';
import contactRoutes from './api/contact.js';
import reviewRoutes from './api/reviews.js';
import newsRoutes from './api/news.js';
import promoRoutes from './api/promocodes.js';
import videoReviewRoutes from './api/video-reviews.js';
import paymentRoutes from './api/payments.js';

// Admin routes
import adminAnalyticsRoutes from './api/admin/analytics.js';
import adminUsersRoutes from './api/admin/users.js';
import adminOrdersRoutes from './api/admin/orders.js';
import adminProductsRoutes from './api/admin/products.js';
import adminLogsRoutes from './api/admin/logs.js';
import adminLicensesRoutes from './api/admin/licenses.js';
import { logActivity } from './middleware/activityLogger.js';
import { getDb } from './db/db.js';

dotenv.config();

// Auto-init schema
try {
  const schema = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'db', 'schema.sql'), 'utf-8');
  getDb().exec(schema);
  console.log('✓ Schema synced');
} catch (e) {
  console.error('Schema init error:', e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;



// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Wildcard domain support: *.vercel.app
    if (allowedOrigins.some(a => a.startsWith('*.') && origin?.endsWith(a.slice(1)))) {
      return callback(null, true);
    }
    callback(null, true); // Allow all in development
  },
  credentials: true,
}));
app.use(compression()); // gzip compression
app.use(express.json({ limit: '100mb' }));

// Cache control for GET requests
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60'); // 1 minute cache
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/promocodes', promoRoutes);
app.use('/api/video-reviews', videoReviewRoutes);
app.use('/api/payments', paymentRoutes);

// Admin routes (with activity logging)
app.use('/api/admin/analytics', logActivity, adminAnalyticsRoutes);
app.use('/api/admin/users', logActivity, adminUsersRoutes);
app.use('/api/admin/orders', logActivity, adminOrdersRoutes);
app.use('/api/admin/products', logActivity, adminProductsRoutes);
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/admin/licenses', logActivity, adminLicensesRoutes);

// Error handler
// Enhanced error handler with JSON syntax error detection
app.use((err, _req, res, next) => {
  if (err.type === 'entity.parse.failed' || err.status === 400) {
    return res.status(400).json({ error: 'Некорректный JSON' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve frontend static files (production)
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  const distPath = join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback — all non-API routes serve index.html
    app.get('*', (_req, res) => {
      res.sendFile(join(distPath, 'index.html'));
    });
  }
}

// Process-level error handlers (prevent crash)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health`);
  console.log(`🛡️  Rate limiting disabled for admin access`);
  if (isProd) {
    console.log(`🌐 Serving frontend from dist/ (production)`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => process.exit(0));
});
