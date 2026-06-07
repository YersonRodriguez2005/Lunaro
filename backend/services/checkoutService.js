const pool = require('../config/db');

const processCheckout = async (userId, cartItems, mockPaymentId) => {
    // 1. Obtener un cliente dedicado para la transacción
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        let totalOrder = 0;
        const itemsToInsert = [];

        // 2. Validar stock y recalcular precios reales desde la BD
        for (const item of cartItems) {
            const resProduct = await client.query(
                'SELECT price, stock, name FROM products WHERE id = $1 AND active = true',
                [item.productId]
            );

            if (resProduct.rows.length === 0) {
                throw new Error(`El producto con ID ${item.productId} no existe o está inactivo`);
            }

            const product = resProduct.rows[0];

            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
            }

            // Calcular subtotal con el precio seguro del backend
            const subtotal = product.price * item.quantity;
            totalOrder += subtotal;

            itemsToInsert.push({
                productId: item.productId,
                quantity: item.quantity,
                priceUnit: product.price
            });
        }

        // 3. Crear la cabecera de la orden
        const resOrder = await client.query(
            `INSERT INTO orders (user_id, total, status, payment_id) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, totalOrder, 'paid', mockPaymentId] // 'paid' simula el éxito de la pasarela
        );
        const orderId = resOrder.rows[0].id;

        // 4. Insertar los detalles (order_items) y descontar stock
        for (const item of itemsToInsert) {
            // Insertar ítem
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_unit) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.quantity, item.priceUnit]
            );

            // Descontar stock (operación atómica)
            await client.query(
                'UPDATE products SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [item.quantity, item.productId]
            );
        }

        await client.query('COMMIT'); // Confirmar transacción
        return { orderId, total: totalOrder, status: 'paid' };

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir todo si hay error
        throw error;
    } finally {
        client.release(); // Devolver el cliente al pool
    }
};

module.exports = { processCheckout };