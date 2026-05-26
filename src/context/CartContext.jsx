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
  const [toast, setToast] = useState({ visible: false, message: '', subMessage: '', id: 0 });
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [constructorItems, setConstructorItems] = useState(() => loadFromStorage('ant-constructor', []));

  const showToast = useCallback((message, subMessage) => {
    setToast(prev => ({ visible: true, message, subMessage, id: prev.id + 1 }));
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    localStorage.setItem('ant-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ant-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ant-compare', JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    localStorage.setItem('ant-constructor', JSON.stringify(constructorItems));
  }, [constructorItems]);

  const addToCart = useCallback((productId, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.id === productId && item.size === size ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, qty: 1, size: size || null }];
    });
    setAddedProduct({ id: productId, size: size || null });
    setCartModalOpen(true);
  }, []);

  const removeFromCart = useCallback((productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  }, []);

  const updateQty = useCallback((productId, size, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId && item.size === size ? { ...item, qty } : item
      )
    );
  }, []);

  const closeCartModal = useCallback(() => {
    setCartModalOpen(false);
    setAddedProduct(null);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addConstructorItem = useCallback((item) => {
    setConstructorItems(prev => {
      if (prev.find(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeConstructorItem = useCallback((id) => {
    setConstructorItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearConstructorItems = useCallback(() => {
    setConstructorItems([]);
  }, []);

  const syncConstructorToCart = useCallback(() => {
    setCart(prev => {
      const existingIds = new Set(prev.map(i => i.id));
      const newItems = constructorItems.filter(i => !existingIds.has(i.id));
      return [...prev, ...newItems.map(i => ({ id: i.id, qty: i.qty, size: null }))];
    });
    setConstructorItems([]);
  }, [constructorItems]);

  const addToFavorites = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) return prev;
      showToast('Хороший выбор!', 'Добавлено в избранное');
      return [...prev, productId];
    });
  }, [showToast]);

  const removeFromFavorites = useCallback((productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      showToast('Хороший выбор!', 'Добавлено в избранное');
      return [...prev, productId];
    });
  }, [showToast]);

  const toggleCompare = useCallback((productId) => {
    setCompare(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const value = {
    cart,
    favorites,
    compare,
    cartCount,
    cartModalOpen,
    addedProduct,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    toggleCompare,
    clearFavorites,
    closeCartModal,
    toast,
    hideToast,
    constructorItems,
    addConstructorItem,
    removeConstructorItem,
    clearConstructorItems,
    syncConstructorToCart,
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
