// routes/auth.js
const express = require("express");
const router = express.Router();

// Importar controllers
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");

// Importar middleware de validación
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");

// Rutas
router.post("/register", registerValidation, registerController.register);
router.post("/login", loginValidation, loginController.login);

module.exports = router;
