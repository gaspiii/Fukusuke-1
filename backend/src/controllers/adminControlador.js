import User from '../models/modelo.js';
import Boleta from '../models/modeloBoleta.js';

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-password'); // Excluir contraseñas
        res.json(usuarios);
    } catch (error) {
        console.error('Error en obtener Usuarios:', error); // Registrar error
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const obtenerCantidadUsuarios = async (req, res) => {
    try {
        const cantidad = await User.countDocuments(); // Contar todos los usuarios
        res.json({ cantidad });
    } catch (error) {
        console.error('Error al obtener cantidad de usuarios:', error);
        res.status(500).json({ message: 'Error al obtener cantidad de usuarios' });
    }
};

export const obtenerProductos = async (req, res) => {
    // Implementar lógica para productos (simulado aquí)
    res.json([{ id: 1, name: 'Producto A', price: 10 }]); // Reemplazar con la lógica real
};

export const obtenerCompras = async (req, res) => {
    try {
        const compras = await Boleta.find().select('cliente fecha total');
        res.json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener compras' });
    }
};

export const obtenerPedidos = async (req, res) => {
    // Implementar lógica para pedidos activos (simulado aquí)
    res.json([{ id: 1, status: 'Activo', cliente: 'Juan Pérez' }]); // Reemplazar con la lógica real
};
