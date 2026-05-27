import { Router } from 'express';
import { getDb } from '../db/pg.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const VALID_STATUSES = ['новый', 'в обработке', 'подтверждён', 'отправлен', 'доставлен', 'отменён'];

const router = Router();

// POST /api/orders — create order (public — no auth needed for checkout)
router.post('/', async (req, res) => {
  const {
    customer_name, customer_email, customer_phone,
    delivery_method, delivery_address, delivery_cost,
    payment_method, items, subtotal, total, comment,
    promo_code, promo_discount,
  } = req.body;

  if (!customer_name || !customer_phone || !items || !total) {
    return res.status(400).json({ error: 'customer_name, customer_phone, items, and total are required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }

  const db = getDb();

  // Append promo info to comment if promo was used
  let finalComment = comment || '';
  if (promo_code && promo_discount > 0) {
    finalComment = (finalComment ? finalComment + '\n' : '') + `Промокод: ${promo_code}, скидка: ${promo_discount} ₽`;
  }

  // Create order
  const result = await db.prepare(`
    INSERT INTO orders (
      customer_name, customer_email, customer_phone,
      delivery_method, delivery_address, delivery_cost,
      payment_method, items, subtotal, total, status, comment
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'новый', ?)
  `).run(
    customer_name,
    customer_email || '',
    customer_phone,
    delivery_method || 'courier',
    delivery_address || '',
    delivery_cost || 0,
    payment_method || 'online',
    JSON.stringify(items),
    subtotal || total,
    total,
    finalComment,
  );

  const orderId = result.lastInsertRowid;

  // Insert order_items (normalized)
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertItems = await db.transaction(async (orderItems) => {
    for (const item of orderItems) {
      await insertItem.run(orderId, item.product_id, item.product_name, item.quantity, item.price, item.size || null);
    }
  });

  await insertItems(items);

  // Return order with items
  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({
    ...order,
    items: orderItems,
  });
});

// GET /api/orders — all orders (auth required)
router.get('/', requireAuth, async (req, res) => {
  const db = getDb();
  const orders = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const parsed = await Promise.all(orders.map(async (o) => {
    const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
    return {
      ...o,
      items: items.length > 0 ? items : JSON.parse(o.items || '[]'),
    };
  }));
  res.json(parsed);
});

// GET /api/orders/:id — single order (auth required)
router.get('/:id', requireAuth, async (req, res) => {
  const db = getDb();
  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  res.json({
    ...order,
    items: items.length > 0 ? items : JSON.parse(order.items || '[]'),
  });
});

// PUT /api/orders/:id/status — update status (auth required)
router.put('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const db = getDb();
  const existing = await db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Order not found' });

  await db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);

  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  res.json({
    ...order,
    items: items.length > 0 ? items : JSON.parse(order.items || '[]'),
  });
});

export default router;
