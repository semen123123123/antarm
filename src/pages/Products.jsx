import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { api } from '../utils/api';

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 12;

  useEffect(() => {
    setLoading(true);
    api.get('/products').then(prods => {
      setAllProducts(prods || []);
      setLoading(false);
    }).catch(() => {
      setAllProducts([]);
      setLoading(false);
    });
  }, []);

  const displayProducts = filteredProducts ?? allProducts;

  // Сортировка
  const sorted = useMemo(() => {
    const arr = [...displayProducts];
    switch (sortBy) {
      case 'price_asc': return arr.sort((a, b) => a.price - b.price);
      case 'price_desc': return arr.sort((a, b) => b.price - a.price);
      case 'rating': return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest': return arr.sort((a, b) => ((b.created_at || '') > (a.created_at || '') ? 1 : -1));
      case 'popular': return arr.sort((a, b) => ((b.rating || 0) * (b.reviews || 0)) - ((a.rating || 0) * (a.reviews || 0)));
      case 'name': return arr.sort((a, b) => a.name.localeCompare(b.name));
      default: return arr;
    }
  }, [displayProducts, sortBy]);

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

  if (loading) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Загрузка товаров...</p>
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
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <Breadcrumbs items={[
              { label: 'Главная', to: '/' },
              { label: 'Каталог', to: '/catalog' },
              { label: 'Все товары' },
            ]} color="rgba(255,255,255,0.6)" activeColor="#fff" />
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 700, color: '#fff',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 12,
          }}>
            Все товары
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {allProducts.length} {allProducts.length === 1 ? 'товар' : allProducts.length < 5 ? 'товара' : 'товаров'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 32 }}>
            {/* Sidebar */}
            <div style={{ width: 240, flexShrink: 0 }}>
              <FilterSidebar
                onFilter={handleFilter}
                onSort={handleSort}
                products={allProducts}
                initialSort={sortBy}
              />
            </div>

            {/* Product Grid */}
            <div style={{ flex: 1 }}>
              {paginated.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999',
                }}>
                  <p style={{ fontSize: 16, marginBottom: 8, color: '#666' }}>Нет товаров</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  gap: 6, marginTop: 32,
                }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{
                      padding: '6px 12px', fontSize: 13, borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
                      cursor: page <= 1 ? 'default' : 'pointer',
                      opacity: page <= 1 ? 0.5 : 1,
                    }}
                  >
                    ← Назад
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        padding: '6px 12px', fontSize: 13, borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: p === page ? '#333' : '#fff',
                        color: p === page ? '#fff' : '#333',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{
                      padding: '6px 12px', fontSize: 13, borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
                      cursor: page >= totalPages ? 'default' : 'pointer',
                      opacity: page >= totalPages ? 0.5 : 1,
                    }}
                  >
                    Вперед →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
