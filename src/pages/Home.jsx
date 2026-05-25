import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import { apiGetProductos } from '../services/api';

const SAMPLE_PRODUCTOS = [
  { id: 101, nombre: 'Hamburguesa Clásica', precio: 5990, descripcion: 'Carne 180g, lechuga, tomate y queso cheddar', categoria: 'hamburguesas' },
  { id: 102, nombre: 'Pizza Margherita', precio: 8990, descripcion: 'Salsa de tomate, mozzarella fresca y albahaca', categoria: 'pizzas' },
  { id: 103, nombre: 'Ensalada César', precio: 4990, descripcion: 'Lechuga romana, pollo grillado y crutones', categoria: 'ensaladas' },
  { id: 104, nombre: 'Brownie con Helado', precio: 3990, descripcion: 'Brownie de chocolate caliente con helado de vainilla', categoria: 'postres' },
];

const CATEGORIAS = [
  { id: 'hamburguesas', emoji: '🍔', label: 'Hamburguesas' },
  { id: 'pizzas', emoji: '🍕', label: 'Pizzas' },
  { id: 'ensaladas', emoji: '🥗', label: 'Ensaladas' },
  { id: 'bebidas', emoji: '🥤', label: 'Bebidas' },
  { id: 'postres', emoji: '🍰', label: 'Postres' },
];

export default function Home({ onNavigate }) {
  const [featured, setFeatured] = useState(SAMPLE_PRODUCTOS);

  useEffect(() => {
    apiGetProductos()
      .then(data => { if (data && data.length > 0) setFeatured(data.slice(0, 4)); })
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Comida deliciosa,<br />
            <span className="hero-highlight">directo a ti</span>
          </h1>
          <p className="hero-subtitle">
            Los mejores sabores de Santiago, con entrega rápida y garantizada.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNavigate('menu')}>
              Ver Menú Completo
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('about')}>
              Conocer más
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-emoji">🍔</span>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Explora por categoría</h2>
          <p>Elige tu antojo favorito</p>
        </div>
        <div className="categories-grid">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              className="category-card"
              onClick={() => onNavigate('menu')}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Más populares</h2>
          <button className="link-btn" onClick={() => onNavigate('menu')}>
            Ver todo →
          </button>
        </div>
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="banner-section">
        <div className="banner">
          <div className="banner-text">
            <h3>🚀 Entrega en 30 minutos</h3>
            <p>O tu próximo pedido tiene un 10% de descuento</p>
          </div>
          <button className="btn-primary" onClick={() => onNavigate('menu')}>
            Pedir ahora
          </button>
        </div>
      </section>
    </div>
  );
}
