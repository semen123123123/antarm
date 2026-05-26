import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem('cookieConsent');
    if (!agreed) setVisible(true);
  }, []);

  const handleOk = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const openModal = (btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.click();
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  if (!visible) return null;

  const linkStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: 12,
    color: '#666',
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline',
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      maxWidth: 400,
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      zIndex: 9999,
      fontSize: 13,
      lineHeight: 1.5,
      color: '#444',
    }}>
      <p style={{ margin: 0, marginBottom: 14 }}>
        Наш сайт использует cookie-файлы и обрабатывает персональные данные. Это улучшает работу сайта и взаимодействие с ним. Подтвердите ваше согласие, нажав кнопку ОК.
      </p>
      <p style={{ margin: 0, marginBottom: 14, fontSize: 12 }}>
        <button onClick={() => openModal('btn-cookie')} style={linkStyle}>
          Согласие на обработку файлов cookie
        </button>
        <span style={{ margin: '0 6px', color: '#ccc' }}>/</span>
        <button onClick={() => openModal('btn-consent')} style={linkStyle}>
          согласие на обработку персональных данных
        </button>
      </p>
      <button
        onClick={handleOk}
        style={{
          padding: '8px 28px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#555'}
        onMouseLeave={e => e.currentTarget.style.background = '#333'}
      >
        OK
      </button>
    </div>
  );
}
