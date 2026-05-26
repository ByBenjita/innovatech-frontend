import React from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const inCart  = items.find(i => i.id === product.id);
  const agotado = product.stock !== undefined && product.stock <= 0;
  const stockBajo = product.stock > 0 && product.stock <= 5;

  return (
    <div className={`product-card${agotado ? ' card-agotado' : ''}`}>
      <div className="product-img">
        {product.imagen
          ? <img className="product-real-img" src={product.imagen} alt={product.nombre} onError={e => { e.target.style.display = 'none'; }} />
          : <span className="product-img-placeholder">{product.categoria || 'producto'}</span>
        }
        {product.categoria && (
          <span className="product-category-tag">{product.categoria}</span>
        )}
        {agotado && <div className="agotado-overlay">Agotado</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-desc">{product.descripcion}</p>

        {product.stock !== undefined && (
          <p className={`stock-info ${agotado ? 'stock-agotado' : stockBajo ? 'stock-bajo' : 'stock-ok'}`}>
            {agotado
              ? 'Sin stock'
              : stockBajo
              ? `Ultimas ${product.stock} unidades`
              : `Disponible (${product.stock})`}
          </p>
        )}

        <div className="product-footer">
          <span className="product-price">
            ${Number(product.precio).toLocaleString('es-CL')}
          </span>
          <button
            className={`btn-add${inCart ? ' in-cart' : ''}${agotado ? ' disabled' : ''}`}
            onClick={() => !agotado && addItem(product)}
            disabled={agotado}
          >
            {agotado ? 'Agotado' : inCart ? `En carrito (${inCart.qty})` : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
