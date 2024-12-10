import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext"; // Importamos el contexto

export default function OrderModal({ orderDetails, setShowModal }) {
  const { updateCartCount } = useContext(AppContext); // Usamos el contexto

  const [status, setStatus] = useState("espera");
  const [platform, setPlatform] = useState("local");
  const [type, setType] = useState("entrega");
  const [products, setProducts] = useState(orderDetails.items || []);
  const [totalPrice, setTotalPrice] = useState(orderDetails.totalPrice || 0);
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [orderDate, setOrderDate] = useState(new Date().toISOString());
  const [discount, setDiscount] = useState(0);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("35 minutos");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Cargar datos del cliente desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        setCustomerName(user.name);
        setCustomerAddress(user.address || "");
        setCustomerId(user.id);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("No se encontró un token de autenticación.");
        return;
      }
  
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!customerId || !customerName || (type === "entrega" && !customerAddress) || !customerPhone) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
      }
  
      const payload = {
        status, platform, type, products: products.map((item) => ({
          product: item._id,
          quantity: item.count,
          price: item.price,
        })),
        totalPrice: parseFloat(totalPrice),
        paymentMethod, orderDate, discount, estimatedDeliveryTime,
        customerName, customerAddress: type === "entrega" ? customerAddress : null,
        customerPhone, customerId // Asegurarte de enviar el customerId
      };
      console.log(payload);
      const response = await fetch("http://localhost:4000/api/orders/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
      }
  
      const data = await response.json();
      alert("Pedido creado con éxito.");
      console.log(data);
  
      // Limpiar el carrito en el localStorage y actualizar el estado global
      localStorage.removeItem("items");
      updateCartCount();
  
      // Vaciar el estado de los productos en el frontend
      setProducts([]);
  
      handleClose();
    } catch (error) {
      console.error("Error al enviar el pedido:", error.message);
      alert(`Error al procesar el pedido: ${error.message}`);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-3xl h-[90vh] overflow-hidden flex flex-col bg-neutral">
        {/* Header */}
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Crear Pedido</h2>
          <button onClick={handleClose} className="btn btn-sm btn-error">
            ✕
          </button>
        </div>

        {/* Contenido con scroll interno */}
        <div className="modal-body flex-1 overflow-y-auto space-y-4">
          {/* Sección: Estado */}
          <div className="form-control">
            <label className="label">Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="select select-bordered">
              <option value="espera">Espera</option>
              <option value="proceso">Proceso</option>
              <option value="listo">Listo</option>
              <option value="reparto">Reparto</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          {/* Sección: Plataforma */}
          <div className="form-control">
            <label className="label">Plataforma:</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="select select-bordered">
              <option value="local">Local</option>
              <option value="uber">Uber</option>
              <option value="peya">Peya</option>
              <option value="didi">Didi</option>
            </select>
          </div>

          {/* Sección: Tipo de pedido */}
          <div className="form-control">
            <label className="label">Tipo:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered">
              <option value="entrega">Entrega</option>
              <option value="retiro">Retiro</option>
            </select>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-2">Productos:</h3>
            <ul className="space-y-2">
              {products.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name} (x{item.count})</span>
                  <span>${(item.price * item.count).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Precio total */}
          <div className="form-control">
            <label className="label">Total:</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="input input-bordered"
            />
          </div>

          {/* Métodos de pago */}
          <div className="form-control">
            <label className="label">Método de Pago:</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="select select-bordered">
              <option value="tarjeta">Tarjeta</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Más campos */}
          <div className="form-control">
            <label className="label">Nombre del Cliente:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input input-bordered"
            />
          </div>

          {type === "entrega" && (
            <div className="form-control">
              <label className="label">Dirección:</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="input input-bordered"
              />
            </div>
          )}

          <div className="form-control">
            <label className="label">Teléfono:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="input input-bordered"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer flex justify-end mt-4 space-x-2">
          <button onClick={handleClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
