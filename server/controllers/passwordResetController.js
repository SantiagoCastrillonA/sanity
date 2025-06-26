const passwordResetService = require("../services/passwordResetService");

const setDb = (database) => {
  passwordResetService.setDb(database);
};

const setEmailService = (emailService) => {
  passwordResetService.setEmailService(emailService);
};

/**
 * Solicitar restablecimiento de contraseña
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await passwordResetService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error en requestPasswordReset controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Error interno del servidor al solicitar restablecimiento",
    });
  }
};

/**
 * Verificar token de restablecimiento
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await passwordResetService.verifyResetToken(token);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        userId: result.userId,
        email: result.email,
      },
    });
  } catch (error) {
    console.error("Error en verifyResetToken controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error interno del servidor al verificar token",
    });
  }
};

/**
 * Restablecer contraseña con token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const result = await passwordResetService.resetPasswordWithToken(
      token,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error en resetPassword controller:", error);
    res.status(error.status || 500).json({
      success: false,
      message:
        error.message || "Error interno del servidor al restablecer contraseña",
    });
  }
};

module.exports = {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  setDb,
  setEmailService,
};
