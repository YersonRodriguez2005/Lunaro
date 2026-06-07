const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary');

// Rutas Públicas (Clientes)
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Rutas Protegidas (Administrador) - CRUD con Multer para manejar FormData
router.post('/', verifyToken, isAdmin, upload.array('images', 5), productController.create);
router.put('/:id', verifyToken, isAdmin, upload.array('images', 5), productController.update);
router.delete('/:id', verifyToken, isAdmin, productController.remove);

// Rutas de Reseñas (Clientes)
router.get('/:productId/reviews', reviewController.getProductReviews);
router.post('/:productId/reviews', verifyToken, reviewController.addReview);

module.exports = router;