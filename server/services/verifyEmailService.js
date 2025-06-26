let dbInstance;

const setDb = (database) => {
  dbInstance = database;
};

const verifyEmail = async (token) => {
  if (!dbInstance || !dbInstance.User) {
    const error = new Error('El servidor no está completamente inicializado.');
    error.status = 500;
    throw error;
  }

  if (!token) {
    const error = new Error('No se proporcionó el token de verificación.');
    error.status = 400;
    throw error;
  }

  console.log('Token recibido:', token);

  // Buscar usuario por token
  const user = await dbInstance.User.findOne({ where: { token } });

  if (!user) {
    const error = new Error('El enlace de verificación es inválido o ha expirado. Solicita uno nuevo.');
    error.status = 400;
    throw error;
  }

  console.log('Token en la base de datos:', user.token);

  // Actualizar estado de verificación
  user.verify_email = true;
  user.token = null;
  await user.save();

  return {
    message: "¡Tu correo ha sido verificado exitosamente!",
    user: {
      id: user.id,
      email: user.email,
      verify_email: user.verify_email
    }
  };
};

module.exports = { verifyEmail, setDb }; 