import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { getCategoryBySlug, getProductsByCategory, products } from '../data/products';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Category() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.05 });
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });

  if (!category) {
    return (
      <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Категория не найдена</h1>
          <Link to="/catalog" style={{ color: '#fff', textDecoration: 'underline' }}>Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const baseProducts = filteredProducts || getProductsByCategory(category.id);

  const sorted = useMemo(() => {
    const arr = [...baseProducts];
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price);
      case 'price-desc': return arr.sort((a, b) => b.price - a.price);
      case 'name': return arr.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating': return arr.sort((a, b) => b.rating - a.rating);
      default: return arr;
    }
  }, [baseProducts, sort]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleFilter = (filtered) => {
    setFilteredProducts(filtered);
    setPage(1);
  };

  return (
    <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={headerRef}
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <Breadcrumbs items={[
              { label: 'Каталог', to: '/catalog' },
              { label: category.name },
            ]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
            <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
              {category.name}
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
              {sorted.length} товаров
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            {/* Sidebar */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <FilterSidebar onFilter={handleFilter} />
            </div>

            {/* Products */}
            <div style={{ flex: 1 }}>
              {/* Sort Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
              }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  Показано {paginated.length} из {sorted.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Сортировка:</span>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: 14,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="default" style={{ background: '#333' }}>По умолчанию</option>
                    <option value="price-asc" style={{ background: '#333' }}>Цена ↑</option>
                    <option value="price-desc" style={{ background: '#333' }}>Цена ↓</option>
                    <option value="name" style={{ background: '#333' }}>По названию</option>
                    <option value="rating" style={{ background: '#333' }}>По рейтингу</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div
                ref={gridRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                }}
              >
                {paginated.map((product, i) => (
                  <div
                    key={product.id}
                    style={{
                      opacity: gridVisible ? 1 : 0,
                      transform: gridVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.5s ease ${i * 0.08}s`,
                    }}
                  >
                    <ProductCard product={product} solid />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 48,
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: p === page ? '#fff' : 'rgba(255,255,255,0.05)',
                        color: p === page ? '#333' : '#fff',
                        border: p === page ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={e => {
                        if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {sorted.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontSize: 20, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>
                    Ничего не найдено
                  </h3>
                  <p>Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
