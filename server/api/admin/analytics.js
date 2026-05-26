import { Router } from 'express';
import { getDb } from '../../db/db.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// GET /api/admin/analytics/dashboard — real-time metrics
router.get('/dashboard', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Revenue this month
  const revenueRow = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as order_count
    FROM orders WHERE created_at >= ? AND status != 'отменён'
  `).get(monthStart);

  // Conversion rate (orders / unique visitors — simulated)
  const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get();
  const conversionRate = totalOrders.count > 0 ? ((totalOrders.count / Math.max(totalOrders.count * 8, 1)) * 100).toFixed(2) : '0';

  // Top 5 products
  const topProducts = db.prepare(`
    SELECT oi.product_name, SUM(oi.quantity) as total_qty, SUM(oi.quantity * oi.price) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'отменён'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY total_qty DESC
    LIMIT 5
  `).all();

  // Orders by status
  const ordersByStatus = db.prepare(`
    SELECT status, COUNT(*) as count, SUM(total) as revenue
    FROM orders
    GROUP BY status
  `).all();

  // Daily revenue (last 7 days)
  const dailyRevenue = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue
    FROM orders
    WHERE created_at >= ? AND status != 'отменён'
    GROUP BY DATE(created_at)
    ORDER BY date
  `).all(weekAgo);

  // New orders today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const newOrdersToday = db.prepare(
    "SELECT COUNT(*) as count FROM orders WHERE created_at >= ?"
  ).get(todayStart);

  // Recent orders
  const recentOrders = db.prepare(`
    SELECT id, customer_name, total, status, created_at
    FROM orders ORDER BY created_at DESC LIMIT 5
  `).all();

  // Low stock products
  const lowStock = db.prepare(`
    SELECT id, name, in_stock, stock_status
    FROM products WHERE in_stock = 0 OR stock_status = 'pre_order'
    LIMIT 5
  `).all();

  // Expiring licenses (ФЗ-150)
  const expiringLicenses = db.prepare(`
    SELECT lv.id, lv.license_number, lv.expiry_date, u.name as user_name, u.email
    FROM license_verifications lv
    JOIN users u ON lv.user_id = u.id
    WHERE lv.verified = 1 AND lv.expiry_date IS NOT NULL
      AND lv.expiry_date <= date('now', '+30 days')
    ORDER BY lv.expiry_date ASC
    LIMIT 5
  `).all();

  // Server status (simulated)
  const serverStatus = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    timestamp: now.toISOString(),
  };

  res.json({
    revenue: revenueRow.revenue,
    orderCount: revenueRow.order_count,
    conversionRate: `${conversionRate}%`,
    newOrdersToday: newOrdersToday.count,
    topProducts,
    ordersByStatus,
    dailyRevenue,
    recentOrders,
    lowStock,
    expiringLicenses,
    serverStatus,
  });
});

// GET /api/admin/analytics/sales — sales by period
router.get('/sales', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { period = '30d' } = req.query;

  let dateFilter;
  const now = new Date();
  switch (period) {
    case '7d': dateFilter = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(); break;
    case '30d': dateFilter = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(); break;
    case '90d': dateFilter = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString(); break;
    case '1y': dateFilter = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString(); break;
    default: dateFilter = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  const sales = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue,
           AVG(total) as avg_order
    FROM orders
    WHERE created_at >= ? AND status != 'отменён'
    GROUP BY DATE(created_at)
    ORDER BY date
  `).all(dateFilter);

  const total = db.prepare(`
    SELECT COUNT(*) as orders, SUM(total) as revenue, AVG(total) as avg_order,
           MIN(total) as min_order, MAX(total) as max_order
    FROM orders
    WHERE created_at >= ? AND status != 'отменён'
  `).get(dateFilter);

  res.json({ sales, summary: total, period });
});

// GET /api/admin/analytics/top-products
router.get('/top-products', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { limit = 10 } = req.query;

  const topProducts = db.prepare(`
    SELECT p.id, p.name, p.sku, p.price, p.category_id,
           SUM(oi.quantity) as total_sold,
           SUM(oi.quantity * oi.price) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.status != 'отменён'
    GROUP BY oi.product_id, p.name, p.sku, p.price
    ORDER BY total_revenue DESC
    LIMIT ?
  `).all(Number(limit));

  res.json(topProducts);
});

// GET /api/admin/analytics/export — CSV export
router.get('/export', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { type = 'orders' } = req.query;

  let data, headers;

  if (type === 'orders') {
    data = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    headers = ['id', 'customer_name', 'customer_email', 'customer_phone', 'total', 'status', 'created_at'];
  } else if (type === 'products') {
    data = db.prepare('SELECT * FROM products').all();
    headers = ['id', 'name', 'sku', 'price', 'in_stock', 'category_id', 'created_at'];
  } else if (type === 'customers') {
    data = db.prepare('SELECT id, name, email, phone, total_spent, loyalty_points, created_at FROM users WHERE role = "customer" OR role = "moderator"').all();
    headers = ['id', 'name', 'email', 'phone', 'total_spent', 'loyalty_points', 'created_at'];
  } else {
    return res.status(400).json({ error: 'Invalid export type' });
  }

  // Generate CSV
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h] ?? '';
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    });
    csvRows.push(values.join(','));
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csvRows.join('\n'));
});

export default router;
