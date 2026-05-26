import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const VALID_STATUSES = ['новый', 'в обработке', 'подтверждён', 'отправлен', 'доставлен', 'отменён'];

const STATUS_STYLES = {
  'новый': { bg: '#dbeafe', text: '#1d4ed8' },
  'в обработке': { bg: '#fef3c7', text: '#b45309' },
  'подтверждён': { bg: '#ede9fe', text: '#7c3aed' },
  'отправлен': { bg: '#ffedd5', text: '#c2410c' },
  'доставлен': { bg: '#dcfce7', text: '#16a34a' },
  'отменён': { bg: '#fce7f3', text: '#dc2626' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const updated = await api.put(`/orders/${orderId}/status`, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(updated);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <p style={{ color: '#9ca3af' }}>Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Заказы ({orders.length})</h1>
      </div>

      {/* Status filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px', fontSize: 13, borderRadius: 20,
            background: filter === 'all' ? '#111827' : '#ffffff',
            border: filter === 'all' ? '1px solid #111827' : '1px solid #d1d5db',
            color: filter === 'all' ? '#ffffff' : '#374151',
            cursor: 'pointer', fontWeight: 500,
          }}
        >
          Все <span style={{ opacity: 0.7 }}>({orders.length})</span>
        </button>
        {VALID_STATUSES.map(s => {
          const style = STATUS_STYLES[s];
          const count = orders.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px', fontSize: 13, borderRadius: 20,
                background: filter === s ? style.bg : '#ffffff',
                border: filter === s ? `1px solid ${style.text}` : '1px solid #d1d5db',
                color: filter === s ? style.text : '#374151',
                cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
              }}
            >
              {s} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>№</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Клиент</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Сумма</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Статус</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Дата</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const statusStyle = STATUS_STYLES[order.status] || { bg: '#f3f4f6', text: '#6b7280' };
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      background: selectedOrder?.id === order.id ? '#f9fafb' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>#{order.id}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{order.customerName || order.customer_name || '—'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>
                      {(order.total || 0).toLocaleString('ru-RU')} ₽
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                        background: statusStyle.bg, color: statusStyle.text,
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13 }}>
                      {new Date(order.createdAt || order.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={order.status}
                        onChange={e => {
                          e.stopPropagation();
                          updateStatus(order.id, e.target.value);
                        }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          padding: '4px 8px', fontSize: 12, borderRadius: 6,
                          border: '1px solid #d1d5db', background: '#ffffff', color: '#374151',
                          cursor: 'pointer',
                        }}
                      >
                        {VALID_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Нет заказов
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail */}
      {selectedOrder && (
        <div style={{
          marginTop: 24,
          background: '#ffffff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
              Заказ #{selectedOrder.id}
            </h2>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ fontSize: 18, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 12px 0' }}>Информация о заказе</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <InfoRow label="Статус" value={selectedOrder.status} />
                <InfoRow label="Сумма" value={`${(selectedOrder.total || 0).toLocaleString('ru-RU')} ₽`} />
                <InfoRow label="Дата" value={new Date(selectedOrder.createdAt || selectedOrder.created_at).toLocaleString('ru-RU')} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 12px 0' }}>Клиент</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <InfoRow label="Имя" value={selectedOrder.customerName || selectedOrder.customer_name || '—'} />
                <InfoRow label="Email" value={selectedOrder.email || selectedOrder.customerEmail || '—'} />
                <InfoRow label="Телефон" value={selectedOrder.phone || selectedOrder.customerPhone || '—'} />
                <InfoRow label="Адрес" value={selectedOrder.address || selectedOrder.customerAddress || '—'} />
              </div>
            </div>
          </div>

          {/* Items */}
          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 12px 0' }}>Товары в заказе</h3>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500 }}>Товар</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500 }}>Кол-во</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500 }}>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{item.name || item.productName || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{item.quantity || 1}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{(item.price || 0).toLocaleString('ru-RU')} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status update */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Изменить статус:</span>
            <select
              value={selectedOrder.status}
              onChange={e => updateStatus(selectedOrder.id, e.target.value)}
              style={{
                padding: '8px 14px', fontSize: 13, borderRadius: 8,
                border: '1px solid #d1d5db', background: '#ffffff', color: '#374151',
              }}
            >
              {VALID_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <span style={{ fontSize: 13, color: '#6b7280', minWidth: 80 }}>{label}:</span>
      <span style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
