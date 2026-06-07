const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validación básica (mejorable con librerías como Joi o express-validator)
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const user = await authService.registerUser(name, email, password);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        // Enviar un 400 en caso de que el error sea generado por el servicio (ej. correo duplicado)
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Proporcione correo y contraseña' });
        }

        const data = await authService.loginUser(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', ...data });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// En JWT (Stateless), el cierre de sesión real ocurre en el frontend eliminando el token.
const logout = (req, res) => {
    res.status(200).json({ message: 'Sesión cerrada. Por favor elimine el token del cliente.' });
};

const refreshToken = (req, res) => {
    // Extraer token de cabecera o cookie (según tu implementación)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No hay token' });

    try {
        // Validamos la firma del token, ignorando si ya expiró
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        
        // Generamos un nuevo token con 1 hora más de vida
        const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ token: newToken, user: decoded });
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o corrupto' });
    }
};

module.exports = { register, login, logout, refreshToken };