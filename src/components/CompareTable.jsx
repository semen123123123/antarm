import { products } from '../data/products';

export default function CompareTable({ products: compareProducts }) {
  if (!compareProducts || compareProducts.length === 0) return null;

  const allSpecKeys = new Set();
  compareProducts.forEach(p => p.specs.forEach(s => allSpecKeys.add(s.key)));
  const specKeys = [...allSpecKeys];

  const getSpec = (product, key) => {
    const spec = product.specs.find(s => s.key === key);
    return spec ? spec.value : '—';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14,
      }}>
        <thead>
          <tr>
            <th style={{
              padding: 16,
              textAlign: 'left',
              borderBottom: '2px solid var(--border)',
              minWidth: 140,
              color: 'var(--text-secondary)',
              fontWeight: 500,
              background: 'var(--bg-secondary)',
            }}>
              Характеристика
            </th>
            {compareProducts.map(p => (
              <th key={p.id} style={{
                padding: 16,
                textAlign: 'center',
                borderBottom: '2px solid var(--border)',
                minWidth: 200,
                background: 'var(--bg-secondary)',
              }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: 120, height: 120, objectFit: 'cover', margin: '0 auto 12px', border: '1px solid var(--border)', borderRadius: 0 }}
                />
                <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{p.name}</p>
                <p style={{
                  fontSize: 18,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--text-price)',
                }}>
                  {p.price.toLocaleString('ru-RU')} ₽
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500, background: 'var(--bg-secondary)' }}>
              Цена
            </td>
            {compareProducts.map(p => (
              <td key={p.id} style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-price)',
              }}>
                {p.price.toLocaleString('ru-RU')} ₽
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500, background: 'var(--bg-secondary)' }}>
              Наличие
            </td>
            {compareProducts.map(p => (
              <td key={p.id} style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <span className={`badge ${p.inStock ? 'badge-success' : 'badge-danger'}`}>
                  {p.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500, background: 'var(--bg-secondary)' }}>
              Рейтинг
            </td>
            {compareProducts.map(p => (
              <td key={p.id} style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                ★ {p.rating} ({p.reviews})
              </td>
            ))}
          </tr>

          {specKeys.map(key => {
            const values = compareProducts.map(p => getSpec(p, key));
            const allSame = values.every(v => v === values[0]);

            return (
              <tr key={key}>
<td style={{
                   padding: '12px 16px',
                   borderBottom: '1px solid var(--border)',
                   fontWeight: 500,
                   color: 'var(--text-secondary)',
                   background: 'var(--bg-secondary)',
                 }}>
                  {key}
                </td>
                {compareProducts.map((p, i) => (
                  <td key={p.id} style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    textAlign: 'center',
                    color: allSame ? 'var(--text-primary)' : 'var(--accent)',
                    fontWeight: allSame ? 400 : 600,
                  }}>
                    {values[i]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
