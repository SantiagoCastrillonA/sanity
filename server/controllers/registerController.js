const registerService = require("../services/registerService");

const setDb = (database) => {
  registerService.setDb(database);
};

const register = async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerService.registerUser(userData);
    res.status(200).json({
      success: true,
      message: result.message || "Usuario registrado exitosamente",
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Error en register controller:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error interno del servidor al registrar usuario'
    });
  }
};

module.exports = { register, setDb }; 