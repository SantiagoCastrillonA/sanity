const bcrypt = require("bcryptjs");

let db = null;

const setDb = (database) => {
  db = database;
};

/**
 * Obtener perfil de usuario por ID
 * @param {number} userId - ID del usuario
 * @returns {Object} - Datos del perfil del usuario
 */
const getUserProfile = async (userId) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    const user = await db.User.findByPk(userId, {
      attributes: [
        "id",
        "email",
        "full_name",
        "profile_pick",
        "accountType",
        "verify_email",
        "document",
        "phone",
        "emergency_contact_name",
        "emergency_contact_phone",
        "created_at",
        "updated_at",
      ],
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return {
      success: true,
      message: "Perfil obtenido exitosamente",
      user: user.toJSON(),
    };
  } catch (error) {
    console.error("Error en getUserProfile service:", error);
    throw error;
  }
};

/**
 * Actualizar perfil de usuario
 * @param {number} userId - ID del usuario
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Usuario actualizado
 */
const updateUserProfile = async (userId, updateData) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    // Campos permitidos para actualizar
    const allowedFields = [
      "full_name",
      "profile_pick",
      "document",
      "phone",
      "emergency_contact_name",
      "emergency_contact_phone",
    ];

    // Filtrar solo los campos permitidos
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    // Validar que hay datos para actualizar
    if (Object.keys(filteredData).length === 0) {
      const error = new Error("No hay datos válidos para actualizar");
      error.status = 400;
      throw error;
    }

    // Buscar el usuario
    const user = await db.User.findByPk(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    // Validar documento único si se está actualizando
    if (filteredData.document && filteredData.document !== user.document) {
      const existingUser = await db.User.findOne({
        where: { document: filteredData.document },
      });
      if (existingUser) {
        const error = new Error(
          "El documento ya está registrado por otro usuario"
        );
        error.status = 400;
        throw error;
      }
    }

    // Actualizar usuario
    await user.update(filteredData);

    // Obtener usuario actualizado sin datos sensibles
    const updatedUser = await db.User.findByPk(userId, {
      attributes: [
        "id",
        "email",
        "full_name",
        "profile_pick",
        "accountType",
        "verify_email",
        "document",
        "phone",
        "emergency_contact_name",
        "emergency_contact_phone",
        "created_at",
        "updated_at",
      ],
    });

    return {
      success: true,
      message: "Perfil actualizado exitosamente",
      user: updatedUser.toJSON(),
    };
  } catch (error) {
    console.error("Error en updateUserProfile service:", error);
    throw error;
  }
};

/**
 * Cambiar contraseña del usuario
 * @param {number} userId - ID del usuario
 * @param {Object} passwordData - Datos de la contraseña
 * @returns {Object} - Resultado de la operación
 */
const changePassword = async (userId, passwordData) => {
  try {
    if (!db) {
      throw new Error("Base de datos no inicializada");
    }

    const { currentPassword, newPassword } = passwordData;

    // Validar datos requeridos
    if (!currentPassword || !newPassword) {
      const error = new Error(
        "Contraseña actual y nueva contraseña son requeridas"
      );
      error.status = 400;
      throw error;
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      const error = new Error(
        "La nueva contraseña debe tener al menos 6 caracteres"
      );
      error.status = 400;
      throw error;
    }

    // Buscar usuario
    const user = await db.User.findByPk(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    // Verificar que el usuario tenga contraseña (no sea usuario de Google)
    if (!user.password) {
      const error = new Error(
        "Usuario registrado con Google no puede cambiar contraseña"
      );
      error.status = 400;
      throw error;
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      const error = new Error("Contraseña actual incorrecta");
      error.status = 400;
      throw error;
    }

    // Encriptar nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await user.update({ password: hashedNewPassword });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error en changePassword service:", error);
    throw error;
  }
};

module.exports = {
  setDb,
  getUserProfile,
  updateUserProfile,
  changePassword,
};
