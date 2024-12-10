import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Purchases() {
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [filterDate, setFilterDate] = useState(""); // Estado para la fecha de filtro
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

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
          navigate("/");
        });
    } else {
      navigate("/login");
    }

    fetchPurchaseData();  // Obtener compras
    fetchOrders();        // Obtener pedidos
    fetchUserCount();     // Obtener cantidad de usuarios
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
      setUserCount(data.cantidad);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPurchaseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/purchases", // Suponiendo que tienes un endpoint para obtener compras
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las compras");
      }

      const data = await response.json();
      setRecentPurchases(data.recentPurchases); // Asegúrate de que la API devuelva las compras recientes
      setTotalSales(data.totalSales);  // Total de ventas (suponiendo que viene en la respuesta)
      setTotalClients(data.totalClients); // Total de clientes (suponiendo que viene en la respuesta)
    } catch (error) {
      console.error("Error al cargar los datos de compras:", error.message);
    }
  };

  const fetchOrders = async (date = "") => {
    try {
      const token = localStorage.getItem("token");
      const url = date
        ? `http://localhost:4000/api/admin-dashboard/orders/date?date=${date}` // Enviar la fecha como parámetro de consulta
        : "http://localhost:4000/api/admin-dashboard/orders";  // Si no se selecciona fecha, obtener todos los pedidos

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
      }

      const data = await response.json();
      setOrders(data.orders); // Asegúrate de que la API devuelva los pedidos
    } catch (error) {
      console.error("Error al cargar los pedidos:", error.message);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);
    fetchOrders(selectedDate); // Filtrar pedidos por fecha seleccionada
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">Control de Compras</h1>
        <button
          className="btn bg-red-500 hover:bg-red-700 text-white"
          onClick={() => navigate("/admin-dashboard")}
        >
          Volver al Admin Dashboard
        </button>
      </div>

      {/* Filtro por fecha */}
      <div className="mb-6">
        <label htmlFor="filterDate" className="text-white font-semibold">Filtrar por Fecha:</label>
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={handleDateChange}
          className="ml-4 p-2 bg-neutral text-white rounded"
        />
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card shadow-lg bg-neutral text-white p-4">
          <h2 className="text-lg font-semibold">Total Ventas</h2>
          <p className="text-2xl font-bold">{`$${totalSales}.00`}</p>
        </div>
        <div className="card shadow-lg bg-neutral text-white p-4">
          <h2 className="text-lg font-semibold">Total Clientes</h2>
          <p className="text-2xl font-bold">{totalClients}</p>
        </div>
        <div className="card shadow-lg bg-neutral text-white p-4">
          <h2 className="text-lg font-semibold">Compras Últimas 24 Hrs</h2>
          <ul>
            {recentPurchases.map((purchase) => (
              <li key={purchase.id} className="text-sm">
                {purchase.date} - {purchase.amount} ({purchase.paymentMethod})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Gráficos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card shadow-lg bg-neutral text-white p-6 flex justify-center items-center">
            <p>Gráfico de Ventas (Placeholder)</p>
          </div>
          <div className="card shadow-lg bg-neutral text-white p-6 flex justify-center items-center">
            <p>Gráfico de Clientes (Placeholder)</p>
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <h2 className="text-xl font-semibold text-white mb-4">Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-neutral text-white">
          <thead>
            <tr>
              <th>Número de Orden</th>
              <th>Detalles</th>
              <th>Monto</th>
              <th>Método de Pago</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.details}</td>
                <td>{order.amount}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.client}</td>
                <td>{order.address}</td>
                <td>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-700 text-white"
                    onClick={() =>
                      alert(`Ver detalles de la orden: ${order.orderNumber}`)
                    }
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
