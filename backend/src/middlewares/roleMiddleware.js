export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!rolesPermitidos.includes(role)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios.' });
        }

        next();
    };
};