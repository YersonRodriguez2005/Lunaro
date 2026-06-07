const pool = require('../config/db');

const createCategory = async (name, description) => {
    // Normalizar el nombre a mayúsculas/minúsculas para evitar duplicados (ej. "Hombre" vs "hombre")
    const formattedName = name.trim();
    
    // Verificar si ya existe
    const existing = await pool.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [formattedName]);
    if (existing.rows.length > 0) {
        throw new Error('La categoría ya existe');
    }

    const result = await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [formattedName, description]
    );
    return result.rows[0];
};

const getCategories = async () => {
    // Solo retornamos las categorías activas ordenadas alfabéticamente
    const result = await pool.query('SELECT * FROM categories WHERE active = true ORDER BY name ASC');
    return result.rows;
};

module.exports = { createCategory, getCategories };