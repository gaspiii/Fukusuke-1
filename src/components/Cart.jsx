import React, { useEffect, useState, useContext } from "react";
import { Footer } from "./Footer";
import { AppContext } from "../context/AppContext"; // Importamos el contexto
import OrderModal from "./OrderModal"; // Componente modal que crearemos

export default function Cart() {
  const [items, setItems] = useState([]); // LocalStorage
  const { updateCartCount } = useContext(AppContext); // Usamos el contexto para actualizar el contador
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [orderDetails, setOrderDetails] = useState({}); // Detalles del pedido para mostrar en el modal

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
    updateCartCount(); // Aseguramos que el contador de productos se actualice al cargar el carrito
  }, [updateCartCount]); // Ejecutamos updateCartCount cuando el componente se monta

  const removeFromCart = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    // Actualizamos el contador global de productos en el carrito
    updateCartCount();
  };

  const total = items.reduce((sum, item) => {
    // Asegurarse de que el precio sea un número (parsear si es necesario)
    const price = typeof item.price === "string" ? parseFloat(item.price.replace('$', '').trim()) : item.price;
    
    // Verifica que el precio sea un número válido
    if (isNaN(price)) {
      return sum; // Si no es válido, no lo sumamos
    }

    // Sumar precio * cantidad
    return sum + price * (item.count || 1);
  }, 0);

  const handleCheckout = () => {
    // Establecer los detalles del pedido que queremos mostrar en el modal
    setOrderDetails({
      items: items,
      totalPrice: total,
      discount: 0, // Podrías gestionar un descuento si es necesario
      estimatedTime: "35 minutos", // Puedes hacerlo dinámico
    });

    // Mostrar el modal
    setShowModal(true);
  };

  return (
    <main>
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No hay productos en el carrito.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                    <td>{item.price || "$0.00"}</td>
                    <td>
                      <button className="btn btn-error btn-xs" onClick={() => removeFromCart(index)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-2 px-11 mb-20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg">${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Descuento:</span>
            <input
              type="text"
              placeholder="Ingresa tu código de descuento"
              className="input input-bordered w-1/4 h-6"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Tiempo estimado de llegada:</span>
            <span className="text-lg">35 minutos</span>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleCheckout} 
              className="btn btn-error animate__animated animate__pulse"
            >
              Hacer pedido
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal para procesar el pedido */}
      {showModal && <OrderModal orderDetails={orderDetails} setShowModal={setShowModal} />}
    </main>
  );
}
