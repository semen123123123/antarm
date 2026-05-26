import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export default function PromocodesAdmin() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: '', discount_type: 'percent', discount_value: '',
    expires_at: '', usage_limit: '',
  });

  const fetchCodes = () => {
    setLoading(true);
    api.get('/promocodes').then(data => {
      setCodes(data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCodes(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', discount_type: 'percent', discount_value: '', expires_at: '', usage_limit: '' });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      code: item.code || '',
      discount_type: item.discount_type || 'percent',
      discount_value: item.discount_value?.toString() || '',
      expires_at: item.expires_at ? item.expires_at.slice(0, 10) : '',
      usage_limit: item.usage_limit?.toString() || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      alert('Заполните код и размер скидки');
      return;
    }
    const payload = {
      code: form.code,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      expires_at: form.expires_at || null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : 0,
    };
    try {
      if (editing) {
        await api.put(`/promocodes/${editing.id}`, payload);
      } else {
        await api.post('/promocodes', payload);
      }
      setShowForm(false);
      fetchCodes();
    } catch (err) {
      alert(err.message || 'Ошибка при сохранении');
    }
  };

  const deleteCode = async (id) => {
    if (!confirm('Удалить этот промокод?')) return;
    try {
      await api.delete(`/promocodes/${id}`);
      fetchCodes();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const isExpired = (date) => date && new Date(date) < new Date();
  const isExhausted = (code) => code.usage_limit > 0 && code.usage_count >= code.usage_limit;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Промокоды</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
            Управление промокодами и скидками
          </p>
        </div>
        <button onClick={openCreate} style={{
          padding: '8px 20px', fontSize: 13, borderRadius: 8,
          background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
        }}>
          + Новый промокод
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 480,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#111827' }}>
              {editing ? 'Редактировать промокод' : 'Новый промокод'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Название кода *</label>
                <input value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Например: SUMMER20"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, textTransform: 'uppercase' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Тип скидки</label>
                <select value={form.discount_type} onChange={e => setForm(prev => ({ ...prev, discount_type: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}>
                  <option value="percent">Процент (%)</option>
                  <option value="fixed">Фиксированная сумма (₽)</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Размер скидки *</label>
                <input type="number" value={form.discount_value} onChange={e => setForm(prev => ({ ...prev, discount_value: e.target.value }))}
                  placeholder={form.discount_type === 'percent' ? 'Например: 20' : 'Например: 500'}
                  min="1" max={form.discount_type === 'percent' ? '100' : ''}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Действует до</label>
                  <input type="date" value={form.expires_at} onChange={e => setForm(prev => ({ ...prev, expires_at: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Лимит использований</label>
                  <input type="number" value={form.usage_limit} onChange={e => setForm(prev => ({ ...prev, usage_limit: e.target.value }))}
                    placeholder="0 = без лимита" min="0"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '8px 20px', fontSize: 13, borderRadius: 8,
                  background: '#fff', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer',
                }}>Отмена</button>
                <button type="submit" style={{
                  padding: '8px 20px', fontSize: 13, borderRadius: 8,
                  background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>{editing ? 'Сохранить' : 'Создать'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Загрузка...</p>
      ) : codes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🏷️</p>
          <p>Нет промокодов</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {codes.map(code => {
            const expired = isExpired(code.expires_at);
            const exhausted = isExhausted(code);
            const isInactive = !code.is_active || expired || exhausted;
            return (
              <div key={code.id} style={{
                background: '#fff', borderRadius: 12, padding: 20,
                border: `1px solid ${isInactive ? '#fecaca' : '#e5e7eb'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: isInactive ? 0.6 : 1,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 18, color: '#111827', fontFamily: 'monospace' }}>{code.code}</strong>
                    {isInactive && (
                      <span style={{ padding: '2px 8px', fontSize: 11, borderRadius: 4, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                        {expired ? 'Просрочен' : exhausted ? 'Лимит исчерпан' : 'Неактивен'}
                      </span>
                    )}
                    {code.is_active && !expired && !exhausted && (
                      <span style={{ padding: '2px 8px', fontSize: 11, borderRadius: 4, background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>
                        Активен
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    {code.discount_type === 'percent' ? `${code.discount_value}%` : `${code.discount_value} ₽`}
                    {code.expires_at && ` · до ${new Date(code.expires_at).toLocaleDateString('ru-RU')}`}
                    {code.usage_limit > 0 && ` · ${code.usage_count}/${code.usage_limit}`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(code)} style={{
                    padding: '6px 12px', fontSize: 12, borderRadius: 6,
                    background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer',
                  }}>Редактировать</button>
                  <button onClick={() => deleteCode(code.id)} style={{
                    padding: '6px 12px', fontSize: 12, borderRadius: 6,
                    background: '#fff', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer',
                  }}>Удалить</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
