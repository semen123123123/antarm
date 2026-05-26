import { Link } from 'react-router-dom';
import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { api } from '../utils/api';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, constructorItems, removeConstructorItem, clearConstructorItems } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const constructorTotal = constructorItems.reduce((sum, item) => sum + item.price, 0);
  const subtotal = cartSubtotal + constructorTotal;
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0) + constructorItems.length;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMessage('');
    try {
      const res = await api.post('/promocodes/validate', { code: promoCode.trim() });
      if (!res.valid) {
        setPromoMessage(res.message || res.error || 'Неверный код');
        setPromoApplied(false);
        setPromoDiscount(0);
      } else {
        let discount = 0;
        if (res.discount_type === 'percent') {
          discount = Math.round((subtotal * res.discount_value) / 100);
        } else {
          discount = Math.min(res.discount_value, subtotal);
        }
        setPromoDiscount(discount);
        setPromoApplied(true);
        setPromoMessage(`Промокод применён, скидка ${discount.toLocaleString('ru-RU')} ₽`);
        localStorage.setItem('antarm-promo', JSON.stringify({ code: promoCode.trim().toUpperCase(), discount, discount_type: res.discount_type, discount_value: res.discount_value }));
      }
    } catch {
      setPromoMessage('Ошибка при проверке кода');
      setPromoApplied(false);
      setPromoDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoMessage('');
    localStorage.removeItem('antarm-promo');
  };

  const totalAfterDiscount = Math.max(0, subtotal - promoDiscount);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = totalAfterDiscount + shipping;

  if (totalCount === 0) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 20 }}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#222' }}>
            Корзина пуста
          </h1>
          <p style={{ fontSize: 15, color: '#999', marginBottom: 32 }}>
            Добавьте товары из каталога или конструктора
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
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
            <Link to="/constructor" style={{
              display: 'inline-flex',
              padding: '12px 28px',
              background: 'transparent',
              color: '#333',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid rgba(0,0,0,0.1)',
            }}>
              Конструктор
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Breadcrumbs items={[{ label: 'Корзина' }]} color="#999" activeColor="#333" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#222' }}>Корзина</h1>
          <p style={{ fontSize: 14, color: '#999' }}>{totalCount} товаров</p>
        </div>

        <div className="cart-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 32,
          alignItems: 'flex-start',
        }}>
          {/* Items */}
          <div>
            {/* Constructor items */}
            {constructorItems.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Из конструктора
                </h3>
                {constructorItems.map(item => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto auto',
                    gap: 16,
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      width: 80,
                      height: 80,
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      🎒
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#333' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: 12, color: '#999' }}>Конструктор экипировки</p>
                    </div>
                    <div style={{
                      fontSize: 14,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      minWidth: 90,
                      textAlign: 'right',
                      color: '#333',
                    }}>
                      {item.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <button
                      onClick={() => removeConstructorItem(item.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        color: '#ccc',
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Regular cart items */}
            {cartItems.length > 0 && (
              <div>
                {cartItems.map(item => (
                  <CartItem
                    key={`${item.id}-${item.size || 'no-size'}`}
                    item={item}
                    onRemove={() => removeFromCart(item.id, item.size)}
                    onUpdateQty={(id, sz, q) => updateQty(id, sz, q)}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => { clearCart(); clearConstructorItems(); }}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                color: '#888',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Очистить корзину
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary" style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '12px',
            padding: 28,
            position: 'sticky',
            top: 'calc(var(--header-height) + 24px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#222' }}>
              Итого
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 14 }}>
                <span>Товары ({totalCount})</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#333' }}>{subtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 14 }}>
                <span>Доставка</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: shipping === 0 ? '#28a745' : '#333' }}>
                  {shipping === 0 ? 'Бесплатно' : `${shipping} ₽`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: 12, color: '#bbb', marginTop: -4 }}>
                  Бесплатная доставка от 10 000 ₽
                </p>
              )}

              {/* Promo code section */}
              <div style={{
                marginTop: -8,
                marginBottom: 8,
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: 16,
              }}>
                {promoApplied ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f0fdf4', borderRadius: 8, padding: '10px 12px',
                    border: '1px solid #bbf7d0',
                  }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
                        ✓ Промокод применён
                      </span>
                      <p style={{ fontSize: 12, color: '#15803d', margin: '2px 0 0 0' }}>
                        {promoMessage.replace('Промокод применён, ', '')}
                      </p>
                    </div>
                    <button onClick={removePromoCode} style={{
                      background: 'none', border: 'none', color: '#dc2626',
                      fontSize: 12, cursor: 'pointer', textDecoration: 'underline',
                    }}>Отменить</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Промокод"
                        style={{
                          flex: 1, padding: '8px 12px', border: '1px solid #d1d5db',
                          borderRadius: 6, fontSize: 13, textTransform: 'uppercase',
                        }}
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={promoLoading || !promoCode.trim()}
                        style={{
                          padding: '8px 16px', fontSize: 12, borderRadius: 6,
                          background: promoLoading ? '#9ca3af' : '#111827',
                          color: '#fff', border: 'none', cursor: promoLoading ? 'not-allowed' : 'pointer',
                          fontWeight: 600, whiteSpace: 'nowrap',
                        }}
                      >
                        {promoLoading ? '...' : 'Применить'}
                      </button>
                    </div>
                    {promoMessage && (
                      <p style={{ fontSize: 12, color: promoApplied ? '#16a34a' : '#dc2626', margin: '6px 0 0 0' }}>
                        {promoMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: 14 }}>
                  <span>Скидка</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-{promoDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
            </div>

            <div style={{
              borderTop: '1px solid rgba(0,0,0,0.06)',
              paddingTop: 20,
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>К оплате</span>
              <span style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: '#222',
              }}>
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <Link
              to="/checkout"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                background: '#333',
                color: '#fff',
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Оформить заказ
            </Link>

            <p style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#bbb',
              marginTop: 14,
            }}>
              Нажимая кнопку, вы соглашаетесь с условиями обработки данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
