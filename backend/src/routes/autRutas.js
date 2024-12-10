import { Router } from 'express';
import { registro, login } from '../controllers/autControladores.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login); // Esta ruta es la que autenticará al usuario y devolverá el token JWT

export default router