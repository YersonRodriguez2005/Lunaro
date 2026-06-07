const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Lectura pública para el Header y Buscador del cliente
router.get('/', categoryController.getAll);

// Creación restringida al administrador
router.post('/', verifyToken, isAdmin, categoryController.create);

module.exports = router;