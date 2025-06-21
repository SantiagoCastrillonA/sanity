const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");

class RegisterService {
  async registerUser(userData) {
    const { username, email, password, name, full_name } = userData;

    console.log("Datos recibidos en registerService:", userData); // ← AGREGAR LOG

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario - ASEGURAR QUE SE INCLUYA EL CAMPO 'name'
    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      name: name || username, // ← ASEGURAR QUE 'name' tenga valor
      full_name: full_name || null,
    });

    // Generar token JWT
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        full_name: newUser.full_name,
      },
      token,
    };
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new RegisterService();
