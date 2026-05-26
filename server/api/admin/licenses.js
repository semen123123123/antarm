import { Router } from 'express';
import { getDb } from '../../db/db.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// GET /api/admin/licenses — all license verifications
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { verified, expiring } = req.query;

  let where = [];
  let params = [];

  if (verified === 'true') { where.push('lv.verified = 1'); }
  if (verified === 'false') { where.push('lv.verified = 0'); }
  if (expiring === 'true') { where.push("lv.expiry_date IS NOT NULL AND lv.expiry_date <= date('now', '+30 days')"); }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const licenses = db.prepare(`
    SELECT lv.*, u.name as user_name, u.email as user_email,
           vb.name as verified_by_name
    FROM license_verifications lv
    JOIN users u ON lv.user_id = u.id
    LEFT JOIN users vb ON lv.verified_by = vb.id
    ${whereClause}
    ORDER BY lv.created_at DESC
  `).all(...params);

  res.json(licenses);
});

// PUT /api/admin/licenses/:id/verify — verify/reject license
router.put('/:id/verify', requireAuth, requireRole('admin'), (req, res) => {
  const { verified, notes, expiryDate } = req.body;
  if (typeof verified !== 'boolean') {
    return res.status(400).json({ error: 'verified (boolean) is required' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT * FROM license_verifications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'License not found' });

  db.prepare(`
    UPDATE license_verifications
    SET verified = ?, verified_by = ?, notes = ?, expiry_date = ?
    WHERE id = ?
  `).run(verified ? 1 : 0, req.user.id, notes || existing.notes, expiryDate || existing.expiry_date, req.params.id);

  const license = db.prepare(`
    SELECT lv.*, u.name as user_name, u.email as user_email
    FROM license_verifications lv
    JOIN users u ON lv.user_id = u.id
    WHERE lv.id = ?
  `).get(req.params.id);

  res.json(license);
});

// GET /api/admin/licenses/expiring — licenses expiring within 30 days
router.get('/expiring', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const licenses = db.prepare(`
    SELECT lv.*, u.name as user_name, u.email as user_email
    FROM license_verifications lv
    JOIN users u ON lv.user_id = u.id
    WHERE lv.verified = 1 AND lv.expiry_date IS NOT NULL
      AND lv.expiry_date <= date('now', '+30 days')
    ORDER BY lv.expiry_date ASC
  `).all();

  res.json(licenses);
});

export default router;
