import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, dark = false, solid = false }) {
  const { addToCart, toggleFavorite, toggleCompare, favorites, compare } = useCart();
  const isFav = favorites.includes(product.id);
  const isComp = compare.includes(product.id);

  // solid = серый фон для каталога, dark = полупрозрачный для главной
  const isDark = dark || solid;
  const bg = solid ? '#2d2d2d' : (dark ? 'rgba(255,255,255,0.05)' : 'var(--bg-card)');
  const border = solid ? '1px solid #444' : (dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border)');
  const textPrimary = isDark ? '#fff' : 'var(--text-primary)';
  const textSecondary = isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)';
  const textPrice = isDark ? '#fff' : 'var(--text-price)';
  const imgBg = isDark ? 'rgba(0,0,0,0.3)' : 'var(--bg-secondary)';
  const hoverBg = solid ? '#3a3a3a' : (dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)');
  const radius = isDark ? '12px' : '0';

  return (
    <div style={{
      background: bg,
      border: border,
      borderRadius: radius,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = hoverBg;
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = bg;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <Link to={`/product/${product.slug}`}>
        <div style={{
          aspectRatio: '1',
          background: imgBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            loading="lazy"
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {/* Badges */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            {product.oldPrice && (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(255, 0, 0, 0.8)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}>
                Скидка
              </span>
            )}
            {!product.inStock && (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: '6px',
              }}>
                Нет в наличии
              </span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: 16 }}>
        <Link to={`/product/${product.slug}`}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 500,
            marginBottom: 4,
            lineHeight: 1.3,
            minHeight: 40,
            color: textPrimary,
            transition: 'color 0.2s',
          }}>
            {product.name}
          </h3>
        </Link>

        <p style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: textSecondary,
          marginBottom: 12,
        }}>
          {product.sku}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            fontSize: 20,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: textPrice,
          }}>
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          {product.oldPrice && (
            <span style={{
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              color: dark ? 'rgba(255,255,255,0.4)' : 'var(--text-old-price)',
              textDecoration: 'line-through',
            }}>
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          fontSize: 13,
          color: textSecondary,
        }}>
          <span style={{ color: '#f59e0b' }}>★</span>
          <span style={{ fontWeight: 600, color: textPrimary }}>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: 12,
              padding: '10px 12px',
              background: dark ? '#fff' : undefined,
              color: dark ? '#333' : undefined,
              borderColor: dark ? '#fff' : undefined,
              borderRadius: '8px',
            }}
            onClick={(e) => { e.preventDefault(); addToCart(product.id); }}
          >
            В корзину
          </button>
          <button
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              borderRadius: '8px',
              fontSize: 16,
              cursor: 'pointer',
              color: isFav ? '#ff0000' : textSecondary,
              transition: 'all 0.2s',
            }}
            onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              borderRadius: '8px',
              fontSize: 16,
              cursor: 'pointer',
              color: isComp ? (dark ? '#fff' : 'var(--accent)') : textSecondary,
              transition: 'all 0.2s',
            }}
            onClick={(e) => { e.preventDefault(); toggleCompare(product.id); }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            ⚖️
          </button>
        </div>
      </div>
    </div>
  );
}
