// validators/authValidator.js
const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().max(100).allow("", null),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
