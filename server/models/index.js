const { sequelize } = require("../config/sequelize");

// Importar modelos
const User = require("./User");
const DiaryEntry = require("./DiaryEntry");
const Activity = require("./Activity");
const EmergencyLog = require("./EmergencyLog");

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    throw error;
  }
};

// Definir asociaciones
User.hasMany(DiaryEntry, {
  foreignKey: "user_id",
  as: "diaryEntries",
});

DiaryEntry.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(EmergencyLog, {
  foreignKey: "user_id",
  as: "emergencyLogs",
});

EmergencyLog.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Función para sincronizar la base de datos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("✅ Base de datos sincronizada correctamente");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  DiaryEntry,
  Activity,
  EmergencyLog,
  syncDatabase,
  testConnection,
};
