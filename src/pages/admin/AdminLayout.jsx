import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Дашборд', icon: '📊' },
  { path: '/admin/products', label: 'Товары', icon: '📦' },
  { path: '/admin/orders', label: 'Заказы', icon: '🛒' },
  { path: '/admin/categories', label: 'Категории', icon: '🏷️' },
  { path: '/admin/reviews', label: 'Отзывы', icon: '💬' },
  { path: '/admin/news', label: 'Новости', icon: '📰' },
  { path: '/admin/video-reviews', label: 'Обзоры', icon: '🎬' },
  { path: '/admin/promocodes', label: 'Промокоды', icon: '🏷️' },
  { path: '/admin/logs', label: 'Журнал', icon: '📝' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f9fafb',
    }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, bg: 'rgba(0,0,0,0.3)', zIndex: 40,
            display: 'block',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h1 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            ANT ARM
          </h1>
          <p style={{
            fontSize: 11,
            color: '#9ca3af',
            marginTop: 4,
            margin: '4px 0 0 0',
          }}>
            Панель управления
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#111827' : '#6b7280',
                  background: isActive ? '#f3f4f6' : 'transparent',
                  borderLeft: isActive ? '3px solid #111827' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  margin: '2px 0',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <p style={{
            fontSize: 13,
            color: '#374151',
            margin: '0 0 2px 0',
            fontWeight: 500,
          }}>
            {user?.name || user?.email}
          </p>
          <p style={{
            fontSize: 11,
            color: '#9ca3af',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {user?.role === 'admin' ? 'Администратор' : user?.role}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to="/"
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                textAlign: 'center',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              На сайт
            </Link>
            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                background: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed', top: 12, left: 12, zIndex: 45,
          display: 'none',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: 20,
          cursor: 'pointer',
        }}
        className="admin-hamburger"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        padding: 32,
        minWidth: 0,
        background: '#f9fafb',
      }}>
        <Outlet />
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-layout aside {
            transform: translateX(-100%);
          }
          .admin-layout aside.open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0 !important;
            padding: 16px !important;
          }
          .admin-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
