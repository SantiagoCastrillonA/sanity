const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sanity",
  port: process.env.DB_PORT || 3306,
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    process.exit(1);
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "Servidor del Diario Emocional funcionando correctamente",
  });
});

// Ruta para probar la conexión a la base de datos
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 as result", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json({
      message: "Conexión a la base de datos exitosa",
      result: results[0].result,
    });
  });
});

// Rutas para el diario emocional
app.post("/api/analyze-emotion", (req, res) => {
  const { message, userId } = req.body;

  // Aquí implementarás la lógica de análisis emocional con IA
  // Por ahora, una respuesta simple
  const emotion = analyzeEmotion(message);

  // Guardar en la base de datos
  const query =
    "INSERT INTO diary_entries (user_id, message, emotion, created_at) VALUES (?, ?, ?, NOW())";
  db.query(query, [userId || 1, message, emotion], (err, result) => {
    if (err) {
      console.error("Error guardando entrada del diario:", err);
      return res.status(500).json({ error: "Error guardando entrada" });
    }

    const response = generateEmotionalResponse(emotion);
    res.json({
      response,
      emotion,
      activities: getRecommendedActivities(emotion),
      entryId: result.insertId,
    });
  });
});

// Ruta para obtener entradas del diario
app.get("/api/diary-entries/:userId", (req, res) => {
  const { userId } = req.params;

  const query =
    "SELECT * FROM diary_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 20";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo entradas" });
    }
    res.json(results);
  });
});

// Ruta para contacto de emergencia
app.post("/api/emergency-contact", (req, res) => {
  const { userId } = req.body;

  // Registrar la emergencia
  const query =
    "INSERT INTO emergency_contacts (user_id, contacted_at) VALUES (?, NOW())";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error registrando emergencia:", err);
    }
  });

  res.json({
    message: "Contacto de emergencia activado",
    emergencyNumbers: [
      { name: "Línea de Crisis", number: "106" },
      { name: "Emergencias", number: "123" },
    ],
  });
});

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;
