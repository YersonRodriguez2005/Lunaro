const userService = require('../services/userService');

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const updatedUser = await userService.updateUserProfile(req.user.id, name, phone, address);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

module.exports = { getProfile, updateProfile };