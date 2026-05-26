import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';
import { getProductBySlug, getProductsByCategory, categories as staticCategories } from '../data/products';
import { useCart } from '../context/CartContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(() => getProductBySlug(slug));
  const [categories, setCategories] = useState(staticCategories);
  const [related, setRelated] = useState(() => {
    const p = getProductBySlug(slug);
    if (!p) return [];
    return getProductsByCategory(p.categoryId).filter(rp => rp.id !== p.id).slice(0, 4);
  });
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, favorites } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [imageRef, imageVisible] = useScrollAnimation({ threshold: 0.1 });
  const [infoRef, infoVisible] = useScrollAnimation({ threshold: 0.1 });
  const [tabsRef, tabsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [relatedRef, relatedVisible] = useScrollAnimation({ threshold: 0.1 });

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ author_name: '', author_email: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const oldToNewCategoryId = { 1: 11, 2: 14, 3: 12, 4: 20, 5: 19, 6: 19 };
  const mapCategoryId = (id) => oldToNewCategoryId[id] || id;

  // Fetch product + reviews from API
  useEffect(() => {
    setLoading(true);
    api.get('/products').then(prods => {
      const mapped = prods.map(p => ({ ...p, categoryId: mapCategoryId(p.categoryId || p.category_id) }));
      const found = mapped.find(p => p.slug === slug);
      if (found) {
        setProduct(found);
        setRelated(mapped.filter(p => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4));
      } else {
        setProduct(null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Fetch approved reviews
    api.get(`/reviews?product_id=${slug}&approved=1`).then(revs => {
      setReviews(revs || []);
    }).catch(() => {});
  }, [slug]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.author_name || !reviewForm.text || !reviewForm.rating) {
      alert('Заполните все обязательные поля');
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        product_slug: slug,
        product_id: product?.id,
        ...reviewForm,
      });
      setReviewSubmitted(true);
      setReviewForm({ author_name: '', author_email: '', rating: 5, text: '' });
    } catch (err) {
      alert('Ошибка при отправке отзыва');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
          <p style={{ color: '#666' }}>Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, marginBottom: 12, color: '#222' }}>Товар не найден</h1>
          <Link to="/catalog" style={{ color: '#666', textDecoration: 'underline' }}>Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId || c.id === product.category_id);
  const isFav = favorites.includes(product.id);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating?.toFixed(1) || '0';

  const tabs = [
    { id: 'description', label: 'Описание' },
    { id: 'specs', label: 'Характеристики' },
    { id: 'reviews', label: `Отзывы (${reviews.length})` },
  ];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', color: '#333' }}>
      {/* Breadcrumbs */}
      <section style={{ padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Каталог', to: '/catalog' },
            { label: 'Товары', to: `/category/${category?.slug}` },
            { label: product.name },
          ]} color="#999" activeColor="#333" />
        </div>
      </section>

      {/* Product Info */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="product-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Image */}
            <div
              ref={imageRef}
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                aspectRatio: '3/4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.6s ease',
              }}
            >
              <img
                src={product.image || 'https://placehold.co/600x800/f5f5f5/999?text=Нет+фото'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://placehold.co/600x800/f5f5f5/999?text=Нет+фото'; }}
              />
            </div>

            {/* Info */}
            <div
              ref={infoRef}
              style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.6s ease',
              }}
            >
              <Link
                to={`/category/${category?.slug}`}
                style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  background: '#f0f0f0',
                  borderRadius: '20px',
                  fontSize: 12,
                  color: '#666',
                  textDecoration: 'none',
                  marginBottom: 12,
                }}
              >
                {category?.name}
              </Link>

              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#222' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {'★'.repeat(Math.round(Number(avgRating)))}
                  {'☆'.repeat(5 - Math.round(Number(avgRating)))}
                </span>
                <span style={{ fontSize: 14, color: '#666', fontFamily: 'var(--font-mono)' }}>{avgRating}</span>
                <span style={{ fontSize: 13, color: '#999' }}>· {reviews.length} отзывов</span>
              </div>

              {/* Price */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                marginBottom: 24,
                padding: '20px 0',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}>
                <span className="product-price" style={{
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: '#222',
                }}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.oldPrice && (
                  <span style={{ fontSize: 18, color: '#bbb', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                    {product.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>

              {/* Stock */}
              <div style={{ marginBottom: 24 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: product.inStock ? 'rgba(40, 167, 69, 0.08)' : 'rgba(220, 53, 69, 0.08)',
                  border: `1px solid ${product.inStock ? 'rgba(40, 167, 69, 0.25)' : 'rgba(220, 53, 69, 0.25)'}`,
                  borderRadius: '8px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: product.inStock ? '#28a745' : '#dc3545',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>

              {/* Size Selector */}
              {(() => {
                const sizesSpec = product.specs.find(s => s.key === 'Размеры');
                if (!sizesSpec) return null;
                const sizes = sizesSpec.value.split(',').map(s => s.trim());
                return (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 10 }}>
                      Размер
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          style={{
                            padding: '8px 20px',
                            border: selectedSize === size ? '2px solid #333' : '1px solid #ddd',
                            borderRadius: '8px',
                            background: selectedSize === size ? '#333' : '#fff',
                            color: selectedSize === size ? '#fff' : '#333',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Qty + Add to cart */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#666', fontSize: 16, cursor: 'pointer' }}>
                    −
                  </button>
                  <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#666', fontSize: 16, cursor: 'pointer' }}>
                    +
                  </button>
                </div>

                <button
                  className="add-to-cart"
                  onClick={() => { for (let i = 0; i < qty; i++) addToCart(product, selectedSize); }}
                  style={{
                    flex: 1, minWidth: 180, height: 40,
                    background: '#333', color: '#fff',
                    fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.05em', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#555'}
                  onMouseLeave={e => e.currentTarget.style.background = '#333'}
                >
                  В корзину
                </button>
              </div>

              {/* Marketplace links */}
              {(product.wb_url || product.ozon_url) && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  {product.wb_url && (
                    <a href={product.wb_url} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, textAlign: 'center', padding: '10px 16px', background: '#cb11ab', color: '#fff',
                      borderRadius: '8px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      Wildberries
                    </a>
                  )}
                  {product.ozon_url && (
                    <a href={product.ozon_url} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, textAlign: 'center', padding: '10px 16px', background: '#005bff', color: '#fff',
                      borderRadius: '8px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      Ozon
                    </a>
                  )}
                </div>
              )}

              {/* Favorites */}
              <button
                onClick={() => toggleFavorite(product.id)}
                style={{
                  padding: '10px 16px',
                  background: isFav ? 'rgba(255,0,0,0.06)' : 'transparent',
                  border: `1px solid ${isFav ? 'rgba(255,0,0,0.25)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '8px',
                  color: isFav ? '#d00' : '#888',
                  fontSize: 13, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                {isFav ? '❤' : '♡'} В избранное
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: '40px 0', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="container">
          <div
            ref={tabsRef}
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.6s ease',
            }}
          >
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 28 }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '14px 24px',
                    background: 'none', border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #333' : '2px solid transparent',
                    color: activeTab === tab.id ? '#333' : '#999',
                    fontSize: 15, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ maxWidth: 800 }}>
              {activeTab === 'description' && (
                <div style={{ fontSize: 15, lineHeight: 1.8, color: '#666' }}>
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  {product.specs.map((spec, i) => (
                    <div
                      key={spec.key}
                      style={{
                        display: 'flex',
                        padding: '14px 20px',
                        background: i % 2 === 0 ? '#fafafa' : '#fff',
                        borderBottom: i < product.specs.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      }}
                    >
                      <span style={{ width: 200, flexShrink: 0, color: '#888', fontSize: 14 }}>
                        {spec.key}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#444' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {/* Reviews list */}
                  {reviews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>
                      <p>Отзывов пока нет. Будьте первым!</p>
                    </div>
                  )}
                  {reviews.map((review, i) => (
                    <div key={review.id || i} style={{
                      padding: '20px 0',
                      borderBottom: i < reviews.length - 1 ? '1px solid #f0f0f0' : 'none',
                    }}>
                      <p style={{ fontSize: 12, color: '#999', marginBottom: 6, fontWeight: 500 }}>
                        Отзыв на товар: <span style={{ color: '#333' }}>{product.name}</span>
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 600, color: '#666',
                          }}>
                            {review.author_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#333', margin: 0 }}>{review.author_name}</p>
                            <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
                              {review.created_at ? new Date(review.created_at).toLocaleDateString('ru-RU') : ''}
                            </p>
                          </div>
                        </div>
                        <span style={{ color: '#f59e0b', fontSize: 14 }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>{review.text}</p>
                    </div>
                  ))}

                  {/* Review form */}
                  <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: '#111827' }}>
                      Оставить отзыв
                    </h3>
                    <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                      Товар: <strong style={{ color: '#333' }}>{product.name}</strong>
                    </p>
                    {reviewSubmitted ? (
                      <div style={{
                        padding: 16, background: '#f0fdf4', borderRadius: 8,
                        border: '1px solid #bbf7d0', color: '#166534', fontSize: 14,
                      }}>
                        ✅ Спасибо за ваш отзыв! Он появится после модерации.
                      </div>
                    ) : (
                      <form onSubmit={submitReview}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                          <div>
                            <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                              Имя *
                            </label>
                            <input
                              type="text"
                              value={reviewForm.author_name}
                              onChange={e => setReviewForm(prev => ({ ...prev, author_name: e.target.value }))}
                              placeholder="Ваше имя"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                              Email
                            </label>
                            <input
                              type="email"
                              value={reviewForm.author_email}
                              onChange={e => setReviewForm(prev => ({ ...prev, author_email: e.target.value }))}
                              placeholder="email@example.com"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                            Оценка *
                          </label>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                style={{
                                  background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
                                  color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db',
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                            Текст отзыва *
                          </label>
                          <textarea
                            value={reviewForm.text}
                            onChange={e => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                            placeholder="Расскажите о вашем опыте использования..."
                            rows={4}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          style={{
                            padding: '10px 24px', background: '#111827', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                            cursor: reviewSubmitting ? 'not-allowed' : 'pointer', opacity: reviewSubmitting ? 0.6 : 1,
                          }}
                        >
                          {reviewSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ padding: '48px 0', background: '#f5f5f5' }}>
          <div className="container">
            <div
              ref={relatedRef}
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.6s ease',
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#222' }}>
                Похожие товары
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 20,
              }}>
                {related.map(p => (
                  <ProductCard key={p.id} product={p} light />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
