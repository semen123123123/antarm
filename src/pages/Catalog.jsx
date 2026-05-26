import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { categories, getProductsByCategory } from '../data/products';
import useScrollAnimation from '../hooks/useScrollAnimation';

const categoryIcons = {
  'bronezhilety': '/icons/icon1.png',
  'razgruzochnye-sistemy': '/icons/icon2.png',
  'podsumki': '/icons/icon3.png',
  'ryukzaki-i-sumki': '/icons/icon2.png',
  'remni-oruzheynye': '/icons/icon3.png',
  'aksessuary': '/icons/icon1.png',
};

export default function Catalog() {
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.05 });
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <div style={{
      background: `url('/img/bg3.png') center/cover fixed`,
      minHeight: '100vh',
      color: '#fff',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
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
            <Breadcrumbs items={[{ label: 'Каталог' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
            <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>
              Каталог
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 600 }}>
              Тактическое снаряжение российского производства
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {categories.map((cat, i) => {
              const products = getProductsByCategory(cat.id);
              const inStock = products.filter(p => p.inStock).length;

              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#fff',
                    opacity: gridVisible ? 1 : 0,
                    transform: gridVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.5s ease ${i * 0.1}s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = gridVisible ? 'translateY(0)' : 'translateY(30px)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={categoryIcons[cat.slug] || '/icons/icon1.png'}
                    alt={cat.name}
                    style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 24 }}
                  />
                  <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    {inStock} из {cat.count} товаров в наличии
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
