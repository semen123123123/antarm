import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from '../../db/pg.js';
import { requireAuth, requireRole, requirePermission } from '../../middleware/auth.js';

const router = Router();

// GET /api/admin/users — list all users
router.get('/', requireAuth, requirePermission('admin'), async (req, res) => {
  const db = getDb();
  const users = await db.prepare(`
    SELECT id, email, role, name, phone, is_blocked, loyalty_points, total_spent, created_at
    FROM users ORDER BY created_at DESC
  `).all();

  // Add order counts
  const usersWithOrders = await Promise.all(users.map(async (u) => {
    const orderCount = await db.prepare("SELECT COUNT(*) as count FROM orders WHERE customer_email = ?").get(u.email);
    return { ...u, order_count: orderCount.count };
  }));

  res.json(usersWithOrders);
});

// POST /api/admin/users — create user
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const validRoles = ['admin', 'product_manager', 'order_manager', 'content_editor', 'analyst'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  const db = getDb();
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = await db.prepare(`
    INSERT INTO users (email, password_hash, role, name, phone)
    VALUES (?, ?, ?, ?, ?)
  `).run(email, passwordHash, role || 'product_manager', name || '', phone || '');

  const user = await db.prepare('SELECT id, email, role, name, phone, is_blocked, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

// PUT /api/admin/users/:id — update user
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  const { name, phone, role, password } = req.body;

  if (role) {
    const validRoles = ['admin', 'product_manager', 'order_manager', 'content_editor', 'analyst'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
  }

  let passwordHash = existing.password_hash;
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    passwordHash = bcrypt.hashSync(password, 10);
  }

  await db.prepare(`
    UPDATE users SET name = ?, phone = ?, role = ?, password_hash = ?
    WHERE id = ?
  `).run(name || existing.name, phone || existing.phone, role || existing.role, passwordHash, req.params.id);

  const user = await db.prepare('SELECT id, email, role, name, phone, is_blocked, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

// PUT /api/admin/users/:id/block — block/unblock user
router.put('/:id/block', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT id, is_blocked FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  const newBlocked = !existing.is_blocked;
  await db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?').run(newBlocked ? 1 : 0, req.params.id);

  res.json({ id: req.params.id, is_blocked: newBlocked });
});

// PUT /api/admin/users/:id/loyalty — adjust loyalty points
router.put('/:id/loyalty', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT id, loyalty_points FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  const { points, operation = 'add' } = req.body;
  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Points must be a number' });
  }

  let newPoints = existing.loyalty_points;
  if (operation === 'add') newPoints += points;
  else if (operation === 'set') newPoints = points;
  else if (operation === 'subtract') newPoints -= points;

  if (newPoints < 0) newPoints = 0;

  await db.prepare('UPDATE users SET loyalty_points = ? WHERE id = ?').run(newPoints, req.params.id);
  res.json({ id: req.params.id, loyalty_points: newPoints });
});

// GET /api/admin/users/:id/orders — user order history
router.get('/:id/orders', requireAuth, requirePermission('admin', 'order_manager'), async (req, res) => {
  const db = getDb();
  const user = await db.prepare('SELECT email FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const orders = await db.prepare(`
    SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC
  `).all(user.email);

  res.json(orders);
});

export default router;
