import { Router } from 'express';
import { getDb } from '../db/pg.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/categories — all categories
router.get('/', async (req, res) => {
  const db = getDb();
  const categories = await db.prepare('SELECT * FROM categories ORDER BY id').all();
  res.json(categories);
});

// POST /api/categories — create (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, slug, icon } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'name and slug are required' });
  }

  const db = getDb();
  const existing = await db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (existing) {
    return res.status(409).json({ error: 'Category with this slug already exists' });
  }

  const result = await db.prepare(
    'INSERT INTO categories (name, slug, icon, count) VALUES (?, ?, ?, 0)'
  ).run(name, slug, icon || '');

  res.status(201).json({
    id: result.lastInsertRowid,
    name,
    slug,
    icon: icon || '',
    count: 0,
  });
});

// PUT /api/categories/:id — update (admin only)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  const { name, slug, icon } = req.body;
  await db.prepare('UPDATE categories SET name = ?, slug = ?, icon = ? WHERE id = ?').run(
    name ?? existing.name,
    slug ?? existing.slug,
    icon !== undefined ? icon : existing.icon,
    req.params.id
  );

  const updated = await db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/categories/:id — delete (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT id FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  // Check if category has products
  const productCount = await db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(req.params.id);
  if (productCount.count > 0) {
    return res.status(400).json({ error: 'Cannot delete category with existing products' });
  }

  await db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ message: 'Category deleted' });
});

export default router;
