import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const ROLE_LABELS = {
  admin: 'Администратор',
  product_manager: 'Менеджер товаров',
  order_manager: 'Менеджер заказов',
  content_editor: 'Контент-редактор',
  analyst: 'Аналитик',
  customer: 'Клиент',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'product_manager', phone: '' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = () => {
    api.get('/admin/users').then(setUsers).finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ email: '', password: '', name: '', role: 'product_manager', phone: '' });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBlock = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/block`);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', name: user.name, role: user.role, phone: user.phone || '' });
    setShowModal(true);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <p style={{ color: '#9ca3af' }}>Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Пользователи ({users.length})</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', password: '', name: '', role: 'product_manager', phone: '' });
            setShowModal(true);
          }}
          style={{
            padding: '10px 20px', background: '#111827', color: '#ffffff',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Добавить
        </button>
      </div>

      <div style={{
        background: '#ffffff', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Имя</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Роль</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Статус</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13 }}>{user.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 500, color: '#111827' }}>{user.name || '—'}</td>
                  <td style={{ padding: '12px 14px', color: '#374151' }}>{user.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: 12,
                      background: '#f3f4f6', color: '#374151',
                    }}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                      background: user.isBlocked || user.blocked ? '#fce7f3' : '#dcfce7',
                      color: user.isBlocked || user.blocked ? '#dc2626' : '#16a34a',
                    }}>
                      {user.isBlocked || user.blocked ? 'Заблокирован' : 'Активен'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '6px 12px', fontSize: 12,
                          background: '#ffffff', border: '1px solid #d1d5db',
                          borderRadius: 6, color: '#374151', cursor: 'pointer',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleBlock(user)}
                        style={{
                          padding: '6px 12px', fontSize: 12,
                          background: '#ffffff',
                          border: user.isBlocked || user.blocked ? '1px solid #bbf7d0' : '1px solid #fecaca',
                          borderRadius: 6,
                          color: user.isBlocked || user.blocked ? '#16a34a' : '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        {user.isBlocked || user.blocked ? '🔓' : '🔒'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Нет пользователей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 12, padding: 28,
            width: 440, maxWidth: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
                {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: 18, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>Имя</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>Email</label>
                  <input
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
                    Пароль {editingUser && '(оставьте пустым, чтобы не менять)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>Роль</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                      outline: 'none', boxSizing: 'border-box', background: '#ffffff',
                    }}
                  >
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>Телефон</label>
                  <input
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px', fontSize: 14, borderRadius: 8,
                    background: '#ffffff', border: '1px solid #d1d5db', color: '#374151',
                    cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px', fontSize: 14, borderRadius: 8,
                    background: '#111827', border: 'none', color: '#ffffff',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
