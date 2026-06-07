const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Se espera el formato: "Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Al verificar, se desencripta el payload original { id, role }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

const isAdmin = (req, res, next) => {
    // Depende de que verifyToken se haya ejecutado antes
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Requiere privilegios de administrador.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };