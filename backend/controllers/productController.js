const productService = require('../services/productService');

const create = async (req, res) => {
    try {
        const image_urls = req.files ? req.files.map(file => file.path) : [];
        
        if (image_urls.length === 0) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        const payload = { ...req.body, image_urls };
        
        if (typeof payload.sizes === 'string') {
            payload.sizes = payload.sizes.split(',').map(s => s.trim().toUpperCase());
        }

        const newProduct = await productService.createProduct(payload);
        res.status(201).json({ product: newProduct });
    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        // Si el usuario es admin, podría enviar un query ?all=true para ver inactivos
        const isAdminRequest = req.user && req.user.role === 'admin' && req.query.all === 'true';
        const products = await productService.getProducts(!isAdminRequest);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = { ...req.body };

        // 1. IMPORTANTE: Multer guarda los archivos en req.files
        if (req.files && req.files.length > 0) {
            payload.image_urls = req.files.map(file => file.path);
        } else {
            payload.image_urls = null;
        }

        // 2. Parsear el string de tallas que viene del FormData
        if (payload.sizes && typeof payload.sizes === 'string') {
            payload.sizes = payload.sizes.split(',').map(s => s.trim().toUpperCase());
        }

        const updatedProduct = await productService.updateProduct(id, payload);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error en el backend:", error);
        res.status(400).json({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Producto desactivado correctamente (Soft Delete)' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { create, getAll, getById, update, remove };