# Plataforma de Cursos Online

Sistema completo de gestión de cursos online con panel de administración, sistema de usuarios y funcionalidades avanzadas.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Instalación

1. **Backend (JSON Server)**
```bash
cd backend
npm install
npm start
# El backend correrá en http://localhost:4002
```

2. **Frontend**
```bash
cd cursos
npm install
npm run dev
# El frontend correrá en http://localhost:3011
```

## 📁 Estructura del Proyecto

```
cursos/
├── backend/           # JSON Server (API Mock)
│   └── db.json       # Base de datos
├── cursos/           # Frontend React
│   ├── src/
│   │   ├── api/      # Cliente API
│   │   ├── components/
│   │   ├── config/   # Configuración
│   │   ├── pages/    # Páginas
│   │   ├── store/    # Estado global (Zustand)
│   │   └── utils/    # Utilidades
│   └── .env         # Variables de entorno
```

## 🎯 Características Principales

### Para Usuarios
- ✅ Registro y autenticación
- ✅ Explorador de cursos con filtros
- ✅ Dashboard personalizado
- ✅ Gestión de cursos inscritos
- ✅ Sistema de progreso
- ✅ Certificados
- ✅ Programa de lealtad
- ✅ Reseñas y valoraciones

### Para Administradores
- ✅ Dashboard con analytics
- ✅ Gestión completa de cursos (CRUD)
- ✅ Gestión de áreas/categorías
- ✅ Gestión de leads
- ✅ Moderación de reseñas
- ✅ Configuración global del sistema
- ✅ Integración WhatsApp Business
- ✅ Sistema de exámenes

## 🔧 Configuración

### Variables de Entorno
Copia `.env.example` a `.env` y configura:

```env
VITE_API_URL=http://localhost:4002
VITE_APP_NAME="Plataforma de Cursos"
VITE_ENABLE_WHATSAPP=true
# ... más configuraciones
```

## 📱 Rutas Principales

### Públicas
- `/` - Página principal
- `/courses` - Catálogo de cursos
- `/course/:id` - Detalle del curso
- `/login` - Iniciar sesión
- `/register` - Registro

### Usuario (Requiere autenticación)
- `/dashboard` - Panel de usuario
- `/profile` - Perfil
- `/my-courses` - Mis cursos
- `/certificates` - Certificados

### Admin (Requiere rol admin)
- `/admin` - Dashboard admin
- `/admin/courses` - Gestión de cursos
- `/admin/content` - Gestión de áreas
- `/admin/config` - Configuración

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React 18.3.1
  - Vite
  - React Router DOM 6
  - Zustand (Estado global)
  - Tailwind CSS
  - Axios
  - Recharts (Gráficos)

- **Backend:**
  - JSON Server (Desarrollo)
  - RESTful API

## 📊 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación
- Todas las páginas principales
- Panel de administración completo
- Gestión de cursos (CRUD)
- Sistema de configuración
- Integración WhatsApp
- Sistema de exámenes
- Dashboard con analytics
- Sistema de reseñas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT.

## 🆘 Soporte

Para soporte, envía un email a soporte@plataformacursos.com

---

**Desarrollado con ❤️ por el equipo de desarrollo**