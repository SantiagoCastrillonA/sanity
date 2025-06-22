const loginService = require("../services/loginService");

const setDb = (database) => {
  loginService.setDb(database);
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService.loginUser({ email, password });
    
    // Enviar el token como una cookie HTTP-only
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict",
      maxAge: 3600000, // 1 hora
    });

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user
    });
  } catch (error) {
    console.error('Error en login controller:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error interno del servidor al iniciar sesión'
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ 
    success: true,
    message: "Sesión cerrada correctamente" 
  });
};

module.exports = { login, logout, setDb };