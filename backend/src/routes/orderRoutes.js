import express from 'express';
import verificarToken from '../middlewares/authMiddleware.js';
import { createOrder } from '../controllers/orderController.js';



const router = express.Router();


router.post('/orders/create', verificarToken, createOrder);

export default router;