import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);  // Agregamos estado para la cantidad de usuarios
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
          navigate("/"); // Redirigir al inicio si no es administrador
        });
    } else {
      navigate("/login");
    }
    fetchUsuarios();
    fetchUserCount();  // Llamada a la nueva función para obtener la cantidad de usuarios
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/admin-dashboard/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const data = await response.json();
      setUsers(data); // Aquí ya no filtramos por rol, se asume que los usuarios son todos los tipos
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/admin-dashboard/users/count", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la cantidad de usuarios");
      }

      const data = await response.json();
      setUserCount(data.cantidad);  // Actualizamos el estado con la cantidad de usuarios
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditUser = (id) => {
    alert(`Editando información del usuario con ID: ${id}`);
  };

  const handleChat = (id) => {
    navigate(`/chat/${id}`); // Redirige a una página de chat específica
  };

  const handleDeleteUser = (id) => {
    alert(`Borrando usuario con ID: ${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Control de Usuarios</h1>
        <button
          className="btn bg-red-500 hover:bg-red-700 text-white"
          onClick={() => navigate("/admin-dashboard")}
        >
          Volver al Admin Dashboard
        </button>
      </div>

      {/* Mostrar estado de carga o error */}
      {loading && <p className="text-white">Cargando usuarios...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Mostrar cantidad de usuarios */}
      <p className="text-white">Total de usuarios: {userCount}</p>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto bg-neutral p-4 rounded-lg ">
        <table className="table w-full bg-neutral">
          <thead>
            <tr>
              <th>Nombre</th>
              <th >Correo</th>
              <th >Rol</th>
              <th >Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {

              return (
                <tr key={user.id} className="border-t">
                  <td>{user.name}</td>
                  <td >{user.email}</td>
                  <td >{user.role}</td>
                  <td>
                    <button
                      className="btn bg-blue-400 hover:bg-blue-700 text-white"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn bg-green-500 hover:bg-green-700 text-white"
                      onClick={() => handleChat(user.id)}
                    >
                      Chatear
                    </button>
                    <button
                      className="btn bg-red-500 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
