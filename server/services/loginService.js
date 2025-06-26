const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

let dbInstance;

const setDb = (database) => {
  dbInstance = database;
};

const loginUser = async ({ email, password }) => {
  if (!dbInstance || !dbInstance.User) {
    const error = new Error('El servidor no está completamente inicializado.');
    error.status = 500;
    throw error;
  }

  if (!email || !password) {
    const error = new Error("Por favor ingresa tu correo y contraseña");
    error.status = 400;
    throw error;
  }
  const user = await dbInstance.User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("Usuario o contraseña incorrectos");
    error.status = 401;
    throw error;
  }
  if (!user.verify_email) {
    const error = new Error("Por favor verifica tu correo antes de iniciar sesión. Revisa tu bandeja de entrada");
    error.status = 403;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Usuario o contraseña incorrectos");
    error.status = 401;
    throw error;
  }
  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      accountType: user.accountType,
      verify_email: user.verify_email,
    },
    token,
    message: "Inicio de sesión exitoso"
  };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, accountType: user.accountType },
    process.env.JWT_SECRET || "sanity_app_2024_jwt_secret_key_fallback",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

module.exports = { loginUser, setDb };