import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (tab === 'register' && !form.name) errs.name = 'Введите имя';
    if (!form.email) errs.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Неверный формат email';
    if (!form.password) errs.password = 'Введите пароль';
    else if (form.password.length < 6) errs.password = 'Минимум 6 символов';
    if (tab === 'register' && form.password !== form.passwordConfirm) {
      errs.passwordConfirm = 'Пароли не совпадают';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(tab === 'login' ? 'Вход выполнен (демо)' : 'Регистрация успешна (демо)');
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
        }}>
          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 32 }}>
            <button
              className={`tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setErrors({}); }}
              style={{ flex: 1, textAlign: 'center' }}
            >
              Вход
            </button>
            <button
              className={`tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setErrors({}); }}
              style={{ flex: 1, textAlign: 'center' }}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label>Имя</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  className="form-input"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label>Подтвердите пароль</label>
                <input
                  type="password"
                  className="form-input"
                  value={form.passwordConfirm}
                  onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
                />
                {errors.passwordConfirm && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.passwordConfirm}</p>}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 16 }}>
              {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>

            {tab === 'login' && (
              <p style={{ textAlign: 'center', fontSize: 14 }}>
                <a href="#" style={{ color: 'var(--accent)' }}>
                  Забыли пароль?
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
