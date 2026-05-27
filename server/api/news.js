import { Router } from 'express';
import { getDb } from '../db/pg.js';

const router = Router();

// GET /api/news — получить все новости (опционально ?published=true для сайта)
router.get('/', async (req, res) => {
  const db = getDb();
  const published = req.query.published === 'true';

  if (published) {
    const news = await db.prepare(
      'SELECT * FROM news WHERE published = 1 ORDER BY created_at DESC'
    ).all();
    return res.json(news);
  }

  // Без фильтра — все новости (для админки)
  const news = await db.prepare(
    'SELECT * FROM news ORDER BY created_at DESC'
  ).all();
  res.json(news);
});

// GET /api/news/:slug — получить новость по slug
router.get('/:slug', async (req, res) => {
  const db = getDb();
  const news = await db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug);
  if (!news) return res.status(404).json({ error: 'Новость не найдена' });
  res.json(news);
});

// POST /api/news — создать новость
router.post('/', async (req, res) => {
  const { title, slug, content, excerpt, image, published } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'title и content обязательны' });
  }

  const db = getDb();
  const result = await db.prepare(
    'INSERT INTO news (title, slug, content, excerpt, image, published) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    title,
    slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, ''),
    content,
    excerpt || '',
    image || '',
    published ? 1 : 0
  );

  const news = await db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(news);
});

// PUT /api/news/:id — обновить новость
router.put('/:id', async (req, res) => {
  const { title, slug, content, excerpt, image, published } = req.body;
  const db = getDb();

  await db.prepare(
    'UPDATE news SET title = ?, slug = ?, content = ?, excerpt = ?, image = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(title, slug, content, excerpt, image, published ? 1 : 0, req.params.id);

  const news = await db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  res.json(news);
});

// DELETE /api/news/:id — удалить новость
router.delete('/:id', async (req, res) => {
  const db = getDb();
  await db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
