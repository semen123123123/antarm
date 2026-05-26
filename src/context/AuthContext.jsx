import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ant-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('ant-token', data.token);
    localStorage.setItem('ant-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ant-token');
    localStorage.removeItem('ant-user');
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('ant-token');
    if (token) {
      api.get('/auth/me')
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('ant-token');
          localStorage.removeItem('ant-user');
          setUser(null);
        });
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
