// routes/auth.js
const express = require("express");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  // 1) Validar entrada
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password, full_name } = value;

  try {
    // 2) Verificar duplicados
    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({ error: "Correo ya registrado" });
    }
    if (await User.findOne({ where: { username } })) {
      return res.status(409).json({ error: "Username ya en uso" });
    }

    // 3) Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // 4) Crear usuario
    const user = await User.create({ username, email, password_hash, full_name });

    // 5) Responder
    res.status(201).json({
      message: "Registro exitoso",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (e) {
    console.error("Registro error:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  // 1) Validar entrada
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = value;

  try {
    // 2) Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // 3) Verificar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    // 4) Generar JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5) Responder
    res.json({ message: "Login exitoso", token });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
