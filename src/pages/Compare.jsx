import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CompareTable from '../components/CompareTable';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Compare() {
  const { compare, toggleCompare } = useCart();

  const compareProducts = compare
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (compareProducts.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: 24 }}>
            <path d="M18 3v6M6 3v6M3 21h18M3 6h18" />
          </svg>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Список сравнения пуст
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>
            Добавьте товары для сравнения из каталога
          </p>
          <Link to="/catalog" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Сравнение' }]} />

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Сравнение товаров</h1>
            <p>{compareProducts.length} из 4 товаров</p>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => compareProducts.forEach(p => toggleCompare(p.id))}
          >
            Очистить
          </button>
        </div>

        <CompareTable products={compareProducts} />
      </div>
    </div>
  );
}
