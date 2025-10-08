# 🔧 Guía de Refactorización - Eliminación de Hardcodeo

## ✅ Completado

### 1. Archivos de Constantes Creados

✔️ **`frontend/src/constants/config.js`**
- Configuración centralizada de API, timeouts, límites
- Variables de entorno con fallbacks seguros
- Delays estandarizados

✔️ **`frontend/src/constants/roleIds.js`**
- IDs de roles centralizados
- Helper functions: `isAdmin()`, `isStudent()`, etc.
- Rol por defecto definido

✔️ **`frontend/src/constants/storageKeys.js`**
- Todas las keys de localStorage centralizadas
- Helpers para get/set/remove seguros

✔️ **`frontend/src/constants/areaIds.js`**
- IDs y configuración de áreas
- Colores y configuración visual centralizada
- Helper functions: `getAreaById()`, `getAllAreas()`

### 2. Variables de Entorno Actualizadas

✔️ **`frontend/.env`**
- Puerto API corregido: 5144
- Variables añadidas: timeout, storage, website, demo

✔️ **`frontend/.env.example`**
- Documentación completa de variables
- Ejemplos para cada ambiente (dev, staging, prod)

### 3. Archivos Refactorizados

✔️ **`frontend/src/services/apiClient.js`**
- Usa `CONFIG.API.BASE_URL` en lugar de hardcodear
- Usa `STORAGE_KEYS.AUTH_STORAGE` para localStorage

✔️ **`frontend/src/services/api.js`**
- Usa `ROLE_IDS.STUDENT` en lugar de número 6
- Usa `isStudent()` helper en lugar de `rolId === 5 || rolId === 6`

---

## 📋 Pendiente de Refactorizar

### PRIORIDAD ALTA 🔴

#### 1. Actualizar Todos los usos de localStorage

**Archivos a modificar:**
```javascript
// frontend/src/store/authStore.js (líneas 49, 53, 138, 142, 151)
localStorage.getItem('userData')
// Cambiar por:
localStorage.getItem(STORAGE_KEYS.USER_DATA)

// frontend/src/services/notificationService.js
localStorage.getItem('user_notifications')
// Cambiar por:
localStorage.getItem(STORAGE_KEYS.USER_NOTIFICATIONS)

// frontend/src/services/eventService.js
localStorage.getItem('platform_events')
// Cambiar por:
localStorage.getItem(STORAGE_KEYS.PLATFORM_EVENTS)
```

**Archivos afectados (10+):**
- `authStore.js`
- `notificationService.js`
- `eventService.js`
- `courseStore.js`
- `useExamManagement.js`
- `enrollmentUtils.js`
- `useProfile.js`

**Comando para buscar:**
```bash
cd frontend/src
grep -r "localStorage.getItem\|localStorage.setItem" --include="*.js" --include="*.jsx"
```

#### 2. Reemplazar Todos los Role IDs

**Buscar y reemplazar:**
```javascript
// Buscar patrones como:
rolId === 5
rolId === 6
u.rolId === 5 || u.rolId === 6

// Reemplazar por:
rolId === ROLE_IDS.PREMIUM_STUDENT
rolId === ROLE_IDS.STUDENT
isStudent(u.rolId)
```

**Comando:**
```bash
grep -rn "rolId === [0-9]" frontend/src --include="*.js" --include="*.jsx"
```

#### 3. Centralizar Delays y Timeouts

**Buscar y reemplazar:**
```javascript
// Buscar:
setTimeout(..., 500)
setTimeout(..., 1000)
setTimeout(..., 2000)

// Reemplazar por:
setTimeout(..., CONFIG.DELAYS.FAST)
setTimeout(..., CONFIG.DELAYS.NORMAL)
setTimeout(..., CONFIG.DELAYS.SLOW)
```

**Comando:**
```bash
grep -rn "setTimeout\|setInterval" frontend/src --include="*.js" | grep "[0-9][0-9][0-9]"
```

#### 4. Mover Configuración de WhatsApp a Base de Datos

**Crear nueva tabla en db.json:**
```json
{
  "whatsapp_config": [
    {
      "id": "1",
      "phoneNumber": "+57 300 123 4567",
      "triggers": {
        "courseSearch": { "enabled": true, "delay": 3000 },
        "courseView": { "enabled": true, "delay": 5000 }
      },
      "groups": {
        "metalurgia": {
          "name": "Metalurgia Pro",
          "link": "https://chat.whatsapp.com/metalurgia-pro"
        }
      },
      "templates": {
        "welcome": "¡Hola! 👋 Gracias por tu interés...",
        "courseInterest": "Te vimos interesado en cursos de {{area}}..."
      }
    }
  ]
}
```

**Crear servicio:**
```javascript
// frontend/src/services/whatsappConfigService.js
import apiClient from './apiClient'

class WhatsAppConfigService {
  async getConfig() {
    const response = await apiClient.get('/whatsapp_config/1')
    return response.data
  }

  async updateConfig(config) {
    const response = await apiClient.patch('/whatsapp_config/1', config)
    return response.data
  }
}

export default new WhatsAppConfigService()
```

**Actualizar whatsappService.js:**
```javascript
// Al inicio, cargar config desde API
constructor() {
  this.config = null
  this.loadConfig()
}

async loadConfig() {
  this.config = await whatsappConfigService.getConfig()
}
```

### PRIORIDAD MEDIA 🟡

#### 5. Centralizar URLs Externas

**Crear archivo:**
```javascript
// frontend/src/constants/externalUrls.js
export const EXTERNAL_URLS = {
  WEBSITE: {
    BASE: CONFIG.WEBSITE.BASE_URL,
    WEBINARS: `${CONFIG.WEBSITE.BASE_URL}/webinars`,
    REGISTRATION: `${CONFIG.WEBSITE.BASE_URL}/inscripciones`,
  },

  WHATSAPP_GROUPS: {
    // Estos deberían venir de la API
    // Temporalmente aquí hasta mover a BD
  },

  DEFAULT_AVATAR: '/assets/default-avatar.png', // Usar asset local
}
```

#### 6. Mover Datos de Fidelización a Base de Datos

**Actualizar db.json:**
```json
{
  "loyalty_config": {
    "id": "1",
    "pointsPerCourse": 100,
    "levels": {
      "bronce": { "minPoints": 0, "maxPoints": 299, "discount": 5 },
      "plata": { "minPoints": 300, "maxPoints": 599, "discount": 10 },
      "oro": { "minPoints": 600, "maxPoints": 999, "discount": 15 },
      "platino": { "minPoints": 1000, "maxPoints": null, "discount": 20 }
    }
  }
}
```

**Modificar fidelizacionService.js:**
```javascript
async loadConfig() {
  const response = await apiClient.get('/loyalty_config/1')
  this.config = response.data
}
```

#### 7. Centralizar Rangos de Exámenes

**Mover a base de datos:**
```json
{
  "exam_scoring": {
    "id": "1",
    "maxScore": 20,
    "minPassingScore": 11,
    "discountRanges": [
      { "min": 18, "max": 20, "discount": 20 },
      { "min": 15, "max": 17, "discount": 15 },
      { "min": 11, "max": 14, "discount": 10 },
      { "min": 0, "max": 10, "discount": 0 }
    ]
  }
}
```

### PRIORIDAD BAJA 🟢

#### 8. Refactorizar Datos Mock

**Usar faker.js:**
```bash
npm install @faker-js/faker --save-dev
```

```javascript
import { faker } from '@faker-js/faker'

const generateMockUser = () => ({
  id: faker.string.uuid(),
  nombre: faker.person.firstName(),
  apellido: faker.person.lastName(),
  email: faker.internet.email(),
  telefono: faker.phone.number('+57 3## ### ####'),
})
```

#### 9. Implementar Sistema i18n

**Instalar:**
```bash
npm install i18next react-i18next
```

**Estructura:**
```
frontend/src/locales/
  ├── es/
  │   ├── common.json
  │   ├── auth.json
  │   ├── courses.json
  │   └── errors.json
  └── en/
      ├── common.json
      └── ...
```

#### 10. Centralizar Colores de Marca

**Crear archivo:**
```javascript
// frontend/src/constants/brandColors.js
export const BRAND_COLORS = {
  primary: {
    metalurgia: '#DC2626',  // red-600
    mineria: '#2563EB',     // blue-600
    geologia: '#16A34A',    // green-600
  },

  ui: {
    background: '#1F2937',  // gray-800
    surface: '#374151',     // gray-700
    text: '#F9FAFB',        // gray-50
  },

  // Para usar en certificados
  certificate: {
    background: '#ffffff',
    primary: '#98d932',
    text: '#121f3d',
    secondary: '#666',
  }
}
```

---

## 🚀 Plan de Ejecución Sugerido

### Semana 1: Prioridad Alta
1. ✅ Día 1-2: Crear archivos de constantes (COMPLETADO)
2. 📝 Día 3: Actualizar todos los `localStorage` (10 archivos)
3. 📝 Día 4: Reemplazar todos los Role IDs (15+ archivos)
4. 📝 Día 5: Centralizar delays/timeouts (20+ archivos)

### Semana 2: Prioridad Media
5. 📝 Día 1-2: Mover config WhatsApp a BD
6. 📝 Día 3: Mover config fidelización a BD
7. 📝 Día 4: Mover scoring de exámenes a BD
8. 📝 Día 5: Centralizar URLs externas

### Semana 3: Prioridad Baja
9. 📝 Refactorizar datos mock con faker
10. 📝 Preparar estructura i18n
11. 📝 Centralizar colores de marca

---

## 📊 Comando para Buscar Hardcodeos

### Buscar URLs hardcodeadas:
```bash
grep -rn "https://\|http://" frontend/src --include="*.js" --include="*.jsx"
```

### Buscar números mágicos:
```bash
grep -rn "=== [0-9]\|!== [0-9]" frontend/src --include="*.js"
```

### Buscar localStorage sin constantes:
```bash
grep -rn "localStorage\.(get\|set\|remove).*['\"]" frontend/src --include="*.js"
```

### Buscar timeouts hardcodeados:
```bash
grep -rn "setTimeout\|setInterval" frontend/src --include="*.js" | grep -E "[0-9]{3,5}"
```

---

## ✅ Checklist de Verificación

Antes de considerar completa la refactorización:

- [ ] No hay URLs hardcodeadas (excepto en .env)
- [ ] No hay IDs numéricos directos (usar constantes)
- [ ] No hay credenciales en código
- [ ] No hay strings de localStorage duplicados
- [ ] No hay timeouts sin constantes
- [ ] Configuración de WhatsApp en BD
- [ ] Niveles de fidelización en BD
- [ ] Datos mock usan faker.js
- [ ] Colores centralizados
- [ ] Mensajes preparados para i18n

---

## 🎯 Beneficios Esperados

1. **Mantenibilidad**: Cambios en un solo lugar
2. **Testabilidad**: Fácil mockear configuraciones
3. **Escalabilidad**: Añadir nuevas áreas/roles sin tocar código
4. **Internacionalización**: Base para multi-idioma
5. **Configurabilidad**: Admin puede cambiar valores sin deploy
6. **Seguridad**: No hay credenciales en código
7. **Consistencia**: Mismos valores en toda la app

---

## 📝 Notas de Migración

### Antes de empezar cada refactorización:
1. Crear rama git: `git checkout -b refactor/remove-hardcoding`
2. Hacer backup de archivos: `cp file.js file.js.backup`
3. Testear después de cada cambio
4. Hacer commits pequeños y descriptivos

### Testing después de cada cambio:
```bash
# Frontend
npm run dev
# Verificar que la app carga sin errores
# Probar flujos principales: login, ver cursos, crear examen

# Backend
npm run dev
# Verificar que JSON Server responde correctamente
```

### Rollback si algo falla:
```bash
git checkout -- archivo-con-error.js
```

---

## 🔗 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Best Practices - Constants](https://react.dev/learn/thinking-in-react)
- [i18next Documentation](https://www.i18next.com/)
- [Faker.js](https://fakerjs.dev/)
