import React from 'react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { setQty, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-name">{item.nombre}</span>
        <span className="cart-item-price">
          ${Number(item.precio).toLocaleString('es-CL')}
        </span>
      </div>
      <div className="cart-item-controls">
        <button className="qty-btn" onClick={() => setQty(item.id, item.qty - 1)}>−</button>
        <span className="qty-value">{item.qty}</span>
        <button className="qty-btn" onClick={() => setQty(item.id, item.qty + 1)}>+</button>
        <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑️</button>
      </div>
      <span className="cart-item-subtotal">
        ${Number(item.precio * item.qty).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
