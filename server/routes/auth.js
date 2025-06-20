const express = require('express');
const bcrypt = require('bcrypt');
const { registerSchema } = require('../validators/authValidator');
const User = require('../models/User');
const { Op } = require('sequelize');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Validar entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password, full_name } = value;

    // Verificar si usuario o email ya existen
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'El nombre de usuario o email ya están en uso.' });
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password_hash,
      full_name,
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en el servidor al registrar el usuario.' });
  }
});

module.exports = router;
