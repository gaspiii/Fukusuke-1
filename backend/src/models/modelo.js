import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const esquema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: "",
    },
    photo: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    purchases: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            item: { type: String, required: true },
            date: { type: Date, default: Date.now },
            price: { type: Number, required: true },
        },
    ],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});




export default mongoose.model('User', esquema);
