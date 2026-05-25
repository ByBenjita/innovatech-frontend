import React, { useState } from 'react';
import ProductCard from './ProductCard';

const CATEGORIAS = ['todos', 'hamburguesas', 'pizzas', 'ensaladas', 'bebidas', 'postres'];

const CATEGORY_LABEL = {
  todos: '🍽️ Todos',
  hamburguesas: '🍔 Hamburgesas',
  pizzas: '🍕 Pizzas',
  ensaladas: '🥗 Ensaladas',
  bebidas: '🥤 Bebidas',
  postres: '🍰 Postres',
};

export default function ProductList({ products }) {
  const [filtro, setFiltro] = useState('todos');

  const disponibles = CATEGORIAS.filter(cat =>
    cat === 'todos' || products.some(p => p.categoria === cat)
  );

  const filtered = filtro === 'todos'
    ? products
    : products.filter(p => p.categoria === filtro);

  return (
    <div className="product-list-section">
      <div className="category-tabs">
        {disponibles.map(cat => (
          <button
            key={cat}
            className={`category-tab${filtro === cat ? ' active' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {CATEGORY_LABEL[cat] || cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No hay productos en esta categoría aún.</p>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
