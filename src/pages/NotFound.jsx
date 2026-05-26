import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{
          fontSize: 120,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          marginBottom: 16,
        }}>
          404
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
          Страница не найдена
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Запрашиваемая страница не существует или была перемещена
        </p>
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    </div>
  );
}
