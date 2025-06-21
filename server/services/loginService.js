const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

class LoginService {
  async authenticateUser(email, password) {
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

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Generar token JWT
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        full_name: user.full_name,
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

module.exports = new LoginService();
