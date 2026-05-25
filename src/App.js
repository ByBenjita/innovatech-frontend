import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CartPage from './pages/CartPage';
import './styles/variables.css';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'menu':  return <Menu onNavigate={setPage} />;
      case 'cart':  return <CartPage onNavigate={setPage} />;
      default:      return <Home onNavigate={setPage} />;
    }
  };

  return (
    <CartProvider>
      <div className="app">
        <Header currentPage={page} onNavigate={setPage} />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
