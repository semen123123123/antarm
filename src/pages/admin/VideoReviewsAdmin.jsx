import { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';

export default function VideoReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', video_url: '', preview_url: '', sort_order: 0, is_active: true });
  const [previewPreview, setPreviewPreview] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const previewInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

  const fetchReviews = () => {
    setLoading(true);
    api.get('/video-reviews').then(data => {
      setReviews(data || []);
    }).catch((err) => {
      console.error('Ошибка загрузки обзоров:', err);
      alert('Ошибка загрузки обзоров');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const cropTo16x9 = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let cropW, cropH, cropX, cropY;
        const ratio = 16 / 9;
        if (img.width / img.height > ratio) {
          cropH = img.height;
          cropW = img.height * ratio;
          cropX = (img.width - cropW) / 2;
          cropY = 0;
        } else {
          cropW = img.width;
          cropH = img.width / ratio;
          cropX = 0;
          cropY = (img.height - cropH) / 2;
        }
        const maxW = 640;
        const scale = Math.min(1, maxW / cropW);
        canvas.width = cropW * scale;
        canvas.height = cropH * scale;
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewPreview(dataUrl);
        setForm(prev => ({ ...prev, preview_url: dataUrl }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const loadVideoFile = (file) => {
    if (file.size > MAX_VIDEO_SIZE) {
      alert(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум 50 МБ.`);
      return;
    }
    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({ ...prev, video_url: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', video_url: '', preview_url: '', sort_order: 0, is_active: true });
    setPreviewPreview('');
    setVideoFileName('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      video_url: item.video_url || '',
      preview_url: item.preview_url || '',
      sort_order: item.sort_order || 0,
      is_active: !!item.is_active,
    });
    setPreviewPreview(item.preview_url || '');
    setVideoFileName('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.video_url || !form.preview_url) {
      alert('Добавьте видео и превью');
      return;
    }
    try {
      if (editing) {
        await api.put(`/video-reviews/${editing.id}`, form);
      } else {
        await api.post('/video-reviews', form);
      }
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Ошибка при сохранении: ' + (err.message || 'неизвестная ошибка'));
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Удалить этот обзор?')) return;
    try {
      await api.delete(`/video-reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Ошибка при удалении: ' + (err.message || 'неизвестная ошибка'));
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/video-reviews/${item.id}`, { is_active: !item.is_active });
      fetchReviews();
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Обзоры</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
            Видео-обзоры с главной страницы
          </p>
        </div>
        <button onClick={openCreate} style={{
          padding: '8px 20px', fontSize: 13, borderRadius: 8,
          background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
        }}>
          + Новый обзор
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 560,
            maxHeight: '90vh', overflow: 'auto',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#111827' }}>
              {editing ? 'Редактировать обзор' : 'Новый обзор'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Название</label>
                <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Видео *</label>

                {/* URL input */}
                <input value={form.video_url} onChange={e => { setForm(prev => ({ ...prev, video_url: e.target.value })); setVideoFileName(''); }}
                  placeholder="Ссылка на видео или /video.mp4"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, marginBottom: 8 }} />

                {/* Video file upload */}
                <input type="file" accept="video/*" ref={videoInputRef} style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) loadVideoFile(f); }} />
                <button type="button" onClick={() => videoInputRef.current?.click()} style={{
                  width: '100%', padding: '10px 14px', fontSize: 13,
                  border: '1px dashed #d1d5db', borderRadius: 8, background: '#f9fafb',
                  color: '#6b7280', cursor: 'pointer', textAlign: 'center',
                }}>
                  {videoFileName ? `📹 ${videoFileName}` : '📹 Загрузить видео файлом'}
                </button>

                {/* Video preview */}
                {form.video_url && (
                  <video controls style={{
                    width: '100%', marginTop: 8, borderRadius: 6, maxHeight: 200,
                    border: '1px solid #e5e7eb',
                  }}>
                    <source src={form.video_url} />
                  </video>
                )}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Превью (16:9) *</label>
                <input type="file" accept="image/*" ref={previewInputRef} style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) cropTo16x9(f); }} />
                <button type="button" onClick={() => previewInputRef.current?.click()} style={{
                  width: '100%', padding: '10px 14px', fontSize: 13,
                  border: '1px dashed #d1d5db', borderRadius: 8, background: '#f9fafb',
                  color: '#6b7280', cursor: 'pointer', textAlign: 'center',
                }}>
                  {previewPreview ? '🖼 Заменить превью' : '🖼 Загрузить превью'}
                </button>
                {previewPreview && (
                  <img src={previewPreview} alt="" style={{ width: '100%', marginTop: 8, borderRadius: 6, aspectRatio: '16/9', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                )}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Порядок сортировки</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    style={{ width: 18, height: 18 }} />
                  Активно
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
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
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🎬</p>
          <p>Нет видео-обзоров</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {reviews.map(item => (
            <div key={item.id} style={{
              background: '#fff', borderRadius: 12, overflow: 'hidden',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ aspectRatio: '16/9', background: '#f3f4f6', position: 'relative' }}>
                {item.preview_url && (
                  <img src={item.preview_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span style={{
                    padding: '2px 8px', fontSize: 11, borderRadius: 4,
                    background: item.is_active ? '#d1fae5' : '#f3f4f6',
                    color: item.is_active ? '#065f46' : '#6b7280', fontWeight: 600,
                  }}>
                    {item.is_active ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>{item.title || 'Без названия'}</h3>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px 0', wordBreak: 'break-all', maxHeight: 40, overflow: 'hidden' }}>
                  {item.video_url?.startsWith('data:') ? '[Видео файл]' : item.video_url}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(item)} style={{
                    flex: 1, padding: '6px 12px', fontSize: 12, borderRadius: 6,
                    background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer',
                  }}>Редактировать</button>
                  <button onClick={() => toggleActive(item)} style={{
                    padding: '6px 12px', fontSize: 12, borderRadius: 6,
                    background: item.is_active ? '#fef3c7' : '#d1fae5',
                    color: item.is_active ? '#92400e' : '#065f46', border: 'none', cursor: 'pointer',
                  }}>
                    {item.is_active ? 'Деакт.' : 'Акт.'}
                  </button>
                  <button onClick={() => deleteReview(item.id)} style={{
                    padding: '6px 12px', fontSize: 12, borderRadius: 6,
                    background: '#fff', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer',
                  }}>Удалить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
