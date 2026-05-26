import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const STATUS_COLORS = {
  'новый': { bg: '#dbeafe', text: '#1d4ed8' },
  'в обработке': { bg: '#fef3c7', text: '#b45309' },
  'подтверждён': { bg: '#ede9fe', text: '#7c3aed' },
  'отправлен': { bg: '#ffedd5', text: '#c2410c' },
  'доставлен': { bg: '#dcfce7', text: '#16a34a' },
  'отменён': { bg: '#fce7f3', text: '#dc2626' },
};

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #f3f4f6',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</p>
          <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 700, color: '#111827' }}>{value}</p>
        </div>
        <span style={{ fontSize: 28 }}>{icon}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/analytics/dashboard')
      .then(setData)
      .catch(err => {
        console.error('Dashboard error:', err);
        setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, border: '3px solid #e5e7eb',
            borderTopColor: '#111827', borderRadius: '50%',
            animation: 'admin-spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 20, background: '#fef2f2',
        border: '1px solid #fecaca', borderRadius: 10,
        color: '#dc2626', fontSize: 14,
      }}>
        {error}
      </div>
    );
  }

  if (!data) return null;

  const { revenue, orderCount, newOrdersToday, ordersByStatus, recentOrders, lowStock } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Дашборд</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stats cards — 3 карточки (убрана Конверсия) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="💰" label="Выручка (мес)" value={`${(revenue || 0).toLocaleString('ru-RU')} ₽`} />
        <StatCard icon="🛒" label="Заказов (мес)" value={orderCount || 0} />
        <StatCard icon="📦" label="Новых сегодня" value={newOrdersToday || 0} />
      </div>

      {/* Orders by status */}
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
        marginBottom: 28,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>📋 Заказы по статусам</h2>
        {ordersByStatus && ordersByStatus.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {ordersByStatus.map((entry) => {
              const status = entry.status;
              const count = entry.count;
              const colors = STATUS_COLORS[status] || { bg: '#f3f4f6', text: '#6b7280' };
              return (
                <div key={status} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 8,
                  background: colors.bg,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{status}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>Нет данных</p>
        )}
      </div>

      {/* Recent Orders */}
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>🕐 Последние заказы</h2>
          <Link to="/admin/orders" style={{ fontSize: 13, color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
            Все заказы →
          </Link>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>№</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Клиент</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Сумма</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Статус</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => {
                  const colors = STATUS_COLORS[order.status] || { bg: '#f3f4f6', text: '#6b7280' };
                  return (
                    <tr key={order.id || i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>#{order.id}</td>
                      <td style={{ padding: '10px 12px', color: '#374151' }}>{order.customerName || order.customer_name || '—'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{(order.total || 0).toLocaleString('ru-RU')} ₽</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                          background: colors.bg, color: colors.text,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 12 }}>
                        {new Date(order.createdAt || order.created_at).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>Нет заказов</p>
        )}
      </div>

      {/* Low stock warning */}
      {lowStock && lowStock.length > 0 && (
        <div style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 12,
          padding: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#c2410c', margin: '0 0 8px 0' }}>
            ⚠️ Заканчиваются на складе
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {lowStock.map((p, i) => (
              <span key={i} style={{
                padding: '4px 10px', background: '#ffffff', borderRadius: 6,
                fontSize: 12, color: '#374151', border: '1px solid #fed7aa',
              }}>
                {p.name} — {p.stock || p.count} шт.
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes admin-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
