import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userPurchases, setUserPurchases] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    photo: "", // Agregado para manejar la foto
  });
  const [showPassword, setShowPassword] = useState(false);

  // Simulación de las compras realizadas
  const fetchUserPurchases = () => {
    const mockPurchases = [
      { date: "2024-11-15", item: "Sushi Roll", amount: 20 },
      { date: "2024-11-10", item: "Tempura", amount: 15 },
      { date: "2024-11-05", item: "Combo Sushi", amount: 30 },
    ];
    setUserPurchases(mockPurchases);
  };

  // Obtener datos del usuario desde el localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserData(userData);
      setFormData({
        email: userData.email || "",
        address: userData.address || "",
        password: "",
        confirmPassword: "",
        photo: userData.photo || "", // Cargar la foto desde los datos del usuario
      });
      fetchUserPurchases();
    } else {
      setError("No se encontraron datos del usuario. Por favor inicia sesión.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para actualizar la imagen de perfil con un enlace
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.value, // Actualiza la URL de la imagen
    });
  };

  // Función para actualizar la información del usuario en el backend
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    if (formData.email.trim() === "") {
      setError("El correo no puede estar vacío.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/user/update", {
        method: "PUT", // Usamos PUT para actualizar
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la información.");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser); // Actualizamos el estado con los datos del usuario
      setIsEditing(false); // Salimos del modo de edición

      // Mostrar mensaje de éxito
      setSuccessMessage("Cambios hechos con éxito.");

      // Eliminar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setTimeout(() => {
        setError(null);
      }, 5000);
    } catch (error) {
      
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  if (!userData) {
    return <div className="text-center mt-6 text-xl font-semibold">Cargando datos del perfil...</div>;
  }

  return (
    <main>
      <div className="container mx-auto mb-10 p-6 bg-neutral rounded-lg shadow-lg">
        <div className="mt-6 bg-base-200 p-5 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center">Información Personal</h2>
          
          {/* Mostrar mensaje de error si existe */}
          {error && (
            <label className="alert alert-error my-4">{error}</label>
          )}

          {/* Mostrar mensaje de éxito si los cambios son guardados */}
          {successMessage && (
            <div className="alert alert-success my-4">{successMessage}</div>
          )}

          <div className="flex justify-center content-center items-center mt-4 text-center space-x-4">
            <div>

            
              <div className="avatar">
                <div className="w-40 h-40 rounded-full overflow-hidden">
                  <img
                    src={userData.photo || "https://via.placeholder.com/150"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold">Actualizar foto de perfil</label>
                  <input
                    type="text"
                    name="photo"
                    placeholder="Enlace de la nueva imagen"
                    className="input input-bordered w-full"
                    value={formData.photo}
                    onChange={handleImageChange}
                  />
                </div>
              )}
              </div>
            <div>
              {!isEditing ? (
                <>
                  <p><span className="font-bold">Correo:</span> {userData.email}</p>
                  <p><span className="font-bold">Dirección:</span> {userData.address || "No especificada"}</p>
                  <p><span className="font-bold">Rol:</span> {userData.role}</p>
                  <button
                    className="btn bg-blue-500 text-white mt-4"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Información
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo"
                      className="input input-bordered w-full"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Dirección"
                      className="input input-bordered w-full"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Nueva Contraseña"
                        className="input input-bordered w-full"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar Contraseña"
                      className="input input-bordered w-full"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    
                    {/* Campo para actualizar la imagen */}
                    

                    <div className="space-x-4">
                      <button
                        className="btn bg-green-500 text-white"
                        onClick={handleUpdateProfile}
                      >
                        Guardar Cambios
                      </button>
                      <button
                        className="btn bg-gray-500 text-white"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">PROMOS ESPECIALES SOLO PARA TI</h2>
          <div className="mt-4 bg-error p-6 rounded-lg shadow-xl text-center text-white">
            <p className="text-lg">¡Gracias por ser parte de Fukusuke Sushi! Aquí tienes un descuento especial en tu próxima compra.</p>
            <p className="font-bold text-xl mt-2">Descuento del 15% en tu próxima orden con el código: <span className="text-blue-400">SUSHI15</span></p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">Compras Realizadas</h2>
          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {userPurchases.length > 0 ? (
                  userPurchases.map((purchase, index) => (
                    <tr key={index}>
                      <td>{purchase.date}</td>
                      <td>{purchase.item}</td>
                      <td>${purchase.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">No se han encontrado compras.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
