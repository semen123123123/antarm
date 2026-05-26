import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const sections = [
  {
    id: 'warranty',
    title: 'Гарантии',
    cards: [
      { title: 'Гарантия 2 года', desc: 'На всю продукцию ANT ARM действует гарантия 24 месяца с момента покупки. Гарантийный талон прилагается к каждому товару.' },
      { title: 'Бесплатный ремонт', desc: 'В течение гарантийного срока мы бесплатно ремонтируем или заменяем дефектные изделия.' },
      { title: 'Возврат 14 дней', desc: 'Если товар не подошёл, вы можете вернуть его в течение 14 дней с момента получения.' },
      { title: 'Проверка качества', desc: 'Каждое изделие проходит контроль качества перед отправкой. Гарантируем отсутствие производственных дефектов.' },
    ],
  },
  {
    id: 'delivery',
    title: 'Доставка',
    cards: [
      { title: 'СДЭК', desc: 'Доставка до пункта выдачи или курьером до двери. Срок: 2–5 дней.' },
      { title: 'Wildberries', desc: 'Заказ через маркетплейс с доставкой в ближайший ПВЗ. Срок: 1–3 дня.' },
      { title: 'Ozon', desc: 'Оформление заказа на Ozon с быстрой доставкой. Срок: 1–3 дня.' },
      { title: 'Почта России', desc: 'Доставка в любое отделение Почты России. Срок: 5–14 дней.' },
    ],
  },
  {
    id: 'return',
    title: 'Возврат',
    cards: [
      { title: 'Условия возврата', desc: 'Вы можете вернуть товар в течение 14 дней с момента получения. Товар должен быть неиспользованным, с сохранением товарного вида и упаковки.' },
      { title: 'Как оформить возврат', desc: 'Свяжитесь с нами по email Ant.arm@internet.ru. Мы согласуем детали и предоставим адрес для отправки.' },
      { title: 'Сроки возврата', desc: 'После получения товара проверяем его состояние в течение 3 рабочих дней. Возврат средств — 5–10 рабочих дней.' },
      { title: 'Бракованный товар', desc: 'При обнаружении производственного брака возврат осуществляется за наш счёт.' },
    ],
  },
  {
    id: 'payment',
    title: 'Оплата',
    cards: [
      { title: 'Банковской картой', desc: 'Принимаем Visa, Mastercard, МИР. Оплата через защищённый протокол 3D Secure.' },
      { title: 'Электронные кошельки', desc: 'ЮMoney, SberPay — быстрая оплата без ввода данных карты.' },
      { title: 'Наложенным платежом', desc: 'Оплата при получении в отделении Почты России или пункте выдачи СДЭК.' },
    ],
  },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState('warranty');

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ padding: '60px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Условия' }]} color="#999" activeColor="#333" />
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: '0.02em', color: '#222' }}>
            Условия
          </h1>
          <p style={{ fontSize: 16, color: '#777', maxWidth: 600, lineHeight: 1.6 }}>
            Гарантии, доставка, возврат и оплата
          </p>
        </div>
      </section>

      {/* Навигация по разделам */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0 }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeSection === s.id ? '2px solid #222' : '2px solid transparent',
                  padding: '16px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: activeSection === s.id ? '#222' : '#999',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (activeSection !== s.id) e.target.style.color = '#555'; }}
                onMouseLeave={e => { if (activeSection !== s.id) e.target.style.color = '#999'; }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Контент */}
      {sections.map(s => (
        <section key={s.id} id={s.id} style={{ padding: '60px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="container">
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 28, color: '#222' }}>
              {s.title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${s.cards.length}, 1fr)`, gap: 20 }}>
              {s.cards.map((card, i) => (
                <div key={i} style={{
                  background: '#f5f5f5',
                  borderRadius: 12,
                  padding: '28px 24px',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#222' }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Контакт */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            background: '#f5f5f5',
            borderRadius: 16,
            padding: '40px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>
              Остались вопросы? Свяжитесь с нами
            </p>
            <a href="mailto:Ant.arm@internet.ru" style={{ fontSize: 16, fontWeight: 600, color: '#222', textDecoration: 'none' }}>
              Ant.arm@internet.ru
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
