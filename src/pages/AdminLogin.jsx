import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login('admin@antarm.ru', password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Неверный пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        padding: 40,
        width: 360,
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: '#fff',
          textTransform: 'uppercase',
        }}>
          Админ-панель
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
          Введите пароль администратора
        </p>

        <form onSubmit={handleSubmit}>
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

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
            ← На сайт
          </a>
        </p>
      </div>
    </div>
  );
}
