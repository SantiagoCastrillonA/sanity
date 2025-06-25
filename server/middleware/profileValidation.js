const validateProfileUpdate = (req, res, next) => {
  const {
    full_name,
    document,
    phone,
    emergency_contact_name,
    emergency_contact_phone,
  } = req.body;
  const errors = [];

  // Validar nombre completo
  if (full_name !== undefined) {
    if (typeof full_name !== "string" || full_name.trim().length === 0) {
      errors.push("El nombre completo no puede estar vacío");
    } else if (full_name.trim().length > 200) {
      errors.push("El nombre completo no puede exceder 200 caracteres");
    }
  }

  // Validar documento
  if (document !== undefined) {
    if (typeof document !== "string" || document.trim().length === 0) {
      errors.push("El documento no puede estar vacío");
    } else if (document.trim().length > 15) {
      errors.push("El documento no puede exceder 15 caracteres");
    } else if (!/^[0-9]+$/.test(document.trim())) {
      errors.push("El documento solo puede contener números");
    }
  }

  // Validar teléfono
  if (phone !== undefined) {
    if (typeof phone !== "string" || phone.trim().length === 0) {
      errors.push("El teléfono no puede estar vacío");
    } else if (phone.trim().length > 20) {
      errors.push("El teléfono no puede exceder 20 caracteres");
    } else if (!/^[0-9+\-\s()]+$/.test(phone.trim())) {
      errors.push("El teléfono contiene caracteres inválidos");
    }
  }

  // Validar nombre de contacto de emergencia
  if (emergency_contact_name !== undefined) {
    if (
      typeof emergency_contact_name !== "string" ||
      emergency_contact_name.trim().length === 0
    ) {
      errors.push("El nombre del contacto de emergencia no puede estar vacío");
    } else if (emergency_contact_name.trim().length > 100) {
      errors.push(
        "El nombre del contacto de emergencia no puede exceder 100 caracteres"
      );
    }
  }

  // Validar teléfono de contacto de emergencia
  if (emergency_contact_phone !== undefined) {
    if (
      typeof emergency_contact_phone !== "string" ||
      emergency_contact_phone.trim().length === 0
    ) {
      errors.push(
        "El teléfono del contacto de emergencia no puede estar vacío"
      );
    } else if (emergency_contact_phone.trim().length > 20) {
      errors.push(
        "El teléfono del contacto de emergencia no puede exceder 20 caracteres"
      );
    } else if (!/^[0-9+\-\s()]+$/.test(emergency_contact_phone.trim())) {
      errors.push(
        "El teléfono del contacto de emergencia contiene caracteres inválidos"
      );
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

const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  // Validar contraseña actual
  if (
    !currentPassword ||
    typeof currentPassword !== "string" ||
    currentPassword.trim().length === 0
  ) {
    errors.push("La contraseña actual es requerida");
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

  // Validar que las contraseñas sean diferentes
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push("La nueva contraseña debe ser diferente a la actual");
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
  validateProfileUpdate,
  validatePasswordChange,
};
