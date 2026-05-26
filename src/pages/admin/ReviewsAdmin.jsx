import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, all

  const fetchReviews = () => {
    setLoading(true);
    const params = filter === 'all' ? '' : `&approved=${filter === 'approved' ? 1 : 0}`;
    api.get(`/reviews?${params}`).then(data => {
      setReviews(data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const toggleApprove = async (review) => {
    try {
      await api.patch(`/reviews/${review.id}`, { is_approved: !review.is_approved });
      fetchReviews();
    } catch (err) {
      alert('Ошибка при обновлении отзыва');
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Удалить этот отзыв?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert('Ошибка при удалении отзыва');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Отзывы</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
            Управление отзывами покупателей
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'pending', label: 'На модерации', color: '#f59e0b' },
          { key: 'approved', label: 'Одобренные', color: '#10b981' },
          { key: 'all', label: 'Все', color: '#6b7280' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 16px', fontSize: 13, borderRadius: 8,
              border: filter === f.key ? 'none' : '1px solid #d1d5db',
              background: filter === f.key ? f.color : '#fff',
              color: filter === f.key ? '#fff' : '#374151',
              cursor: 'pointer', fontWeight: filter === f.key ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Загрузка...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
          <p>Нет отзывов</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              background: '#fff', borderRadius: 12, padding: 20,
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 600, color: '#6b7280',
                  }}>
                    {review.author_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{review.author_name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                      {review.author_email || 'Без email'} · {review.created_at ? new Date(review.created_at).toLocaleDateString('ru-RU') : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#f59e0b', fontSize: 14 }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span style={{
                    padding: '2px 8px', fontSize: 11, borderRadius: 4,
                    background: review.is_approved ? '#d1fae5' : '#fef3c7',
                    color: review.is_approved ? '#065f46' : '#92400e',
                    fontWeight: 600,
                  }}>
                    {review.is_approved ? 'Одобрен' : 'На модерации'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                {review.text}
              </p>
              {review.product_id && (
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px 0' }}>
                  Товар ID: {review.product_id}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleApprove(review)}
                  style={{
                    padding: '6px 14px', fontSize: 12, borderRadius: 6,
                    background: review.is_approved ? '#f3f4f6' : '#10b981',
                    color: review.is_approved ? '#374151' : '#fff',
                    border: 'none', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  {review.is_approved ? 'Снять одобрение' : 'Одобрить'}
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  style={{
                    padding: '6px 14px', fontSize: 12, borderRadius: 6,
                    background: '#fff', color: '#ef4444',
                    border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
