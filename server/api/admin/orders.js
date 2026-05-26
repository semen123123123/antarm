import { Router } from 'express';
import { getDb } from '../../db/db.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const VALID_STATUSES = ['новый', 'в обработке', 'подтверждён', 'отправлен', 'доставлен', 'отменён'];

const router = Router();

// GET /api/admin/orders — list with filters
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { status, search, sort = 'created_at', order = 'DESC', page = 1, limit = 20 } = req.query;

  let where = [];
  let params = [];

  if (status) { where.push('o.status = ?'); params.push(status); }
  if (search) {
    where.push('(o.customer_name LIKE ? OR o.customer_phone LIKE ? OR o.customer_email LIKE ? OR CAST(o.id AS TEXT) LIKE ?)');
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const orderBy = `o.${sort} ${order}`;
  const offset = (Number(page) - 1) * Number(limit);

  // Count
  const countRow = db.prepare(`SELECT COUNT(*) as total FROM orders o ${whereClause}`).all(...params);
  const total = countRow[0]?.total || 0;

  // Orders
  const orders = db.prepare(`
    SELECT o.*, 
           (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
    FROM orders o ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ orders, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
});

// GET /api/admin/orders/:id — single order with history
router.get('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const history = db.prepare(`
    SELECT h.*, u.name as changed_by_name
    FROM order_status_history h
    LEFT JOIN users u ON h.changed_by = u.id
    WHERE h.order_id = ?
    ORDER BY h.created_at ASC
  `).all(order.id);

  res.json({ ...order, items, history });
});

// PUT /api/admin/orders/:id/status — update status with history
router.put('/:id/status', requireAuth, requireRole('admin'), (req, res) => {
  const { status, comment } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const db = getDb();
  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Order not found' });

  const oldStatus = existing.status;

  // Update order
  db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);

  // Record history
  db.prepare(`
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, comment)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.params.id, oldStatus, status, req.user.id, comment || '');

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const history = db.prepare(`
    SELECT h.*, u.name as changed_by_name
    FROM order_status_history h
    LEFT JOIN users u ON h.changed_by = u.id
    WHERE h.order_id = ?
    ORDER BY h.created_at ASC
  `).all(order.id);

  res.json({ ...order, items, history });
});

// POST /api/admin/orders/:id/notify — send notification (simulated)
router.post('/:id/notify', requireAuth, requireRole('admin'), (req, res) => {
  const { type = 'email', message } = req.body;
  const db = getDb();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // In production, this would send via SendPulse/SMTP
  const notification = {
    type,
    to: type === 'email' ? order.customer_email : order.customer_phone,
    subject: `Заказ #${order.id} — ${order.status}`,
    message: message || `Ваш заказ #${order.id} обновлён. Статус: ${order.status}`,
    sent_at: new Date().toISOString(),
  };

  res.json({ success: true, notification });
});

// GET /api/admin/orders/:id/print — print invoice (returns HTML)
router.get('/:id/print', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  const html = `
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><title>Накладная #${order.id}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      .meta { color: #666; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin: 24px 0; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background: #f5f5f5; }
      .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 24px; }
      .footer { margin-top: 48px; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 16px; }
    </style></head><body>
    <h1>Накладная #${order.id}</h1>
    <div class="meta">Дата: ${new Date(order.created_at).toLocaleDateString('ru-RU')} | Статус: ${order.status}</div>
    <h3>Клиент</h3>
    <p>${order.customer_name}<br>${order.customer_phone}<br>${order.customer_email || ''}</p>
    ${order.delivery_address ? `<h3>Адрес доставки</h3><p>${order.delivery_address}</p>` : ''}
    <table>
      <tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
      ${items.map(i => `<tr><td>${i.product_name}${i.size ? ` (${i.size})` : ''}</td><td>${i.quantity}</td><td>${i.price.toLocaleString('ru-RU')} ₽</td><td>${(i.price * i.quantity).toLocaleString('ru-RU')} ₽</td></tr>`).join('')}
    </table>
    <div class="total">Итого: ${order.total.toLocaleString('ru-RU')} ₽</div>
    <div class="footer">ANT ARM — Тактическое снаряжение | ${new Date().toLocaleDateString('ru-RU')}</div>
    </body></html>
  `;

  res.send(html);
});

export default router;
