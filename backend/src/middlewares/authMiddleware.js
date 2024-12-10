    import jwt from 'jsonwebtoken';
    import dotenv from 'dotenv';
    dotenv.config();

    const verificarToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET; // .env
    
        if (!token) {
            return res.status(401).json({ error: "No se proporcionó un token" });
        }
    
        try {
            const decoded = jwt.verify(token, JWT_SECRET); 
            console.log(decoded); 

            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(401).json({ error: "Token inválido o expirado" });
        }
    };
    
    export default verificarToken;

