import React, { useEffect, useState } from 'react';
import ProductList from '../components/products/ProductList';
import { apiGetProductos } from '../services/api';

const SAMPLE_MENU = [
  { id: 1, nombre: 'Hamburguesa Clásica', precio: 5990, descripcion: 'Carne 180g, lechuga, tomate y queso cheddar', categoria: 'hamburguesas' },
  { id: 2, nombre: 'Hamburguesa BBQ', precio: 7490, descripcion: 'Carne 200g, cebolla caramelizada y salsa BBQ', categoria: 'hamburguesas' },
  { id: 3, nombre: 'Hamburguesa Doble', precio: 8990, descripcion: 'Doble carne 160g, doble queso y jalapeños', categoria: 'hamburguesas' },
  { id: 4, nombre: 'Pizza Margherita', precio: 8990, descripcion: 'Salsa de tomate, mozzarella fresca y albahaca', categoria: 'pizzas' },
  { id: 5, nombre: 'Pizza Pepperoni', precio: 9990, descripcion: 'Salsa de tomate, pepperoni y mozzarella', categoria: 'pizzas' },
  { id: 6, nombre: 'Pizza 4 Quesos', precio: 10990, descripcion: 'Mozzarella, gouda, parmesano y gorgonzola', categoria: 'pizzas' },
  { id: 7, nombre: 'Ensalada César', precio: 4990, descripcion: 'Lechuga romana, pollo grillado y crutones', categoria: 'ensaladas' },
  { id: 8, nombre: 'Ensalada Mediterránea', precio: 5490, descripcion: 'Mix de hojas, aceitunas, feta y tomates cherry', categoria: 'ensaladas' },
  { id: 9, nombre: 'Limonada Natural', precio: 1990, descripcion: 'Limón fresco, agua con gas y menta', categoria: 'bebidas' },
  { id: 10, nombre: 'Batido de Frutilla', precio: 2990, descripcion: 'Frutillas frescas, leche y helado de vainilla', categoria: 'bebidas' },
  { id: 11, nombre: 'Jugo de Naranja', precio: 1790, descripcion: 'Naranja exprimida al momento', categoria: 'bebidas' },
  { id: 12, nombre: 'Brownie con Helado', precio: 3990, descripcion: 'Brownie de chocolate caliente con helado de vainilla', categoria: 'postres' },
  { id: 13, nombre: 'Cheesecake de Maracuyá', precio: 3490, descripcion: 'Base de galleta, crema de queso y coulis de maracuyá', categoria: 'postres' },
];

export default function Menu() {
  const [products, setProducts] = useState(SAMPLE_MENU);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetProductos()
      .then(data => {
        if (data && data.length > 0) {
          const apiProducts = data.map((p, i) => ({
            ...p,
            id: p.id ?? `api-${i}`,
            categoria: p.categoria || 'especiales',
          }));
          setProducts([...SAMPLE_MENU, ...apiProducts]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="menu-page">
      <div className="page-hero">
        <h1>Nuestro Menú</h1>
        <p>Ingredientes frescos, sabores que enamoran</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner">⏳</span> Cargando productos...
        </div>
      ) : (
        <div className="container">
          <ProductList products={products} />
        </div>
      )}
    </div>
  );
}
