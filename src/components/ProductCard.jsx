import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, dark = false, solid = false, light = false }) {
  const { addToCart, toggleFavorite, toggleCompare, favorites, compare } = useCart();
  const isFav = favorites.includes(product.id);
  const isComp = compare.includes(product.id);

  // solid = серый фон для каталога, dark = полупрозрачный для главной, light = белый фон
  const isDark = dark || solid;
  const bg = light ? '#fff' : (solid ? '#2d2d2d' : (dark ? 'rgba(255,255,255,0.05)' : 'var(--bg-card)'));
  const border = light ? '1px solid rgba(0,0,0,0.08)' : (solid ? '1px solid #444' : (dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border)'));
  const textPrimary = light ? '#1a1a1a' : (isDark ? '#fff' : 'var(--text-primary)');
  const textSecondary = light ? '#888' : (isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)');
  const textPrice = light ? '#1a1a1a' : (isDark ? '#fff' : 'var(--text-price)');
  const imgBg = light ? '#f5f5f5' : (isDark ? 'rgba(0,0,0,0.3)' : 'var(--bg-secondary)');
  const hoverBg = light ? '#fafafa' : (solid ? '#3a3a3a' : (dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)'));
  const radius = isDark ? '12px' : (light ? '12px' : '0');

  return (
    <div style={{
      background: bg,
      border: border,
      borderRadius: radius,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: light ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' : undefined,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = hoverBg;
      e.currentTarget.style.transform = 'translateY(-4px)';
      if (light) {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
      } else {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = bg;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = light ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' : 'none';
      if (light) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
    }}
    >
      <Link to={`/product/${product.slug}`} style={{ width: '100%' }}>
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
            {product.inStock || product.in_stock ? (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(40, 167, 69, 0.9)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: '6px',
              }}>
                В наличии
              </span>
            ) : (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(0,0,0,0.7)',
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

      <div style={{ padding: 16, textAlign: 'center', width: '100%' }}>
        <Link to={`/product/${product.slug}`}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 500,
            marginBottom: 6,
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
          marginBottom: 8,
        }}>
          {product.sku}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
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

        {/* Rating - only shows if product has reviews */}
        {(product.reviews > 0) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 8,
            fontSize: 13,
            color: textSecondary,
          }}>
            <span style={{ color: '#f59e0b' }}>
              {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span style={{ fontWeight: 600, color: textPrimary }}>{Number(product.rating).toFixed(1)}</span>
            <span>({product.reviews})</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: 12,
              padding: '10px 12px',
              background: light ? '#2a2a2a' : (dark ? '#fff' : (solid ? '#4a9eff' : undefined)),
              color: light ? '#fff' : (dark ? '#333' : (solid ? '#fff' : undefined)),
              borderColor: light ? '#2a2a2a' : (dark ? '#fff' : (solid ? '#4a9eff' : undefined)),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={(e) => { e.preventDefault(); addToCart(product.id); }}
            onMouseEnter={e => { e.currentTarget.style.background = light ? '#1a1a1a' : '#555'; }}
            onMouseLeave={e => { e.currentTarget.style.background = light ? '#2a2a2a' : (dark ? '#fff' : (solid ? '#4a9eff' : undefined)); }}
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
          <a
            href="https://www.wildberries.ru/catalog/0/search.aspx?search=ANT+ARM"
            target="_blank"
            rel="noopener noreferrer"
            title="Wildberries"
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              borderRadius: '8px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              color: '#cb11ab',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-mono)',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)'; e.currentTarget.style.borderColor = '#cb11ab'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'; }}
          >
            WB
          </a>
          <a
            href="https://www.ozon.ru/search/?text=ANT+ARM"
            target="_blank"
            rel="noopener noreferrer"
            title="Ozon"
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              borderRadius: '8px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              color: '#005bff',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-mono)',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)'; e.currentTarget.style.borderColor = '#005bff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'; }}
          >
            Ozon
          </a>
        </div>
      </div>
    </div>
  );
}
