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
const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} = require("../controllers/passwordResetController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require("../middleware/profileValidation");
const {
  validatePasswordResetRequest,
  validateResetToken,
  validatePasswordReset,
} = require("../middleware/passwordResetValidation");

router.post("/auth/googleSignIn", googleSignIn); // Ruta para iniciar sesión con Google
router.post("/auth/googleSignUp", googleSignUp); // Ruta para registrar usuario con Google
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Ruta para cerrar sesión
router.get("/verify-email", verifyEmail); // Ruta para verificar correo electrónico

// Rutas de restablecimiento de contraseña (públicas)
router.post(
  "/password/reset-request",
  validatePasswordResetRequest,
  requestPasswordReset
); // Solicitar restablecimiento
router.get("/password/verify-token", validateResetToken, verifyResetToken); // Verificar token
router.post("/password/reset", validatePasswordReset, resetPassword); // Restablecer contraseña

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
