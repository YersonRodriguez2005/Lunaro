const pool = require('../config/db');

// Crear producto (Actualizado para múltiples imágenes)
const createProduct = async (productData) => {
    const { category_id, name, description, price, stock, sizes, image_urls } = productData;
    const result = await pool.query(
        `INSERT INTO products (category_id, name, description, price, stock, sizes, image_urls) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [category_id, name, description, price, stock, sizes, image_urls] // image_urls es un array
    );
    return result.rows[0];
};

// Obtener todos los productos (Para el cliente solo los activos)
const getProducts = async (onlyActive = true) => {
    let query = `
        SELECT 
            p.*, 
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
            COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
    `;
    
    if (onlyActive) {
        query += ' WHERE p.active = true';
    }
    
    query += ' GROUP BY p.id ORDER BY p.created_at DESC';
    
    const result = await pool.query(query);
    return result.rows;
};

// Obtener producto por ID
const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1 AND active = true', [id]);
    if (result.rows.length === 0) {
        throw new Error('Producto no encontrado o inactivo');
    }
    return result.rows[0];
};

// Actualizar producto (Actualizado para múltiples imágenes)
const updateProduct = async (id, productData) => {
    const { category_id, name, description, price, stock, sizes, image_urls, active } = productData;
    const result = await pool.query(
        `UPDATE products 
         SET category_id = COALESCE($1, category_id), 
             name = COALESCE($2, name), 
             description = COALESCE($3, description), 
             price = COALESCE($4, price), 
             stock = COALESCE($5, stock), 
             sizes = COALESCE($6, sizes), 
             image_urls = COALESCE($7, image_urls), 
             active = COALESCE($8, active),
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $9 
         RETURNING *`,
        [category_id, name, description, price, stock, sizes, image_urls, active, id]
    );
    
    if (result.rows.length === 0) throw new Error('Producto no encontrado');
    return result.rows[0];
};

// Eliminación lógica (Soft Delete)
const deleteProduct = async (id) => {
    const result = await pool.query(
        'UPDATE products SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, active',
        [id]
    );
    if (result.rows.length === 0) throw new Error('Producto no encontrado');
    return result.rows[0];
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };