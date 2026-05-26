import { useState, useEffect, useRef, useMemo } from 'react';

export default function FilterSidebar({ onFilter, onSort, products: apiProducts, initialSort }) {
  const allProducts = apiProducts || [];

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState(initialSort || 'default');
  const [expanded, setExpanded] = useState({ price: true });

  const availableSizes = useMemo(
    () => [...new Set(allProducts.flatMap(p => p.sizes || []).filter(Boolean))],
    [allProducts]
  );

  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMulti = (setter, current, value) => {
    setter(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  const filterTimerRef = useRef(null);
  useEffect(() => {
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    filterTimerRef.current = setTimeout(() => {
      applyFilters();
    }, 200);
    return () => {
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, inStockOnly, selectedSizes]);

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
    if (inStockOnly) filtered = filtered.filter(p => p.inStock || p.in_stock);
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        (p.sizes || []).some(s => selectedSizes.includes(s))
      );
    }

    onFilter?.(filtered);
  };

  const applySort = (value) => {
    setSortBy(value);
    onSort?.(value);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSelectedSizes([]);
    setSortBy('default');
    onFilter?.(allProducts);
    onSort?.('default');
  };

  const activeCount = [
    minPrice, maxPrice,
    inStockOnly ? 1 : 0,
    ...selectedSizes,
  ].filter(Boolean).length;

  const FilterSection = ({ title, sectionKey, children }) => (
    <div style={{ marginBottom: 14 }}>
      <button
        onClick={() => toggleSection(sectionKey)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '6px 0',
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#555',
          cursor: 'pointer',
        }}
      >
        {title}
        <span style={{ fontSize: 9, opacity: 0.4, transform: expanded[sectionKey] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          &#9660;
        </span>
      </button>
      {expanded[sectionKey] && (
        <div style={{ paddingLeft: 0, marginTop: 4 }}>
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxRow = ({ label, checked, onChange }) => (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '3px 0',
      fontSize: 13,
      color: '#666',
      cursor: 'pointer',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: '#333', width: 14, height: 14 }}
      />
      <span style={{ flex: 1 }}>{label}</span>
    </label>
  );

  return (
    <aside style={{
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: '12px',
      padding: 20,
      height: 'fit-content',
      position: 'sticky',
      top: 'calc(var(--header-height) + 24px)',
      maxHeight: 'calc(100vh - var(--header-height) - 48px)',
      overflowY: 'auto',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <h3 style={{
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#333',
        }}>
          Фильтры
        </h3>
        {activeCount > 0 && (
          <span style={{
            fontSize: 11,
            padding: '1px 7px',
            background: '#eee',
            color: '#555',
            borderRadius: '8px',
          }}>
            {activeCount}
          </span>
        )}
      </div>

      <FilterSection title="Сортировка" sectionKey="sort">
        <select
          value={sortBy}
          onChange={e => applySort(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 10px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '6px',
            color: '#333',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <option value="default">По умолчанию</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
          <option value="rating">По рейтингу</option>
          <option value="newest">Новинки</option>
          <option value="popular">Популярные</option>
        </select>
      </FilterSection>

      <FilterSection title="Цена" sectionKey="price">
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="От"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{
              flex: 1, padding: '7px 10px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '6px', color: '#333', fontSize: 13, minWidth: 0,
            }}
          />
          <input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{
              flex: 1, padding: '7px 10px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '6px', color: '#333', fontSize: 13, minWidth: 0,
            }}
          />
        </div>
      </FilterSection>

      <FilterSection title="Наличие" sectionKey="stock">
        <CheckboxRow
          label="Только в наличии"
          checked={inStockOnly}
          onChange={e => setInStockOnly(e.target.checked)}
        />
      </FilterSection>

      {availableSizes.length > 0 && (
        <FilterSection title="Размер" sectionKey="sizes">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {availableSizes.map(s => (
              <button
                key={s}
                onClick={() => toggleMulti(setSelectedSizes, selectedSizes, s)}
                style={{
                  padding: '4px 10px', fontSize: 12, borderRadius: '4px',
                  border: selectedSizes.includes(s) ? '1px solid #333' : '1px solid rgba(0,0,0,0.12)',
                  background: selectedSizes.includes(s) ? '#333' : 'transparent',
                  color: selectedSizes.includes(s) ? '#fff' : '#666',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          onClick={applyFilters}
          style={{
            flex: 1, padding: '8px 14px', background: '#333', color: '#fff',
            fontSize: 13, fontWeight: 500, borderRadius: '6px', cursor: 'pointer', border: 'none',
          }}
        >
          Применить
        </button>
        <button
          onClick={resetFilters}
          style={{
            padding: '8px 14px', background: 'transparent',
            border: '1px solid rgba(0,0,0,0.1)', color: '#666',
            fontSize: 13, borderRadius: '6px', cursor: 'pointer',
          }}
        >
          Сброс
        </button>
      </div>
    </aside>
  );
}
