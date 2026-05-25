import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ currentPage, onNavigate }) {
  const { count } = useCart();
  const { isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon">🍔</span>
          <span className="logo-text">Sabor<strong>Express</strong></span>
        </button>

        <nav className="nav">
          <button
            className={`nav-link${currentPage === 'home' ? ' active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Inicio
          </button>
          <button
            className={`nav-link${currentPage === 'menu' ? ' active' : ''}`}
            onClick={() => onNavigate('menu')}
          >
            Menú
          </button>
          <button
            className={`nav-link${currentPage === 'about' ? ' active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            Nosotros
          </button>
        </nav>

        {isAdmin ? (
          <button className="login-btn admin-active" onClick={logout}>
            👤 Cerrar sesión
          </button>
        ) : (
          <button className="login-btn" onClick={() => onNavigate('admin')}>
            👤 Login
          </button>
        )}

        <button className="cart-btn" onClick={() => onNavigate('cart')}>
          <span className="cart-icon">🛒</span>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
