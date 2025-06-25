const profileService = require("../services/profileService");

const setDb = (database) => {
  profileService.setDb(database);
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await profileService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Error en getProfile controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error interno del servidor al obtener perfil",
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const result = await profileService.updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Error en updateProfile controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message:
        error.message || "Error interno del servidor al actualizar perfil",
    });
  }
};

/**
 * Cambiar contraseña del usuario autenticado
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const passwordData = req.body;

    const result = await profileService.changePassword(userId, passwordData);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error en changePassword controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message:
        error.message || "Error interno del servidor al cambiar contraseña",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  setDb,
};
