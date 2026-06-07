const checkoutService = require('../services/checkoutService');

const createOrder = async (req, res) => {
    try {
        // cartItems formato esperado: [{ productId: 1, quantity: 2 }, ...]
        const { cartItems, paymentToken } = req.body; 
        const userId = req.user.id;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío o tiene formato inválido' });
        }

        // Simulamos un ID de pasarela (ej. Stripe/PayPal) usando un timestamp o UUID
        const mockPaymentId = paymentToken || `mock_txn_${Date.now()}`;

        const orderResult = await checkoutService.processCheckout(userId, cartItems, mockPaymentId);

        res.status(201).json({ 
            message: 'Pago procesado y orden creada exitosamente', 
            order: orderResult 
        });

    } catch (error) {
        // Errores de stock o producto devuelven 400, otros 500
        const statusCode = error.message.includes('Stock') || error.message.includes('existe') ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { createOrder };