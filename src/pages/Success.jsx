import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderParam = searchParams.get('orderId');
    const stored = localStorage.getItem('antarm-current-order');
    
    let orderId = orderParam;
    if (!orderId && stored) {
      try {
        const parsed = JSON.parse(stored);
        orderId = parsed.orderId;
      } catch { /* ignore */ }
    }

    if (!orderId) {
      setStatus('no-order');
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await api.get(`/check-payment/${orderId}`);
        if (res.success) {
          setStatus('success');
          setOrderData(res);
          localStorage.removeItem('antarm-current-order');
          localStorage.removeItem('ant-cart');
        } else {
          setStatus('pending');
          setOrderData(res);
        }
      } catch (err) {
        console.error('Payment check failed:', err);
        setStatus('error');
        setError('Не удалось проверить статус оплаты');
      }
    };

    checkPayment();
    const interval = setInterval(checkPayment, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [searchParams]);

  if (status === 'checking') {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48,
            border: '3px solid rgba(0,0,0,0.1)',
            borderTopColor: '#333',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ fontSize: 16, color: '#666' }}>Проверяем оплату...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: '#e8f5e9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 32,
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#333' }}>
            Оплата прошла успешно!
          </h1>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 8 }}>
            Заказ #{orderData?.orderId || '—'} оплачен
          </p>
          {orderData?.receiptId && (
            <p style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>
              Чек отправлен на email/телефон
            </p>
          )}
          <p style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
            Сумма: {orderData?.total?.toLocaleString('ru-RU')} ₽
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '14px 32px',
            background: '#333',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: 8,
            textDecoration: 'none',
          }}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: '#fff3e0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 32,
          }}>
            ⏳
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#333' }}>
            Ожидаем подтверждения оплаты
          </h1>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 8 }}>
            Заказ #{orderData?.orderId || '—'} — проверяем статус
          </p>
          <p style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
            Пожалуйста, не закрывайте страницу
          </p>
        </div>
      </div>
    );
  }

  if (status === 'no-order') {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#333' }}>
            Заказ не найден
          </h1>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>
            Не удалось определить номер заказа
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex',
            padding: '14px 32px',
            background: '#333',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            textDecoration: 'none',
          }}>
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#333' }}>
          Ошибка
        </h1>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>
          {error || 'Не удалось проверить статус оплаты'}
        </p>
        <Link to="/cart" style={{
          display: 'inline-flex',
          padding: '14px 32px',
          background: '#333',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 8,
          textDecoration: 'none',
        }}>
          Вернуться в корзину
        </Link>
      </div>
    </div>
  );
}
