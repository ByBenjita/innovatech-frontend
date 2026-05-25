import React, { useState } from 'react';
import CartItem from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';

export default function CartPage({ onNavigate }) {
  const { items, total, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <span className="success-icon">✅</span>
          <h2>¡Pedido recibido!</h2>
          <p>Tu pedido está en preparación. Llegará en aproximadamente 30 minutos.</p>
          <button className="btn-primary" onClick={() => { clearCart(); onNavigate('home'); }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <span className="empty-icon">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el menú para comenzar tu pedido.</p>
          <button className="btn-primary" onClick={() => onNavigate('menu')}>
            Ir al menú
          </button>
        </div>
      </div>
    );
  }

  const delivery = 1490;
  const totalConDelivery = total + delivery;

  return (
    <div className="cart-page">
      <div className="page-hero">
        <h1>Tu Pedido</h1>
        <p>{items.length} producto{items.length !== 1 ? 's' : ''} seleccionado{items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          <h2>Resumen</h2>
          <div className="cart-items-list">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <button className="link-btn" onClick={() => onNavigate('menu')}>
            ← Seguir comprando
          </button>
        </div>

        <div className="order-summary">
          <h2>Total del pedido</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${Number(total).toLocaleString('es-CL')}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>${Number(delivery).toLocaleString('es-CL')}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${Number(totalConDelivery).toLocaleString('es-CL')}</span>
          </div>
          <button className="btn-primary btn-full" onClick={() => setOrdered(true)}>
            🚀 Realizar pedido
          </button>
          <button className="btn-ghost btn-full" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
