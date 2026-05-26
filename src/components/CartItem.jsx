import { products } from '../data/products';

function getProductById(id) {
  return products.find(p => p.id === id);
}

export default function CartItem({ item, onRemove, onUpdateQty }) {
  // Use stored product data from cart, fallback to static lookup for backward compatibility
  const productName = item.name || getProductById(item.id)?.name || 'Товар';
  const productPrice = item.price ?? getProductById(item.id)?.price ?? 0;
  const productImage = item.image || getProductById(item.id)?.image || '';
  const productSku = item.sku || getProductById(item.id)?.sku || '';

  const total = productPrice * item.qty;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto auto auto auto',
      gap: 16,
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <img
        src={productImage}
        alt={productName}
        style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 0 }}
      />
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#333' }}>
          {productName}
        </h4>
        <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#999' }}>
          {productSku}{item.size ? ` • Размер: ${item.size}` : ''}
        </p>
      </div>
      <div style={{
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        minWidth: 90,
        textAlign: 'right',
        color: '#333',
      }}>
        {productPrice.toLocaleString('ru-RU')} ₽
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <button
          onClick={() => onUpdateQty(item.id, item.size, item.qty - 1)}
          style={{
            width: 32,
            height: 32,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            background: '#fff',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          −
        </button>
        <span style={{
          width: 40,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          background: '#fff',
          color: '#333',
        }}>
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, item.size, item.qty + 1)}
          style={{
            width: 32,
            height: 32,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            background: '#fff',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
      <div style={{
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        minWidth: 90,
        textAlign: 'right',
        color: '#333',
      }}>
        {total.toLocaleString('ru-RU')} ₽
      </div>
      <button
        onClick={() => onRemove(item.id, item.size)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 18,
          color: '#ccc',
          cursor: 'pointer',
          padding: 4,
          lineHeight: 1,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
      >
        ×
      </button>
    </div>
  );
}
