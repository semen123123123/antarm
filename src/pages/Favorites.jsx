import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Favorites() {
  const { favorites, removeFromFavorites, clearFavorites } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  const favoriteProducts = favorites
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (favoriteProducts.length === 0) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 20 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, color: '#222' }}>
            Нет избранных товаров
          </h1>
          <p style={{ fontSize: 15, color: '#999', marginBottom: 28 }}>
            Нажмите ♡ на карточке товара, чтобы добавить в избранное
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '12px 28px',
            background: '#333',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            textDecoration: 'none',
          }}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Breadcrumbs items={[{ label: 'Избранное' }]} color="#999" activeColor="#333" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#222' }}>Избранное</h1>
            <p style={{ fontSize: 14, color: '#999' }}>{favoriteProducts.length} товаров</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {confirmClear ? (
              <>
                <button
                  onClick={() => { clearFavorites(); setConfirmClear(false); }}
                  style={{
                    padding: '8px 16px', fontSize: 13, borderRadius: 8,
                    background: '#ef4444', color: '#fff', border: 'none',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Удалить всё?
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  style={{
                    padding: '8px 16px', fontSize: 13, borderRadius: 8,
                    background: '#fff', color: '#374151', border: '1px solid #d1d5db',
                    cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Отмена
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                style={{
                  padding: '8px 16px', fontSize: 13, borderRadius: 8,
                  background: '#fff', color: '#ef4444', border: '1px solid #fecaca',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                Удалить всё
              </button>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {favoriteProducts.map(product => (
            <div key={product.id} style={{ position: 'relative' }}>
              <ProductCard key={product.id} product={product} light />
              <button
                onClick={() => removeFromFavorites(product.id)}
                style={{
                  position: 'absolute',
                  top: 8, right: 8,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #e5e7eb',
                  color: '#ef4444',
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                title="Удалить из избранного"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
