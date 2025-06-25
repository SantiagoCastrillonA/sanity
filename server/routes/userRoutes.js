const express = require("express");
const router = express.Router();
const { googleSignIn } = require("../controllers/loginGoogleController");
const { googleSignUp } = require("../controllers/registerGoogleController");
const { register } = require("../controllers/registerController");
const { login, logout } = require("../controllers/loginController");
const { verifyEmail } = require("../controllers/verifyEmailController");

router.post("/auth/googleSignIn", googleSignIn); // Ruta para iniciar sesión con Google
router.post("/auth/googleSignUp", googleSignUp); // Ruta para registrar usuario con Google
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Ruta para cerrar sesión
router.get("/verify-email", verifyEmail); // Ruta para verificar correo electrónico

module.exports = router;