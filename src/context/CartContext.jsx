import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Load cart specific to this user
  const getCartKey = () => {
    return user ? `cart_${user.id}_${user.role}` : 'cart_guest';
  };

  const [cart, setCart] = useState(() => {
    try {
      if (user) {
        const saved = localStorage.getItem(`cart_${user.id}_${user.role}`);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // When user changes (login/logout), load their specific cart
  useEffect(() => {
    try {
      if (user) {
        const saved = localStorage.getItem(`cart_${user.id}_${user.role}`);
        setCart(saved ? JSON.parse(saved) : []);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  }, [user]);

  // Save cart whenever it changes (tied to user)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}_${user.role}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item) => {
    const safeItem = { 
      ...item, 
      price: Number(item.price) || 0 
    };
    
    setCart(prev => {
      const existing = prev.find(i => i.id === safeItem.id);
      if (existing) {
        return prev.map(i =>
          i.id === safeItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...safeItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    const qty = parseInt(quantity) || 0;
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    if (qty > 9999) return; // Max limit
    setCart(prev =>
      prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}_${user.role}`);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};