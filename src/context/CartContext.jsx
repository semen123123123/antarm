import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadFromStorage('ant-cart', []));
  const [favorites, setFavorites] = useState(() => loadFromStorage('ant-favorites', []));
  const [compare, setCompare] = useState(() => loadFromStorage('ant-compare', []));

  useEffect(() => {
    localStorage.setItem('ant-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ant-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ant-compare', JSON.stringify(compare));
  }, [compare]);

  const addToCart = useCallback((productId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, qty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addToFavorites = useCallback((productId) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  }, []);

  const removeFromFavorites = useCallback((productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const toggleCompare = useCallback((productId) => {
    setCompare(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const value = {
    cart,
    favorites,
    compare,
    cartCount,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    toggleCompare,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
