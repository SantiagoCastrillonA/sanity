const { Activity } = require("../models");

const seedActivities = async () => {
  try {
    const activities = [
      {
        name: "Meditación Mindfulness",
        description:
          "Práctica de meditación consciente para reducir el estrés y la ansiedad",
        category: "Relajación",
        duration_minutes: 15,
        difficulty_level: "easy",
        recommended_emotions: ["ansiedad", "estres", "preocupacion"],
        instructions:
          "1. Siéntate cómodamente\n2. Cierra los ojos\n3. Respira profundamente\n4. Observa tus pensamientos sin juzgar",
        is_active: true,
      },
      {
        name: "Ejercicio Físico",
        description: "Actividad física moderada para liberar endorfinas",
        category: "Actividad Física",
        duration_minutes: 30,
        difficulty_level: "medium",
        recommended_emotions: ["tristeza", "depresion", "baja_energia"],
        instructions:
          "1. Elige una actividad que disfrutes\n2. Comienza lentamente\n3. Mantén un ritmo constante\n4. Escucha a tu cuerpo",
        is_active: true,
      },
      {
        name: "Escritura Reflexiva",
        description: "Escribir sobre tus pensamientos y sentimientos",
        category: "Autoconocimiento",
        duration_minutes: 20,
        difficulty_level: "easy",
        recommended_emotions: ["confusion", "tristeza", "estres"],
        instructions:
          "1. Busca un lugar tranquilo\n2. Escribe sin censurarte\n3. Explora tus emociones\n4. No te preocupes por la gramática",
        is_active: true,
      },
      {
        name: "Respiración Profunda",
        description: "Técnica de respiración para calmar la mente",
        category: "Relajación",
        duration_minutes: 10,
        difficulty_level: "easy",
        recommended_emotions: ["ansiedad", "estres", "panico"],
        instructions:
          "1. Inhala por 4 segundos\n2. Mantén por 4 segundos\n3. Exhala por 6 segundos\n4. Repite 10 veces",
        is_active: true,
      },
      {
        name: "Contacto Social",
        description: "Conectar con amigos o familiares",
        category: "Social",
        duration_minutes: 60,
        difficulty_level: "medium",
        recommended_emotions: ["soledad", "tristeza", "aislamiento"],
        instructions:
          "1. Identifica a alguien de confianza\n2. Inicia una conversación\n3. Comparte cómo te sientes\n4. Escucha activamente",
        is_active: true,
      },
      {
        name: "Música Relajante",
        description: "Escuchar música que te tranquilice",
        category: "Entretenimiento",
        duration_minutes: 25,
        difficulty_level: "easy",
        recommended_emotions: ["estres", "ansiedad", "agitacion"],
        instructions:
          "1. Elige música instrumental o clásica\n2. Usa auriculares si es posible\n3. Cierra los ojos y concéntrate\n4. Deja que la música te lleve",
        is_active: true,
      },
    ];

    // Verificar si ya existen actividades
    const existingActivities = await Activity.findAll();

    if (existingActivities.length === 0) {
      await Activity.bulkCreate(activities);
      console.log("✅ Actividades creadas exitosamente");
    } else {
      console.log("ℹ️  Las actividades ya existen en la base de datos");
    }
  } catch (error) {
    console.error("❌ Error creando actividades:", error);
  }
};

module.exports = { seedActivities };
