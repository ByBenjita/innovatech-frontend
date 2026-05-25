import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">🍔</span>
          <span className="logo-text">Sabor<strong>Express</strong></span>
          <p>La mejor comida, directo a tu puerta.</p>
        </div>

        <div className="footer-links">
          <h4>Horarios</h4>
          <p>Lun – Vie: 11:00 – 23:00</p>
          <p>Sáb – Dom: 12:00 – 24:00</p>
        </div>

        <div className="footer-links">
          <h4>Contacto</h4>
          <p>📞 +56 9 1234 5678</p>
          <p>📧 hola@saborexpress.cl</p>
          <p>📍 Santiago, Chile</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 SaborExpress · Desplegado en AWS con Docker</p>
      </div>
    </footer>
  );
}
