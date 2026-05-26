import { Router } from 'express';
import { getDb } from '../db/db.js';

const router = Router();

// GET /api/promocodes — список всех промокодов (админ)
router.get('/', (req, res) => {
  const db = getDb();
  const codes = db.prepare('SELECT * FROM promocodes ORDER BY created_at DESC').all();
  res.json(codes);
});

// POST /api/promocodes — создать промокод (админ)
router.post('/', (req, res) => {
  const { code, discount_type, discount_value, expires_at, usage_limit } = req.body;

  if (!code || !discount_type || !discount_value) {
    return res.status(400).json({ error: 'code, discount_type и discount_value обязательны' });
  }
  if (!['percent', 'fixed'].includes(discount_type)) {
    return res.status(400).json({ error: 'discount_type должен быть percent или fixed' });
  }
  if (discount_value < 1) {
    return res.status(400).json({ error: 'Скидка должна быть больше 0' });
  }
  if (discount_type === 'percent' && discount_value > 100) {
    return res.status(400).json({ error: 'Процент скидки не может быть больше 100' });
  }

  const db = getDb();

  // Check for duplicate code
  const existing = db.prepare('SELECT id FROM promocodes WHERE code = ?').get(code.toUpperCase());
  if (existing) {
    return res.status(409).json({ error: 'Такой код уже существует' });
  }

  const result = db.prepare(
    'INSERT INTO promocodes (code, discount_type, discount_value, expires_at, usage_limit) VALUES (?, ?, ?, ?, ?)'
  ).run(code.toUpperCase(), discount_type, discount_value, expires_at || null, usage_limit || 0);

  const promocode = db.prepare('SELECT * FROM promocodes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(promocode);
});

// PUT /api/promocodes/:id — обновить промокод (админ)
router.put('/:id', (req, res) => {
  const { code, discount_type, discount_value, expires_at, usage_limit, is_active } = req.body;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM promocodes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Промокод не найден' });

  db.prepare(
    'UPDATE promocodes SET code = ?, discount_type = ?, discount_value = ?, expires_at = ?, usage_limit = ?, is_active = ? WHERE id = ?'
  ).run(
    code?.toUpperCase() || existing.code,
    discount_type || existing.discount_type,
    discount_value ?? existing.discount_value,
    expires_at !== undefined ? expires_at : existing.expires_at,
    usage_limit ?? existing.usage_limit,
    is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM promocodes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/promocodes/:id — удалить промокод (админ)
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM promocodes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// POST /api/promocodes/validate — проверить промокод (для корзины)
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Введите промокод' });

  const db = getDb();
  const promocode = db.prepare('SELECT * FROM promocodes WHERE code = ?').get(code.toUpperCase());

  if (!promocode) {
    return res.json({ valid: false, message: 'Неверный код' });
  }

  if (!promocode.is_active) {
    return res.json({ valid: false, message: 'Промокод не активен' });
  }

  // Check expiry
  if (promocode.expires_at) {
    const expiry = new Date(promocode.expires_at);
    if (expiry < new Date()) {
      return res.json({ valid: false, message: 'Промокод просрочен' });
    }
  }

  // Check usage limit
  if (promocode.usage_limit > 0 && promocode.usage_count >= promocode.usage_limit) {
    return res.json({ valid: false, message: 'Лимит исчерпан' });
  }

  // Calculate discount
  let discount = 0;
  if (promocode.discount_type === 'percent') {
    discount = Math.round(subtotal * (promocode.discount_value / 100));
  } else {
    discount = Math.min(promocode.discount_value, subtotal);
  }

  res.json({
    valid: true,
    message: `Промокод применен, скидка ${discount.toLocaleString('ru-RU')} ₽`,
    promocode_id: promocode.id,
    discount_type: promocode.discount_type,
    discount_value: promocode.discount_value,
    discount,
    total: subtotal - discount,
  });
});

// POST /api/promocodes/use — отметить промокод как использованный
router.post('/use', (req, res) => {
  const { promocode_id, order_id, discount_applied } = req.body;
  const db = getDb();

  db.prepare('UPDATE promocodes SET usage_count = usage_count + 1 WHERE id = ?').run(promocode_id);
  db.prepare(
    'INSERT INTO used_promocodes (promocode_id, order_id, discount_applied) VALUES (?, ?, ?)'
  ).run(promocode_id, order_id, discount_applied);

  res.json({ success: true });
});

export default router;
