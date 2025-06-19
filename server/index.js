const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar Sequelize y modelos
const { testConnection, syncDatabase } = require("./models");
// Importar rutas
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Sanity funcionando",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      api: "/api",
    },
  });
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    await testConnection();
    await syncDatabase(false); // false para no recrear las tablas

    // Ejecutar seeders solo en desarrollo
    if (process.env.NODE_ENV !== "production") {
      const { seedActivities } = require("./seeders/activitySeeder");
      await seedActivities();
    }
  } catch (error) {
    console.error("Error inicializando la base de datos:", error);
    process.exit(1);
  }
};

// Inicializar base de datos y servidor
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
});

module.exports = app;
