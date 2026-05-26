import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const ACTION_STYLES = {
  create: { bg: '#dcfce7', text: '#16a34a', label: 'Создание' },
  update: { bg: '#dbeafe', text: '#1d4ed8', label: 'Обновление' },
  delete: { bg: '#fce7f3', text: '#dc2626', label: 'Удаление' },
};

const ENTITY_ICONS = {
  products: '📦',
  orders: '🛒',
  users: '👤',
  categories: '📂',
  settings: '⚙️',
  licenses: '📋',
};

const ENTITY_LABELS = {
  products: 'Товары',
  orders: 'Заказы',
  users: 'Пользователи',
  categories: 'Категории',
  settings: 'Настройки',
  licenses: 'Лицензии',
};

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ entityType: '', action: '' });

  useEffect(() => { loadLogs(); }, [page, filter]);

  const loadLogs = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 50, ...filter });
    api.get(`/admin/logs?${params}`).then(res => {
      setLogs(res.logs);
      setTotal(res.total);
    }).finally(() => setLoading(false));
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Журнал действий</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{total} записей</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select
          value={filter.entityType}
          onChange={e => { setFilter({ ...filter, entityType: e.target.value }); setPage(1); }}
          style={{
            padding: '8px 14px', fontSize: 13,
            background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 8,
            color: '#374151', outline: 'none',
          }}
        >
          <option value="">Все модули</option>
          {Object.entries(ENTITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={filter.action}
          onChange={e => { setFilter({ ...filter, action: e.target.value }); setPage(1); }}
          style={{
            padding: '8px 14px', fontSize: 13,
            background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 8,
            color: '#374151', outline: 'none',
          }}
        >
          <option value="">Все действия</option>
          {Object.entries(ACTION_STYLES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Logs list */}
      <div style={{
        background: '#ffffff', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Загрузка...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Нет записей</div>
        ) : (
          <div>
            {logs.map((log, i) => {
              const actionStyle = ACTION_STYLES[log.action] || { bg: '#f3f4f6', text: '#6b7280', label: log.action };
              const icon = ENTITY_ICONS[log.entityType] || '📋';
              return (
                <div
                  key={log.id || i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 20px',
                    borderBottom: i < logs.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <span style={{ fontSize: 20, marginTop: 2 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: actionStyle.bg, color: actionStyle.text,
                      }}>
                        {actionStyle.label}
                      </span>
                      <span style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>
                        {log.description || `${ENTITY_LABELS[log.entityType] || log.entityType} — ${log.action}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
                      <span>{new Date(log.createdAt || log.created_at).toLocaleString('ru-RU')}</span>
                      {log.userName && <span>{log.userName}</span>}
                      {log.userEmail && <span>{log.userEmail}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 14px', fontSize: 13, borderRadius: 8,
              background: page === 1 ? '#f3f4f6' : '#ffffff',
              border: '1px solid #d1d5db', color: page === 1 ? '#d1d5db' : '#374151',
              cursor: page === 1 ? 'default' : 'pointer',
            }}
          >
            ← Назад
          </button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                style={{
                  padding: '8px 14px', fontSize: 13, borderRadius: 8,
                  background: page === pageNum ? '#111827' : '#ffffff',
                  border: page === pageNum ? '1px solid #111827' : '1px solid #d1d5db',
                  color: page === pageNum ? '#ffffff' : '#374151',
                  cursor: 'pointer', fontWeight: page === pageNum ? 600 : 400,
                }}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 14px', fontSize: 13, borderRadius: 8,
              background: page === totalPages ? '#f3f4f6' : '#ffffff',
              border: '1px solid #d1d5db', color: page === totalPages ? '#d1d5db' : '#374151',
              cursor: page === totalPages ? 'default' : 'pointer',
            }}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  );
}
