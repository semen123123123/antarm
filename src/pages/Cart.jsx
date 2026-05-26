import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" style={{ marginBottom: 24 }}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
            Корзина пуста
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
            Добавьте товары из каталога, чтобы оформить заказ
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '14px 32px',
            background: '#fff',
            color: '#333',
            fontSize: 14,
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
    <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
      <div className="container" style={{ padding: '40px 0' }}>
        <Breadcrumbs items={[{ label: 'Корзина' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8, color: '#fff' }}>Корзина</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>{cartItems.length} товаров</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 48,
          alignItems: 'flex-start',
        }}>
          {/* Items */}
          <div>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQty={updateQty}
              />
            ))}
            <button
              onClick={clearCart}
              style={{
                marginTop: 24,
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Очистить корзину
            </button>
          </div>

          {/* Summary */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: 32,
            position: 'sticky',
            top: 'calc(var(--header-height) + 24px)',
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#fff' }}>
              Итого
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                <span>Товары ({cartItems.reduce((sum, i) => sum + i.qty, 0)})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{subtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                <span>Доставка</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: shipping === 0 ? '#28a745' : 'rgba(255,255,255,0.8)' }}>
                  {shipping === 0 ? 'Бесплатно' : `${shipping} ₽`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: -8 }}>
                  Бесплатная доставка от 10 000 ₽
                </p>
              )}
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 24,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>К оплате</span>
              <span style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: '#fff',
              }}>
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <Link
              to="/delivery"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: '#fff',
                color: '#333',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Оформить заказ
            </Link>

            <p style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 16,
            }}>
              Нажимая кнопку, вы соглашаетесь с условиями обработки данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
