import { Router } from 'express';
import { getDb } from '../db/db.js';
import nodemailer from 'nodemailer';

const router = Router();

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: SMTP_PORT === '465',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// POST /api/contact — отправить заявку
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Имя и сообщение обязательны' });
    }

    const db = getDb();
    const stmt = db.prepare('INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
    stmt.run(name, email || null, phone || null, message);

    // Отправка email-уведомления, если настроено
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"ANT ARM" <${process.env.SMTP_USER}>`,
          to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
          subject: 'Новая заявка с сайта ANT ARM',
          html: `
            <h2>Новая заявка</h2>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || '—'}</p>
            <p><strong>Телефон:</strong> ${phone || '—'}</p>
            <p><strong>Сообщение:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (err) {
        console.error('Email send failed:', err.message);
      }
    }

    res.json({ success: true, message: 'Заявка отправлена' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: err.message || 'Внутренняя ошибка сервера' });
  }
});

// GET /api/contact — получить все заявки (для админ-панели)
router.get('/', (req, res) => {
  const db = getDb();
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.json(messages);
});

// PATCH /api/contact/:id/read — отметить как прочитано
router.patch('/:id/read', (req, res) => {
  const db = getDb();
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
