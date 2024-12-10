import React from 'react';

export function Footer() {
    return (
        <footer className='flex flex-col justify-center min-h-3 bg-red-500 mt-auto text-gray-50 text-center  p-6 gap-1'>
            <p>Ubicación: Av. Principal 123, Santiago, Chile</p>
            <p>Teléfono: +56 9 1234 5678</p>
            <p>Email: contacto@fukusukesushi.cl</p>
            <p>Horario de atención: Lunes a Sábado, 12:00 - 22:00</p>
        </footer>
    )
}