import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import autRutas from './routes/autRutas.js' ;
import boletaRutas from './routes/boletaRutas.js';
import profileRutas from './routes/profileRutas.js';
import adminRutas from './routes/adminRutas.js';
import orderRoutes from './routes/orderRoutes.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    credentials: true // Permitir envío de cookies y encabezados autorizados
})) ;

app.use(morgan('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.resolve('public', 'images')));

app.use("/api", [autRutas, boletaRutas, profileRutas, adminRutas, orderRoutes]);


app.get('/api/images', (req, res) => {
    const imagesDir = path.resolve('public', 'images');
    
    console.log('Intentando leer el directorio:', imagesDir); // Agregar log
    
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio:', err); // Agregar log
            return res.status(500).json({ error: 'No se pudieron leer las imágenes' });
        }
        
        console.log('Archivos en el directorio:', files); // Agregar log

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        
        res.json(imageFiles);
    });
});



export default app;
