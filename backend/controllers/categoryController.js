const categoryService = require('../services/categoryService');

const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
        }

        const newCategory = await categoryService.createCategory(name, description);
        res.status(201).json({ message: 'Categoría creada', category: newCategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
};

module.exports = { create, getAll };