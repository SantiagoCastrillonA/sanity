const verifyEmailService = require('../services/verifyEmailService');

const setDb = (database) => {
  verifyEmailService.setDb(database);
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await verifyEmailService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user
    });
  } catch (error) {
    console.error('Error en verifyEmail controller:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al verificar el correo'
    });
  }
};

module.exports = { verifyEmail, setDb }; 