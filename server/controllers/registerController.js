let dbInstance;
const registerService = require("../services/registerService");

const setDb = (database) => {
  dbInstance = database;
};

const register = async (req, res) => {
  try {
    if (!dbInstance || !dbInstance.User) {
      return res.status(500).json({
        success: false,
        message: "El servidor no está completamente inicializado."
      });
    }

    const userData = req.body;
    const result = await registerService.registerUser(dbInstance, userData);
    res.status(200).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: result.user,
      token: result.token
    });
  } catch (error) {
    handleError(error, res);
  }
};


module.exports = { register, setDb }; 