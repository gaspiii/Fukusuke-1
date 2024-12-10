import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AppContext = createContext();

// Proveedor de contexto
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Función para actualizar la cantidad de artículos en el carrito
  const updateCartCount = () => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    const totalItems = storedItems.reduce((count, item) => count + item.count, 0);
    setCartItemCount(totalItems);
  };

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("items")) || [];
    const existingItemIndex = currentCart.findIndex((item) => item._id === product._id);

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      currentCart[existingItemIndex].count += 1;
    } else {
      // Si no está, añadirlo con una cantidad inicial de 1
      currentCart.push({ ...product, count: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("items", JSON.stringify(currentCart));

    // Actualizar el contador de artículos en el carrito
    updateCartCount();
  };

  // Cargar el usuario desde el almacenamiento local o inicializarlo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser(userData);  // Asegúrate de que el estado de usuario se actualiza
      }
    }

    updateCartCount();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, cartItemCount, updateCartCount, addToCart }}>
      {children}
    </AppContext.Provider>
  );
};
