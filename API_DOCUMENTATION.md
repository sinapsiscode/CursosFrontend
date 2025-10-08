# API Documentation - Sistema de Cursos

**Base URL**: `http://localhost:5144`

**Autenticación**: Todos los endpoints requieren headers de autenticación:
- `x-user-id`: ID del usuario autenticado
- `x-role-id`: ID del rol del usuario (1-7)

---

## 📋 Índice de Endpoints

### Autenticación
- `POST /login` - Iniciar sesión

### Usuarios
- `GET /usuarios` - Listar usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear usuario
- `PATCH /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Cursos
- `GET /cursos` - Listar cursos
- `GET /cursos/:id` - Obtener curso por ID
- `POST /cursos` - Crear curso
- `PATCH /cursos/:id` - Actualizar curso
- `DELETE /cursos/:id` - Eliminar curso

### Áreas
- `GET /areas` - Listar áreas
- `GET /areas/:id` - Obtener área por ID
- `POST /areas` - Crear área
- `PATCH /areas/:id` - Actualizar área
- `DELETE /areas/:id` - Eliminar área

### Eventos
- `GET /eventos` - Listar eventos
- `GET /eventos/:id` - Obtener evento por ID
- `POST /eventos` - Crear evento
- `PATCH /eventos/:id` - Actualizar evento
- `DELETE /eventos/:id` - Eliminar evento

### Exámenes
- `GET /examenes` - Listar exámenes
- `GET /examenes/:id` - Obtener examen por ID
- `POST /examenes` - Crear examen
- `PATCH /examenes/:id` - Actualizar examen
- `DELETE /examenes/:id` - Eliminar examen

### Configuración de Exámenes
- `GET /examen_configuraciones` - Listar configuraciones
- `POST /examen_configuraciones` - Habilitar examen para estudiante
- `PATCH /examen_configuraciones/:id` - Actualizar configuración
- `DELETE /examen_configuraciones/:id` - Deshabilitar examen

### Cupones
- `GET /cupones` - Listar cupones
- `GET /cupones/:id` - Obtener cupón por ID
- `POST /cupones` - Crear cupón
- `PATCH /cupones/:id` - Actualizar cupón (marcar como usado)

### Reseñas
- `GET /resenas` - Listar reseñas
- `GET /resenas/:id` - Obtener reseña por ID
- `POST /resenas` - Crear reseña
- `PATCH /resenas/:id` - Aprobar/Rechazar reseña
- `DELETE /resenas/:id` - Eliminar reseña

### Fidelización
- `GET /fidelizacion` - Listar registros de puntos
- `GET /fidelizacion/:id` - Obtener puntos de usuario
- `POST /fidelizacion` - Crear registro de puntos
- `PATCH /fidelizacion/:id` - Actualizar puntos

### Notificaciones
- `GET /notificaciones` - Listar notificaciones
- `GET /notificaciones/:id` - Obtener notificación por ID
- `POST /notificaciones` - Crear notificación
- `PATCH /notificaciones/:id` - Marcar como leída
- `DELETE /notificaciones/:id` - Eliminar notificación

### Intereses de Usuario
- `GET /user_interests` - Listar intereses
- `GET /user_interests/:id` - Obtener intereses de usuario
- `POST /user_interests` - Crear registro de intereses
- `PATCH /user_interests/:id` - Actualizar intereses

### Registros de Eventos
- `GET /event_registrations` - Listar registros
- `POST /event_registrations` - Registrar usuario en evento
- `DELETE /event_registrations/:id` - Cancelar registro

---

## 🔐 Autenticación

### POST /login

Autentica un usuario y devuelve sus datos.

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@example.com",
    "rolId": 1,
    "activo": true
  },
  "token": "mock-jwt-token" // Solo en producción será JWT real
}
```

**Response Error (401)**:
```json
{
  "error": "Credenciales inválidas"
}
```

---

## 👥 Usuarios

### GET /usuarios

Lista todos los usuarios (filtrable).

**Query Parameters**:
- `rolId` (optional): Filtrar por rol
- `activo` (optional): Filtrar por estado (true/false)

**Response (200)**:
```json
[
  {
    "id": "1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "rolId": 6,
    "activo": true,
    "fechaCreacion": "2024-01-15T10:00:00.000Z"
  }
]
```

### GET /usuarios/:id

Obtiene un usuario por ID.

**Response (200)**:
```json
{
  "id": "1",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "+51999888777",
  "rolId": 6,
  "activo": true,
  "fechaCreacion": "2024-01-15T10:00:00.000Z"
}
```

**Response Error (404)**:
```json
{
  "error": "Usuario no encontrado"
}
```

### POST /usuarios

Crea un nuevo usuario.

**Request Body**:
```json
{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@example.com",
  "password": "password123",
  "telefono": "+51999888777",
  "rolId": 6,
  "activo": true
}
```

**Response (201)**:
```json
{
  "id": "101",
  "nombre": "María",
  "apellido": "García",
  "email": "maria@example.com",
  "rolId": 6,
  "activo": true,
  "fechaCreacion": "2024-03-15T14:30:00.000Z"
}
```

### PATCH /usuarios/:id

Actualiza un usuario existente.

**Request Body** (campos opcionales):
```json
{
  "nombre": "María Luisa",
  "telefono": "+51999111222",
  "activo": false
}
```

**Response (200)**:
```json
{
  "id": "101",
  "nombre": "María Luisa",
  "apellido": "García",
  "email": "maria@example.com",
  "telefono": "+51999111222",
  "rolId": 6,
  "activo": false
}
```

### DELETE /usuarios/:id

Elimina un usuario.

**Response (200)**:
```json
{}
```

---

## 📚 Cursos

### GET /cursos

Lista todos los cursos (filtrable).

**Query Parameters**:
- `areaId` (optional): Filtrar por área
- `activo` (optional): Filtrar por estado (true/false)
- `destacado` (optional): Filtrar destacados (true/false)

**Response (200)**:
```json
[
  {
    "id": "1",
    "titulo": "Introducción a la Metalurgia",
    "descripcion": "Fundamentos de metalurgia extractiva",
    "areaId": "1",
    "nivel": "Básico",
    "duracion": 40,
    "precio": 299,
    "precioDescuento": 249,
    "instructor": "Dr. Carlos Méndez",
    "rating": 4.5,
    "estudiantesInscritos": 1250,
    "destacado": true,
    "activo": true,
    "fechaCreacion": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /cursos/:id

Obtiene un curso por ID con todos sus detalles.

**Response (200)**:
```json
{
  "id": "1",
  "titulo": "Introducción a la Metalurgia",
  "descripcion": "Fundamentos de metalurgia extractiva",
  "areaId": "1",
  "nivel": "Básico",
  "duracion": 40,
  "precio": 299,
  "precioDescuento": 249,
  "instructor": "Dr. Carlos Méndez",
  "rating": 4.5,
  "estudiantesInscritos": 1250,
  "destacado": true,
  "activo": true,
  "contenido": [
    {
      "modulo": "Módulo 1",
      "titulo": "Introducción",
      "lecciones": [
        { "titulo": "Conceptos básicos", "duracion": 45, "tipo": "video" }
      ]
    }
  ],
  "requisitos": ["Conocimientos básicos de química"],
  "objetivos": ["Comprender los fundamentos de la metalurgia"],
  "certificado": true,
  "fechaCreacion": "2024-01-01T00:00:00.000Z"
}
```

### POST /cursos

Crea un nuevo curso.

**Request Body**:
```json
{
  "titulo": "Nuevo Curso",
  "descripcion": "Descripción del curso",
  "areaId": "1",
  "nivel": "Intermedio",
  "duracion": 30,
  "precio": 199,
  "instructor": "Ing. Ana López",
  "destacado": false,
  "activo": true
}
```

**Response (201)**:
```json
{
  "id": "51",
  "titulo": "Nuevo Curso",
  "descripcion": "Descripción del curso",
  "areaId": "1",
  "nivel": "Intermedio",
  "duracion": 30,
  "precio": 199,
  "instructor": "Ing. Ana López",
  "rating": 0,
  "estudiantesInscritos": 0,
  "destacado": false,
  "activo": true,
  "fechaCreacion": "2024-03-15T15:00:00.000Z"
}
```

### PATCH /cursos/:id

Actualiza un curso existente.

**Request Body** (campos opcionales):
```json
{
  "precio": 249,
  "precioDescuento": 199,
  "activo": false
}
```

### DELETE /cursos/:id

Elimina un curso.

---

## 🎯 Áreas

### GET /areas

Lista todas las áreas.

**Query Parameters**:
- `activo` (optional): Filtrar por estado (true/false)

**Response (200)**:
```json
[
  {
    "id": "1",
    "nombre": "Metalurgia",
    "codigo": "metalurgia",
    "descripcion": "Ciencia de los metales",
    "icono": "🔬",
    "activo": true
  }
]
```

### POST /areas

Crea una nueva área.

**Request Body**:
```json
{
  "nombre": "Seguridad Minera",
  "codigo": "seguridad",
  "descripcion": "Gestión de seguridad",
  "icono": "🦺",
  "activo": true
}
```

---

## 📅 Eventos

### GET /eventos

Lista todos los eventos.

**Query Parameters**:
- `areaId` (optional): Filtrar por área
- `tipo` (optional): Filtrar por tipo (webinar, taller, conferencia)

**Response (200)**:
```json
[
  {
    "id": "1",
    "titulo": "Webinar: Innovaciones en Minería",
    "descripcion": "Últimas tecnologías mineras",
    "areaId": "2",
    "tipo": "webinar",
    "fecha": "2024-04-15T18:00:00.000Z",
    "duracion": 120,
    "instructor": "Ing. Pedro Sánchez",
    "capacidadMaxima": 100,
    "inscritos": 45,
    "precio": 0,
    "online": true,
    "activo": true
  }
]
```

### POST /eventos

Crea un nuevo evento.

**Request Body**:
```json
{
  "titulo": "Taller de Seguridad",
  "descripcion": "Seguridad en operaciones",
  "areaId": "2",
  "tipo": "taller",
  "fecha": "2024-05-20T09:00:00.000Z",
  "duracion": 240,
  "instructor": "Ing. Laura Torres",
  "capacidadMaxima": 30,
  "precio": 150,
  "online": false,
  "activo": true
}
```

---

## 📝 Exámenes

### GET /examenes

Lista todos los exámenes.

**Query Parameters**:
- `cursoId` (optional): Filtrar por curso
- `activo` (optional): Filtrar por estado

**Response (200)**:
```json
[
  {
    "id": "1",
    "titulo": "Examen Final - Metalurgia",
    "cursoId": "1",
    "duracion": 60,
    "intentosPermitidos": 3,
    "porcentajeAprobacion": 70,
    "activo": true,
    "preguntas": [
      {
        "id": "q1",
        "pregunta": "¿Qué es la metalurgia extractiva?",
        "tipo": "multiple",
        "opciones": [
          "Extracción de metales de minerales",
          "Trabajo con metales preciosos",
          "Fundición de hierro",
          "Análisis químico"
        ],
        "respuestaCorrecta": 0,
        "puntos": 10
      }
    ]
  }
]
```

### POST /examenes

Crea un nuevo examen.

**Request Body**:
```json
{
  "titulo": "Examen Módulo 1",
  "cursoId": "1",
  "duracion": 45,
  "intentosPermitidos": 2,
  "porcentajeAprobacion": 70,
  "activo": true,
  "preguntas": []
}
```

---

## ⚙️ Configuración de Exámenes

### GET /examen_configuraciones

Lista configuraciones de exámenes.

**Query Parameters**:
- `studentId` (optional): Filtrar por estudiante
- `courseId` (optional): Filtrar por curso
- `enabled` (optional): Filtrar habilitados

**Response (200)**:
```json
[
  {
    "id": "1",
    "studentId": "10",
    "courseId": "1",
    "examId": "1",
    "enabled": true,
    "attemptsAllowed": 3,
    "attemptsUsed": 1,
    "timeLimit": 60,
    "availableFrom": "2024-03-01T00:00:00.000Z",
    "availableUntil": "2024-04-01T23:59:59.000Z",
    "createdAt": "2024-03-01T10:00:00.000Z"
  }
]
```

### POST /examen_configuraciones

Habilita un examen para un estudiante.

**Request Body**:
```json
{
  "studentId": "10",
  "courseId": "1",
  "examId": "1",
  "attemptsAllowed": 3,
  "timeLimit": 60,
  "availableFrom": "2024-03-15T00:00:00.000Z",
  "availableUntil": "2024-04-15T23:59:59.000Z"
}
```

**Response (201)**:
```json
{
  "id": "5",
  "studentId": "10",
  "courseId": "1",
  "examId": "1",
  "enabled": true,
  "attemptsAllowed": 3,
  "attemptsUsed": 0,
  "timeLimit": 60,
  "availableFrom": "2024-03-15T00:00:00.000Z",
  "availableUntil": "2024-04-15T23:59:59.000Z",
  "createdAt": "2024-03-15T14:30:00.000Z"
}
```

---

## 🎫 Cupones

### GET /cupones

Lista todos los cupones.

**Query Parameters**:
- `studentId` (optional): Filtrar por estudiante
- `courseId` (optional): Filtrar por curso
- `isUsed` (optional): Filtrar usados/no usados

**Response (200)**:
```json
[
  {
    "id": "1",
    "code": "DESC-AB12CD",
    "studentId": "10",
    "courseId": "1",
    "examId": "1",
    "discountPercentage": 15,
    "isUsed": false,
    "createdAt": "2024-03-10T15:30:00.000Z",
    "expirationDate": "2024-04-10T23:59:59.000Z"
  }
]
```

### POST /cupones

Crea un nuevo cupón (generalmente después de aprobar examen).

**Request Body**:
```json
{
  "code": "DESC-XY78ZW",
  "studentId": "10",
  "courseId": "1",
  "examId": "1",
  "discountPercentage": 20,
  "expirationDate": "2024-05-01T23:59:59.000Z"
}
```

### PATCH /cupones/:id

Marca un cupón como usado.

**Request Body**:
```json
{
  "isUsed": true,
  "usedAt": "2024-03-12T10:00:00.000Z"
}
```

---

## ⭐ Reseñas

### GET /resenas

Lista todas las reseñas.

**Query Parameters**:
- `courseId` (optional): Filtrar por curso
- `userId` (optional): Filtrar por usuario
- `status` (optional): Filtrar por estado (pending, approved, rejected)

**Response (200)**:
```json
[
  {
    "id": "1",
    "courseId": "1",
    "userId": "10",
    "userName": "Juan Pérez",
    "rating": 5,
    "comment": "Excelente curso, muy completo",
    "status": "approved",
    "createdAt": "2024-03-05T12:00:00.000Z",
    "reviewedAt": "2024-03-05T14:00:00.000Z",
    "reviewedBy": "1"
  }
]
```

### POST /resenas

Crea una nueva reseña (requiere moderación).

**Request Body**:
```json
{
  "courseId": "1",
  "userId": "10",
  "userName": "Juan Pérez",
  "rating": 5,
  "comment": "Muy buen curso"
}
```

**Response (201)**:
```json
{
  "id": "25",
  "courseId": "1",
  "userId": "10",
  "userName": "Juan Pérez",
  "rating": 5,
  "comment": "Muy buen curso",
  "status": "pending",
  "createdAt": "2024-03-15T16:00:00.000Z"
}
```

### PATCH /resenas/:id

Aprueba o rechaza una reseña (solo admin).

**Request Body (Aprobar)**:
```json
{
  "status": "approved",
  "reviewedAt": "2024-03-15T17:00:00.000Z",
  "reviewedBy": "1"
}
```

**Request Body (Rechazar)**:
```json
{
  "status": "rejected",
  "reviewedAt": "2024-03-15T17:00:00.000Z",
  "reviewedBy": "1",
  "rejectionReason": "Contenido inapropiado"
}
```

---

## 🎁 Fidelización

### GET /fidelizacion

Lista registros de puntos.

**Query Parameters**:
- `userId` (optional): Filtrar por usuario

**Response (200)**:
```json
[
  {
    "id": "1",
    "userId": "10",
    "totalPoints": 450,
    "level": "plata",
    "completedCourses": [
      {
        "courseId": "1",
        "courseName": "Introducción a la Metalurgia",
        "completedAt": "2024-03-01T10:00:00.000Z",
        "pointsEarned": 150
      }
    ],
    "transactions": [
      {
        "type": "earned",
        "points": 150,
        "reason": "Curso completado",
        "date": "2024-03-01T10:00:00.000Z"
      }
    ],
    "redeemedRewards": [],
    "createdAt": "2024-02-01T00:00:00.000Z",
    "updatedAt": "2024-03-01T10:00:00.000Z"
  }
]
```

### POST /fidelizacion

Crea registro inicial de puntos para usuario.

**Request Body**:
```json
{
  "userId": "10",
  "totalPoints": 0,
  "level": "bronce"
}
```

### PATCH /fidelizacion/:id

Actualiza puntos de usuario.

**Request Body**:
```json
{
  "totalPoints": 550,
  "level": "oro",
  "completedCourses": [],
  "transactions": [],
  "updatedAt": "2024-03-15T18:00:00.000Z"
}
```

---

## 🔔 Notificaciones

### GET /notificaciones

Lista notificaciones.

**Query Parameters**:
- `usuarioId` (required): ID del usuario
- `leida` (optional): Filtrar leídas/no leídas (true/false)
- `tipo` (optional): Filtrar por tipo (info, success, warning, error)
- `categoria` (optional): Filtrar por categoría (sistema, curso, examen, evento)

**Response (200)**:
```json
[
  {
    "id": "1",
    "usuarioId": "10",
    "tipo": "success",
    "categoria": "curso",
    "titulo": "Curso completado",
    "mensaje": "Has completado el curso de Metalurgia",
    "leida": false,
    "fecha": "2024-03-15T10:00:00.000Z",
    "metadata": {
      "courseId": "1",
      "courseName": "Introducción a la Metalurgia"
    }
  }
]
```

### POST /notificaciones

Crea una notificación.

**Request Body**:
```json
{
  "usuarioId": "10",
  "tipo": "info",
  "categoria": "evento",
  "titulo": "Nuevo evento disponible",
  "mensaje": "Se ha publicado un nuevo webinar",
  "metadata": {
    "eventId": "5"
  }
}
```

### PATCH /notificaciones/:id

Marca notificación como leída.

**Request Body**:
```json
{
  "leida": true
}
```

---

## 📊 Intereses de Usuario

### GET /user_interests

Lista registros de intereses.

**Query Parameters**:
- `userId` (required): ID del usuario

**Response (200)**:
```json
[
  {
    "id": "1",
    "userId": "10",
    "viewedCourses": ["1", "2", "5"],
    "viewedCoursesDetails": {
      "1": {
        "title": "Introducción a la Metalurgia",
        "area": "metalurgia",
        "tags": ["básico", "fundamentos"],
        "lastViewed": "2024-03-15T14:00:00.000Z"
      }
    },
    "searchedTerms": [
      {
        "term": "seguridad minera",
        "area": "mineria",
        "timestamp": "2024-03-14T10:00:00.000Z"
      }
    ],
    "favoriteAreas": [],
    "completedCourses": ["1"],
    "registeredEvents": ["3"],
    "interestScore": {
      "metalurgia": 30,
      "mineria": 15,
      "geologia": 5
    },
    "createdAt": "2024-02-01T00:00:00.000Z",
    "updatedAt": "2024-03-15T14:00:00.000Z"
  }
]
```

### POST /user_interests

Crea registro inicial de intereses.

**Request Body**:
```json
{
  "userId": "10",
  "viewedCourses": [],
  "viewedCoursesDetails": {},
  "searchedTerms": [],
  "favoriteAreas": [],
  "completedCourses": [],
  "registeredEvents": [],
  "interestScore": {
    "metalurgia": 0,
    "mineria": 0,
    "geologia": 0
  }
}
```

### PATCH /user_interests/:id

Actualiza intereses de usuario.

**Request Body** (ejemplo tracking de vista de curso):
```json
{
  "viewedCourses": ["1", "2", "5", "7"],
  "viewedCoursesDetails": {
    "7": {
      "title": "Geología Aplicada",
      "area": "geologia",
      "tags": ["avanzado"],
      "lastViewed": "2024-03-16T09:00:00.000Z"
    }
  },
  "interestScore": {
    "metalurgia": 30,
    "mineria": 15,
    "geologia": 15
  },
  "updatedAt": "2024-03-16T09:00:00.000Z"
}
```

---

## 📝 Registros de Eventos

### GET /event_registrations

Lista registros de eventos.

**Query Parameters**:
- `eventId` (optional): Filtrar por evento
- `userId` (optional): Filtrar por usuario
- `email` (optional): Filtrar por email

**Response (200)**:
```json
[
  {
    "id": "1",
    "eventId": "3",
    "userId": "10",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+51999888777",
    "company": "Minera ABC",
    "registeredAt": "2024-03-10T15:00:00.000Z"
  }
]
```

### POST /event_registrations

Registra usuario en evento.

**Request Body**:
```json
{
  "eventId": "3",
  "userId": "10",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+51999888777",
  "company": "Minera ABC"
}
```

**Response (201)**:
```json
{
  "id": "15",
  "eventId": "3",
  "userId": "10",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+51999888777",
  "company": "Minera ABC",
  "registeredAt": "2024-03-16T10:00:00.000Z"
}
```

**Response Error (400)** - Ya registrado:
```json
{
  "success": false,
  "error": "Ya estás registrado en este evento"
}
```

### DELETE /event_registrations/:id

Cancela registro de evento.

**Response (200)**:
```json
{}
```

---

## 🔒 Roles y Permisos

### Roles del Sistema

| ID | Rol | Permisos |
|----|-----|----------|
| 1 | Super Admin | Todos los permisos |
| 2 | Gerente General | Gestión completa excepto configuración |
| 3 | Jefe de Operaciones | Gestión de cursos y eventos |
| 4 | Administrador | Moderación de contenido |
| 5 | Estudiante Premium | Acceso a cursos premium |
| 6 | Estudiante | Acceso básico |
| 7 | Invitado | Solo lectura |

### Permisos por Endpoint

- **POST/PATCH/DELETE /cursos**: Requiere rolId <= 3
- **POST/PATCH/DELETE /usuarios**: Requiere rolId <= 2
- **PATCH /resenas** (aprobar/rechazar): Requiere rolId <= 4
- **GET endpoints**: Todos los roles
- **POST /resenas, /event_registrations**: Roles 5 y 6 (estudiantes)

---

## ❌ Códigos de Error

### 400 - Bad Request
```json
{
  "error": "Datos inválidos",
  "details": {
    "field": "email",
    "message": "Email ya registrado"
  }
}
```

### 401 - Unauthorized
```json
{
  "error": "No autorizado",
  "message": "Headers de autenticación faltantes"
}
```

### 403 - Forbidden
```json
{
  "error": "Acceso denegado",
  "message": "No tienes permisos para esta operación"
}
```

### 404 - Not Found
```json
{
  "error": "Recurso no encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor",
  "message": "Descripción del error"
}
```

---

## 🚀 Notas para Migración a Backend Real

### Campos a Agregar en Producción

1. **Todos los modelos**:
   - `createdBy`: ID del usuario creador
   - `updatedBy`: ID del último usuario que modificó
   - `deletedAt`: Soft delete (en lugar de DELETE físico)

2. **Usuarios**:
   - `passwordHash`: En lugar de `password` en texto plano
   - `emailVerified`: Verificación de email
   - `lastLogin`: Último inicio de sesión
   - `refreshToken`: Para autenticación JWT

3. **Archivos/Imágenes**:
   - Implementar upload a S3/Cloudinary
   - Campos: `imageUrl`, `thumbnailUrl`, `fileSize`, `mimeType`

### Endpoints Adicionales en Producción

- `POST /auth/refresh` - Renovar token JWT
- `POST /auth/forgot-password` - Recuperar contraseña
- `POST /auth/verify-email` - Verificar email
- `POST /upload` - Subir archivos
- `GET /analytics/dashboard` - Dashboard de métricas
- `POST /payments/checkout` - Procesar pagos

### Validaciones a Implementar

- **Email**: Formato válido + verificación única
- **Password**: Mínimo 8 caracteres, mayúsculas, números
- **Dates**: Validar fechas futuras para eventos/exámenes
- **Ratings**: Rango 1-5
- **Permisos**: Validar rolId antes de cada operación

### Base de Datos Recomendada

**PostgreSQL** (Recomendado para producción):
```sql
-- Ejemplo de tabla usuarios con campos de producción
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  rol_id INTEGER REFERENCES roles(id),
  activo BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

---

## 📞 Soporte

Para migración a backend real, considerar:
- **Stack recomendado**: Node.js + Express + PostgreSQL
- **Autenticación**: JWT con refresh tokens
- **ORM**: Prisma o TypeORM
- **Validación**: Joi o Zod
- **Documentación**: Swagger/OpenAPI autogenerado
