import mongoose from 'mongoose';

const boletaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        unique: true,
    },
    cliente: {
        type: String,
        required: true,
    },
    productos: [{
        nombre: String,
        cantidad: Number,
        precio: Number,
    }],
    total: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Boleta', boletaSchema);