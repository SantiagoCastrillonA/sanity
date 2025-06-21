const { validationResult } = require("express-validator");
const loginService = require("../services/loginService");

class LoginController {
  // Usar arrow function para mantener el contexto
  login = async (req, res) => {
    try {
      // Validar errores
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Llamar al service
      const result = await loginService.authenticateUser(email, password);

      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // Arrow function para mantener contexto
  handleError = (error, res) => {
    console.error("Error en login:", error);

    switch (error.message) {
      case "INVALID_CREDENTIALS":
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });

      default:
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor",
        });
    }
  };
}

module.exports = new LoginController();
