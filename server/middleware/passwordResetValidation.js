const validatePasswordResetRequest = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  // Validar email
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("El email es requerido");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("El email no tiene un formato válido");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validateResetToken = (req, res, next) => {
  const { token } = req.query;
  const errors = [];

  // Validar token
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    errors.push("Token de restablecimiento es requerido");
  } else if (token.length !== 64) {
    // crypto.randomBytes(32).toString('hex') genera 64 caracteres
    errors.push("Token de restablecimiento inválido");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;
  const errors = [];

  // Validar token
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    errors.push("Token de restablecimiento es requerido");
  } else if (token.length !== 64) {
    errors.push("Token de restablecimiento inválido");
  }

  // Validar nueva contraseña
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.trim().length === 0
  ) {
    errors.push("La nueva contraseña es requerida");
  } else if (newPassword.length < 6) {
    errors.push("La nueva contraseña debe tener al menos 6 caracteres");
  } else if (newPassword.length > 255) {
    errors.push("La nueva contraseña no puede exceder 255 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

module.exports = {
  validatePasswordResetRequest,
  validateResetToken,
  validatePasswordReset,
};
