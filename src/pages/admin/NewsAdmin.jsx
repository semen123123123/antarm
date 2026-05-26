import { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ content: '', image: '', published: true });

  // Crop state
  const [originalImage, setOriginalImage] = useState(null);
  const [imageMeta, setImageMeta] = useState({ w: 0, h: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [imagePreview, setImagePreview] = useState('');
  const [isCropping, setIsCropping] = useState(false);
  const cropRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchNews = () => {
    setLoading(true);
    api.get('/news').then(data => {
      setNews(data || []);
    }).catch((err) => {
      console.error('Ошибка загрузки новостей:', err);
      alert('Ошибка загрузки новостей');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  // Generate slug from first words of content
  const generateSlug = (content) => {
    const translit = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
      'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    };
    // Take first 50 chars of content for slug
    const firstLine = content.trim().split('\n')[0].slice(0, 50);
    let slug = '';
    for (const ch of firstLine.toLowerCase()) slug += translit[ch] || ch;
    return slug.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'news-' + Date.now();
  };

  // Generate title from first line of content
  const generateTitle = (content) => {
    return content.trim().split('\n')[0].slice(0, 100) || 'Новость';
  };

  const loadImageForCrop = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        setImageMeta({ w, h });
        setOriginalImage(e.target.result);

        // Calculate default centered 16:9 crop
        const ratio = 16 / 9;
        let cropW, cropH;
        if (w / h > ratio) {
          cropH = h;
          cropW = h * ratio;
        } else {
          cropW = w;
          cropH = w / ratio;
        }
        setCropBox({
          x: (w - cropW) / 2,
          y: (h - cropH) / 2,
          w: cropW,
          h: cropH,
        });
        setIsCropping(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxW = 1200;
    const scale = Math.min(1, maxW / cropBox.w);
    canvas.width = cropBox.w * scale;
    canvas.height = cropBox.h * scale;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, cropBox.x, cropBox.y, cropBox.w, cropBox.h, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      setForm(prev => ({ ...prev, image: dataUrl }));
      setIsCropping(false);
      setOriginalImage(null);
    };
    img.src = originalImage;
  };

  const handleCropClick = (e) => {
    const rect = cropRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const { w, h } = imageMeta;
    const ratio = 16 / 9;
    let cropW, cropH;
    if (w / h > ratio) {
      cropH = h;
      cropW = h * ratio;
    } else {
      cropW = w;
      cropH = w / ratio;
    }

    let newX = clickX * w - cropW / 2;
    let newY = clickY * h - cropH / 2;
    newX = Math.max(0, Math.min(newX, w - cropW));
    newY = Math.max(0, Math.min(newY, h - cropH));

    setCropBox({ x: newX, y: newY, w: cropW, h: cropH });
  };

  const recropImage = () => {
    if (imagePreview) {
      const img = new Image();
      img.onload = () => {
        setImageMeta({ w: img.width, h: img.height });
        setOriginalImage(imagePreview);
        const ratio = 16 / 9;
        let cropW, cropH;
        if (img.width / img.height > ratio) {
          cropH = img.height;
          cropW = img.height * ratio;
        } else {
          cropW = img.width;
          cropH = img.width / ratio;
        }
        setCropBox({ x: (img.width - cropW) / 2, y: (img.height - cropH) / 2, w: cropW, h: cropH });
        setIsCropping(true);
      };
      img.src = imagePreview;
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ content: '', image: '', published: true });
    setImagePreview('');
    setOriginalImage(null);
    setIsCropping(false);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      content: item.content || '',
      image: item.image || '',
      published: !!item.published,
    });
    setImagePreview(item.image || '');
    setOriginalImage(null);
    setIsCropping(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content) {
      alert('Введите текст новости');
      return;
    }
    const title = generateTitle(form.content);
    const payload = {
      title,
      slug: generateSlug(form.content),
      content: form.content,
      excerpt: '',
      image: form.image || null,
      published: form.published,
    };
    try {
      if (editing) {
        await api.put(`/news/${editing.id}`, payload);
      } else {
        await api.post('/news', payload);
      }
      setShowForm(false);
      fetchNews();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Ошибка при сохранении: ' + (err.message || 'неизвестная ошибка'));
    }
  };

  const deleteNews = async (id) => {
    if (!confirm('Удалить эту новость?')) return;
    try {
      const res = await api.delete(`/news/${id}`);
      if (res && res.success === false) {
        alert('Ошибка при удалении');
        return;
      }
      fetchNews();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Ошибка при удалении: ' + (err.message || 'неизвестная ошибка'));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Новости</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
            Управление новостями на главной странице
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: '8px 20px', fontSize: 13, borderRadius: 8,
            background: '#111827', color: '#fff', border: 'none',
            cursor: 'pointer', fontWeight: 600,
          }}
        >
          + Новая новость
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 640,
            maxHeight: '90vh', overflow: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#111827' }}>
              {editing ? 'Редактировать новость' : 'Новая новость'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Текст *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Фото (16:9)</label>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) loadImageForCrop(f); }} />

                {isCropping && originalImage ? (
                  <div>
                    <div
                      ref={cropRef}
                      onClick={handleCropClick}
                      style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        cursor: 'crosshair',
                        background: '#000',
                      }}
                    >
                      <img
                        src={originalImage}
                        alt=""
                        style={{
                          position: 'absolute',
                          left: `${-(cropBox.x / imageMeta.w) * 100}%`,
                          top: `${-(cropBox.y / imageMeta.h) * 100}%`,
                          width: `${(imageMeta.w / cropBox.w) * 100}%`,
                          height: 'auto',
                          maxWidth: 'none',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Crop area indicator */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '2px solid rgba(255,255,255,0.8)',
                        borderRadius: 6,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, textAlign: 'center' }}>
                      Кликните на фото чтобы отцентрировать область кадрирования
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" onClick={applyCrop} style={{
                        padding: '6px 16px', fontSize: 12, borderRadius: 6,
                        background: '#111827', color: '#fff', border: 'none', cursor: 'pointer',
                      }}>
                        Применить кадрирование
                      </button>
                      <button type="button" onClick={() => { setIsCropping(false); setOriginalImage(null); }} style={{
                        padding: '6px 16px', fontSize: 12, borderRadius: 6,
                        background: '#fff', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer',
                      }}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{
                      width: '100%', padding: '10px 14px', fontSize: 13,
                      border: '1px dashed #d1d5db', borderRadius: 8, background: '#f9fafb',
                      color: '#6b7280', cursor: 'pointer', textAlign: 'center',
                    }}>
                      {imagePreview ? '🖼 Заменить фото' : '🖼 Загрузить фото'}
                    </button>
                    {imagePreview && (
                      <div style={{ position: 'relative', marginTop: 8 }}>
                        <img src={imagePreview} alt="" style={{
                          width: '100%', borderRadius: 6,
                          aspectRatio: '16/9', objectFit: 'cover', border: '1px solid #e5e7eb',
                        }} />
                        <button type="button" onClick={recropImage} style={{
                          position: 'absolute', bottom: 8, right: 8,
                          padding: '4px 12px', fontSize: 11, borderRadius: 6,
                          background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer',
                        }}>
                          Обрезать
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))}
                    style={{ width: 18, height: 18 }} />
                  Опубликовано
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
      ) : news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📰</p>
          <p>Новостей пока нет</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {news.map(item => (
            <div key={item.id} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              background: '#fff', borderRadius: 12, padding: 16,
              border: '1px solid #e5e7eb',
            }}>
              {item.image && (
                <img src={item.image} alt="" style={{
                  width: 160, aspectRatio: '16/9', objectFit: 'cover',
                  borderRadius: 8, flexShrink: 0,
                }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>
                    {item.title}
                  </h3>
                  {item.published ? (
                    <span style={{ padding: '2px 8px', fontSize: 11, borderRadius: 4, background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>
                      Опубликовано
                    </span>
                  ) : (
                    <span style={{ padding: '2px 8px', fontSize: 11, borderRadius: 4, background: '#f3f4f6', color: '#6b7280', fontWeight: 600 }}>
                      Черновик
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                  {item.content?.slice(0, 150)}...
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(item)} style={{
                    padding: '6px 14px', fontSize: 12, borderRadius: 6,
                    background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer',
                  }}>Редактировать</button>
                  <button onClick={() => deleteNews(item.id)} style={{
                    padding: '6px 14px', fontSize: 12, borderRadius: 6,
                    background: '#fff', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer',
                  }}>Удалить</button>
                  <button onClick={async () => {
                    try {
                      await api.put(`/news/${item.id}`, { published: !item.published });
                      fetchNews();
                    } catch (err) {
                      console.error(err);
                      alert('Ошибка');
                    }
                  }} style={{
                    padding: '6px 14px', fontSize: 12, borderRadius: 6,
                    background: item.published ? '#fef3c7' : '#d1fae5',
                    color: item.published ? '#92400e' : '#065f46', border: 'none', cursor: 'pointer',
                  }}>
                    {item.published ? 'Скрыть' : 'Опубл.'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
