import { Router } from 'express';
import verificarToken from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/roleMiddleware.js';
import {
    obtenerUsuarios,
    obtenerCantidadUsuarios,
} from '../controllers/adminControlador.js';
import { createProduct,  deleteProduct, getProducts, getProductCount, getProductsByCategory } from "../controllers/productController.js"; //productos
import { createDiscount, editDiscount, deleteDiscount, getDiscounts } from "../controllers/discountController.js"; //descuentos
import { getCategories, updateCategory, getTotalCategories, createCategory, deleteCategory  } from "../controllers/categoryController.js"; //categorias
import { getOrders, updateOrderStatus, deleteOrder, getOrdersByDate } from '../controllers/orderController.js'; //pedidos

const router = Router();



router.get('/admin-dashboard', verificarToken, verificarRol(['admin']), (req, res) => {
    res.status(200).json({ message: 'Bienvenido, administrador' });
    
});

// Rutas para usuarios
router.get('/admin-dashboard/users', verificarToken, verificarRol(['admin']), obtenerUsuarios);
router.get('/admin-dashboard/users/count', verificarToken, verificarRol(['admin']), obtenerCantidadUsuarios);

// Rutas de productos
router.get("/admin-dashboard/products", verificarToken, verificarRol(['admin']), getProducts);
router.get("/admin-dashboard/products/count", verificarToken, verificarRol(['admin']), getProductCount);
router.get("/admin-dashboard/products/:categoryId", verificarToken, verificarRol(['admin']),getProductsByCategory)
router.post("/admin-dashboard/products", verificarToken, verificarRol(['admin']), createProduct);
router.delete("/admin-dashboard/products/:id", verificarToken, verificarRol(['admin']), deleteProduct);
//Rutas categorias
router.get("/admin-dashboard/categories", verificarToken, verificarRol(['admin']), getCategories);
router.get("/admin-dashboard/categories/count", verificarToken, verificarRol(['admin']), getTotalCategories);
router.post("/admin-dashboard/categories", verificarToken, verificarRol(['admin']), createCategory);
router.put("/admin-dashboard/categories/:categoryId", verificarToken, verificarRol(['admin']), updateCategory);
router.delete('/admin-dashboard/categories/:categoryId', verificarToken, verificarRol(['admin']), deleteCategory);

// Rutas de descuentos
router.get("/admin-dashboard/discounts", verificarToken, verificarRol(['admin']), getDiscounts);
router.post("/admin-dashboard/discounts", verificarToken, verificarRol(['admin']), createDiscount);
router.put("/admin-dashboard/discounts/:id", verificarToken, verificarRol(['admin']),editDiscount);
router.delete("/admin-dashboard/discounts/:id", verificarToken, verificarRol(['admin']), deleteDiscount);

//Rutas de pedidos

router.get('/admin-dashboard/orders', verificarToken, verificarRol(['admin']), getOrders);  // Obtener todos los pedidos
router.put('/admin-dashboard/order/update', verificarToken, verificarRol(['admin']), updateOrderStatus);  // Actualizar el estado del pedido
router.delete('/admin-dashboard/order/delete', verificarToken, verificarRol(['admin']), deleteOrder);  // Eliminar un pedido
router.get('/admin-dashboard/orders/date', verificarToken, verificarRol(['admin']), getOrdersByDate); // Obtener pedidos por fecha

export default router;
