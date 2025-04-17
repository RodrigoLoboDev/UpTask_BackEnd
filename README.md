# 🚀 Backend - UpTask | Administrador de Tareas

Este es el backend de **UpTask**, una aplicación web full stack MERN diseñada para la gestión de proyectos y tareas, incluyendo funcionalidades de autenticación, autorización y colaboración entre usuarios. Este servidor está construido con **Node.js**, **Express**, y utiliza **MongoDB** como base de datos principal.

## 🛠️ Tecnologías y Dependencias

- **Express**: Framework para crear el servidor web.
- **MongoDB + Mongoose**: Base de datos NoSQL y ODM para modelar los datos.
- **dotenv**: Manejo de variables de entorno.
- **cors**: Middleware para habilitar el intercambio de recursos entre dominios.
- **colors**: Mejorar la visualización en la consola.
- **bcrypt**: Encriptación de contraseñas.
- **jsonwebtoken**: Autenticación basada en tokens JWT.
- **nodemailer**: Envío de correos electrónicos para validación y recuperación.
- **express-validator**: Validaciones robustas en los endpoints.

## 🧠 Funcionalidades Principales

- Registro de usuarios con validación por email.
- Autenticación con JWT.
- Recuperación y cambio de contraseña vía email.
- Creación y gestión de proyectos.
- Gestión de tareas por proyecto.
- Notas adicionales y colaboración en proyectos.
- Middleware de protección de rutas y validación de tokens.

## 📂 Estructura del Proyecto

```bash
src/
├── config/           # Configuración de CORS, MongoDB y nodemailer
├── controllers/      # Lógica de negocio para rutas de usuarios, proyectos y tareas
├── emails/           # Plantillas de correo electrónico
├── middleware/       # Autenticación, validación y manejo de errores
├── models/           # Modelos de datos (User, Project, Task)
├── routes/           # Definición de rutas de la API
└── utils/            # Utilidades como hashing de contraseñas, generación y verificación de JWT, y token de validación

## 🚀 Cómo Empezar
1. Clona el repositorio:

```bash
git clone https://github.com/RodrigoLoboDev/UpTask_BackEnd
```
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno. Crea un archivo .env en la raíz del proyecto con los siguientes valores (ajústalos según tu entorno):

```bash
DATABASE_URL=
FRONTEND_URL=

# NODEMAILER
NODEMAILER_HOST=
NODEMAILER_PORT=
NODEMAILER_USER=
NODEMAILER_PASS=

# JSON WEB TOKEN
JWT_SECRET=
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## 📫 Endpoints Principales

### 🔐 Autenticación

- `POST /api/auth/create-account` → Crear cuenta de usuario
- `POST /api/auth/confirm-account` → Confirmar cuenta con token
- `POST /api/auth/login` → Iniciar sesión con email y contraseña
- `POST /api/auth/request-new-code` → Reenviar código de confirmación
- `POST /api/auth/request-password-reset` → Solicitar restablecimiento de contraseña (envía un token por email)
- `POST /api/auth/validate-token-password-reset` → Validar token de restablecimiento de contraseña
- `POST /api/auth/reset-password/:token` → Actualizar contraseña
- `GET /api/auth/user` → Obtener los datos del usuario autenticado

### 📁 Proyectos

- `POST /api/projects` → Crear nuevo proyecto
- `GET /api/projects` → Obtener todos los proyectos del usuario autenticado
- `GET /api/projects/:id` → Obtener un proyecto por su ID
- `PUT /api/projects/:id` → Actualizar un proyecto por su ID
- `DELETE /api/projects/:id` → Eliminar un proyecto por su ID

### ✅ Tareas

- `POST /api/projects/:projectId/tasks` → Crear una nueva tarea en un proyecto
- `GET /api/projects/:projectId/tasks` → Obtener todas las tareas de un proyecto
- `GET /api/projects/:projectId/tasks/:taskId` → Obtener una tarea específica
- `PUT /api/projects/:projectId/tasks/:taskId` → Actualizar una tarea
- `DELETE /api/projects/:projectId/tasks/:taskId` → Eliminar una tarea


## 🤝 Contribuciones
Las contribuciones son bienvenidas. Si tienes ideas para mejorar el proyecto, no dudes en abrir un issue o hacer un pull request.

## 📧 Contacto
- Email: rolobo2812@gmail.com
- LinkedIn: [Jesús Luis Rodrigo Lobo](https://www.linkedin.com/in/jes%C3%BAs-luis-rodrigo-lobo-6594a81b4/)
- GitHub: [RodrigoLoboDev](https://github.com/RodrigoLoboDev)

#### ⭐️ Si te gusta lo que hago, no dudes en seguirme y contribuir a mis proyectos. ⭐️