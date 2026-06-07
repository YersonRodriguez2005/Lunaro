const pool = require('../config/db');

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const userId = req.user.id; // Del token JWT

        if (!rating || rating < 1 || rating > 5 || !comment) {
            return res.status(400).json({ message: 'Calificación (1-5) y comentario son requeridos.' });
        }

        const result = await pool.query(
            `INSERT INTO reviews (user_id, product_id, rating, comment) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, productId, rating, comment]
        );

        res.status(201).json({ message: 'Reseña agregada exitosamente', review: result.rows[0] });
    } catch (error) {
        // Capturar violación de restricción UNIQUE
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Ya has calificado este producto.' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await pool.query(
            `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = $1 
             ORDER BY r.created_at DESC`,
            [productId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
    }
};

module.exports = { addReview, getProductReviews };