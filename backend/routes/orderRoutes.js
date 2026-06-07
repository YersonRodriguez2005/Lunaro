const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Ruta para el cliente (Mi Historial)
router.get('/my-orders', verifyToken, orderController.getMyOrders);

// Ruta para el administrador (Todas las ventas)
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);

module.exports = router;