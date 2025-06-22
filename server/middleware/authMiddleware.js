const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Obtener token de la cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sanity_app_2024_jwt_secret_key_fallback");
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      accountType: decoded.accountType
    };
    
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar si es profesional
const requireProfessional = (req, res, next) => {
  if (req.user.accountType !== 'Profesional') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere cuenta de profesional.'
    });
  }
  next();
};

// Middleware para verificar si es usuario regular
const requireUser = (req, res, next) => {
  if (req.user.accountType !== 'Usuario') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere cuenta de usuario.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireProfessional,
  requireUser
}; 