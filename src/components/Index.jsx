import React, { useState } from "react";
import { Footer } from "./Footer";
import { Link } from "react-router-dom";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main>
      <header className="bg-black">
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: "url(https://plus.unsplash.com/premium_photo-1668143358351-b20146dbcc02?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          <div className="hero-overlay bg-opacity-8 0"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold animate__animated animate__fadeInDown">
                Palillos pa' los loquillos
              </h1>
              <p className="mb-5 animate__animated animate__fadeInUp">
                Conocerás el mejor sushi de la tierra.
              </p>
              <Link to="/catalog" className="btn btn-error animate__animated animate__pulse">
                Pedir ahora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sobre Nuestro Sushi *@/}
      <section className="py-20 ">
        <div className="contai@@ner mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Sobre Nuestro Sushi</h2>
          <p className="mb-4">
            Nuestro sushi es preparado con ingredientes frescos y de la más alta calidad. Cada bocado es una explosión de sabor que te transportará a Japón. 
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>🐟 Pescado fresco y sostenible, capturado diariamente.</li>
            <li>🍚 Arroz japonés de grano corto, cocido a la perfección.</li>
            <li>🥒 Verduras orgánicas y coloridas, seleccionadas cuidadosamente.</li>
            <li>🌶️ Salsas caseras que realzan el sabor de cada plato.</li>
            <li>👨‍🍳 Preparación artesanal por chefs expertos en sushi.</li>
          </ul>
          <Link to="/catalog" className="btn btn-error">Descubre nuestro menú</Link>
        </div>
      </section>

      {/* Estadísticas sobre la Empresa */}
      <section className="py-20 bg-black">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-white font-bold mb-6">Sobre Fukusushi</h2>
          <p className="mb-4">Desde nuestros inicios, hemos crecido y evolucionado para ofrecerte lo mejor.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-neutral rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-xl font-bold">2000+</h3>
              <p>Clientes Satisfechos</p>
            </div>
            <div className="p-6 bg-neutral rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-xl font-bold">150+</h3>
              <p>Variedades de Sushi</p>
            </div>
            <div className="p-6 bg-neutral rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-xl font-bold">10+</h3>
              <p>Años de Experiencia</p>
            </div>
          </div>
          <Link to="/login" className="btn btn-error mt-6">Únete a nuestra familia</Link>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="py-10 ">
        <div className="container mx-auto px-4 ">
          <h1 className="text-3xl font-bold text-center mb-8">Contáctanos</h1>
          <div className="max-w-lg mx-auto p-8 rounded-lg shadow-lg">
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="input input-bordered w-full"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="input input-bordered w-full"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="message">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  className="textarea textarea-bordered w-full"
                  placeholder="Escribe tu mensaje aquí"
                  rows="5"
                ></textarea>
              </div>
              <div className="text-center">
                <button className="btn btn-error w-full">Enviar Mensaje</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
