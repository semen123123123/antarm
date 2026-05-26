import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import useScrollAnimation from '../hooks/useScrollAnimation';

const contactCards = [
  {
    icon: '📞',
    title: 'Телефон',
    value: '8 (800) 250-87-23',
    sub: 'Бесплатно по России',
    href: 'tel:88002508723',
  },
  {
    icon: '️',
    title: 'Email',
    value: 'info@antarm.ru',
    sub: 'Ответим в течение часа',
    href: 'mailto:info@antarm.ru',
  },
  {
    icon: '📍',
    title: 'Адрес',
    value: 'Санкт-Петербург',
    sub: 'пр. Старо-Петергофский, д. 40',
    href: '#',
  },
  {
    icon: '💬',
    title: 'Telegram',
    value: '@WartechManager',
    sub: 'Быстрая связь',
    href: 'https://t.me/WartechManager',
  },
];

const workingHours = [
  { day: 'Понедельник — Пятница', time: '9:00 — 18:00' },
  { day: 'Суббота', time: '10:00 — 16:00' },
  { day: 'Воскресенье', time: 'Выходной' },
];

export default function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const [cardsRef, cardsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [formRef, formVisible] = useScrollAnimation({ threshold: 0.1 });
  const [hoursRef, hoursVisible] = useScrollAnimation({ threshold: 0.1 });
  const [mapRef, mapVisible] = useScrollAnimation({ threshold: 0.1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={{
      background: '#2a2a2a',
      minHeight: '100vh',
      color: '#fff',
    }}>
      {/* Header */}
      <section style={{
        padding: '60px 0 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Контакты' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: '0.05em',
          }}>
            Контакты
          </h1>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
          }}>
            Свяжитесь с нами удобным способом или посетите наш офис
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div
            ref={cardsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
          >
            {contactCards.map((card, i) => (
              <a
                key={i}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener' : undefined}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: 32,
                  textDecoration: 'none',
                  color: '#fff',
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = cardsVisible ? 'translateY(0)' : 'translateY(20px)';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 8,
                }}>
                  {card.title}
                </h3>
                <div style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 4,
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  {card.sub}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map */}
      <section style={{
        padding: '60px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <div
            ref={formRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'start',
            }}
          >
            {/* Form */}
            <div>
              <h2 style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 24,
              }}>
                Напишите нам
              </h2>
              <p style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 32,
              }}>
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>

              {sent && (
                <div style={{
                  padding: 16,
                  background: 'rgba(40, 167, 69, 0.2)',
                  border: '1px solid rgba(40, 167, 69, 0.4)',
                  borderRadius: '8px',
                  marginBottom: 24,
                  color: '#28a745',
                  fontSize: 14,
                }}>
                  ✅ Сообщение отправлено! Мы скоро ответим.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                      Имя
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: 15,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: 15,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: 15,
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Сообщение
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: 15,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '14px 32px',
                    background: '#fff',
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Отправить сообщение
                </button>
              </form>
            </div>

            {/* Map / Info */}
            <div
              ref={mapRef}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)',
                fontSize: 18,
                opacity: mapVisible ? 1 : 0,
                transform: mapVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'all 0.6s ease',
              }}
            >
              [Карта: Санкт-Петербург, пр. Старо-Петергофский, д. 40]
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours */}
      <section style={{
        padding: '60px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <div
            ref={hoursRef}
            style={{
              maxWidth: 600,
              margin: '0 auto',
              textAlign: 'center',
              opacity: hoursVisible ? 1 : 0,
              transform: hoursVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 32,
            }}>
              Часы работы
            </h2>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {workingHours.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px 32px',
                    borderBottom: i < workingHours.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
                    {item.day}
                  </span>
                  <span style={{
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: item.time === 'Выходной' ? 'rgba(255,255,255,0.4)' : '#fff',
                  }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
