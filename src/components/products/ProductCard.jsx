import React from 'react';
import { useCart } from '../../context/CartContext';

const CATEGORY_EMOJI = {
  hamburguesas: '🍔',
  pizzas: '🍕',
  ensaladas: '🥗',
  bebidas: '🥤',
  postres: '🍰',
  pollos: '🍗',
  pastas: '🍝',
  mariscos: '🦞',
};

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const emoji = CATEGORY_EMOJI[product.categoria] || '🍽️';
  const inCart = items.find(i => i.id === product.id);

  return (
    <div className="product-card">
      <div className="product-img">
        <span className="product-emoji">{emoji}</span>
        {product.categoria && (
          <span className="product-category-tag">{product.categoria}</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-desc">{product.descripcion}</p>
        <div className="product-footer">
          <span className="product-price">
            ${Number(product.precio).toLocaleString('es-CL')}
          </span>
          <button
            className={`btn-add${inCart ? ' in-cart' : ''}`}
            onClick={() => addItem(product)}
          >
            {inCart ? `✓ (${inCart.qty})` : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
