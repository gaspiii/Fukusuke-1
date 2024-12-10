import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrdersManagement() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Fecha inicial: hoy
  const [ordersByStatus, setOrdersByStatus] = useState({
    espera: [],
    proceso: [],
    listo: [],
    reparto: [],
  });

  const [selectedOrder, setSelectedOrder] = useState(null); // Pedido seleccionado para detalles
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders(date);
  }, [date]);

  const fetchOrders = (selectedDate) => {
    const token = localStorage.getItem("token");
  
    fetch(
      `http://localhost:4000/api/admin-dashboard/orders/date?date=${selectedDate}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const groupedOrders = {
          espera: [],
          proceso: [],
          listo: [],
          reparto: [],
          finalizado: [], // Asegúrate de agregar esta categoría
        };
  
        data.orders.forEach((order) => {
          if (groupedOrders[order.status]) {
            groupedOrders[order.status].push(order);
          }
        });
  
        setOrdersByStatus(groupedOrders);
      })
      .catch((error) => {
        console.error("Error al cargar los pedidos:", error);
      });
  };
  

  const handleUpdateOrder = (orderId, newStatus) => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/admin-dashboard/order/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchOrders(date);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del pedido:", error);
      });
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Pedidos</h1>
        <div>
          <label className="mr-2 text-white">Seleccionar Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
      </div>

      {["espera", "proceso", "listo", "reparto"].map((status) => (
        <OrderSection
          key={status}
          title={`Pedidos en ${status.charAt(0).toUpperCase() + status.slice(1)}`}
          orders={ordersByStatus[status]}
          handleUpdateOrder={handleUpdateOrder}
          handleSelectOrder={handleSelectOrder}
        />
      ))}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          handleUpdateOrder={handleUpdateOrder}
          closeModal={closeModal}
        />
      )}
      <OrderFinalizedSection
        title="Pedidos Finalizados"
        orders={ordersByStatus["finalizado"] || []}  // Asegúrate de que esta sección esté recibiendo los pedidos finalizados
        handleUpdateOrder={handleUpdateOrder}
        handleSelectOrder={handleSelectOrder}
        />
    </div>
  );
}

function OrderSection({ title, orders, handleUpdateOrder, handleSelectOrder }) {
    const isOrderLate = (orderDate) => {
      const orderDateObj = new Date(orderDate);
      const now = new Date();
      const timeElapsed = Math.floor((now - orderDateObj) / (1000 * 60)); // Minutos transcurridos
      return timeElapsed > 60; // Pedido atrasado
    };
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full bg-neutral text-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customerName}</td>
                    <td>
                      {order.products.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td className="space-x-2">
                      {isOrderLate(order.orderDate) && (
                        <div className="flex items-center space-x-2 text-red-500">
                          <span>⚠️</span>
                          <span className="text-xs">Atraso de pedido</span>
                        </div>
                      )}
                      <button
                        className="btn btn-sm bg-blue-500 hover:opacity-80"
                        onClick={() => handleSelectOrder(order)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay pedidos en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  

  function OrderDetailsModal({ order, handleUpdateOrder, closeModal }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // Estado para controlar el modal de confirmación
  
    const orderDate = new Date(order.orderDate);  // Fecha en que se hizo el pedido
    const finalizedDate = order.finalizedDate ? new Date(order.finalizedDate) : null;  // Fecha en que se finalizó el pedido
    const now = new Date();
    const timeElapsed = Math.floor((now - orderDate) / (1000 * 60)); // Minutos transcurridos desde el pedido
  
    let timeToFinalize = null;
    if (finalizedDate) {
      timeToFinalize = Math.floor((finalizedDate - orderDate) / (1000 * 60)); // Minutos hasta que se finalizó
    }
  
    const isLate = timeElapsed > 60 && (order.status === "espera" || order.status === "proceso");
  
    return (
      <div>
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl bg-neutral text-white">
            <h2 className="font-bold text-2xl mb-4">Detalles del Pedido</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Información del Cliente</h3>
                <ul>
                  <li><strong>Nombre:</strong> {order.customerName}</li>
                  <li><strong>Teléfono:</strong> {order.customerPhone}</li>
                  <li><strong>Dirección:</strong> {order.customerAddress || "No especificada"}</li>
                  <li><strong>Fecha del Pedido:</strong> {orderDate.toLocaleString()}</li>
                  <li><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Detalles del Pedido</h3>
                <ul>
                  <li><strong>Plataforma:</strong> {order.platform}</li>
                  <li><strong>Tipo:</strong> {order.type}</li>
                  <li><strong>Método de Pago:</strong> {order.paymentMethod}</li>
                  <li><strong>Descuento:</strong> ${order.discount.toFixed(2)}</li>
                  <li><strong>Tiempo Estimado de Entrega:</strong> {order.estimatedDeliveryTime}</li>
                  <li>
                    <strong>Tiempo Transcurrido: </strong>
                    <span className={`${isLate ? "text-red-500 font-extrabold animate-pulse" : "text-white"}`}>
                      {timeElapsed} minutos
                      {isLate && <span className="ml-2 text-xl">⚠️</span>}
                    </span>
                  </li>
                  {finalizedDate && (
                    <li>
                      <strong>Tiempo hasta Finalización:</strong>
                      <span className="text-white">{timeToFinalize} minutos</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Productos</h3>
              <div className="max-h-40 overflow-y-scroll">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product?.name || "Nombre no disponible"}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Acciones</h3>
              <div className="flex flex-wrap gap-4">
                {order.status === "espera" && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdateOrder(order._id, "proceso")}
                  >
                    Pasar a Proceso
                  </button>
                )}
  
                {order.status === "proceso" && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdateOrder(order._id, "listo")}
                  >
                    Colocar como Listo
                  </button>
                )}
  
                {order.status === "listo" && (
                  <div>
                    <p>¿Se ha entregado este pedido?</p>
                    <button
                      className="btn btn-success"
                      onClick={() => handleUpdateOrder(order._id, "finalizado")}
                    >
                      Confirmar Entrega
                    </button>
                  </div>
                )}
                {/* Eliminar el botón de Cancelar Pedido para los pedidos finalizados */}
                {order.status !== "finalizado" && (
                  <button
                    className="btn btn-error"
                    onClick={() => setShowDeleteModal(true)} // Muestra el modal de confirmación
                  >
                    Cancelar Pedido
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => alert("Iniciando chat con el cliente...")}
                >
                  Iniciar Chat
                </button>
                <button className="btn ml-auto" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  function OrderFinalizedSection({ title, orders, handleUpdateOrder, handleSelectOrder }) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full bg-neutral text-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Cantidad de Productos</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customerName}</td>
                    <td>
                      {order.products.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td className="space-x-2">
                      <button
                        className="btn btn-sm bg-blue-500 hover:opacity-80"
                        onClick={() => handleSelectOrder(order)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay pedidos finalizados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  