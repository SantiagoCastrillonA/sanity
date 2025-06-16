const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar Sequelize y modelos
const { testConnection, syncDatabase } = require("./models");
// Importar rutas
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "Servidor del Diario Emocional funcionando correctamente",
  });
});

// Ruta para probar la conexión a la base de datos
app.get("/api/test-db", async (req, res) => {
  try {
    const { sequelize } = require("./models");
    await sequelize.authenticate();
    res.json({
      message: "Conexión a la base de datos exitosa con Sequelize",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos",
      details: error.message,
    });
  }
});

// Usar las rutas de la API
app.use("/api", apiRoutes);

// Funciones auxiliares (simplificadas por ahora)
function analyzeEmotion(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("triste") ||
    lowerMessage.includes("deprimido") ||
    lowerMessage.includes("mal")
  ) {
    return "tristeza";
  } else if (
    lowerMessage.includes("feliz") ||
    lowerMessage.includes("alegre") ||
    lowerMessage.includes("bien")
  ) {
    return "alegría";
  } else if (
    lowerMessage.includes("enojado") ||
    lowerMessage.includes("molesto") ||
    lowerMessage.includes("furioso")
  ) {
    return "ira";
  } else if (
    lowerMessage.includes("nervioso") ||
    lowerMessage.includes("ansioso") ||
    lowerMessage.includes("preocupado")
  ) {
    return "ansiedad";
  } else {
    return "neutral";
  }
}

function generateEmotionalResponse(emotion) {
  const responses = {
    tristeza:
      "Entiendo que te sientes triste. Es normal tener estos momentos. ¿Te gustaría hablar más sobre lo que te está afectando?",
    alegría:
      "¡Qué maravilloso que te sientas bien! Es importante celebrar estos momentos positivos. ¿Qué te está haciendo sentir así?",
    ira: "Veo que estás pasando por un momento de frustración. Respirar profundo puede ayudar. ¿Quieres contarme qué te está molestando?",
    ansiedad:
      "La ansiedad puede ser muy abrumadora. Recuerda que estoy aquí para apoyarte. ¿Hay algo específico que te preocupa?",
    neutral:
      "Gracias por compartir conmigo. ¿Hay algo en particular de lo que te gustaría hablar hoy?",
  };

  return responses[emotion] || responses.neutral;
}

function getRecommendedActivities(emotion) {
  const activities = {
    tristeza: [
      "Escuchar música relajante",
      "Hacer una caminata al aire libre",
      "Escribir en tu diario personal",
      "Llamar a un amigo cercano",
    ],
    alegría: [
      "Compartir tu alegría con alguien",
      "Hacer ejercicio",
      "Crear algo artístico",
      "Planificar algo divertido",
    ],
    ira: [
      "Hacer ejercicio intenso",
      "Practicar respiración profunda",
      "Escribir sobre tus sentimientos",
      "Escuchar música calmante",
    ],
    ansiedad: [
      "Practicar meditación",
      "Hacer ejercicios de respiración",
      "Organizar tu espacio",
      "Tomar un baño relajante",
    ],
    neutral: [
      "Leer un libro",
      "Hacer ejercicio ligero",
      "Escuchar un podcast",
      "Practicar un hobby",
    ],
  };

  return activities[emotion] || activities.neutral;
}

app.listen(PORT, async () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  await initializeDatabase();
});

module.exports = app;
