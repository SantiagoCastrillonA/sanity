# 🌟 Diario Emocional con IA

Una plataforma innovadora diseñada para apoyar el bienestar emocional de los usuarios a través de un diario interactivo con inteligencia artificial.

## 📋 Descripción

Este software ofrece una plataforma completa que permite a las personas expresar sus emociones mediante un chat inteligente que:

- 🤖 **Análisis emocional con IA**: Identifica y responde según las emociones detectadas
- 📝 **Diario personal**: Registro de pensamientos y sentimientos
- 🎯 **Actividades recomendadas**: Sugerencias personalizadas para mejorar el estado de ánimo
- 🆘 **Sistema de emergencia**: Contacto directo con personas de confianza o líneas de ayuda
- 📊 **Seguimiento del bienestar**: Monitoreo del progreso emocional a largo plazo

## 🏗️ Arquitectura del Proyecto

```
sanity/
├── client/          # Frontend - React con Vite
│   ├── src/
│   ├── public/
│   └── package.json
└── server/          # Backend - Node.js con Express
    ├── config/      # Configuración de base de datos
    ├── models/      # Modelos de Sequelize
    ├── routes/      # Rutas de la API
    ├── seeders/     # Datos de ejemplo
    └── package.json
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React** - Biblioteca de JavaScript para interfaces de usuario
- **Tailwind CSS** - Framework de utilidades CSS para diseño rápido y consistente

### Backend

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **Sequelize** - ORM para Node.js
- **MySQL** - Base de datos relacional
- **dotenv** - Gestión de variables de entorno
- **CORS** - Habilitación de recursos cruzados

## 📊 Base de Datos

### Modelos principales:

- **Users**: Información de usuarios y contactos de emergencia
- **DiaryEntries**: Entradas del diario con análisis emocional
- **Activities**: Actividades terapéuticas recomendadas
- **EmergencyLogs**: Registro de eventos de emergencia

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sanity
```

### 2. Configurar el Backend

```bash
cd server
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en el directorio `server/`:

```env
# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sanity
DB_PORT=3306

# Configuración del servidor
PORT=3001
NODE_ENV=development
```

### 4. Configurar la base de datos

1. Crear la base de datos en MySQL:

```sql
CREATE DATABASE sanity;
```

2. El servidor creará automáticamente las tablas al iniciar

### 5. Iniciar el servidor backend

```bash
cd server
npm run dev
```

El servidor estará disponible en: `http://localhost:3001`

### 6. Configurar el Frontend

```bash
cd client
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🔧 Scripts Disponibles

### Backend (server/)

- `npm run dev` - Inicia el servidor
- `npm run dev` - Inicia el servidor en modo desarrollo (con nodemon)

### Frontend (client/)

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 📡 API Endpoints

### Diario

- `GET /api/diary/:userId` - Obtener entradas del diario de un usuario
- `POST /api/diary` - Crear nueva entrada del diario

### Actividades

- `GET /api/activities` - Obtener todas las actividades
- `GET /api/activities/recommended/:emotion` - Actividades por emoción

### Sistema

- `GET /api/test-db` - Probar conexión a la base de datos

## 🎯 Funcionalidades Principales

### 1. Chat Emocional

- Análisis de sentimientos en tiempo real
- Respuestas personalizadas según el estado emocional
- Historial de conversaciones

### 2. Diario Personal

- Registro de pensamientos y emociones
- Puntuación del estado de ánimo
- Seguimiento temporal del bienestar

### 3. Actividades Terapéuticas

- Recomendaciones basadas en emociones detectadas
- Categorías: Relajación, Actividad Física, Social, etc.
- Instrucciones detalladas para cada actividad

### 4. Sistema de Emergencia

- Botón de pánico
- Contacto automático con personas de confianza
- Registro de eventos críticos

## 🔒 Seguridad y Privacidad

- Todas las conversaciones se almacenan de forma segura
- Encriptación de datos sensibles
- Cumplimiento con regulaciones de privacidad
- Acceso controlado a información personal

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, por favor abre un issue en el repositorio.

## 🙏 Agradecimientos

- A los profesionales de la salud mental que inspiraron este proyecto
- A la comunidad de desarrolladores por las herramientas utilizadas
- A todos los contribuidores que hacen posible este proyecto

---

**⚠️ Nota Importante**: Esta aplicación es una herramienta de apoyo y no reemplaza la atención profesional de salud mental. En caso de crisis, contacta inmediatamente a los servicios de emergencia locales.

**Líneas de ayuda en Colombia:**

- Línea 106: Línea de atención en crisis
- Línea 123: Línea de emergencias
- Teléfono de la Esperanza: (01) 244 2845
