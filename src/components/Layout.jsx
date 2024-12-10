import React, { useContext, useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx"; // Importar el contexto

export default function Layout() {
  const { user, setUser, cartItemCount, updateCartCount } = useContext(AppContext); // Usar el contexto
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Actualizar la cantidad de productos del carrito
    updateCartCount();

    // Escuchar eventos de cambios en el carrito
    window.addEventListener("storage", handleStorageChange);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateCartCount]);

  const handleStorageChange = (event) => {
    if (event.key === "items") {
      updateCartCount();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="bg-black">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-error btn-circle btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/catalog">Catálogo</Link>
                </li>
                <li>
                  <Link to="/cart">Carrito</Link>
                </li>
                <li>
                  <Link to="/contact">Contacto</Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link to="/profile">Perfil</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Cerrar sesión</button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login">Inicio de sesión</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="navbar-center">
            <Link to="/" className="btn btn-ghost text-xl">
              FUKUSUKE SUSHI
            </Link>
          </div>
          <div className="navbar-end flex items-center space-x-2">
            {/* Carrito de compras */}
            <div className="relative">
              <Link to="/cart" className="btn btn-ghost btn-circle btn-sm">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m15-9a2 2 0 11-4 0 2 2 0 014 0zm-7 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="badge badge-error badge-sm absolute -top-2 -right-2">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Usuario logueado */}
            {isLoading ? (
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-500 border-red-500"></div>
            ) : user ? (
              <>
                <Link to="/profile" className="btn btn-ghost btn-circle btn-sm">
                  <div className="mask mask-circle ">
                    <img
                      alt="Avatar"
                      src={user.photo || "https://via.placeholder.com/150"}
                      className="object-cover"
                    />
                  </div>
                </Link>
                {user.role === "admin" && (
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => navigate("/admin-dashboard")}
                  >
                    Admin Dashboard
                  </button>
                )}
              </>
            ) : (
              // Botón de iniciar sesión
              <button
                className="btn btn-error btn-sm text-white"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-red-500 border-red-500"></div>
            <p className="text-white mt-2">Cargando...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}
