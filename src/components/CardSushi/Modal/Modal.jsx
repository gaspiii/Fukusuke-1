import React from "react";
import { Item } from "../Item/Item";

export function Modal({ showModal, isOpen, opciones }) {

    function saveItemLocalStorage(opciones) {
        const items = document.querySelectorAll("div.sushi input:checked");

        let itemsArray = JSON.parse(localStorage.getItem("items")) || [];
        
        items.forEach((item) => {
            const itemId = item.id;
            let itemObject = null;

            opciones.forEach((opcion) => {
                if (opcion.name === itemId) {
                    itemObject = {
                        name: opcion.name,
                        price: opcion.price,
                        count: 1
                    };
                }
            });

            if (itemObject) {
                const existingItem = itemsArray.find(itemInArray => itemInArray.name === itemObject.name);
                if (existingItem) {
                    existingItem.count += 1;
                } else {
                    itemsArray.push(itemObject);
                }
            }
        });
    
        localStorage.setItem("items", JSON.stringify(itemsArray));
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    
                    <div className="bg-white p-7 rounded-lg flex flex-col">
                        <div className="flex flex-row justify-end">
                            <button className="btn btn-circle btn-white" onClick={showModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                            </button>
                        </div>
                        
                        <form method="dialog" className="flex flex-col bg-white m p-6 rounded-lg min-w-64 gap-5">
                            <div className="option-sushi-container">
                                {
                                    opciones.map((opcion) => {
                                        return (
                                            <Item 
                                                key={opcion.name}
                                                name={opcion.name} 
                                                price={opcion.price} 
                                            />
                                        );
                                    })
                                }
                            </div>
                            <button id="button-add-entradas" className="bg-red-500 rounded-lg p-2 text-white" onClick={() => saveItemLocalStorage(opciones)}>Agregar</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}