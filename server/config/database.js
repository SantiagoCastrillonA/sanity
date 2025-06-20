const mysql = require("mysql2/promise");

// Datos de conexión (ajústalos según tu configuración)
const DB_NAME = process.env.DB_NAME || "Sanity";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306; // Puerto por defecto de MySQL
const DB_URL = process.env.DB_URL;

async function createDatabaseIfNotExists() {
  try {
    // Conectar a MySQL sin seleccionar una base de datos específica
    const connection = await mysql.createConnection({
      host: DB_HOST, 
      user: DB_USER, 
      password: DB_PASSWORD, 
    });

    // Crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    console.log(`✅ Base de datos "${DB_NAME}" verificada o creada.`);

    await connection.end();
  } catch (error) {
    console.error("❌ Error al verificar/crear la base de datos:", error);
    process.exit(1); // Detener el proceso si hay error
  }
}

module.exports =createDatabaseIfNotExists ;