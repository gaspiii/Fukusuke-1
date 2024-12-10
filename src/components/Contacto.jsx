import React from "react";
import { Footer } from "./Footer";

export default function Contacto() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Contáctanos</h1>
        <div className="max-w-lg mx-auto  p-8 rounded-lg shadow-lg">
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
      <Footer />
    </main>
  );
}
