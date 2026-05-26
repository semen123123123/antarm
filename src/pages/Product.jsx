import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { getProductBySlug, getProductsByCategory, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Product() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addToCart, toggleFavorite, toggleCompare, favorites, compare } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [imageRef, imageVisible] = useScrollAnimation({ threshold: 0.1 });
  const [infoRef, infoVisible] = useScrollAnimation({ threshold: 0.1 });
  const [tabsRef, tabsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [relatedRef, relatedVisible] = useScrollAnimation({ threshold: 0.1 });

  if (!product) {
    return (
      <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Товар не найден</h1>
          <Link to="/catalog" style={{ color: '#fff', textDecoration: 'underline' }}>Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const related = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const isFav = favorites.includes(product.id);
  const isComp = compare.includes(product.id);

  const tabs = [
    { id: 'description', label: 'Описание' },
    { id: 'specs', label: 'Характеристики' },
    { id: 'reviews', label: `Отзывы (${product.reviews})` },
  ];

  return (
    <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
      {/* Breadcrumbs */}
      <section style={{ padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Каталог', to: '/catalog' },
            { label: category?.name || '', to: `/category/${category?.slug}` },
            { label: product.name },
          ]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
        </div>
      </section>

      {/* Product Info */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            {/* Image */}
            <div
              ref={imageRef}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.6s ease',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div
              ref={infoRef}
              style={{
                opacity: infoVisible ? 1 : 0,
                transform: infoVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'all 0.6s ease',
              }}
            >
              {/* Category Badge */}
              <Link
                to={`/category/${category?.slug}`}
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 16,
                }}
              >
                {category?.name}
              </Link>

              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
                {product.name}
              </h1>
              <p style={{
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 24,
              }}>
                {product.sku}
              </p>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
                <span style={{ fontSize: 18, fontWeight: 600 }}>{product.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>({product.reviews} отзывов)</span>
              </div>

              {/* Price */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                marginBottom: 32,
                padding: '24px 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span style={{
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.oldPrice && (
                  <span style={{
                    fontSize: 20,
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'line-through',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {product.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>

              {/* Stock */}
              <div style={{ marginBottom: 32 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  background: product.inStock ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                  border: `1px solid ${product.inStock ? 'rgba(40, 167, 69, 0.4)' : 'rgba(220, 53, 69, 0.4)'}`,
                  borderRadius: '8px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: product.inStock ? '#28a745' : '#dc3545',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>

              {/* Quantity & Actions */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 18,
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    width: 50,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 18,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => { for (let i = 0; i < qty; i++) addToCart(product.id); }}
                  style={{
                    flex: 1,
                    height: 44,
                    background: '#fff',
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  В корзину
                </button>
              </div>

              {/* Secondary Actions */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: isFav ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isFav ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    color: isFav ? '#ff0000' : 'rgba(255,255,255,0.6)',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {isFav ? '❤️' : '🤍'} В избранное
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: isComp ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isComp ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    color: isComp ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  ⚖️ Сравнить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={tabsRef}
            style={{
              opacity: tabsVisible ? 1 : 0,
              transform: tabsVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            {/* Tab Headers */}
            <div style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 32,
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #fff' : '2px solid transparent',
                    color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ maxWidth: 800 }}>
              {activeTab === 'description' && (
                <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  {product.specs.map((spec, i) => (
                    <div
                      key={spec.key}
                      style={{
                        display: 'flex',
                        padding: '16px 24px',
                        borderBottom: i < product.specs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      }}
                    >
                      <span style={{
                        width: 200,
                        flexShrink: 0,
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 14,
                      }}>
                        {spec.key}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                  <p>Отзывы скоро появятся</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container">
            <div
              ref={relatedRef}
              style={{
                opacity: relatedVisible ? 1 : 0,
                transform: relatedVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease',
              }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
                Похожие товары
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 24,
              }}>
                {related.map(product => (
                  <ProductCard key={product.id} product={product} solid />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
