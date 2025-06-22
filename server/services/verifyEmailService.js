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
    const error = new Error('Token no proporcionado');
    error.status = 400;
    throw error;
  }

  console.log('Token recibido:', token);

  // Buscar usuario por token
  const user = await dbInstance.User.findOne({ where: { token } });

  if (!user) {
    const error = new Error('Token inválido o expirado');
    error.status = 400;
    throw error;
  }

  console.log('Token en la base de datos:', user.token);

  // Actualizar estado de verificación
  user.verify_email = true;
  user.token = null;
  await user.save();

  return {
    message: "Correo verificado con éxito",
    user: {
      id: user.id,
      email: user.email,
      verify_email: user.verify_email
    }
  };
};

module.exports = { verifyEmail, setDb }; 