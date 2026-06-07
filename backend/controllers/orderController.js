const orderService = require('../services/orderService');

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getUserOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error en my-orders:", error);
        res.status(500).json({ message: 'Error interno al cargar los pedidos.', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrdersForAdmin();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los pedidos globales', error: error.message });
    }
};

module.exports = { getMyOrders, getAllOrders };