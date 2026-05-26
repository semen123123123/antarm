import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    if (editingProduct) {
      const updated = await api.put(`/products/${editingProduct.id}`, data);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
    } else {
      const created = await api.post('/products', data);
      setProducts(prev => [...prev, created]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <p style={{ color: '#9ca3af' }}>Загрузка...</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Товары ({products.length})</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
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
          + Добавить товар
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={thStyle}>Фото</th>
                <th style={thStyle}>Название</th>
                <th style={thStyle}>Артикул</th>
                <th style={thStyle}>Цена</th>
                <th style={thStyle}>WB</th>
                <th style={thStyle}>Ozon</th>
                <th style={thStyle}>Наличие</th>
                <th style={thStyle}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, background: '#f3f4f6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        📦
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500, color: '#111827', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: '#6b7280', fontFamily: 'monospace' }}>{p.sku || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#111827' }}>
                    {(p.price || 0).toLocaleString('ru-RU')} ₽
                  </td>
                  <td style={tdStyle}>
                    {p.wb_url ? (
                      <a
                        href={p.wb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          color: '#1d4ed8', fontSize: 12, textDecoration: 'none',
                          padding: '2px 8px', background: '#dbeafe', borderRadius: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        WB
                      </a>
                    ) : (
                      <span style={{ color: '#d1d5db' }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {p.ozon_url ? (
                      <a
                        href={p.ozon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          color: '#b45309', fontSize: 12, textDecoration: 'none',
                          padding: '2px 8px', background: '#fef3c7', borderRadius: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        Ozon
                      </a>
                    ) : (
                      <span style={{ color: '#d1d5db' }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                      background: p.inStock || p.in_stock ? '#dcfce7' : '#fce7f3',
                      color: p.inStock || p.in_stock ? '#16a34a' : '#dc2626',
                    }}>
                      {p.inStock || p.in_stock ? 'В наличии' : 'Нет'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleEdit(p)}
                        style={{
                          padding: '6px 12px', fontSize: 12,
                          background: '#ffffff', border: '1px solid #d1d5db',
                          borderRadius: 6, color: '#374151', cursor: 'pointer',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Нет товаров. Нажмите «+ Добавить товар» чтобы создать первый.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: 12,
  color: '#6b7280',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 14px',
  fontSize: 13,
  color: '#374151',
};
