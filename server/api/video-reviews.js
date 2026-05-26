import { Router } from 'express';
import { getDb } from '../db/db.js';

const router = Router();

// GET /api/video-reviews — получить все видео-обзоры
router.get('/', (req, res) => {
  const db = getDb();
  const activeOnly = req.query.active === 'true';
  let reviews;
  if (activeOnly) {
    reviews = db.prepare('SELECT * FROM video_reviews WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC').all();
  } else {
    reviews = db.prepare('SELECT * FROM video_reviews ORDER BY sort_order ASC, created_at DESC').all();
  }
  res.json(reviews);
});

// GET /api/video-reviews/:id — получить один обзор
router.get('/:id', (req, res) => {
  const db = getDb();
  const review = db.prepare('SELECT * FROM video_reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Обзор не найден' });
  res.json(review);
});

// POST /api/video-reviews — создать обзор
router.post('/', (req, res) => {
  const { title, video_url, preview_url, sort_order } = req.body;

  if (!video_url || !preview_url) {
    return res.status(400).json({ error: 'video_url и preview_url обязательны' });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO video_reviews (title, video_url, preview_url, sort_order) VALUES (?, ?, ?, ?)'
  ).run(title || '', video_url, preview_url, sort_order || 0);

  const review = db.prepare('SELECT * FROM video_reviews WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(review);
});

// PUT /api/video-reviews/:id — обновить обзор
router.put('/:id', (req, res) => {
  const { title, video_url, preview_url, sort_order, is_active } = req.body;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM video_reviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Обзор не найден' });

  db.prepare(
    'UPDATE video_reviews SET title = ?, video_url = ?, preview_url = ?, sort_order = ?, is_active = ? WHERE id = ?'
  ).run(
    title ?? existing.title,
    video_url ?? existing.video_url,
    preview_url ?? existing.preview_url,
    sort_order ?? existing.sort_order,
    is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM video_reviews WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/video-reviews/:id — удалить обзор
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM video_reviews WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
