const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const loginUser = async (dbInstance, { email, password }) => {
  if (!email || !password) {
    const error = new Error("EMAIL_OR_PASSWORD_REQUIRED");
    error.status = 400;
    throw error;
  }
  const user = await dbInstance.User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("INVALID_CREDENTIALS");
    error.status = 401;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error("INVALID_CREDENTIALS");
    error.status = 401;
    throw error;
  }
  const token = generateToken(user);
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
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = { loginUser };