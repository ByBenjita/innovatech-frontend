import React, { useState, useEffect } from 'react';
import './App.css';

// Para desarrollo local, se puede usar http://localhost:3001
const API_URL = '';
  
function App() {
  const [productos, setProductos] = useState([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '' });

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('Backend no disponible'));

    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setProductos([...productos, data]);
        setForm({ nombre: '', precio: '', descripcion: '' });
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Innovatech Chile</h1>
        <p>Estado Backend: {status}</p>
      </header>
      <main>
        <h2>Productos</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input placeholder="Precio" type="number" value={form.precio}
            onChange={e => setForm({...form, precio: e.target.value})} required />
          <input placeholder="Descripción" value={form.descripcion}
            onChange={e => setForm({...form, descripcion: e.target.value})} />
          <button type="submit">Agregar Producto</button>
        </form>
        <ul>
          {productos.map(p => (
            <li key={p.id}>
              <strong>{p.nombre}</strong> - ${p.precio} <br/>
              <small>{p.descripcion}</small>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;