import { Router } from 'express';
import { getDb } from '../../db/pg.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// GET /api/admin/logs — activity log
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const { page = 1, limit = 50, user, entityType, action } = req.query;

  let where = [];
  let params = [];

  if (user) { where.push('al.user_id = ?'); params.push(user); }
  if (entityType) { where.push('al.entity_type = ?'); params.push(entityType); }
  if (action) { where.push('al.action = ?'); params.push(action); }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(limit);

  const countRow = await db.prepare(`SELECT COUNT(*) as total FROM activity_logs al ${whereClause}`).all(...params);
  const total = countRow[0]?.total || 0;

  const logs = await db.prepare(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ logs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
});

export default router;
