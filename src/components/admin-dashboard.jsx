import React, { useEffect, useState } from "react";
import Card from "../components/Cards";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState(0); // Cambiado de `products` a `productsCount`
  const [purchases, setPurchases] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(0); // Asegúrate de usar un valor inicial adecuado
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Verificación de administrador
    if (token) {
      fetch("http://localhost:4000/api/admin-dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("No tienes permisos");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.message); // Si el usuario es administrador
        })
        .catch((error) => {
          console.error(error);
          // Redireccionar al inicio si no tiene permisos
          navigate("/");
        });
    } else {
      navigate("/login");
    }

    fetchUserCount();
    fetchProductCount(); // Cargar la cantidad total de productos
    // fetchPurchases();
    // fetchOrders();
  }, [navigate]);

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/admin-dashboard/users/count",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la cantidad de usuarios");
      }

      const data = await response.json();
      setUserCount(data.cantidad); // Actualizamos el estado con la cantidad de usuarios
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/admin-dashboard/products/count",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la cantidad de productos");
      }

      const data = await response.json();
      setProductsCount(data.count); // Actualizamos el estado con el conteo total de productos
    } catch (error) {
      console.error("Error al cargar la cantidad de productos:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Usuarios Activos"
          total={userCount} // Aquí mostramos la cantidad de usuarios
          link="/admin-dashboard/users"
          buttonText="Ver Usuarios"
        />
        <Card
          title="Control de Productos"
          total={productsCount} // Cambiado para usar el total de productos
          link="/admin-dashboard/products"
          buttonText="Ver Productos"
        />
        <Card
          title="Control de Compras"
          total={purchases.length}
          link="/admin-dashboard/purchases"
          buttonText="Ver Compras"
        />
        <Card
          title="Pedidos Activos"
          total={orders.length}
          link="/admin-dashboard/orders"
          buttonText="Ver Pedidos"
        />
      </div>
    </div>
  );
}
