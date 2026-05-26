import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../data/products';

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      return;
    }

    const handler = setTimeout(() => {
      if (query.length >= 2) {
        setResults(searchProducts(query));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, open]);

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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          width: '100%',
          maxWidth: 640,
          maxHeight: '60vh',
          overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск товаров..."
            className="form-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ fontSize: 16, padding: '12px 16px' }}
          />
        </div>

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
                  gap: 16,
                  padding: '12px 20px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 48, height: 48, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: 'var(--text-primary)' }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-price)',
                    fontWeight: 700,
                  }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
            Ничего не найдено по запросу «{query}»
          </div>
        )}

        {query.length < 2 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            Введите минимум 2 символа для поиска
          </div>
        )}
      </div>
    </div>
  );
}
