const pool = require('../config/db');

const getUserOrders = async (userId) => {
    // Uso de json_agg para anidar los items dentro del objeto de la orden directamente en SQL
    const query = `
        SELECT 
            o.id, o.total, o.status, o.created_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'item_id', oi.id,
                        'name', p.name,
                        'quantity', oi.quantity,
                        -- CORRECCIÓN: Usar price_unit en lugar de price para la tabla order_items
                        'subtotal', (oi.quantity * COALESCE(oi.price_unit, p.price)), 
                        'image_url', p.image_urls[1] 
                    )
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
            ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const getAllOrdersForAdmin = async () => {
    const query = `
        SELECT 
            o.id, o.total, o.status, o.created_at,
            u.name AS customer_name,
            u.email AS customer_email,
            json_agg(
                json_build_object('name', p.name, 'qty', oi.quantity)
            ) AS items_summary
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        GROUP BY o.id, u.name, u.email
        ORDER BY o.created_at DESC;
    `;
    
    const result = await pool.query(query);
    return result.rows;
};

module.exports = { getUserOrders, getAllOrdersForAdmin };