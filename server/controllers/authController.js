const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Registrar usuario
const register = async (req, res) => {
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

    const { username, email, password, name, full_name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El usuario o email ya existe",
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario - usando los nombres exactos de la tabla
    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword, // ← Cambiar a password_hash
      name,
      full_name: full_name || null,
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          full_name: newUser.full_name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {

    // Validar errores
    const errors = validationResult(req);
    console.log("Errores de validación:", errors.array());

    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación encontrados");
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }

    console.log("✅ Validación exitosa");
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "username",
        "email",
        "name",
        "full_name",
        "password_hash",
      ],
    });

    console.log("Usuario encontrado:", user ? "SÍ" : "NO");

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    console.log("✅ Usuario encontrado, verificando contraseña...");

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("Contraseña válida:", isPasswordValid ? "SÍ" : "NO");

    if (!isPasswordValid) {
      console.log("❌ Contraseña inválida");
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    console.log("✅ Login exitoso");

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          full_name: user.full_name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  register,
  login,
};
