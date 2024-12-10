import React, { useState } from "react";
import { Modal } from "./Modal/Modal";

export function CardSushi({ name, image, price, opciones}) {
  const [isOpen, setIsOpen] = useState(false);

  function showModal() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative">
      <div className="flex flex-col w-80 rounded-xl transition duration-200 ease-in-out overflow-hidden shadow-lg hover:scale-105">
        <img 
          src={`src/components/images/${image}.jpg`}
          alt={image}
          className="object-cover w-full h-64 box-border"
        />
        <div className="bg-red-500 flex flex-row justify-between items-center p-7">
          <div>
            <p className="text-white">{name}</p>
            <p className="text-white">{price}</p>
          </div>
          <button className="btn btn-white" onClick={showModal}>
            Agregar al carrito
          </button>
        </div>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} showModal={showModal} opciones={opciones} />
      )}
    </div>
  );
}