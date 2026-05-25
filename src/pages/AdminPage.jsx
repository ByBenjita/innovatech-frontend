import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  apiLogin, apiGetProductos, apiAdminAddProducto,
  apiAdminUpdateProducto, apiAdminDeleteProducto, apiAdminGetOrdenes,
} from '../services/api';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { crashed: false, msg: '' }; }
  static getDerivedStateFromError(err) { return { crashed: true, msg: err.message }; }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '3rem' }}>⚠️</p>
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
const EMPTY_FORM  = { nombre: '', precio: '', descripcion: '', categoria: 'hamburguesas', stock: '100' };

// ── Login ────────────────────────────────────────────────────────────────────
function LoginForm({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
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
        setError(data.error || 'Credenciales inválidas');
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
        <div className="admin-login-icon">🔐</div>
        <h2>Panel de Administración</h2>
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
            placeholder="Contraseña"
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

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const { logout } = useAuth();
  const [tab, setTab]             = useState('productos');
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes]     = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [msg, setMsg]             = useState('');

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => { loadProductos(); }, []);
  useEffect(() => { if (tab === 'ordenes') loadOrdenes(); }, [tab]);

  const loadProductos = () =>
    apiGetProductos().then(setProductos).catch(() => {});

  const loadOrdenes = () =>
    apiAdminGetOrdenes().then(setOrdenes).catch(() => {});

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ nombre: p.nombre, precio: p.precio, descripcion: p.descripcion || '', categoria: p.categoria || 'hamburguesas', stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
    try {
      if (editId) {
        await apiAdminUpdateProducto(editId, data);
        flash('✅ Producto actualizado');
      } else {
        await apiAdminAddProducto(data);
        flash('✅ Producto agregado');
      }
      cancelEdit();
      loadProductos();
    } catch {
      flash('⚠️ Error al guardar, intenta de nuevo');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    await apiAdminDeleteProducto(id);
    flash('🗑️ Producto eliminado');
    loadProductos();
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>⚙️ Panel de Administración</h1>
          <p>SaborExpress — gestión de inventario y pedidos</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-ghost" onClick={() => onNavigate('home')}>← Ir a la tienda</button>
          <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>

      {msg && <div className="admin-flash">{msg}</div>}

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab${tab === 'productos' ? ' active' : ''}`} onClick={() => setTab('productos')}>
          🍔 Productos ({productos.length})
        </button>
        <button className={`admin-tab${tab === 'ordenes' ? ' active' : ''}`} onClick={() => setTab('ordenes')}>
          📋 Órdenes
        </button>
      </div>

      {/* ── TAB PRODUCTOS ── */}
      {tab === 'productos' && (
        <div className="admin-body">
          {/* Formulario */}
          <div className="admin-card">
            <h2>{editId ? '✏️ Editar producto' : '➕ Nuevo producto'}</h2>
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
                  <label>Categoría</label>
                  <select className="admin-input" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-field admin-field-wide">
                  <label>Descripción</label>
                  <input className="admin-input" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-actions">
                <button className="btn-primary" type="submit">{editId ? 'Guardar cambios' : 'Agregar producto'}</button>
                {editId && <button className="btn-ghost" type="button" onClick={cancelEdit}>Cancelar</button>}
              </div>
            </form>
          </div>

          {/* Tabla */}
          <div className="admin-card">
            <h2>Inventario de productos</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} className={p.stock === 0 ? 'row-agotado' : ''}>
                      <td>#{p.id}</td>
                      <td><strong>{p.nombre}</strong></td>
                      <td><span className="tag">{p.categoria || '—'}</span></td>
                      <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`stock-badge ${p.stock === 0 ? 'agotado' : p.stock <= 5 ? 'bajo' : 'ok'}`}>
                          {p.stock === 0 ? 'Agotado' : p.stock <= 5 ? `⚠️ ${p.stock}` : p.stock}
                        </span>
                      </td>
                      <td className="admin-actions">
                        <button className="action-btn edit" onClick={() => startEdit(p)}>✏️ Editar</button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id, p.nombre)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB ÓRDENES ── */}
      {tab === 'ordenes' && (
        <div className="admin-body">
          <div className="admin-card">
            <h2>Historial de pedidos</h2>
            {ordenes.length === 0 ? (
              <p className="empty-state">Aún no hay pedidos registrados.</p>
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
                                <li key={i}>{it.cantidad}× {it.nombre} <em>(${Number(it.precio).toLocaleString('es-CL')})</em></li>
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

// ── Export ────────────────────────────────────────────────────────────────────
export default function AdminPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  return (
    <ErrorBoundary>
      {isAdmin ? <Dashboard onNavigate={onNavigate} /> : <LoginForm onNavigate={onNavigate} />}
    </ErrorBoundary>
  );
}
