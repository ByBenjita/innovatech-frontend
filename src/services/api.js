const BASE = process.env.REACT_APP_API_URL || '';

const authHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Públicos ──────────────────────────────────────────────────────────────────
export const apiHealth = () =>
  fetch(`${BASE}/api/health`).then(r => r.json());

export const apiGetProductos = () =>
  fetch(`${BASE}/api/productos`).then(r => r.json());

// ── Órdenes ───────────────────────────────────────────────────────────────────
export const apiCrearOrden = (items, total) =>
  fetch(`${BASE}/api/ordenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, total }),
  }).then(r => r.json());

// ── Auth admin ────────────────────────────────────────────────────────────────
export const apiLogin = (username, password) =>
  fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

// ── Admin: productos ──────────────────────────────────────────────────────────
export const apiAdminAddProducto = (data) =>
  fetch(`${BASE}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const apiAdminUpdateProducto = (id, data) =>
  fetch(`${BASE}/api/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const apiAdminDeleteProducto = (id) =>
  fetch(`${BASE}/api/productos/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  }).then(r => r.json());

export const apiAdminUpdateStock = (id, delta) =>
  fetch(`${BASE}/api/productos/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ delta }),
  }).then(r => r.json());

// ── Admin: órdenes ────────────────────────────────────────────────────────────
export const apiAdminGetOrdenes = () =>
  fetch(`${BASE}/api/ordenes`, { headers: authHeader() }).then(r => r.json());
