import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'saborexpress_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const idx = state.findIndex(i => i.id === action.item.id);
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'SET_QTY':
      return state
        .map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
        .filter(i => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = item => dispatch({ type: 'ADD', item });
  const removeItem = id => dispatch({ type: 'REMOVE', id });
  const setQty = (id, qty) => dispatch({ type: 'SET_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
