const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./models/index");
require("dotenv").config();


// Importar rutas
const userRoutes = require("./routes/userRoutes");


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origin (como Postman) o desde orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);


// Middleware
app.use(express.json());

// Registrar rutas
app.use("/api/users", userRoutes);

// Función para inicializar la base de datos
const startServer = async () => {
  try {

    const db = await initializeDatabase();

    // Inyectar la instancia de la base de datos en los controladores y servicios
    const loginGoogleController = require('./controllers/loginGoogleController');
    const registerGoogleController = require('./controllers/registerGoogleController');
    const loginGoogleService = require('./services/loginGoogleService');
    const registerGoogleService = require('./services/registerGoogleService');

    loginGoogleController.setDb(db);
    registerGoogleController.setDb(db);
    loginGoogleService.setDb(db);
    registerGoogleService.setDb(db);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log("🚀 Servidor corriendo en el puerto", PORT);
    });
  } catch (error) {
    console.error("❌ Error inicializando la base de datos:", error);
    process.exit(1);
  }
};

startServer();
