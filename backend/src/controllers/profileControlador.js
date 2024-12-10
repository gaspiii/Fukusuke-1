import User from '../models/modelo.js';
import bcrypt from 'bcrypt';

const updateInfo = async (req, res) => {
    const { name, email, address, password , photo} = req.body;
    const userId = req.user.id; // El ID del usuario está en req.user (decodificado desde JWT)
  
    try {
      // Buscar el usuario en la base de datos
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Actualizar los campos proporcionados
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
      if (photo) user.photo = photo;
      if (password) {
        // Si la contraseña es proporcionada, cifrarla
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Guardar los cambios
      await user.save();
  
      // Responder con los datos actualizados (sin la contraseña por seguridad)
      res.status(200).json({
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        photo: user.photo,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al actualizar los datos' });
    }
  };
  
  export default updateInfo;