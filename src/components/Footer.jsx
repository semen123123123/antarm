import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'О компании',
    links: [
      { label: 'О нас', to: '/about' },
      { label: 'Контакты', to: '/contacts' },
      { label: 'Реквизиты', to: '/about' },
    ],
  },
  {
    title: 'Покупателям',
    links: [
      { label: 'Гарантии', to: '/about' },
      { label: 'Доставка', to: '/contacts' },
      { label: 'Возврат товара', to: '/contacts' },
      { label: 'Способы оплаты', to: '/contacts' },
    ],
  },
  {
    title: 'Каталог',
    links: [
      { label: 'Бронежилеты', to: '/category/bronezhilety' },
      { label: 'Разгрузки', to: '/category/razgruzochnye-sistemy' },
      { label: 'Подсумки', to: '/category/podsumki' },
      { label: 'Рюкзаки', to: '/category/ryukzaki-i-sumki' },
    ],
  },
  {
    title: 'Контакты',
    links: [
      { label: '8 (800) 250-87-23', to: 'tel:88002508723' },
      { label: 'info@antarm.ru', to: 'mailto:info@antarm.ru' },
      { label: 'Санкт-Петербург', to: '/contacts' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--header-bg)',
      color: 'rgba(255,255,255,0.7)',
      padding: '48px 0 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginBottom: 40,
        }}>
          {columns.map(col => (
            <div key={col.title}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
                color: '#fff',
              }}>
                {col.title}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.6)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 32,
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: '#fff' }}>
              Подписка на новости
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              Получайте информацию о новинках и акциях
            </p>
          </div>
          <form style={{ display: 'flex', gap: 8 }} onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input"
              style={{ width: 280, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            />
            <button type="submit" className="btn btn-primary" style={{ background: '#fff', color: 'var(--header-bg)', borderColor: '#fff' }}>
              Подписаться
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            © 2026 ANT ARM. Все права защищены.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Тактическое снаряжение российского производства
          </p>
        </div>
      </div>
    </footer>
  );
}
