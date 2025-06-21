const express = require("express");
const router = express.Router();
const { googleSignIn } = require("../controllers/loginGoogleController");
const { googleSignUp } = require("../controllers/registerGoogleController");
const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");

router.post("/auth/googleSignIn", googleSignIn); // Ruta para iniciar sesión con Google
router.post("/auth/googleSignUp", googleSignUp); // Ruta para registrar usuario con Google
router.post("/register", register)
router.post("/login", login)

module.exports = router;