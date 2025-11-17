# Guía de Configuración del Proyecto

## Variables de Entorno

Este proyecto utiliza variables de entorno para configurar URLs y claves sensibles. Todas las rutas están centralizadas en `src/constants/config.js` que lee de `.env`.

### Archivo .env

Copia el archivo `.env.example` a `.env` y actualiza los valores según tu entorno:

```bash
cp .env.example .env
```

## Configuración Principal

### 1. API Backend

```env
VITE_API_URL=http://localhost:5144
VITE_API_TIMEOUT=10000
```

### 2. URLs del Sitio Web

```env
VITE_WEBSITE_URL=https://metsel.edu.co
VITE_FORMS_URL=https://formularios.metsel.edu.co
```

### 3. WhatsApp Business API

```env
# Credenciales API
VITE_WHATSAPP_ACCESS_TOKEN=your_token
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_id
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id

# Números de contacto
VITE_WHATSAPP_DEFAULT_PHONE=+57 300 123 4567
VITE_WHATSAPP_BUSINESS_PHONE=+573001234567

# Enlaces de grupos
VITE_WHATSAPP_GROUP_METALURGIA=https://chat.whatsapp.com/metalurgia-pro
VITE_WHATSAPP_GROUP_MINERIA=https://chat.whatsapp.com/mineros-unidos
VITE_WHATSAPP_GROUP_GEOLOGIA=https://chat.whatsapp.com/geologos-colombia
VITE_WHATSAPP_GROUP_GENERAL=https://chat.whatsapp.com/metsel-community
```

### 4. Servicios Externos

```env
# Imágenes
VITE_UNSPLASH_BASE=https://images.unsplash.com

# Videoconferencia
VITE_ZOOM_BASE=https://zoom.us
VITE_TEAMS_BASE=https://teams.microsoft.com

# Media
VITE_YOUTUBE_BASE=https://www.youtube.com
```

### 5. Modo Demo

```env
VITE_DEMO_MODE=true
VITE_DEMO_PASSWORD=Demo2024!
```

## Uso en el Código

### Importar Configuración

```javascript
import CONFIG from '../constants/config'
```

### Ejemplos de Uso

```javascript
// URL de la API
const apiUrl = CONFIG.API.BASE_URL

// Storage
const imageUrl = `${CONFIG.STORAGE.BASE_URL}/images/photo.jpg`

// WhatsApp
const whatsappLink = `${CONFIG.WHATSAPP.WA_ME_BASE}/${phone}`

// Website
const webinarUrl = `${CONFIG.WEBSITE.BASE_URL}${CONFIG.WEBSITE.WEBINARS}`

// Grupos de WhatsApp
const metalGroup = CONFIG.WHATSAPP.GROUPS.METALURGIA

// Placeholders
const defaultAvatar = CONFIG.PLACEHOLDERS.AVATAR_DEFAULT
```

## Ambientes

### Desarrollo
- `.env` - Variables de desarrollo local

### Producción
Actualiza las variables en tu servicio de hosting con los valores de producción:
- API_URL debe apuntar a tu backend en producción
- WEBSITE_URL debe ser tu dominio principal
- WHATSAPP tokens deben ser los reales (no los de prueba)

## Seguridad

⚠️ **IMPORTANTE**:
- Nunca commitear el archivo `.env` al repositorio
- `.env.example` sí se commitea como plantilla
- Rotar las claves de API regularmente
- Usar valores diferentes en desarrollo y producción

## Backend (.env)

El backend también tiene su propio archivo `.env`:

```env
PORT=5144
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
```

Ver `backend/.env.example` para la lista completa.

## Troubleshooting

### Las variables no se cargan
1. Asegúrate que el archivo se llama `.env` (sin números ni sufijos)
2. Reinicia el servidor de desarrollo después de cambiar el .env
3. Las variables deben empezar con `VITE_` para ser accesibles

### URLs no funcionan
1. Verifica que no haya espacios extra en las URLs
2. Verifica que las URLs no terminen con `/` (excepto que sea necesario)
3. Revisa la consola del navegador para errores
