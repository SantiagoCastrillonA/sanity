-- #############################################
-- # Script de Creación de Base de Datos Sanity #
-- # Versión: 1.0                              #
-- # Fecha: 16 de Junio de 2025                #
-- # Autor: Sanity Scrum Master                #
-- #############################################

-- 1. Eliminar la base de datos si ya existe (útil para reinicios limpios en desarrollo)
DROP DATABASE IF EXISTS Sanity;

-- 2. Crear la base de datos
CREATE DATABASE Sanity
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 3. Usar la base de datos recién creada
USE Sanity;

-- 4. Creación de la tabla 'users' (Usuarios)
-- Almacena la información de los usuarios de la aplicación
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, -- Nombre de usuario único
    email VARCHAR(100) NOT NULL UNIQUE,   -- Correo electrónico único
    password_hash VARCHAR(255) NOT NULL,  -- Hash de la contraseña (NUNCA almacenar contraseñas en texto plano)
    full_name VARCHAR(100),               -- Nombre completo del usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- 5. Creación de la tabla 'journal_entries' (Entradas del Diario)
-- Almacena las entradas del diario de cada usuario
CREATE TABLE journal_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                  -- Clave foránea al usuario que escribió la entrada
    entry_date DATE NOT NULL DEFAULT (CURRENT_DATE), -- Fecha de la entrada del diario
    title VARCHAR(255),                    -- Título opcional de la entrada
    content TEXT NOT NULL,                 -- Contenido principal de la entrada del diario
    emotion_tags VARCHAR(255),             -- Etiquetas de emociones (ej. "feliz,triste,ansioso")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Si se elimina un usuario, se eliminan sus entradas
);

-- 6. Creación de la tabla 'chatbot_interactions' (Interacciones con el Chatbot)
-- Almacena el historial de conversaciones con el chatbot
CREATE TABLE chatbot_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                  -- Clave foránea al usuario
    interaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Momento de la interacción
    user_message TEXT NOT NULL,            -- Mensaje del usuario
    bot_response TEXT NOT NULL,            -- Respuesta del chatbot
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Creación de la tabla 'emergency_contacts' (Contactos de Emergencia)
-- Almacena los contactos que el usuario quiere notificar en caso de emergencia
CREATE TABLE emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                  -- Clave foránea al usuario
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),             -- Número de teléfono
    contact_email VARCHAR(100),            -- Correo electrónico
    relationship VARCHAR(50),              -- Relación (ej. "Madre", "Amigo")
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- #############################################
-- #           Datos de Prueba (Opcional)      #
-- #############################################

-- Insertar un usuario de prueba (contraseña 'password123' hasheada para ejemplo)
-- En una aplicación real, el hash se generaría en el backend.
INSERT INTO users (username, email, password_hash, full_name) VALUES
('testuser', 'test@example.com', '$2a$10$fVq... (reemplazar con un hash real)', 'Usuario de Prueba Sanity');

-- Insertar una entrada de diario para el usuario de prueba
INSERT INTO journal_entries (user_id, entry_date, title, content, emotion_tags) VALUES
(1, '2025-06-15', 'Primer día en Sanity', 'Hoy me sentí muy animado al empezar este proyecto. Creo que será un gran éxito.', 'animado,optimista');

-- Insertar una interacción de chatbot para el usuario de prueba
INSERT INTO chatbot_interactions (user_id, user_message, bot_response) VALUES
(1, 'Hola, me siento un poco estresado hoy.', 'Hola, lamento escuchar eso. ¿Hay algo específico que te esté causando estrés?');

-- Insertar un contacto de emergencia para el usuario de prueba
INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, contact_email, relationship) VALUES
(1, 'Mamá', '3101234567', 'mama@example.com', 'Madre');