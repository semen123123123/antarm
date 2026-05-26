import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Favorites() {
  const { favorites } = useCart();

  const favoriteProducts = favorites
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (favoriteProducts.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: 24 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Нет избранных товаров
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>
            Нажмите ❤️ на карточке товара, чтобы добавить в избранное
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
        <Breadcrumbs items={[{ label: 'Избранное' }]} />

        <div className="page-header">
          <h1>Избранное</h1>
          <p>{favoriteProducts.length} товаров</p>
        </div>

        <div className="product-grid">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
