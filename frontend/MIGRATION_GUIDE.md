# Guía de Migración al Backend JSON Server

## ✅ Fase 1: Fundación (COMPLETADA)

Se ha creado la infraestructura base para conectar el frontend con el backend:

### Archivos Creados

1. **`src/services/apiClient.js`** - Cliente axios configurado con interceptors
   - Agrega automáticamente headers `x-user-id` y `x-role-id`
   - Maneja errores centralizadamente
   - Logs de requests/responses en desarrollo

2. **`src/services/authService.js`** - Servicio de autenticación
   - `login(email, password)` - Iniciar sesión
   - `logout()` - Cerrar sesión
   - `getCurrentUser()` - Obtener usuario actual
   - `hasPermission(permiso)` - Verificar permisos
   - `hasRole(rolId)` - Verificar rol
   - Y más métodos útiles...

3. **`src/context/AuthContext.jsx`** - Context Provider de React
   - Maneja estado de autenticación global
   - Hook `useAuth()` para usar en componentes
   - Escucha eventos de logout/unauthorized

4. **`.env`** - Variable de entorno agregada
   - `VITE_API_URL=http://localhost:5000`

---

## 🎯 Cómo Usar

### 1. Envolver la App con AuthProvider

En `src/main.jsx` o `src/App.jsx`:

```jsx
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Tu aplicación aquí */}
    </AuthProvider>
  )
}
```

### 2. Usar en Componentes

```jsx
import { useAuth } from '../context/AuthContext'

function MiComponente() {
  const { usuario, isAuthenticated, hasPermission, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>No autenticado</div>
  }

  return (
    <div>
      <p>Hola, {usuario.nombre}</p>
      <p>Rol: {usuario.rol}</p>

      {hasPermission('crear_curso') && (
        <button>Crear Curso</button>
      )}

      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  )
}
```

### 3. Hacer Peticiones al Backend

```jsx
import apiClient from '../services/apiClient'

async function obtenerEventos() {
  try {
    const response = await apiClient.get('/eventos')
    return response.data
  } catch (error) {
    console.error('Error:', error.message)
    // El error ya viene formateado por el interceptor
  }
}

async function crearEvento(eventoData) {
  try {
    const response = await apiClient.post('/eventos', eventoData)
    return response.data
  } catch (error) {
    console.error('Error:', error.message)
    // Si no tienes permisos, el interceptor ya loggeó el 403
  }
}
```

---

## 📚 Próximos Pasos (Fase 2)

### Migrar EventsPage

1. Crear `src/services/eventsService.js`:

```javascript
import apiClient from './apiClient'

export const eventsService = {
  // Obtener todos los eventos
  async getAll() {
    const response = await apiClient.get('/eventos')
    return response.data
  },

  // Obtener evento por ID
  async getById(id) {
    const response = await apiClient.get(`/eventos/${id}`)
    return response.data
  },

  // Crear evento
  async create(eventoData) {
    const response = await apiClient.post('/eventos', eventoData)
    return response.data
  },

  // Actualizar evento
  async update(id, eventoData) {
    const response = await apiClient.put(`/eventos/${id}`, eventoData)
    return response.data
  },

  // Eliminar evento
  async delete(id) {
    const response = await apiClient.delete(`/eventos/${id}`)
    return response.data
  }
}
```

2. Actualizar `EventsPage.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { eventsService } from '../../services/eventsService'
import { useAuth } from '../../context/AuthContext'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      const data = await eventsService.getAll()
      setEvents(data)
    } catch (error) {
      console.error('Error cargando eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateEvent(eventData) {
    try {
      await eventsService.create(eventData)
      await loadEvents() // Recargar lista
    } catch (error) {
      alert(error.message)
    }
  }

  // ... resto del componente
}
```

---

## 🔐 Permisos Disponibles

Consulta `backend/db.json` para ver todos los permisos por rol:

- `crear_usuario`, `editar_usuario`, `eliminar_usuario`, `ver_usuarios`
- `crear_curso`, `editar_curso`, `eliminar_curso`, `ver_cursos`
- `crear_examen`, `editar_examen`, `eliminar_examen`, `ver_examenes`
- `crear_evento`, `editar_evento`, `eliminar_evento`, `ver_eventos`
- `ver_reportes`
- `gestionar_roles`
- `gestionar_areas`
- `gestionar_notificaciones`
- etc.

---

## 🧪 Testing

### 1. Iniciar Backend

```bash
cd backend
npm install
npm run seed  # Generar datos
npm run dev   # Iniciar servidor en puerto 5000
```

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev   # Puerto 3003 (o el que tengas configurado)
```

### 3. Probar Login

Usuarios de prueba (después de ejecutar `npm run seed`):
- **Admin:** admin@cursos.com / admin123 (rolId: 1)
- Ver más usuarios en `backend/db.json`

---

## 📋 Checklist de Migración

- [x] ✅ Crear `apiClient.js`
- [x] ✅ Crear `authService.js`
- [x] ✅ Crear `AuthContext.jsx`
- [x] ✅ Configurar `.env`
- [x] ✅ Envolver App con `AuthProvider`
- [x] ✅ Crear `eventsService.js`
- [x] ✅ Migrar `EventsPage.jsx`
- [ ] ⏳ Crear `examsService.js`
- [ ] ⏳ Migrar `ExamListPage.jsx`
- [x] ✅ Crear `areasService.js`
- [x] ✅ Migrar `AreaListPage.jsx`

---

## 🚨 Troubleshooting

**Error: "Error de conexión. Verifica tu conexión a internet"**
- ✅ Backend debe estar corriendo en `http://localhost:5000`
- ✅ Ejecuta `cd backend && npm run dev`

**Error: "No autorizado"**
- ✅ Verifica que estés logueado
- ✅ Verifica headers en DevTools → Network

**Error: "Permiso denegado"**
- ✅ Tu rol no tiene el permiso requerido
- ✅ Consulta `backend/db.json` → roles → permisos

---

## 📞 Contacto

Si tienes dudas sobre la migración, revisa los ejemplos en esta guía o consulta el código de los servicios creados.
