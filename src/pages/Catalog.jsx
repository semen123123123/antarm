import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { products as staticProducts, parentCategories, getSubcategories } from '../data/products';


export default function Catalog() {
  const [products, setProducts] = useState(staticProducts);

  useEffect(() => {
    api.get('/products').then(prods => {
      if (prods && prods.length > 0) setProducts(prods);
    }).catch(() => {});
  }, []);

  const categoryImages = {
    'takticheskoe-snaryazhenie': '/img/bronya.jpg',
    'ohota-rybalka-turizm': '/img/ohota.jpg',
    'zootovary': '/img/osheinik.jpg',
    'odezhda': '/img/clothes.jpg',
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero с категориями */}
      <div style={{
        background: '#f5f5f5',
        padding: '60px 0 40px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ marginBottom: 16 }}>
            <Breadcrumbs items={[{ label: 'Каталог' }]} color="#999" activeColor="#333" />
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#333',
            marginBottom: 40,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            Каталог
          </h1>

          {/* 4 карточки родительских категорий */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}>
            {parentCategories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '16px',
                  padding: '52px 28px 44px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 20,
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  }}
                >
                  <img src={categoryImages[cat.slug]} alt={cat.name}
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#2a2a2a',
                      marginBottom: 6,
                      letterSpacing: '0.01em',
                    }}>
                      {cat.name}
                    </h3>
                  </div>
                  </div>
              </Link>
            ))}
          </div>

          {/* Подтипы — чипсы */}
          <div style={{
            marginTop: 40,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}>
            {parentCategories.map(parent => {
              const subs = getSubcategories(parent.id);
              return subs.map(sub => (
                <Link
                  key={sub.slug}
                  to={`/category/${sub.slug}`}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#555',
                    background: 'rgba(0,0,0,0.05)',
                    padding: '7px 16px',
                    borderRadius: 20,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.01em',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#2a2a2a';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                    e.currentTarget.style.color = '#555';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {sub.name}
                </Link>
              ));
            })}
          </div>
        </div>
      </div>

      {/* Кнопка — все товары */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 40px 40px',
        textAlign: 'center',
      }}>
        <Link
          to="/category/takticheskoe-snaryazhenie"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 36px',
            background: '#2a2a2a',
            color: '#fff',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.03em',
            textDecoration: 'none',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#444';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#2a2a2a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Смотреть все товары
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
