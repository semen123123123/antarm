import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';

const navItems = [
  {
    label: 'Каталог',
    to: '/catalog',
    children: [
      { label: 'Разгрузки', to: '/catalog?category=vests' },
      { label: 'Подсумки', to: '/catalog?category=pouches' },
      { label: 'Рюкзаки', to: '/catalog?category=backpacks' },
      { label: 'Аксессуары', to: '/catalog?category=accessories' },
      { label: 'Одежда', to: '/catalog?category=clothing' },
      { label: 'Снаряжение', to: '/catalog?category=gear' },
    ],
  },
  {
    label: 'О компании',
    to: '/about',
    children: [
      { label: 'История', to: '/about#history' },
      { label: 'Производство', to: '/about#production' },
      { label: 'Сертификаты', to: '/about#certs' },
      { label: 'Вакансии', to: '/about#careers' },
    ],
  },
  {
    label: 'Контакты',
    to: '/contacts',
    children: [
      { label: 'Адрес', to: '/contacts#address' },
      { label: 'Обратная связь', to: '/contacts#feedback' },
      { label: 'Реквизиты', to: '/contacts#details' },
    ],
  },
];

const buyerItems = [
  { label: 'Гарантии', to: '/warranty' },
  { label: 'Доставка', to: '/delivery' },
  { label: 'Возврат', to: '/warranty' },
  { label: 'Оплата', to: '/delivery' },
];

function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={item.to}
        style={{
          fontSize: 14,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: open ? '#fff' : 'rgba(255,255,255,0.85)',
          transition: 'color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {item.label}
        <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
      </Link>

      {open && item.children && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#2d2d2d',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 0',
            minWidth: 180,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        >
          {item.children.map(child => (
            <Link
              key={child.to}
              to={child.to}
              style={{
                display: 'block',
                padding: '8px 16px',
                fontSize: 14,
                color: 'var(--text-primary)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.target.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.target.style.background = 'transparent')}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [buyerOpen, setBuyerOpen] = useState(false);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--header-bg)',
      }}>
        {/* Top bar */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 0',
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Производительность · Цена · Качество
            </span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="tel:88002508723" style={{ color: 'rgba(255,255,255,0.9)' }}>
                8 (800) 250-87-23
              </a>
              <a href="https://t.me/WartechManager" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Telegram
              </a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <a href="#" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                ВКонтакте
              </a>
              <a href="#" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Wildberries
              </a>
              <a href="#" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Ozon
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          height: 'var(--header-height)',
          gap: 32,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/img/logo.png" alt="ANT ARM" style={{ height: 40 }} />
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 24, flex: 1, justifyContent: 'center' }} className="desktop-nav">
            {navItems.map(item => (
              <NavDropdown key={item.to} item={item} />
            ))}

            {/* Покупателям */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setBuyerOpen(true)}
              onMouseLeave={() => setBuyerOpen(false)}
            >
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                color: buyerOpen ? '#fff' : 'rgba(255,255,255,0.85)',
              }}>
                Покупателям ▾
              </span>
              {buyerOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#2d2d2d',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '8px 0',
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  zIndex: 200,
                }}>
                  {buyerItems.map(item => (
                    <Link key={item.to} to={item.to} style={{
                      display: 'block',
                      padding: '8px 16px',
                      fontSize: 14,
                      color: '#fff',
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                    onClick={() => setBuyerOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(true)} aria-label="Поиск" style={{ padding: 8, color: 'rgba(255,255,255,0.85)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <Link to="/favorites" aria-label="Избранное" style={{ padding: 8, color: 'rgba(255,255,255,0.85)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link to="/compare" aria-label="Сравнение" style={{ padding: 8, color: 'rgba(255,255,255,0.85)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 3v6M6 3v6M3 21h18M3 6h18" />
              </svg>
            </Link>

            <Link to="/cart" aria-label="Корзина" style={{ padding: 8, color: 'rgba(255,255,255,0.85)', position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'var(--accent-red)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
            style={{ display: 'none', padding: 8, color: '#fff' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            background: 'var(--header-bg)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 0',
          }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(255,255,255,0.85)',
                    padding: '8px 0',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              {buyerItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    paddingLeft: 16,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
