import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import useScrollAnimation from '../hooks/useScrollAnimation';

const deliveryMethods = [
  {
    icon: '🚚',
    title: 'СДЭК',
    desc: 'Доставка до пункта выдачи или курьером до двери. Срок: 2-5 дней.',
    price: 'от 350 ₽',
    link: 'https://www.cdek.ru',
  },
  {
    icon: '',
    title: 'Wildberries',
    desc: 'Заказ через маркетплейс с доставкой в ближайший ПВЗ. Срок: 1-3 дня.',
    price: 'Бесплатно',
    link: 'https://www.wildberries.ru',
  },
  {
    icon: '🟣',
    title: 'Ozon',
    desc: 'Оформление заказа на Ozon с быстрой доставкой. Срок: 1-3 дня.',
    price: 'Бесплатно',
    link: 'https://www.ozon.ru',
  },
  {
    icon: '📮',
    title: 'Почта России',
    desc: 'Доставка в любое отделение Почты России. Срок: 5-14 дней.',
    price: 'от 250 ₽',
    link: 'https://www.pochta.ru',
  },
];

const marketplaceLinks = [
  {
    name: 'Wildberries',
    color: '#cb11ab',
    icon: '',
    url: 'https://www.wildberries.ru',
    desc: 'Бесплатная доставка в ПВЗ',
  },
  {
    name: 'Ozon',
    color: '#005bff',
    icon: '🔵',
    url: 'https://www.ozon.ru',
    desc: 'Быстрая доставка Ozon Rocket',
  },
  {
    name: 'СДЭК',
    color: '#00b33c',
    icon: '🟢',
    url: 'https://www.cdek.ru',
    desc: 'Доставка до двери или ПВЗ',
  },
];

export default function Delivery() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [methodsRef, methodsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [orderRef, orderVisible] = useScrollAnimation({ threshold: 0.1 });
  const [marketplaceRef, marketplaceVisible] = useScrollAnimation({ threshold: 0.1 });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    product: '',
    comment: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', phone: '', email: '', city: '', address: '', product: '', comment: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={headerRef}
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <Breadcrumbs items={[{ label: 'Доставка' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
            <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>
              Доставка
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 600 }}>
              Доставляем по всей России. Выберите удобный способ получения заказа
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Methods */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div
            ref={methodsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
            }}
          >
            {deliveryMethods.map((method, i) => (
              <a
                key={i}
                href={method.link}
                target="_blank"
                rel="noopener"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: 32,
                  textDecoration: 'none',
                  color: '#fff',
                  opacity: methodsVisible ? 1 : 0,
                  transform: methodsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = methodsVisible ? 'translateY(0)' : 'translateY(20px)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{method.icon}</div>
                  <span style={{
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {method.price}
                  </span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{method.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>{method.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Quick Links */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={marketplaceRef}
            style={{
              opacity: marketplaceVisible ? 1 : 0,
              transform: marketplaceVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
              Заказать на маркетплейсе
            </h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 40, fontSize: 16 }}>
              Быстрое оформление заказа с доставкой в ваш город
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {marketplaceLinks.map((mp, i) => (
                <a
                  key={i}
                  href={mp.url}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px 24px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `2px solid ${mp.color}33`,
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${mp.color}15`;
                    e.currentTarget.style.borderColor = mp.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = `${mp.color}33`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{mp.icon}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{mp.name}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>{mp.desc}</p>
                  <span style={{
                    padding: '10px 24px',
                    background: mp.color,
                    borderRadius: '8px',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Перейти →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={orderRef}
            style={{
              maxWidth: 700,
              margin: '0 auto',
              opacity: orderVisible ? 1 : 0,
              transform: orderVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
              Оформить заказ
            </h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 40, fontSize: 16 }}>
              Заполните форму, и мы свяжемся с вами для подтверждения
            </p>

            {sent && (
              <div style={{
                padding: 16,
                background: 'rgba(40, 167, 69, 0.2)',
                border: '1px solid rgba(40, 167, 69, 0.4)',
                borderRadius: '12px',
                marginBottom: 24,
                color: '#28a745',
                fontSize: 14,
                textAlign: 'center',
              }}>
                ✅ Заказ оформлен! Мы свяжемся с вами в ближайшее время.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: 40,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Имя *
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
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
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

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Email
                </label>
                <input
                  type="email"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Город *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
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
                    Товар
                  </label>
                  <input
                    type="text"
                    placeholder="Название товара"
                    value={form.product}
                    onChange={e => setForm({ ...form, product: e.target.value })}
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

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Адрес доставки *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Улица, дом, квартира"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
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

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Комментарий
                </label>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Дополнительная информация"
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
                  width: '100%',
                  padding: '16px 32px',
                  background: '#fff',
                  color: '#333',
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Оформить заказ
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
