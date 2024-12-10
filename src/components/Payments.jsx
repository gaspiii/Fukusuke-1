import React, { useState, useEffect } from "react";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setCartItems(storedItems);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      return sum + price * item.count;
    }, 0);

    const orderData = {
      items: cartItems,
      total,
      user: { name }, // Suponiendo que tienes un campo de usuario en el backend
      paymentMethod: "Tarjeta de crédito",
    };

    try {
      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Pago exitoso. Orden registrada con ID: " + result.order._id);
        localStorage.removeItem("items"); // Limpiar el carrito
        navigate("/"); // Redirigir al inicio
      } else {
        alert("Error al registrar el pedido.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  return (
    <main>
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center">Pasarela de Pagos</h2>
            <form onSubmit={handlePayment}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nombre Titular</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Perez"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Número de tarjeta</span>
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9123 4567"
                  className="input input-bordered w-full"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="form-control mb-4 w-1/2">
                  <label className="label">
                    <span className="label-text">Fecha vencimiento</span>
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input input-bordered w-full"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control mb-4 w-1/2">
                  <label className="label">
                    <span className="label-text">CVV</span>
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="input input-bordered w-full"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-red-500 hover:bg-red-600 w-full">
                  Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Payments;
