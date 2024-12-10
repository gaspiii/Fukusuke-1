import Boleta from '../models/modeloBoleta.js';

// Obtener todas las boletas con opción de filtrar por fecha o cliente
export const obtenerBoletas = async (req, res) => {
    try {
        const { fecha, cliente } = req.query;
        let filter = {};

        if (fecha) {
            filter.fecha = new Date(fecha);
        }
        if (cliente) {
            filter.cliente = cliente;
        }

        const boletas = await Boleta.find(filter).select('cliente fecha total');
        res.json(boletas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las boletas' });
    }
};

// Obtener una boleta específica por ID
export const obtenerBoletaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const boleta = await Boleta.findById(id);

        if (!boleta) {
            return res.status(404).json({ error: 'Boleta no encontrada' });
        }

        res.json(boleta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la boleta' });
    }
};

export const generarReporteVentas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin para el reporte' });
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999); // Incluir toda la última fecha hasta el final del día

        // Buscar boletas en el rango de fechas
        const boletas = await Boleta.find({
            fecha: { $gte: inicio, $lte: fin }
        }).select('fecha total');

        // Calcular el total de ventas
        const totalVentas = boletas.reduce((sum, boleta) => sum + boleta.total, 0);

        // Enviar el reporte con el total y las boletas en el rango de fechas
        res.json({
            mensaje: `Reporte de ventas del ${fechaInicio} al ${fechaFin}`,
            totalVentas,
            boletas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de ventas' });
    }
};