let dbInstance;
const loginService = require("../services/loginService");

const setDb = (database) => {
  dbInstance = database;
};

const login = async (req, res) => {
  try {

    if (!dbInstance || !dbInstance.User) {
      return res.status(500).json({
        success: false,
        message: "El servidor no está completamente inicializado."
      });
    }

    const { email, password } = req.body;
    const result = await loginService.loginUser(dbInstance, { email, password });
    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: result.user,
      token: result.token
    });
  } catch (error) {
    handleError(error, res);
  }
};


module.exports = { login, setDb };