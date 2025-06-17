const express = require("express");
const { User, DiaryEntry, Activity, sequelize } = require("../models");
const router = express.Router();

// Obtener todas las entradas del diario de un usuario
router.get("/diary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await DiaryEntry.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
      ],
      order: [["entry_date", "DESC"]],
    });

    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error obteniendo entradas del diario:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Crear nueva entrada del diario
router.post("/diary", async (req, res) => {
  try {
    const { user_id, content, emotion_detected, mood_score, ai_response } =
      req.body;

    const newEntry = await DiaryEntry.create({
      user_id,
      content,
      emotion_detected,
      mood_score,
      ai_response,
      entry_date: new Date(),
    });

    res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (error) {
    console.error("Error creando entrada del diario:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Obtener actividades recomendadas por emoción
router.get("/activities/recommended/:emotion", async (req, res) => {
  try {
    const { emotion } = req.params;

    const activities = await Activity.findAll({
      where: {
        is_active: true,
      },
      // Filtrar actividades que incluyan la emoción en recommended_emotions
      having: sequelize.literal(
        `JSON_CONTAINS(recommended_emotions, '"${emotion}"')`
      ),
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error obteniendo actividades:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Obtener todas las actividades
router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { is_active: true },
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error obteniendo actividades:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
