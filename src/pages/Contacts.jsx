import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const contacts = [
  {
    title: 'Телефон',
    value: '+7 (996) 630-90-90',
    href: 'tel:+79966309090',
  },
  {
    title: 'Email',
    value: 'Ant.arm@internet.ru',
    href: 'mailto:Ant.arm@internet.ru',
  },
  {
    title: 'Telegram',
    value: '@ant_arm_stav',
    href: 'https://t.me/ant_arm_stav',
  },
  {
    title: 'ВКонтакте',
    value: 'vk.com/ant_arm',
    href: 'https://vk.com/ant_arm',
  },
];

const STORAGE_KEY = 'antarm-pending-messages';

/** Отправляет одну заявку на сервер. Возвращает true при успехе. */
async function sendMessage(msg) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    clearTimeout(timeout);
    return false;
  }
}

/** Синхронизирует все отложенные заявки с сервером */
async function syncPending() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const pending = JSON.parse(raw);
    if (!Array.isArray(pending) || pending.length === 0) return;

    const stillPending = [];
    for (const msg of pending) {
      const ok = await sendMessage(msg);
      if (!ok) stillPending.push(msg);
    }
    if (stillPending.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stillPending));
    }
  } catch {
    // localStorage недоступен — игнорируем
  }
}

const inputStyle = {
  padding: '12px 14px',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 8,
  fontSize: 14,
  color: '#222',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // При загрузке страницы пытаемся отправить отложенные заявки
  useEffect(() => {
    syncPending();
    // Проверяем количество отложенных
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const pending = raw ? JSON.parse(raw) : [];
      setPendingCount(Array.isArray(pending) ? pending.length : 0);
    } catch { /* ignore */ }
  }, []);

  // Периодически пробуем отправить отложенные заявки
  useEffect(() => {
    const interval = setInterval(() => {
      syncPending().then(() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const pending = raw ? JSON.parse(raw) : [];
          setPendingCount(Array.isArray(pending) ? pending.length : 0);
        } catch { /* ignore */ }
      });
    }, 30000); // каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Валидация
    if (!form.name.trim() || !form.message.trim()) {
      setSending(false);
      return;
    }

    // Пробуем отправить на сервер
    const ok = await sendMessage(form);

    if (ok) {
      // Успех — очищаем форму
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } else {
      // Сервер недоступен — сохраняем локально
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const pending = raw ? JSON.parse(raw) : [];
        pending.push({ ...form, savedAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
        setPendingCount(pending.length);
      } catch { /* ignore */ }

      // Показываем успех в любом случае — заявка сохранена
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }

    setSending(false);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ padding: '60px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Контакты' }]} color="#999" activeColor="#333" />
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: '0.02em', color: '#222' }}>
            Контакты
          </h1>
          <p style={{ fontSize: 16, color: '#777', maxWidth: 600, lineHeight: 1.6 }}>
            Свяжитесь с нами удобным для вас способом
          </p>
        </div>
      </section>

      {/* Контакты */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}>
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener"
                style={{
                  background: '#f5f5f5',
                  borderRadius: 12,
                  padding: '32px 24px',
                  textDecoration: 'none',
                  transition: 'all 0.25s',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#eee';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#222' }}>
                  {c.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Адрес */}
      <section id="address" style={{ padding: '60px 0', background: '#f5f5f5' }}>
        <div className="container">
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#222' }}>Адрес производства</h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 4 }}>
              Ставропольский край, город Михайловск
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 4 }}>
              улица Октябрьская, 327/1
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>
              Email: Ant.arm@internet.ru
            </p>
          </div>
        </div>
      </section>

      {/* Реквизиты */}
      <section id="requisites" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#222' }}>Реквизиты</h2>
          <div style={{
            background: '#f5f5f5',
            borderRadius: 12,
            padding: '32px 28px',
            maxWidth: 600,
            border: '1px solid rgba(0,0,0,0.04)',
          }}>
            {[
              { label: 'Индивидуальный предприниматель', value: 'Валиулова Юлия Артуровна' },
              { label: 'ИНН', value: '262102500715' },
              { label: 'ОГРНИП', value: '323265100011653' },
              { label: 'Юридический адрес', value: 'Ставропольский край, Труновский район, село Донское, улица Валькова, дом 11, кв. 1' },
              { label: 'Email для обращений', value: 'Ant.arm@internet.ru' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                gap: 16,
              }}>
                <span style={{ fontSize: 14, color: '#888' }}>{r.label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#333', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма заявки */}
      <section id="applications" style={{ padding: '60px 0', background: '#f5f5f5' }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#222' }}>Напишите нам</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
              Оставьте заявку — мы свяжемся с вами в ближайшее время
            </p>
            {pendingCount > 0 && (
              <div style={{
                padding: '10px 14px',
                background: '#fff3e0',
                border: '1px solid #ffe0b2',
                borderRadius: 8,
                color: '#e65100',
                fontSize: 13,
                marginBottom: 12,
              }}>
                📋 {pendingCount} заяв{pendingCount === 1 ? 'ка' : pendingCount < 5 ? 'ки' : 'ок'} ожидает отправки — отправится автоматически
              </div>
            )}
            {sent ? (
              <div style={{
                background: '#e8f5e9',
                borderRadius: 12,
                padding: '24px',
                textAlign: 'center',
                color: '#2e7d32',
                fontSize: 15,
                fontWeight: 500,
              }}>
                Спасибо! Заявка отправлена.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  placeholder="Имя *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  style={inputStyle}
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  placeholder="Телефон"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Сообщение *"
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    padding: '12px 24px',
                    background: sending ? '#999' : '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: sending ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#444'; }}
                  onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#222'; }}
                >
                  {sending ? 'Отправка...' : 'Отправить'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Соцсети */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#222' }}>Мы в соцсетях</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Telegram', href: 'https://t.me/ant_arm_stav' },
                { label: 'ВКонтакте', href: 'https://vk.com/ant_arm' },
                { label: 'Wildberries', href: 'https://wildberries.ru/brands/311564880-ant-arm' },
                { label: 'Ozon', href: 'https://www.ozon.ru/search/?brand=101865860&brand_was_predicted=true&deny_category_prediction=true&from_global=true&text=ant+arm' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  style={{
                    padding: '10px 24px',
                    background: '#f5f5f5',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#333',
                    textDecoration: 'none',
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#eee';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
