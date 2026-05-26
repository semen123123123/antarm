import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { parentCategories, getSubcategories } from '../data/products';
import SearchModal from './SearchModal';
import Toast from './Toast';

const catalogGroups = parentCategories.map(parent => ({
  label: parent.name,
  slug: parent.slug,
  children: getSubcategories(parent.id).map(sub => ({
    label: sub.name,
    to: `/category/${sub.slug}`,
  })),
}));

const navItems = [
  {
    label: 'Каталог',
    to: '/catalog',
    isCatalog: true,
    groups: catalogGroups,
  },
  {
    label: 'О компании',
    to: '/about',
    children: [
      { label: 'История', to: '/about#history' },
    ],
  },
  {
    label: 'Условия',
    to: '/terms',
    children: [
      { label: 'Гарантии', to: '/terms#warranty' },
      { label: 'Доставка', to: '/terms#delivery' },
      { label: 'Возврат', to: '/terms#return' },
      { label: 'Оплата', to: '/terms#payment' },
    ],
  },
  {
    label: 'Контакты',
    to: '/contacts',
    children: [
      { label: 'Адрес', to: '/contacts#address' },
      { label: 'Реквизиты', to: '/contacts#requisites' },
      { label: 'Заявки', to: '/contacts#applications' },
    ],
  },
];

function CatalogDropdown({ groups, open }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#2d2d2d',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 200,
      }}
    >
      <Link
        to="/catalog"
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#fff',
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
        onMouseLeave={e => e.target.style.color = '#fff'}
      >
        Все товары
      </Link>
      <Link
        to="/constructor"
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = '#fff'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
      >
        Конструктор
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 220px)', gap: 0 }}>
        {groups.map(group => (
        <div key={group.slug} style={{ padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            to={`/category/${group.slug}`}
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            {group.label}
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.children.map(child => (
              <Link
                key={child.to}
                to={child.to}
                style={{
                  display: 'block',
                  padding: '5px 0',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'color 0.15s, padding-left 0.15s',
                }}
                onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '4px'; }}
                onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.7)'; e.target.style.paddingLeft = '0'; }}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);

  if (item.isCatalog) {
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
        <CatalogDropdown groups={item.groups} open={open} />
      </div>
    );
  }

  if (!item.children) {
    return (
      <Link
        to={item.to}
        style={{
          fontSize: 14,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.85)',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#fff'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
      >
        {item.label}
      </Link>
    );
  }

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
  const { cartCount, toast, hideToast } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--header-bg)',
      }}>
        {/* Top bar - hidden on mobile */}
        <div className="top-bar" style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 0',
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <span style={{ fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Скорость Надежность Качество
            </span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+79966309090" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                +7 (996) 630-90-90
              </a>
              <a href="https://t.me/ant_arm_stav" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Telegram
              </a>
              <a href="https://vk.com/ant_arm" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                ВКонтакте
              </a>
              <a href="https://www.wildberries.ru/brands/311564880-ant-arm" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Wildberries
              </a>
              <a href="https://www.ozon.ru/search/?brand=101865860&brand_was_predicted=true&deny_category_prediction=true&from_global=true&text=ant+arm" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Ozon
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            marginLeft: 20,
            position: 'relative',
            bottom: 6,
          }}>
            <img src="/img/logo.png" alt="ANT ARM" style={{ height: 51 }} />
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {navItems.map(item => (
              <NavDropdown key={item.label} item={item} />
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}
              title="Поиск"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <Link to="/favorites" style={{ position: 'relative', color: 'rgba(255,255,255,0.7)', display: 'flex' }} title="Избранное">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link to="/cart" style={{ position: 'relative', color: 'rgba(255,255,255,0.7)', display: 'flex' }} title="Корзина">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  background: '#c00',
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
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setUserOpen(true)}
              onMouseLeave={() => setUserOpen(false)}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.7)',
                  padding: 4,
                }}
                title="Пользователь"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              {userOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  background: '#2d2d2d',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '8px 0',
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  zIndex: 200,
                }}>
                  {isAuthenticated ? (
                    <>
                      <div style={{ padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {user?.name || user?.email}
                      </div>
                      {isAdmin && (
                        <Link to="/admin" style={{ display: 'block', padding: '8px 16px', fontSize: 14, color: 'var(--text-primary)' }}
                          onMouseEnter={e => (e.target.style.background = 'var(--bg-hover)')}
                          onMouseLeave={e => (e.target.style.background = 'transparent')}
                        >
                          Админ-панель
                        </Link>
                      )}
                      <button onClick={logout} style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 16px',
                        fontSize: 14,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                        onMouseEnter={e => (e.target.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.target.style.background = 'transparent')}
                      >
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" style={{ display: 'block', padding: '8px 16px', fontSize: 14, color: 'var(--text-primary)' }}
                        onMouseEnter={e => (e.target.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.target.style.background = 'transparent')}
                      >
                        Войти
                      </Link>
                      <Link to="/register" style={{ display: 'block', padding: '8px 16px', fontSize: 14, color: 'var(--text-primary)' }}
                        onMouseEnter={e => (e.target.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.target.style.background = 'transparent')}
                      >
                        Регистрация
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                padding: 4,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#1a1a1a',
          zIndex: 99,
          padding: '80px 24px 24px',
          overflowY: 'auto',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 18, fontWeight: 600, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              Каталог
            </Link>
            {catalogGroups.map(group => (
              <div key={group.slug} style={{ paddingLeft: 16 }}>
                <Link to={`/category/${group.slug}`} onClick={() => setMenuOpen(false)}
                  style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, display: 'block', padding: '6px 0' }}>
                  {group.label}
                </Link>
                {group.children.map(child => (
                  <Link key={child.to} to={child.to} onClick={() => setMenuOpen(false)}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'block', padding: '4px 0 4px 16px' }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link to="/about" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 18, fontWeight: 600, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              О компании
            </Link>
            <Link to="/contacts" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 18, fontWeight: 600, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              Контакты
            </Link>
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toast toast={toast} onClose={hideToast} />
    </>
  );
}
