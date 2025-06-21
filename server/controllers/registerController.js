const { validationResult } = require("express-validator");
const registerService = require("../services/registerService");

class RegisterController {
  // Método register con arrow function para mantener el contexto
  register = async (req, res) => {
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

      // Llamar al service
      const result = await registerService.registerUser(req.body);

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: result,
      });
    } catch (error) {
      this.handleError(error, res); // ← Ahora this mantendrá el contexto
    }
  };

  // Método handleError con arrow function
  handleError = (error, res) => {
    console.error("Error en registro:", error);

    switch (error.message) {
      case "USER_ALREADY_EXISTS":
        return res.status(400).json({
          success: false,
          message: "El usuario o email ya existe",
        });

      default:
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor",
        });
    }
  };
}

module.exports = new RegisterController();
