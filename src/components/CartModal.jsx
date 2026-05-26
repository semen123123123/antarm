import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function CartModal({ isOpen, onClose, addedProduct }) {
  const { cart, removeFromCart, updateQty } = useCart();

  if (!isOpen || !addedProduct) return null;

  const product = products.find(p => p.id === addedProduct.id);
  if (!product) return null;

  const itemInCart = cart.find(c => c.id === addedProduct.id && c.size === addedProduct.size);
  const qty = itemInCart?.qty || 1;
  const itemTotal = product.price * qty;

  // Рекомендации — товары из той же категории
  const recommendations = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 16,
          padding: 0,
          zIndex: 9999,
          width: '100%',
          maxWidth: 720,
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            color: '#999',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#333'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Товар добавлен в корзину
          </h2>
        </div>

        {/* Added product */}
        <div style={{ padding: '24px 32px' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <Link to={`/product/${product.slug}`} style={{ flexShrink: 0 }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, background: '#f5f5f5' }}
              />
            </Link>
            <div style={{ flex: 1 }}>
              <Link
                to={`/product/${product.slug}`}
                style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', lineHeight: 1.4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#000'}
                onMouseLeave={e => e.currentTarget.style.color = '#1a1a1a'}
              >
                {product.name}
              </Link>
              {product.article && (
                <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Артикул: {product.article}</p>
              )}
              {addedProduct.size && (
                <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Размер: {addedProduct.size}</p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
                {itemTotal.toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                {qty} × {product.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>
        </div>

        {/* Cart summary */}
        <div style={{ padding: '20px 32px', background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: '#666' }}>
              В корзине <strong style={{ color: '#111' }}>{cartCount}</strong> {cartCount === 1 ? 'товар' : cartCount < 5 ? 'товара' : 'товаров'} на сумму <strong style={{ color: '#111' }}>{cartTotal.toLocaleString('ru-RU')} ₽</strong>
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                to="/cart"
                onClick={onClose}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  background: '#1a1a1a',
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ПЕРЕЙТИ В КОРЗИНУ
              </Link>
              <button
                onClick={onClose}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#333',
                  background: '#fff',
                  border: '1px solid #ddd',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.color = '#111'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#333'; }}
              >
                ПРОДОЛЖИТЬ ПОКУПКИ
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ padding: '24px 32px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 16, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              Мы рекомендуем
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {recommendations.map(rec => (
                <Link
                  key={rec.id}
                  to={`/product/${rec.slug}`}
                  onClick={onClose}
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    padding: 12,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={rec.image}
                    alt={rec.name}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, background: '#f5f5f5', marginBottom: 10 }}
                  />
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 4 }}>
                    {rec.name}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
                    {rec.price.toLocaleString('ru-RU')} ₽
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
