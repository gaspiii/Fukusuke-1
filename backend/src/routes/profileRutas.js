import { Router } from 'express';
import updateInfo from '../controllers/profileControlador.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = Router();


router.put('/user/update', verificarToken, updateInfo);

export default router;
