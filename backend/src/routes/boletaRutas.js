import { Router } from 'express';
import { obtenerBoletas, obtenerBoletaPorId, generarReporteVentas  } from '../controllers/boletaControlador.js';

const router = Router();

router.get('/boletas', obtenerBoletas); // Endpoint para obtener todas las boletas con filtros
router.get('/boletas/:id', obtenerBoletaPorId); // Endpoint para obtener una boleta específica por ID
router.get('/reporte-ventas', generarReporteVentas); // EJ: http://localhost:4000/api/reporte-ventas?fechaInicio=2024-01-01&fechaFin=2024-01-319

export default router;