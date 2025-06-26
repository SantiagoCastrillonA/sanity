const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");

let db = null;
let emailService = null;

const setDb = (database) => {
  db = database;
};

const setEmailService = (service) => {
  emailService = service;
};

/**
 * Solicitar restablecimiento de contraseña
 * @param {string} email - Email del usuario
 * @returns {Object} - Resultado de la operación
 */
const requestPasswordReset = async (email) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    if (!emailService) {
      throw new Error("Servicio de email no inicializado");
    }

    // Validar email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      const error = new Error("Email inválido");
      error.status = 400;
      throw error;
    }

    // Buscar usuario por email
    const user = await db.User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error = new Error("No existe una cuenta asociada a este email");
      error.status = 404;
      throw error;
    }

    // Verificar que el usuario tenga contraseña (no sea usuario de Google)
    if (!user.password) {
      const error = new Error(
        "Esta cuenta fue creada con Google. No se puede restablecer la contraseña."
      );
      error.status = 400;
      throw error;
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // Enviar email de restablecimiento
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(
      user.email,
      user.full_name || "Usuario",
      resetUrl
    );

    return {
      success: true,
      message:
        "Se ha enviado un email con las instrucciones para restablecer tu contraseña",
    };
  } catch (error) {
    console.error("Error en requestPasswordReset service:", error);
    throw error;
  }
};

/**
 * Verificar token de restablecimiento
 * @param {string} token - Token de restablecimiento
 * @returns {Object} - Resultado de la verificación
 */
const verifyResetToken = async (token) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    if (!token || typeof token !== "string") {
      const error = new Error("Token inválido");
      error.status = 400;
      throw error;
    }

    // Buscar usuario con el token válido y no expirado
    const user = await db.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      const error = new Error("Token inválido o expirado");
      error.status = 400;
      throw error;
    }

    return {
      success: true,
      message: "Token válido",
      userId: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("Error en verifyResetToken service:", error);
    throw error;
  }
};

/**
 * Restablecer contraseña con token
 * @param {string} token - Token de restablecimiento
 * @param {string} newPassword - Nueva contraseña
 * @returns {Object} - Resultado de la operación
 */
const resetPasswordWithToken = async (token, newPassword) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    // Validar datos de entrada
    if (!token || typeof token !== "string") {
      const error = new Error("Token inválido");
      error.status = 400;
      throw error;
    }

    if (
      !newPassword ||
      typeof newPassword !== "string" ||
      newPassword.length < 6
    ) {
      const error = new Error(
        "La nueva contraseña debe tener al menos 6 caracteres"
      );
      error.status = 400;
      throw error;
    }

    // Buscar usuario con el token válido y no expirado
    const user = await db.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      const error = new Error("Token inválido o expirado");
      error.status = 400;
      throw error;
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar tokens de restablecimiento
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return {
      success: true,
      message: "Contraseña restablecida exitosamente",
    };
  } catch (error) {
    console.error("Error en resetPasswordWithToken service:", error);
    throw error;
  }
};

module.exports = {
  setDb,
  setEmailService,
  requestPasswordReset,
  verifyResetToken,
  resetPasswordWithToken,
};
