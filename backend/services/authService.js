const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password) => {
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        throw new Error('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña (salteo de 10 rondas)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar en base de datos retornando los datos sin la contraseña
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

const loginUser = async (email, password) => {
    // Buscar el usuario
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        throw new Error('Credenciales inválidas');
    }

    const user = result.rows[0];

    // Verificar el hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    // Generar el JSON Web Token
    const payload = {
        id: user.id,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser, loginUser };