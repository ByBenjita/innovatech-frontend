const BASE = process.env.REACT_APP_API_URL || '';

export const apiHealth = () =>
  fetch(`${BASE}/api/health`).then(r => r.json());

export const apiGetProductos = () =>
  fetch(`${BASE}/api/productos`).then(r => r.json());

export const apiAddProducto = (body) =>
  fetch(`${BASE}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());
