import { Router } from 'express';
import { getDb } from '../db/pg.js';

const router = Router();

async function updateProductRating(db, productId) {
  const avg = await db.prepare(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ? AND is_approved = 1'
  ).get(productId);
  await db.prepare(
    'UPDATE products SET rating = ?, reviews = ? WHERE id = ?'
  ).run(avg.avg_rating || 0, avg.review_count || 0, productId);
}

// GET /api/reviews?productId=X&approved=1 — получить отзывы
router.get('/', async (req, res) => {
  const db = getDb();
  const productId = req.query.productId || req.query.product_id ? parseInt(req.query.productId || req.query.product_id) : null;
  const approved = req.query.approved;

  let query = 'SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id';
  const conditions = [];
  const params = [];

  if (productId) {
    conditions.push('r.product_id = ?');
    params.push(productId);
  }

  if (approved !== undefined) {
    conditions.push('r.is_approved = ?');
    params.push(parseInt(approved));
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY r.created_at DESC';

  const reviews = await db.prepare(query).all(...params);
  res.json(reviews);
});

// POST /api/reviews — создать отзыв
router.post('/', async (req, res) => {
  const { product_id, product_slug, author_name, author_email, rating, text } = req.body;

  if (!author_name || !rating || !text) {
    return res.status(400).json({ error: 'author_name, rating и text обязательны' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating должен быть от 1 до 5' });
  }

  const db = getDb();

  // Resolve product_id from slug if needed
  let finalProductId = product_id;
  if (!finalProductId && product_slug) {
    const product = await db.prepare('SELECT id FROM products WHERE slug = ?').get(product_slug);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    finalProductId = product.id;
  }

  if (!finalProductId) {
    return res.status(400).json({ error: 'product_id или product_slug обязателен' });
  }

  const result = await db.prepare(
    'INSERT INTO reviews (product_id, author_name, author_email, rating, text) VALUES (?, ?, ?, ?, ?)'
  ).run(finalProductId, author_name, author_email || null, rating, text);

  // Note: new reviews are NOT auto-approved (is_approved = 0 by default)
  // Rating is NOT updated until admin approves

  const review = await db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(review);
});

// PATCH /api/reviews/:id — обновить отзыв (одобрить/отклонить)
router.patch('/:id', async (req, res) => {
  const { is_approved } = req.body;
  const db = getDb();

  if (is_approved === undefined) {
    return res.status(400).json({ error: 'is_approved обязателен' });
  }

  const review = await db.prepare('SELECT product_id FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Отзыв не найден' });
  }

  await db.prepare('UPDATE reviews SET is_approved = ? WHERE id = ?').run(is_approved ? 1 : 0, req.params.id);
  await updateProductRating(db, review.product_id);

  res.json({ success: true });
});

// DELETE /api/reviews/:id — удалить отзыв
router.delete('/:id', async (req, res) => {
  const db = getDb();
  const review = await db.prepare('SELECT product_id FROM reviews WHERE id = ?').get(req.params.id);

  if (!review) {
    return res.status(404).json({ error: 'Отзыв не найден' });
  }

  await db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  await updateProductRating(db, review.product_id);

  res.json({ success: true });
});

export default router;
