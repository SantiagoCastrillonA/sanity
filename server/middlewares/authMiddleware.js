// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, username, email, iat, exp }
    next();
  } catch (e) {
    console.error("JWT error:", e);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}

module.exports = authMiddleware;
