const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar Sequelize y modelos
const { testConnection, syncDatabase } = require("./models");

// Importar rutas
const userRoutes = require("./routes/userRoutes");

// Importar controladores
const { setDb: setLoginDb } = require('./controllers/loginGoogleController');
const { setDb: setRegisterDb } = require('./controllers/registerGoogleController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Registrar rutas
app.use("/api/users", userRoutes);

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

    console.log("🚀 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error inicializando la base de datos:", error);
    process.exit(1);
  }
};


app.listen(PORT, async () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  const dbInstance = await initializeDatabase();
  setLoginDb(dbInstance);
  setRegisterDb(dbInstance);
});

module.exports = app;
