import { products } from '../data/products';

function getProductById(id) {
  return products.find(p => p.id === id);
}

export default function CartItem({ item, onRemove, onUpdateQty }) {
  const product = getProductById(item.id);
  if (!product) return null;

  const total = product.price * item.qty;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto auto auto auto',
      gap: 16,
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid var(--border)', borderRadius: 0 }}
      />
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: 'var(--text-primary)' }}>
          {product.name}
        </h4>
        <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {product.sku}
        </p>
      </div>
      <div style={{
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        minWidth: 90,
        textAlign: 'right',
        color: 'var(--text-primary)',
      }}>
        {product.price.toLocaleString('ru-RU')} ₽
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <button
          onClick={() => onUpdateQty(item.id, item.qty - 1)}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--border)',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            background: 'var(--input-bg)',
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
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--input-bg)',
        }}>
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, item.qty + 1)}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--border)',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            background: 'var(--input-bg)',
          }}
        >
          +
        </button>
      </div>
      <div style={{
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        minWidth: 90,
        textAlign: 'right',
        color: 'var(--text-price)',
      }}>
        {total.toLocaleString('ru-RU')} ₽
      </div>
      <button
        className="btn-danger"
        onClick={() => onRemove(item.id)}
        aria-label="Удалить"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
