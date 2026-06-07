const pool = require('../config/db');

const getUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, name, email, phone, address, role FROM users WHERE id = $1',
        [id]
    );
    if (result.rows.length === 0) throw new Error('Usuario no encontrado');
    return result.rows[0];
};

const updateUserProfile = async (id, name, phone, address) => {
    const result = await pool.query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             phone = COALESCE($2, phone), 
             address = COALESCE($3, address),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 RETURNING id, name, email, phone, address, role`,
        [name, phone, address, id]
    );
    return result.rows[0];
};

module.exports = { getUserById, updateUserProfile };