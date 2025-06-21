// index.js
require("dotenv").config();
const express = require("express");
const sequelize = require("./config/sequelize");

const authRoutes = require("./routes/auth");
// ejemplo de ruta protegida:
const protectedRoutes = require("./routes/protected");

const app = express();
app.use(express.json());

// Rutas - VERIFICAR ESTAS LÍNEAS
app.use("/auth", authRoutes); // ← Debe ser /auth, NO /api/auth
app.use("/api", protectedRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("✅ DB conectada");
    app.listen(process.env.PORT || 3001, () =>
      console.log(
        `🚀 Servidor corriendo en http://localhost:${process.env.PORT || 3001}`
      )
    );
  })
  .catch((err) => console.error("❌ Error conectando a la DB:", err));
