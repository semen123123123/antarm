import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { api } from '../utils/api';
import {
  products as staticProducts,
  categories as staticCategories,
  getCategoryBySlug,
  getProductsByCategoryOrParent,
} from '../data/products';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Category() {
  const { slug } = useParams();
  const [categories, setCategories] = useState(staticCategories);
  const [allProducts, setAllProducts] = useState(staticProducts);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 12;
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.05 });
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });

  // Статические категории — источник истины для иерархии.
  // API может вернуть товары, но их categoryId устарел (старые ID 1-6).
  // Маппим старые ID на новые ID подкатегорий.
  const oldToNewCategoryId = { 1: 11, 2: 14, 3: 12, 4: 20, 5: 19, 6: 19 };
  const mapCategoryId = (id) => oldToNewCategoryId[id] || id;

  useEffect(() => {
    setLoading(true);

    api.get('/products').then(prods => {
      if (prods && prods.length > 0) {
        // Мержим: API-товары обновляют статические по id, но НЕ заменяют их полностью
        const mapped = prods.map(p => ({
          ...p,
          categoryId: mapCategoryId(p.categoryId || p.category_id),
        }));
        setAllProducts(prev => {
          const merged = [...prev];
          mapped.forEach(ap => {
            const idx = merged.findIndex(mp => mp.id === ap.id);
            if (idx >= 0) merged[idx] = { ...merged[idx], ...ap };
            else merged.push(ap);
          });
          return merged;
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Reset on slug change
  useEffect(() => {
    setPage(1);
    setFilteredProducts(null);
    setSortBy('default');
  }, [slug]);

  const category = categories.find(c => c.slug === slug) || getCategoryBySlug(slug);

  // Определяем базовый набор товаров для категории
  const baseProducts = category
    ? getProductsByCategoryOrParent(category.id, allProducts)
    : [];

  // Применяем ручную фильтрацию (если FilterSidebar передал отфильтрованный список)
  const displayProducts = filteredProducts ?? baseProducts;

  // Сортировка
  const sorted = useMemo(() => {
    const arr = [...displayProducts];
    // Сначала товары точной категории, потом подкатегорий
    const withPriority = arr.map(p => ({
      ...p,
      _priority: (p.categoryId === category.id || p.category_id === category.id) ? 0 : 1,
    }));
    withPriority.sort((a, b) => a._priority - b._priority);

    switch (sortBy) {
      case 'price_asc': return withPriority.sort((a, b) => a._priority - b._priority || a.price - b.price);
      case 'price_desc': return withPriority.sort((a, b) => a._priority - b._priority || b.price - a.price);
      case 'rating': return withPriority.sort((a, b) => a._priority - b._priority || (b.rating || 0) - (a.rating || 0));
      case 'newest': return withPriority.sort((a, b) => a._priority - b._priority || ((b.created_at || '') > (a.created_at || '') ? 1 : -1));
      case 'popular': return withPriority.sort((a, b) => a._priority - b._priority || ((b.rating || 0) * (b.reviews || 0)) - ((a.rating || 0) * (a.reviews || 0)));
      case 'name': return withPriority.sort((a, b) => a._priority - b._priority || a.name.localeCompare(b.name));
      default: return withPriority.map(({ _priority, ...p }) => p);
    }
  }, [displayProducts, sortBy, category?.id]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleFilter = (filtered) => {
    setFilteredProducts(filtered);
    setPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Каталог', to: '/catalog' },
    { label: 'Товары' },
  ];

  if (!category) {
    return (
      <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Категория не найдена</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Такой категории нет в каталоге
          </p>
          <Link to="/catalog" style={{ color: '#fff', textDecoration: 'underline' }}>Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', color: '#333' }}>
      {/* Header */}
      <section style={{
        padding: '40px 0',
        background: `url(/img/bg3.png) center/cover no-repeat`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.85)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div ref={headerRef} style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}>
            <Breadcrumbs
              items={breadcrumbItems}
              color="#999"
              activeColor="#333"
            />
            <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, color: '#222' }}>{category.name}</h1>
          </div>
        </div>
      </section>

      <section style={{
        padding: '40px 0',
        background: `url(/img/bg3.png) center/cover no-repeat`,
        position: 'relative',
        minHeight: '60vh',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.9)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="category-layout" style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: 32,
            alignItems: 'start',
          }}>
            {/* Фильтры */}
            <div className="filter-sidebar">
              <FilterSidebar
                onFilter={handleFilter}
                onSort={handleSort}
                products={allProducts}
                initialSort={sortBy}
              />
            </div>

            {/* Товары */}
            <div>
              <div className="category-sort" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <p style={{ fontSize: 13, color: '#999' }}>
                  {sorted.length} товаров
                </p>
              </div>

              {paginated.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.3 }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <p style={{ fontSize: 16, marginBottom: 8, color: '#666' }}>Нет товаров в этой категории</p>
                  <p style={{ fontSize: 14, color: '#999' }}>
                    Попробуйте изменить фильтры или выбрать другую категорию
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 16,
                }}>
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id || i} product={product} light index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Пагинация — на всю ширину */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6,
              marginTop: 32,
              width: '100%',
            }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#fff',
                  color: page <= 1 ? '#ccc' : '#333',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                }}
              >← Назад</button>

              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    border: 'none',
                    background: p === page ? '#333' : 'transparent',
                    color: p === page ? '#fff' : '#666',
                    fontSize: 13,
                    fontWeight: p === page ? 600 : 400,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (p !== page) e.target.style.background = '#eee'; }}
                  onMouseLeave={e => { if (p !== page) e.target.style.background = 'transparent'; }}
                >{p}</button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#fff',
                  color: page >= totalPages ? '#ccc' : '#333',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                }}
              >Вперед →</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
