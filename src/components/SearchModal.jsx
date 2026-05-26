import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../data/products';
import { api } from '../utils/api';

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Smart search: try API first, fallback to static
  const performSearch = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const apiResults = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
      if (apiResults.length > 0) {
        setResults(apiResults);
        setUseApi(true);
        setLoading(false);
        return;
      }
    } catch {
      // API unavailable, fallback to static
    }

    // Fallback to static search
    const staticResults = searchProducts(searchTerm);
    setResults(staticResults);
    setUseApi(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      performSearch(query);
    }, 150); // Faster debounce: 150ms

    return () => clearTimeout(handler);
  }, [query, open, performSearch]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // Highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: 'rgba(74, 158, 255, 0.2)', color: 'inherit', borderRadius: 2, padding: '0 1px' }}>
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: 640,
          maxHeight: '70vh',
          overflow: 'auto',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск товаров, категорий, характеристик..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 16,
                outline: 'none',
              }}
            />
            {loading && (
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <div style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderTopColor: 'rgba(255,255,255,0.5)',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
              </div>
            )}
          </div>
          {query.length > 0 && query.length < 2 && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              Введите минимум 2 символа для поиска
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ padding: '8px 0' }}>
            {results.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {highlightMatch(product.name, query)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#4a9eff' }}>
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    {product.oldPrice && (
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                        {product.oldPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </div>
                </div>
                {product.inStock && (
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: 'rgba(40, 167, 69, 0.15)',
                    color: '#28a745',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}>
                    В наличии
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && results.length === 0 && !loading && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              Ничего не найдено по запросу «{query}»
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 8 }}>
              Попробуйте изменить запрос или проверьте правописание
            </p>
          </div>
        )}
      </div>
    </div>
  );
}