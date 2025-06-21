const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const registerUser = async (dbInstance, userData) => {
  const { username, email, password, name, full_name } = userData;

  console.log("Datos recibidos en registerService:", userData);

  // Verificar si el usuario ya existe
  const existingUser = await dbInstance.User.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: username }],
    },
  });

  if (existingUser) {
    const error = new Error("USER_ALREADY_EXISTS");
    error.status = 400;
    throw error;
  }

  // Encriptar contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Crear usuario
  const newUser = await dbInstance.User.create({
    username,
    email,
    password_hash: hashedPassword,
    name: name || username,
    full_name: full_name || null,
  });

  // Generar token JWT
  const token = generateToken(newUser);

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
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = { registerUser };