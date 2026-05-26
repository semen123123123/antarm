import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '' });

  useEffect(() => {
    api.get('/categories')
      .then(data => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', slug: '', icon: '' });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      alert('Заполните название и адрес URL');
      return;
    }
    if (editing) {
      const updated = await api.put(`/categories/${editing.id}`, form);
      setCategories(prev => prev.map(c => c.id === editing.id ? updated : c));
    } else {
      const created = await api.post('/categories', form);
      setCategories(prev => [...prev, created]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <p style={{ color: '#9ca3af' }}>Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Категории ({categories.length})</h1>
        <button
          onClick={openAdd}
          style={{
            padding: '10px 20px',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Добавить
        </button>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Иконка</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Название</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Адрес URL</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13 }}>{cat.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: 20 }}>{cat.icon || '📁'}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 500, color: '#111827' }}>{cat.name}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13, fontFamily: 'monospace' }}>{cat.slug}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openEdit(cat)}
                        style={{
                          padding: '6px 12px', fontSize: 12,
                          background: '#ffffff', border: '1px solid #d1d5db',
                          borderRadius: 6, color: '#374151', cursor: 'pointer',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{
                          padding: '6px 12px', fontSize: 12,
                          background: '#ffffff', border: '1px solid #fecaca',
                          borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Нет категорий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 12, padding: 28,
            width: 420, maxWidth: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
                {editing ? 'Редактировать категорию' : 'Новая категория'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ fontSize: 18, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
                  Название *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Например: Экипировка"
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 14,
                    border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
                  Адрес URL *
                </label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="Например: ekipirovka"
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 14,
                    border: '1px solid #d1d5db', borderRadius: 8, color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
                  Иконка (emoji)
                </label>
                <input
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  placeholder="Например: 🛡️"
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
                onClick={() => setShowForm(false)}
                style={{
                  padding: '10px 20px', fontSize: 14, borderRadius: 8,
                  background: '#ffffff', border: '1px solid #d1d5db', color: '#374151',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px', fontSize: 14, borderRadius: 8,
                  background: '#111827', border: 'none', color: '#ffffff',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
