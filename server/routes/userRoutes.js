const express = require("express");
const router = express.Router();
const { googleSignIn } = require("../controllers/loginGoogleController");
const { googleSignUp } = require("../controllers/registerGoogleController");
const { register } = require("../controllers/registerController");
const { login, logout } = require("../controllers/loginController");
const { verifyEmail } = require("../controllers/verifyEmailController");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require("../middleware/profileValidation");

router.post("/auth/googleSignIn", googleSignIn); // Ruta para iniciar sesión con Google
router.post("/auth/googleSignUp", googleSignUp); // Ruta para registrar usuario con Google
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Ruta para cerrar sesión
router.get("/verify-email", verifyEmail); // Ruta para verificar correo electrónico

// Rutas protegidas de perfil
router.get("/profile", authenticateToken, getProfile); // Obtener perfil del usuario
router.put("/profile", authenticateToken, validateProfileUpdate, updateProfile); // Actualizar perfil del usuario
router.put(
  "/profile/change-password",
  authenticateToken,
  validatePasswordChange,
  changePassword
); // Cambiar contraseña

module.exports = router;
