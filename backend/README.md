# Backend REST API - Plataforma de Cursos

Backend simulado con JSON Server que incluye autenticación, autorización por roles y permisos granulares.

## 🚀 Instalación

```bash
cd backend
npm install
```

## 📦 Scripts Disponibles

```bash
# Generar datos falsos y poblar db.json
npm run seed

# Iniciar servidor en modo desarrollo (con nodemon)
npm run dev

# Iniciar servidor en modo producción
npm start
```

## 🏃 Quick Start

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Generar datos de prueba:**
   ```bash
   npm run seed
   ```

3. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

El servidor estará disponible en: `http://localhost:5000`

## 🔐 Autenticación y Autorización

### Sistema de Roles

El sistema cuenta con 7 roles predefinidos:

1. **Super Administrador** - Acceso total al sistema
2. **Administrador** - Gestión de usuarios, cursos, exámenes y eventos
3. **Instructor** - Creación y edición de cursos y exámenes
4. **Coordinador** - Gestión de eventos y reportes
5. **Estudiante Premium** - Acceso a cursos premium y eventos especiales
6. **Estudiante** - Acceso básico a cursos y exámenes
7. **Invitado** - Solo lectura de cursos

### Headers Requeridos

Para operaciones que modifican datos (POST, PUT, PATCH, DELETE), debes incluir:

```
x-role-id: 1
x-user-id: 1
```

### Ejemplo de Login

```bash
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "admin@cursos.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "nombre": "Admin Principal",
    "email": "admin@cursos.com",
    "rolId": 1,
    "rol": "Super Administrador",
    "permisos": ["crear_usuario", "editar_usuario", ...]
  },
  "token": "Bearer MTox"
}
```

## 📚 Endpoints Principales

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `GET /auth/permisos` - Obtener permisos del rol actual
- `GET /auth/modulos` - Obtener módulos accesibles

### Recursos

- `GET /roles` - Listar roles
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario (requiere permiso `crear_usuario`)
- `PUT /usuarios/:id` - Actualizar usuario (requiere permiso `editar_usuario`)
- `DELETE /usuarios/:id` - Eliminar usuario (requiere permiso `eliminar_usuario`)

- `GET /cursos` - Listar cursos
- `POST /cursos` - Crear curso (requiere permiso `crear_curso`)
- `PUT /cursos/:id` - Actualizar curso (requiere permiso `editar_curso`)
- `DELETE /cursos/:id` - Eliminar curso (requiere permiso `eliminar_curso`)

- `GET /examenes` - Listar exámenes
- `POST /examenes` - Crear examen (requiere permiso `crear_examen`)

- `GET /eventos` - Listar eventos
- `POST /eventos` - Crear evento (requiere permiso `crear_evento`)

- `GET /areas` - Listar áreas
- `GET /modulos` - Listar módulos
- `GET /notificaciones` - Listar notificaciones

## 🔒 Permisos Disponibles

```
crear_usuario, editar_usuario, eliminar_usuario, ver_usuarios
crear_curso, editar_curso, eliminar_curso, ver_cursos
crear_examen, editar_examen, eliminar_examen, ver_examenes
crear_evento, editar_evento, eliminar_evento, ver_eventos
ver_reportes
gestionar_roles
gestionar_areas
gestionar_notificaciones
gestionar_fotos
gestionar_cupones
gestionar_fidelizacion
```

## 📖 Ejemplos de Uso

### Crear un curso (como Instructor)

```bash
POST http://localhost:5000/cursos
Content-Type: application/json
x-role-id: 3
x-user-id: 3

{
  "titulo": "Introducción a la Metalurgia",
  "descripcion": "Curso básico de metalurgia",
  "areaId": 1,
  "nivel": "Básico",
  "duracion": 40,
  "precio": 150,
  "instructor": "María González"
}
```

### Intentar eliminar usuario sin permisos

```bash
DELETE http://localhost:5000/usuarios/5
x-role-id: 3
x-user-id: 3
```

**Respuesta (403):**
```json
{
  "error": "Permiso denegado",
  "message": "No tienes permiso para realizar esta acción. Se requiere: eliminar_usuario",
  "rol": "Instructor",
  "permisosActuales": ["ver_usuarios", "crear_curso", ...]
}
```

## 🗂️ Estructura del Proyecto

```
backend/
├── db.json           # Base de datos JSON
├── server.js         # Servidor con middlewares personalizados
├── seed.js           # Script para generar datos falsos
├── package.json      # Dependencias y scripts
└── README.md         # Documentación
```

## 🛠️ Tecnologías

- **json-server** - Servidor REST rápido
- **@faker-js/faker** - Generación de datos falsos
- **axios** - Cliente HTTP
- **nodemon** - Auto-restart en desarrollo

## 📝 Usuarios de Prueba

Después de ejecutar `npm run seed`, puedes usar estos usuarios:

- **Admin:** admin@cursos.com / admin123 (rolId: 1)
- Consulta `db.json` para ver más usuarios generados

## 🔧 Personalización

### Agregar un nuevo permiso

1. Edita el array de `permisos` en el rol correspondiente en `seed.js`
2. Agrega la validación en `server.js` en el objeto `permisosPorRuta`
3. Ejecuta `npm run seed` para regenerar la base de datos

### Agregar un nuevo módulo

Edita el array `modulos` en `seed.js` y especifica los `accesoRoles`.

## 🐛 Troubleshooting

**Puerto 5000 ocupado:**
```bash
PORT=3001 npm run dev
```

**Base de datos vacía:**
```bash
npm run seed
```

## 📄 Licencia

ISC
