import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";  // Importar el contexto
import { Footer } from "./Footer";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [error, setError] = useState(null);

  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para registro
  const [nombre, setNombre] = useState('');
  const [registroEmail, setRegistroEmail] = useState('');
  const [registroPassword, setRegistroPassword] = useState('');

  const { setUser } = useContext(AppContext);  // Usar el contexto para actualizar el usuario
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("El correo electrónico y la contraseña son obligatorios.");
      return;
    }

    const credentials = { email, password };

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        setError(errorData.error || "Error desconocido al iniciar sesión.");
        return;
      }

      const data = await response.json();
      console.log("Inicio de sesión exitoso:", data);

      // Guardar el token y el usuario en el localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Actualizar el usuario en el contexto
      setUser(data.user);

      // Redirigir a la página de perfil
      navigate("/profile");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo electrónico o contraseña incorrectos.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !registroEmail || !registroPassword) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const newUser = {
        name: nombre,
        email: registroEmail,
        password: registroPassword,
    };

    try {
        const response = await fetch("http://localhost:4000/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            setTab("login");
        } else {
            alert(data.error || "Error al registrarse.");
        }
    } catch (err) {
        alert("Hubo un error al registrarse.");
        console.error("Error al registrarse:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg">
          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${tab === "login" ? "tab-active" : ""}`}
              onClick={() => setTab("login")}
            >
              Iniciar Sesión
            </a>
            <a
              className={`tab ${tab === "register" ? "tab-active" : ""}`}
              onClick={() => setTab("register")}
            >
              Registrarse
            </a>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input input-bordered w-full"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" htmlFor="password">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input input-bordered w-full"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <div className="text-center">
                <button type="submit" className="btn btn-error w-full">
                  Iniciar Sesión
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input input-bordered w-full"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="emailRegistro">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="emailRegistro"
                  name="emailRegistro"
                  className="input input-bordered w-full"
                  placeholder="ejemplo@correo.com"
                  value={registroEmail}
                  onChange={(e) => setRegistroEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" htmlFor="passwordRegistro">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="passwordRegistro"
                  name="passwordRegistro"
                  className="input input-bordered w-full"
                  placeholder="Tu contraseña"
                  value={registroPassword}
                  onChange={(e) => setRegistroPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-error w-full">
                  Registrarse
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
