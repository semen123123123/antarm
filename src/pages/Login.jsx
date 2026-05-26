import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <Breadcrumbs items={[{ label: 'Вход' }]} />

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 0,
          padding: 40,
          marginTop: 24,
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            color: '#fff',
            textTransform: 'uppercase',
          }}>
            Вход в аккаунт
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Войдите для оформления заказов
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: 14, marginBottom: 16 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', background: '#fff', color: '#333', borderColor: '#fff' }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>
              Зарегистрироваться
            </Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: 8, fontSize: 14 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
              ← Вернуться на сайт
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
