const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Solo usuarios autenticados pueden comprar
router.post('/', verifyToken, checkoutController.createOrder);

module.exports = router;