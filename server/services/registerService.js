const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

let dbInstance;
let emailService;

const setDb = (database) => {
  dbInstance = database;
};

const setEmailService = (service) => {
  emailService = service;
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const registerUser = async (userData) => {
  const { email, password, full_name, accountType, servicios_especialistas, NC_profesional, certificados, experiencia_laboral } = userData;

  console.log("Datos recibidos en registerService:", userData);

  if (!dbInstance || !dbInstance.User) {
    const error = new Error('El servidor no está completamente inicializado.');
    error.status = 500;
    throw error;
  }

  // Validar tipo de cuenta
  if (!accountType || !['Usuario', 'Profesional'].includes(accountType)) {
    const error = new Error('Tipo de cuenta no válido. Debe ser "Usuario" o "Profesional".');
    error.status = 400;
    throw error;
  }

  // Verificar si el usuario ya existe (solo por email)
  const existingUser = await dbInstance.User.findOne({
    where: { email: email },
  });

  if (existingUser) {
    const error = new Error("USER_ALREADY_EXISTS");
    error.status = 400;
    throw error;
  }

  // Encriptar contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generar token de verificación
  const verificationToken = generateVerificationToken();

  // Crear usuario
  const newUser = await dbInstance.User.create({
    email,
    password: hashedPassword,
    full_name: full_name || null,
    accountType,
    token: verificationToken, // Token para verificación de email
    verify_email: false, // Email no verificado inicialmente
  });

  // Si es profesional, crear perfil profesional
  let professionalProfile = null;
  if (accountType === 'Profesional') {
    try {
      professionalProfile = await dbInstance.Professional.create({
        user_id: newUser.id,
        servicios_especialistas: servicios_especialistas || null,
        NC_profesional: NC_profesional || null,
        certificados: certificados || null,
        experiencia_laboral: experiencia_laboral || null,
      });
      console.log("Perfil profesional creado:", professionalProfile.id);
    } catch (error) {
      console.error("Error creando perfil profesional:", error);
      // Si falla la creación del perfil profesional, eliminar el usuario creado
      await newUser.destroy();
      throw new Error("Error al crear perfil profesional. Por favor, intente nuevamente.");
    }
  }

  // Enviar email de verificación
  try {
    if (emailService && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await emailService.sendVerificationEmail(email, verificationToken, full_name);
      console.log("Email de verificación enviado a:", email);
    } else {
      console.warn("Servicio de email no configurado - saltando envío de email");
    }
  } catch (emailError) {
    console.error("Error enviando email de verificación:", emailError);
    // No fallar el registro si el email falla, solo loguear el error
  }

  // Generar token JWT
  const token = generateToken(newUser);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      accountType: newUser.accountType,
      verify_email: newUser.verify_email,
      professional: professionalProfile ? {
        id: professionalProfile.id,
        servicios_especialistas: professionalProfile.servicios_especialistas,
        NC_profesional: professionalProfile.NC_profesional,
        certificados: professionalProfile.certificados,
        experiencia_laboral: professionalProfile.experiencia_laboral,
      } : null,
    },
    token,
    message: "Usuario registrado exitosamente. Se ha enviado un email de verificación a tu correo electrónico."
  };
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, accountType: user.accountType },
    process.env.JWT_SECRET || "sanity_app_2024_jwt_secret_key_fallback",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

module.exports = { registerUser, setDb, setEmailService };