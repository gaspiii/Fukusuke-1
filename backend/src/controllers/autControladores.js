import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/modelo.js';
import bcrypt from 'bcrypt';

// Registro
export const registro = async (req, res) => {
  //JWT
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
      const { name, email, password, address, photo, role } = req.body;

      // Log para verificar los datos recibidos
      console.log("Datos recibidos:", { name, email, password, address, photo, role });

      // Validación
      if (!name || !email || !password) {
          return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
      }

      // Verificar si el correo ya está registrado
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const nuevoUsuario = new User({
          name,
          email,
          password: hashedPassword,
          address: address || "",
          photo: photo || "https://via.placeholder.com/150",
          role: role || 'user',
      });

      await nuevoUsuario.save();
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ error: 'Error al registrar usuario' });
  }
};



// Login
export const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Verificar si el usuario existe
      const usuario = await User.findOne({ email });
      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Comparar la contraseña
      const contrasenaValida = await bcrypt.compare(password, usuario.password);
      if (!contrasenaValida) {
          return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      
      const token = jwt.sign(
        { id: usuario._id, role: usuario.role }, // Payload
        process.env.JWT_SECRET, // Usamos la clave secreta desde el .env
        { expiresIn: '1d' } // Expiración
      );

      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      res.status(200).json({
          message: "Inicio de sesión exitoso",
          token,
          user: {
              id: usuario._id,
              name: usuario.name,
              email: usuario.email,
              address : usuario.address,
              role: usuario.role,
              photo: usuario.photo,
          },
      });
  } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
  }
};