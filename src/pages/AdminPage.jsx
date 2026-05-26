import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  apiLogin, apiGetProductos, apiAdminAddProducto,
  apiAdminUpdateProducto, apiAdminDeleteProducto, apiAdminGetOrdenes,
  apiAdminUpdateStock,
} from '../services/api';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { crashed: false, msg: '' }; }
  static getDerivedStateFromError(err) { return { crashed: true, msg: err.message }; }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h2 style={{ marginBottom: '12px' }}>Error en el panel admin</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>{this.state.msg}</p>
          <button
            onClick={() => this.setState({ crashed: false })}
            style={{ background: '#FF6B35', color: 'white', padding: '12px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CATEGORIAS = ['hamburguesas', 'pizzas', 'ensaladas', 'bebidas', 'postres'];
const EMPTY_FORM = { nombre: '', precio: '', descripcion: '', categoria: 'hamburguesas', stock: '100', imagen: '' };

function LoginForm({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin(form.username, form.password);
      if (data.token) {
        login(data.token);
        onNavigate('home');
      } else {
        setError(data.error || 'Credenciales invalidas');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h2>Panel de Administracion</h2>
        <p>Ingresa tus credenciales de acceso</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            className="admin-input"
            placeholder="Usuario"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Contrasena"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const { logout } = useAuth();
  const [tab, setTab]             = useState('productos');
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes]     = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [msg, setMsg]             = useState('');

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const safeSet = (setter) => (data) => setter(Array.isArray(data) ? data : []);

  useEffect(() => {
    apiGetProductos().then(safeSet(setProductos)).catch(() => {});
    apiAdminGetOrdenes().then(safeSet(setOrdenes)).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'ordenes') apiAdminGetOrdenes().then(safeSet(setOrdenes)).catch(() => {});
  }, [tab]);

  const loadProductos = () => apiGetProductos().then(safeSet(setProductos)).catch(() => {});

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      nombre:      p.nombre,
      precio:      p.precio,
      descripcion: p.descripcion || '',
      categoria:   p.categoria || 'hamburguesas',
      stock:       p.stock,
      imagen:      p.imagen || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        precio: Number(form.precio),
        stock:  Number(form.stock),
        imagen: form.imagen || null,
      };
      if (editId) {
        await apiAdminUpdateProducto(editId, data);
        flash('Producto actualizado');
      } else {
        await apiAdminAddProducto(data);
        flash('Producto agregado');
      }
      cancelEdit();
      loadProductos();
    } catch {
      flash('Error al guardar');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`Eliminar "${nombre}"?`)) return;
    try {
      await apiAdminDeleteProducto(id);
      flash('Producto eliminado');
      loadProductos();
    } catch {
      flash('Error al eliminar');
    }
  };

  const handleStockChange = async (id, delta) => {
    try {
      await apiAdminUpdateStock(id, delta);
      loadProductos();
    } catch {
      flash('Error al actualizar stock');
    }
  };

  const stockCritico = productos.filter(p => p.stock <= 5).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Panel de Administracion</h1>
          <p>SaborExpress — gestion de inventario y pedidos</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-ghost" onClick={() => onNavigate('home')}>Ir a la tienda</button>
          <button className="btn-ghost" onClick={logout}>Cerrar sesion</button>
        </div>
      </div>

      {msg && <div className="admin-flash">{msg}</div>}

      <div className="admin-stats">
        <StatCard label="Productos totales"  value={productos.length} color="#6366f1" />
        <StatCard label="Stock critico (5 o menos)" value={stockCritico} color={stockCritico > 0 ? '#f59e0b' : '#10b981'} />
        <StatCard label="Pedidos registrados" value={ordenes.length}  color="#3b82f6" />
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab${tab === 'productos' ? ' active' : ''}`} onClick={() => setTab('productos')}>
          Productos ({productos.length})
        </button>
        <button className={`admin-tab${tab === 'ordenes' ? ' active' : ''}`} onClick={() => setTab('ordenes')}>
          Ordenes ({ordenes.length})
        </button>
      </div>

      {tab === 'productos' && (
        <div className="admin-body">
          <div className="admin-card">
            <h2>{editId ? 'Editar producto' : 'Nuevo producto'}</h2>
            <div className="admin-form-layout">
              <form className="admin-form" onSubmit={handleSave}>
                <div className="admin-form-row">
                  <div className="admin-field">
                    <label>Nombre</label>
                    <input className="admin-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                  </div>
                  <div className="admin-field">
                    <label>Precio (CLP)</label>
                    <input className="admin-input" type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required min="0" />
                  </div>
                  <div className="admin-field">
                    <label>Stock</label>
                    <input className="admin-input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-field">
                    <label>Categoria</label>
                    <select className="admin-input" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-field admin-field-wide">
                    <label>Descripcion</label>
                    <input className="admin-input" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                  </div>
                </div>
                <div className="admin-field">
                  <label>URL de imagen (opcional)</label>
                  <input
                    className="admin-input"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.imagen}
                    onChange={e => setForm({ ...form, imagen: e.target.value })}
                  />
                </div>
                <div className="admin-form-actions">
                  <button className="btn-primary" type="submit">{editId ? 'Guardar cambios' : 'Agregar producto'}</button>
                  {editId && <button className="btn-ghost" type="button" onClick={cancelEdit}>Cancelar</button>}
                </div>
              </form>

              {form.imagen ? (
                <div className="img-preview-wrap">
                  <p className="img-preview-label">Vista previa</p>
                  <img className="img-preview" src={form.imagen} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              ) : (
                <div className="img-preview-wrap img-preview-empty">
                  <p>Pega una URL de imagen para ver la vista previa</p>
                </div>
              )}
            </div>
          </div>

          <div className="admin-card">
            <h2>Inventario de productos</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} className={p.stock === 0 ? 'row-agotado' : ''}>
                      <td>
                        {p.imagen
                          ? <img className="table-thumb" src={p.imagen} alt={p.nombre} onError={e => { e.target.style.display = 'none'; }} />
                          : <span className="table-thumb-placeholder">—</span>}
                      </td>
                      <td>#{p.id}</td>
                      <td>
                        <strong>{p.nombre}</strong>
                        {p.descripcion && <p className="table-desc">{p.descripcion}</p>}
                      </td>
                      <td><span className="tag">{p.categoria || '—'}</span></td>
                      <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                      <td>
                        <div className="stock-controls">
                          <button
                            className="stock-btn minus"
                            onClick={() => handleStockChange(p.id, -1)}
                            disabled={p.stock <= 0}
                            title="Quitar 1"
                          >−</button>
                          <span className={`stock-badge ${p.stock === 0 ? 'agotado' : p.stock <= 5 ? 'bajo' : 'ok'}`}>
                            {p.stock === 0 ? 'Agotado' : p.stock}
                          </span>
                          <button
                            className="stock-btn plus"
                            onClick={() => handleStockChange(p.id, 1)}
                            title="Agregar 1"
                          >+</button>
                        </div>
                      </td>
                      <td className="admin-actions">
                        <button className="action-btn edit" onClick={() => startEdit(p)}>Editar</button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id, p.nombre)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'ordenes' && (
        <div className="admin-body">
          <div className="admin-card">
            <h2>Historial de pedidos</h2>
            {ordenes.length === 0 ? (
              <p className="empty-state">Aun no hay pedidos registrados.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map(o => {
                      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                      return (
                        <tr key={o.id}>
                          <td><strong>#{o.id}</strong></td>
                          <td>{new Date(o.created_at).toLocaleString('es-CL')}</td>
                          <td>
                            <ul className="order-items-list">
                              {items.map((it, i) => (
                                <li key={i}>{it.cantidad}x {it.nombre} <em>(${Number(it.precio).toLocaleString('es-CL')})</em></li>
                              ))}
                            </ul>
                          </td>
                          <td><strong>${Number(o.total).toLocaleString('es-CL')}</strong></td>
                          <td><span className="tag tag-green">{o.estado}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  return (
    <ErrorBoundary>
      {isAdmin ? <Dashboard onNavigate={onNavigate} /> : <LoginForm onNavigate={onNavigate} />}
    </ErrorBoundary>
  );
}
