const express = require("express");
const router = express.Router();
const { googleSignIn } = require("../controllers/loginGoogleController");
const { googleSignUp } = require("../controllers/registerGoogleController");


router.post("/auth/googleSignIn", googleSignIn); // Ruta para iniciar sesión con Google
router.post("/auth/googleSignUp", googleSignUp); // Ruta para registrar usuario con Google

module.exports = router;