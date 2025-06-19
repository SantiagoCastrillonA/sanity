const express = require("express");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/profile", auth, (req, res) => {
  // req.user viene del token
  res.json({ message: "Ruta protegida", user: req.user });
});

module.exports = router;
