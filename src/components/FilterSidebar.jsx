import { useState } from 'react';
import { products } from '../data/products';

export default function FilterSidebar({ onFilter }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const specOptions = {};
  products.forEach(p => {
    p.specs.forEach(spec => {
      if (!specOptions[spec.key]) specOptions[spec.key] = new Set();
      specOptions[spec.key].add(spec.value);
    });
  });

  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [expanded, setExpanded] = useState({ price: true });

  const toggleSpec = (key, value) => {
    setSelectedSpecs(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
    if (inStockOnly) filtered = filtered.filter(p => p.inStock);
    Object.entries(selectedSpecs).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(p =>
          p.specs.some(s => s.key === key && values.includes(s.value))
        );
      }
    });
    onFilter(filtered);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSelectedSpecs({});
    onFilter(products);
  };

  const activeFiltersCount = (minPrice || maxPrice || inStockOnly ? 1 : 0) +
    Object.values(selectedSpecs).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <aside style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: 24,
      height: 'fit-content',
      position: 'sticky',
      top: 'calc(var(--header-height) + 24px)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#fff',
        }}>
          Фильтры
        </h3>
        {activeFiltersCount > 0 && (
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '10px',
          }}>
            {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => toggleSection('price')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '8px 0',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <span>Цена, ₽</span>
          <span style={{ fontSize: 12, opacity: 0.5 }}>{expanded.price ? '▾' : ''}</span>
        </button>
        {expanded.price && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              type="number"
              placeholder="От"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        )}
      </div>

      {/* In Stock */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
        }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              accentColor: '#fff',
              cursor: 'pointer',
            }}
          />
          Только в наличии
        </label>
      </div>

      {/* Specs */}
      {Object.entries(specOptions).map(([key, values]) => (
        <div key={key} style={{ marginBottom: 20 }}>
          <button
            onClick={() => toggleSection(key)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span>{key}</span>
            <span style={{ fontSize: 12, opacity: 0.5 }}>{expanded[key] ? '▾' : '▸'}</span>
          </button>
          {expanded[key] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[...values].map(value => (
                <label
                  key={value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 13,
                    padding: '4px 0',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(selectedSpecs[key] || []).includes(value)}
                    onChange={() => toggleSpec(key, value)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: '#fff',
                      cursor: 'pointer',
                    }}
                  />
                  {value}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={applyFilters}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: '#fff',
            color: '#333',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Применить
        </button>
        <button
          onClick={resetFilters}
          style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}
        >
          Сброс
        </button>
      </div>
    </aside>
  );
}
