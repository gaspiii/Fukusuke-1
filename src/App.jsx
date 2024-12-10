import React, { useState } from 'react';
import Cart from './components/Cart';
import Catalog from './components/Catalogo';
import Auth from './components/Login';
import Contacto from './components/Contacto';
import Payments from './components/Payments';
import Profile from './components/Profile';
import Index from './components/Index';
import Users from './components/Users';
import AdminDashboard from './components/admin-dashboard';
import Products from './components/Products';
import Purchases from './components/Purchases';
import Orders from './components/Orders';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  const [cartItems, setCartItems] = useState([]); 

  // agregar prod. al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // eliminar prod. del carrito
  const removeFromCart = (indexToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          {/* Pasamos addToCart al catálogo */}
          <Route path="catalog" element={<Catalog addToCart={addToCart} />} />
          {/* Pasamos los productos y la función de eliminar al carrito */}
          <Route path="cart" element={<Cart items={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="contact" element={<Contacto />} />
          <Route path="login" element={<Auth />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="payment" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin-dashboard/users" element={<Users  />} />
          <Route path="admin-dashboard/products" element={<Products  />} />
          <Route path="admin-dashboard/purchases" element={<Purchases  />} />
          <Route path="admin-dashboard/orders" element={<Orders  />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
