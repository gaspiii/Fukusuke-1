import User from '../models/modelo.js';  // Corregido el nombre de importación del modelo User
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Obtener todos los pedidos (con paginación si es necesario)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('products.product', 'name');
        
        // Log de los pedidos obtenidos
        console.log('Pedidos obtenidos:', orders);
        
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};



// Actualizar el estado de un pedido
export const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;  // Esperamos recibir el id del pedido y el nuevo estado

    try {
        // Validar que el estado sea uno permitido
        const validStatuses = ['espera', 'proceso', 'listo', 'reparto', 'finalizado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        // Buscar el pedido y actualizar su estado
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Estado del pedido actualizado', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
    }
};

// Eliminar un pedido (en caso de que sea necesario)
export const deleteOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};


export const createOrder = async (req, res) => {
    try {
        const {
            status, platform, type, products, totalPrice, paymentMethod, 
            customerName, customerPhone, customerAddress = '', discount = 0, 
            estimatedDeliveryTime = '35 minutos'
        } = req.body;

        const userId = req.body.customerId;  // Se asume que el usuario está autenticado y tienes su ID en el token
        console.log(req.body);
        // Buscar el cliente (usuario) por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }

        // Validar que los productos existen y que las cantidades son correctas
        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ error: `Producto no encontrado: ${item.product}` });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser mayor que 0' });
            }
        }

        // Crear el pedido
        const newOrder = new Order({
            status, platform, type, products, totalPrice, paymentMethod, 
            customerName, customerPhone, customerAddress, discount, 
            estimatedDeliveryTime, customer: user._id
        });

        // Guardar el pedido en la base de datos
        await newOrder.save();

        res.status(201).json({ message: 'Pedido creado exitosamente', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
};


// Obtener los pedidos por fecha
export const getOrdersByDate = async (req, res) => {
    const { date } = req.query; // El cliente enviará la fecha como parámetro de consulta.

    try {
        const selectedDate = new Date(date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Filtrar pedidos con fechas dentro del rango del día seleccionado, incluyendo el estado finalizado
        const orders = await Order.find({
            orderDate: {
                $gte: selectedDate,
                $lt: nextDate,
            },
        })
        .populate('customer', 'name email')  // Información del cliente
        .populate('products.product', 'name'); // Población del nombre del producto

        // Enviar los pedidos agrupados por estado, incluyendo 'finalizado'
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};
