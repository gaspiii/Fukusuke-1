import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['espera', 'proceso', 'listo', 'reparto', 'finalizado'],
  },
  platform: {
    type: String,
    required: true,
    enum: ['local', 'uber', 'peya', 'didi'],
  },
  type: {
    type: String,
    required: true,
    enum: ['entrega', 'retiro'],
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['tarjeta', 'efectivo', 'transferencia'],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number,
    default: 0,
  },
  estimatedDeliveryTime: {
    type: String,
    default: '35 minutos',
  },
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    default: '',
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencia al modelo User o el que uses para los clientes
    required: true,
  }
});

export default mongoose.model('Order', orderSchema);
