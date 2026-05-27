import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { products } from '../data/products';

const ORDER_STORAGE_KEY = 'antarm-pending-orders';

/** Отправляет один заказ на сервер. Возвращает {ok, id}. */
async function sendOrder(orderData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return { ok: true, id: data.id };
    }
    return { ok: false, error: 'Ошибка сервера' };
  } catch {
    clearTimeout(timeout);
    return { ok: false, error: 'offline' };
  }
}

/** Синхронизирует отложенные заказы с сервером */
async function syncPendingOrders() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return;
    const pending = JSON.parse(raw);
    if (!Array.isArray(pending) || pending.length === 0) return;

    const stillPending = [];
    for (const order of pending) {
      const result = await sendOrder(order);
      if (!result.ok) stillPending.push(order);
    }
    if (stillPending.length === 0) {
      localStorage.removeItem(ORDER_STORAGE_KEY);
    } else {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(stillPending));
    }
  } catch { /* ignore */ }
}

const DELIVERY_METHODS = [
  { id: 'courier', label: 'Курьерская доставка', price: 500, freeFrom: 10000 },
  { id: 'cdek', label: 'СДЭК', price: 350, freeFrom: 15000 },
  { id: 'pochta', label: 'Почта России', price: 250, freeFrom: 20000 },
  { id: 'pickup', label: 'Самовывоз', price: 0, freeFrom: 0 },
];

const PAYMENT_METHODS = [
  { id: 'online', label: 'Онлайн-оплата', desc: 'Картой через ЮKassa' },
  { id: 'sbp', label: 'СБП', desc: 'Система быстрых платежей' },
  { id: 'cash', label: 'Наличными', desc: 'При получении' },
];

const styles = {
  bg: '#f5f5f5',
  surface: '#fff',
  border: 'rgba(0,0,0,0.06)',
  text: '#333',
  textSecondary: '#999',
  textMuted: '#bbb',
  accent: '#333',
  radius: '8px',
};

function Btn({ children, onClick, disabled, variant }) {
  const isPrimary = variant !== 'ghost';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 28px',
        background: isPrimary ? styles.accent : 'transparent',
        color: isPrimary ? '#fff' : styles.textSecondary,
        border: isPrimary ? 'none' : `1px solid ${styles.border}`,
        borderRadius: styles.radius,
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type, placeholder, required }) {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: styles.textSecondary }}>
          {label}{required && <span style={{ color: '#e00', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            fontSize: 14,
            color: styles.text,
            background: styles.surface,
            resize: 'vertical',
            minHeight: 60,
          }}
        />
      ) : (
        <input
          type={type || 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            fontSize: 14,
            color: styles.text,
            background: styles.surface,
          }}
        />
      )}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      fontSize: 13,
      color: styles.textSecondary,
      cursor: 'pointer',
      lineHeight: 1.5,
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: styles.accent }}
      />
      {label}
    </label>
  );
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const [pendingOrderCount, setPendingOrderCount] = useState(0);

  // При загрузке синхронизируем отложенные заказы
  useEffect(() => {
    syncPendingOrders().then(() => {
      try {
        const raw = localStorage.getItem(ORDER_STORAGE_KEY);
        const pending = raw ? JSON.parse(raw) : [];
        setPendingOrderCount(Array.isArray(pending) ? pending.length : 0);
      } catch { /* ignore */ }
    });
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: user?.address || '',
    comment: '',
    agreeTerms: false,
    agreeLaw150: false,
  });

  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('antarm-promo');
      if (raw) {
        const data = JSON.parse(raw);
        setPromoCode(data.code || '');
        setPromoDiscount(data.discount || 0);
      }
    } catch { /* ignore */ }
  }, []);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const delivery = DELIVERY_METHODS.find(d => d.id === deliveryMethod);
  const deliveryCost = delivery?.freeFrom && subtotal >= delivery.freeFrom ? 0 : (delivery?.price || 0);
  const total = Math.max(0, subtotal - promoDiscount) + deliveryCost;

  const hasProtectedItems = cartItems.some(item => {
    const p = item.product;
    return p.categoryId === 1 || p.category_id === 1;
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Введите имя';
    if (!formData.phone.trim()) return 'Введите телефон';
    if (formData.phone.replace(/\D/g, '').length < 10) return 'Введите корректный номер телефона';
    if (!formData.agreeTerms) return 'Примите условия соглашения';
    if (hasProtectedItems && !formData.agreeLaw150) return 'Подтвердите соответствие ФЗ №150';
    return '';
  };

  const nextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setError('');
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const submitOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const orderItems = cartItems.map(item => ({
        id: item.id,
        quantity: item.qty,
        size: item.size || null,
      }));

      // 1. Initialize payment via RoboKassa
      const paymentRes = await fetch('/api/payments/init-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: orderItems,
          email: formData.email,
          phone: formData.phone,
          deliveryMethod,
          deliveryAddress: deliveryMethod === 'pickup' ? '' : formData.address,
          comment: formData.comment,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Payment initialization failed');
      }

      if (paymentData.paymentUrl) {
        // Redirect to CloudPayments payment page
        localStorage.setItem('antarm-current-order', JSON.stringify({
          orderId: paymentData.orderId,
          total: paymentData.total,
        }));
        window.location.href = paymentData.paymentUrl;
        return;
      }

      // CloudPayments not configured — order created but manual payment
      setOrderId(paymentData.orderId);
      clearCart();
      setStep(4);
    } catch (err) {
      // Fallback to local order creation
      console.error('Payment init error:', err);
      try {
        const orderData = {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'pickup' ? '' : formData.address,
          delivery_cost: deliveryCost,
          payment_method: paymentMethod,
          items: cartItems.map(item => ({
            product_id: item.id,
            product_name: item.product.name,
            quantity: item.qty,
            price: item.product.price,
            size: item.size || null,
          })),
          subtotal,
          total,
          promo_code: promoCode || null,
          promo_discount: promoDiscount || 0,
          comment: formData.comment,
        };
        const result = await sendOrder(orderData);
        if (result.ok) {
          setOrderId(result.id);
          clearCart();
          setStep(4);
        } else {
          throw new Error(result.error);
        }
      } catch (innerErr) {
        setError('Не удалось оформить заказ. Попробуйте ещё раз.');
        console.error(innerErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderId) {
    return (
      <div style={{ background: styles.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: styles.textSecondary, marginBottom: 20 }}>Корзина пуста</p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '12px 28px',
            background: styles.accent,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: styles.radius,
            textDecoration: 'none',
          }}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  if (step === 4 && orderId) {
    return (
      <div style={{ background: styles.bg, minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 28,
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: styles.text }}>Заказ оформлен!</h1>
          <p style={{ fontSize: 15, color: styles.textSecondary, marginBottom: 8 }}>
            Номер заказа: <strong style={{ color: styles.text }}>#{orderId}</strong>
          </p>
          <p style={{ fontSize: 14, color: styles.textMuted, marginBottom: 32 }}>
            Мы свяжемся с вами для подтверждения
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '12px 28px',
            background: styles.accent,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: styles.radius,
            textDecoration: 'none',
          }}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: styles.bg, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 0 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Breadcrumbs items={[{ label: 'Корзина', to: '/cart' }, { label: 'Оформление заказа' }]} color="#999" activeColor="#333" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, color: styles.text }}>Оформление заказа</h1>

        {/* Steps */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 32,
        }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: s <= step ? styles.accent : styles.border,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'flex-start' }}>

          {/* Form */}
          <div style={{
            background: styles.surface,
            borderRadius: styles.radius,
            padding: 32,
            border: `1px solid ${styles.border}`,
          }}>

            {pendingOrderCount > 0 && (
              <div style={{
                padding: '12px 16px',
                background: '#fff8e1',
                color: '#f57f17',
                borderRadius: styles.radius,
                fontSize: 13,
                marginBottom: 12,
                border: '1px solid #ffe082',
              }}>
                📋 {pendingOrderCount} заказ{pendingOrderCount === 1 ? '' : pendingOrderCount < 5 ? 'а' : 'ов'} ожидает отправки — отправится автоматически
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#fff0f0',
                color: '#e00',
                borderRadius: styles.radius,
                fontSize: 13,
                marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            {/* Step 1: Customer Data */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: styles.text }}>Контактные данные</h2>

                <Input label="Имя" value={formData.name} onChange={v => updateField('name', v)} required />
                <Input label="Email" type="email" value={formData.email} onChange={v => updateField('email', v)} />
                <Input label="Телефон" value={formData.phone} onChange={v => updateField('phone', v)} required placeholder="+7 (999) 999-99-99" />

                <Input label="Комментарий к заказу" type="textarea" value={formData.comment} onChange={v => updateField('comment', v)} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  <Checkbox
                    checked={formData.agreeTerms}
                    onChange={v => updateField('agreeTerms', v)}
                    label="Я принимаю условия пользовательского соглашения и политики обработки персональных данных"
                  />
                  {hasProtectedItems && (
                    <Checkbox
                      checked={formData.agreeLaw150}
                      onChange={v => updateField('agreeLaw150', v)}
                      label="Подтверждаю, что приобретаемое изделие соответствует требованиям ФЗ №150, и отсутствуют ограничения для его приобретения"
                    />
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <Btn onClick={nextStep}>Продолжить</Btn>
                </div>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: styles.text }}>Способ доставки</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DELIVERY_METHODS.map(m => {
                    const free = m.freeFrom && subtotal >= m.freeFrom;
                    return (
                      <label key={m.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 16px',
                        border: `1px solid ${deliveryMethod === m.id ? styles.accent : styles.border}`,
                        borderRadius: styles.radius,
                        cursor: 'pointer',
                        background: deliveryMethod === m.id ? '#fafafa' : styles.surface,
                      }}>
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === m.id}
                          onChange={() => setDeliveryMethod(m.id)}
                          style={{ accentColor: styles.accent }}
                        />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: styles.text }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: free ? '#28a745' : styles.text }}>
                          {free ? 'Бесплатно' : `${m.price} ₽`}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <Btn variant="ghost" onClick={prevStep}>Назад</Btn>
                  <Btn onClick={nextStep}>Продолжить</Btn>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: styles.text }}>Способ оплаты</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 16px',
                      border: `1px solid ${paymentMethod === m.id ? styles.accent : styles.border}`,
                      borderRadius: styles.radius,
                      cursor: 'pointer',
                      background: paymentMethod === m.id ? '#fafafa' : styles.surface,
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        style={{ accentColor: styles.accent }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: styles.text }}>{m.label}</span>
                        <p style={{ fontSize: 12, color: styles.textMuted, marginTop: 2 }}>{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <Btn variant="ghost" onClick={prevStep}>Назад</Btn>
                  <Btn onClick={submitOrder} disabled={submitting}>
                    {submitting ? 'Оформление...' : 'Подтвердить заказ'}
                  </Btn>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div style={{
            background: styles.surface,
            borderRadius: styles.radius,
            padding: 24,
            border: `1px solid ${styles.border}`,
            position: 'sticky',
            top: 'var(--header-height)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: styles.text }}>Ваш заказ</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 13 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: styles.text }}>{item.product.name}</span>
                    {item.size && <span style={{ color: styles.textMuted, fontSize: 12 }}> (Размер: {item.size})</span>}
                    <span style={{ color: styles.textMuted, marginLeft: 4 }}>× {item.qty}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', color: styles.text, marginLeft: 12, whiteSpace: 'nowrap' }}>
                    {(item.product.price * item.qty).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${styles.border}`, marginBottom: 12 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: styles.textSecondary }}>
                <span>Товары</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{subtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: styles.textSecondary }}>
                <span>Доставка</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: deliveryCost === 0 ? '#28a745' : styles.textSecondary }}>
                  {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}
                </span>
              </div>
            </div>

            <div style={{
              borderTop: `1px solid ${styles.border}`,
              marginTop: 12,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: styles.text }}>Итого</span>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: styles.text }}>
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
