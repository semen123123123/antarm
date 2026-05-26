import { useState, useEffect, useRef } from 'react';

export default function ProductForm({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: 1,
    price: 0,
    oldPrice: null,
    sku: '',
    image: '',
    description: '',
    inStock: true,
    specs: [],
    wb_url: '',
    ozon_url: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        categoryId: product.categoryId || product.category_id || 1,
        price: product.price || 0,
        oldPrice: product.oldPrice || product.old_price || null,
        sku: product.sku || '',
        image: product.image || '',
        description: product.description || '',
        inStock: product.inStock !== undefined ? product.inStock : (product.in_stock !== 0),
        specs: product.specs || [],
        wb_url: product.wb_url || '',
        ozon_url: product.ozon_url || '',
      });
      if (product.image) setImagePreview(product.image);
    }
  }, [product]);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Crop image to 3:4 ratio using canvas
  const cropTo3x4 = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 3:4 ratio — width is 3/4 of height
        let cropW, cropH, cropX, cropY;
        const ratio = 3 / 4;

        if (img.width / img.height > ratio) {
          // Image is wider than 3:4 — crop width
          cropH = img.height;
          cropW = img.height * ratio;
          cropX = (img.width - cropW) / 2;
          cropY = 0;
        } else {
          // Image is taller than 3:4 — crop height
          cropW = img.width;
          cropH = img.width / ratio;
          cropX = 0;
          cropY = (img.height - cropH) / 2;
        }

        // Resize to max 800px width for storage efficiency
        const maxW = 800;
        const scale = Math.min(1, maxW / cropW);
        canvas.width = cropW * scale;
        canvas.height = cropH * scale;

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        updateField('image', dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение');
      return;
    }
    cropTo3x4(file);
  };

  const addSpec = () => {
    setForm(prev => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));
  };

  const updateSpec = (index, field, value) => {
    setForm(prev => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specs };
    });
  };

  const removeSpec = (index) => {
    setForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  // Auto-generate slug from name (transliteration + slugify)
  const generateSlug = (name) => {
    const translit = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
      'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'e',
      'Ж': 'zh', 'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm',
      'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u',
      'Ф': 'f', 'Х': 'kh', 'Ц': 'ts', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'shch',
      'Ы': 'y', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya',
    };
    let slug = '';
    for (const ch of name) {
      slug += translit[ch] || ch;
    }
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (value) => {
    updateField('name', value);
    if (!form.slug || form.slug === generateSlug(form.name || '')) {
      updateField('slug', generateSlug(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSlug = form.slug || generateSlug(form.name);
    if (!form.name || !form.price || !form.sku) {
      alert('Заполните обязательные поля: Название товара, Цена, Артикул');
      return;
    }
    onSave({ ...form, slug: finalSlug });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 32,
        width: '90%',
        maxWidth: 760,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
            {product ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: 20, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name + Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormGroup
              label="Название товара *"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Например: Бронежилет Комфорт-3"
            />
            <FormGroup
              label="Адрес в URL"
              value={form.slug}
              onChange={v => updateField('slug', v)}
              placeholder="Автоматически из названия"
              hint="Оставьте пустым — заполнится автоматически"
            />
          </div>

          {/* Row 2: Category + Price + Old Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Категория</label>
              <select
                value={form.categoryId}
                onChange={e => updateField('categoryId', Number(e.target.value))}
                style={inputStyle}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <FormGroup label="Цена *" type="number" value={form.price} onChange={v => updateField('price', Number(v))} />
            <FormGroup label="Цена до скидки" type="number" value={form.oldPrice || ''} onChange={v => updateField('oldPrice', v ? Number(v) : null)} />
          </div>

          {/* Row 3: Article + Photo Upload */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormGroup label="Артикул *" value={form.sku} onChange={v => updateField('sku', v)} placeholder="Например: ARM-001" />
            <div>
              <label style={labelStyle}>Фото товара (3:4)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 13,
                      border: '1px dashed #d1d5db', borderRadius: 8,
                      background: '#f9fafb', color: '#6b7280', cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {imagePreview ? '📷 Заменить фото' : '📷 Загрузить фото'}
                  </button>
                  {form.image && !form.image.startsWith('data:') && (
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                      URL: {form.image.slice(0, 40)}...
                    </p>
                  )}
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Превью"
                    style={{
                      width: 60, height: 80, objectFit: 'cover',
                      borderRadius: 6, border: '1px solid #e5e7eb',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Row 4: WB + Ozon URLs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormGroup
              label="Ссылка Wildberries"
              value={form.wb_url}
              onChange={v => updateField('wb_url', v)}
              placeholder="https://www.wildberries.ru/catalog/..."
            />
            <FormGroup
              label="Ссылка Ozon"
              value={form.ozon_url}
              onChange={v => updateField('ozon_url', v)}
              placeholder="https://www.ozon.ru/product/..."
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Описание</label>
            <textarea
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Подробное описание товара..."
              style={{
                ...inputStyle,
                minHeight: 80,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* In stock */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>В наличии</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={e => updateField('inStock', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                {form.inStock ? 'Да' : 'Нет'}
              </label>
            </div>
          </div>

          {/* Specs */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={labelStyle}>Характеристики</label>
              <button
                type="button"
                onClick={addSpec}
                style={{
                  padding: '4px 12px', fontSize: 12, borderRadius: 6,
                  background: '#f3f4f6', border: '1px solid #d1d5db',
                  color: '#374151', cursor: 'pointer',
                }}
              >
                + Добавить
              </button>
            </div>
            {form.specs.length === 0 && (
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Нет характеристик</p>
            )}
            {form.specs.map((spec, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input
                  value={spec.key}
                  onChange={e => updateSpec(i, 'key', e.target.value)}
                  placeholder="Название (например: Вес)"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  value={spec.value}
                  onChange={e => updateSpec(i, 'value', e.target.value)}
                  placeholder="Значение (например: 3.5 кг)"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  style={{
                    padding: '6px 10px', fontSize: 14,
                    background: 'none', border: '1px solid #fecaca',
                    borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px', fontSize: 14, borderRadius: 8,
                background: '#ffffff', border: '1px solid #d1d5db', color: '#374151',
                cursor: 'pointer', fontWeight: 500,
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px', fontSize: 14, borderRadius: 8,
                background: '#111827', border: 'none', color: '#ffffff',
                cursor: 'pointer', fontWeight: 600,
              }}
            >
              {product ? 'Сохранить изменения' : 'Создать товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormGroup({ label, value, onChange, type = 'text', placeholder, hint, min, max, step }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={inputStyle}
      />
      {hint && <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  color: '#374151',
  fontWeight: 500,
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  color: '#111827',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};
