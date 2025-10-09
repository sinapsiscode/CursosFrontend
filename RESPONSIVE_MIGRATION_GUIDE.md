# Guía de Migración Mobile-First - CEOs UNI Platform

## ✅ Archivos Ya Actualizados

### 1. **Constantes de Estilos**
- ✅ `frontend/src/constants/homeConstants.jsx`
- ✅ `frontend/src/constants/navbarConstants.jsx`
- ✅ `frontend/src/constants/courseConstants.js`

### 2. **Componentes Comunes**
- ✅ `frontend/src/components/common/Navbar/NavbarLogo.jsx`
- ✅ `frontend/src/components/home/HomeCarousel.jsx`

### 3. **Componentes de Detalle**
- ✅ `frontend/src/components/courseDetail/CourseHeader.jsx`

## 📋 Patrones de Migración Mobile-First

### Patrón 1: Espaciado (Padding/Margin)
```jsx
// ❌ Antes
className="px-4 py-8 mb-12"

// ✅ Después (Mobile → Tablet → Desktop)
className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 mb-6 sm:mb-8 md:mb-12"
```

### Patrón 2: Tamaños de Fuente
```jsx
// ❌ Antes
className="text-3xl"

// ✅ Después
className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
```

### Patrón 3: Grids Responsive
```jsx
// ❌ Antes
className="grid grid-cols-2 md:grid-cols-4 gap-6"

// ✅ Después
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
```

### Patrón 4: Flex Direction
```jsx
// ❌ Antes
className="md:flex space-y-6 md:space-y-0 md:space-x-8"

// ✅ Después
className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8"
```

### Patrón 5: Ancho de Elementos
```jsx
// ❌ Antes
className="md:w-1/3"

// ✅ Después
className="w-full md:w-1/3"
```

### Patrón 6: Tamaños de Iconos/Botones
```jsx
// ❌ Antes
className="w-6 h-6 p-3"

// ✅ Después
className="w-5 h-5 sm:w-6 sm:h-6 p-2 sm:p-2.5 md:p-3"
```

### Patrón 7: Ocultar/Mostrar en Breakpoints
```jsx
// Ocultar en móvil, mostrar en desktop
className="hidden md:block"
className="hidden md:flex"
className="hidden lg:inline"

// Mostrar en móvil, ocultar en desktop
className="block md:hidden"
className="sm:hidden"
```

### Patrón 8: Flex-wrap para Responsive
```jsx
// ❌ Antes
className="flex items-center space-x-4"

// ✅ Después (permite wrap en móvil)
className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4"
```

### Patrón 9: Bordes Redondeados
```jsx
// ❌ Antes
className="rounded-xl"

// ✅ Después
className="rounded-lg sm:rounded-xl"
```

### Patrón 10: Tamaños Arbitrarios
```jsx
// Para textos muy pequeños
className="text-[10px] sm:text-xs"
```

## 🎯 Breakpoints de Tailwind

```
sm:  640px  - Tablets pequeñas (portrait)
md:  768px  - Tablets (landscape)
lg:  1024px - Laptops pequeñas
xl:  1280px - Desktop
2xl: 1536px - Desktop grande
```

## 📱 Checklist por Tipo de Componente

### Componentes de Card
- [ ] Padding interno: `p-3 sm:p-4`
- [ ] Texto del título: `text-sm sm:text-base md:text-lg`
- [ ] Badges: `text-[10px] sm:text-xs px-1.5 sm:px-2`
- [ ] Iconos: `w-3 h-3 sm:w-4 sm:h-4`

### Componentes de Header
- [ ] Container: `px-3 sm:px-4 md:px-6 lg:px-8`
- [ ] Títulos principales: `text-xl sm:text-2xl md:text-3xl lg:text-4xl`
- [ ] Subtítulos: `text-sm sm:text-base md:text-lg`
- [ ] Flex container: `flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8`

### Componentes de Modal
- [ ] Ancho máximo: `w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl`
- [ ] Padding: `p-4 sm:p-6 md:p-8`
- [ ] Botones: `text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5`

### Grids de Contenido
- [ ] Cursos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] Áreas: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- [ ] Admin tables: `hidden md:table-cell` para columnas secundarias

### Botones
- [ ] Padding: `px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2`
- [ ] Texto: `text-xs sm:text-sm md:text-base`
- [ ] Iconos internos: `w-4 h-4 sm:w-5 sm:h-5`

## 🔧 Archivos Pendientes de Actualizar

### Prioridad Alta (Vistas Públicas)
- [ ] `frontend/src/pages/CourseDetail.jsx`
- [ ] `frontend/src/pages/Events.jsx`
- [ ] `frontend/src/pages/CourseExam.jsx`
- [ ] `frontend/src/components/courseDetail/CourseTabs.jsx`
- [ ] `frontend/src/components/courseDetail/CourseTabContent.jsx`
- [ ] `frontend/src/components/events/*`

### Prioridad Media (Vistas de Usuario)
- [ ] `frontend/src/pages/MyCourses.jsx`
- [ ] `frontend/src/pages/Profile.jsx`
- [ ] `frontend/src/pages/MyFavorites.jsx`
- [ ] `frontend/src/pages/LoyaltyProgram.jsx`
- [ ] `frontend/src/components/auth/LoginModal.jsx`
- [ ] `frontend/src/components/auth/RegisterModal.jsx`

### Prioridad Baja (Admin)
- [ ] `frontend/src/components/Admin/Layout/AdminLayout.jsx`
- [ ] `frontend/src/pages/Admin/*`
- [ ] `frontend/src/pages/Admin/CarouselManagement.jsx`

## 🚀 Proceso Recomendado

1. **Leer el archivo actual**
2. **Identificar clases de Tailwind con valores fijos**
3. **Aplicar patrones mobile-first según la tabla de arriba**
4. **Probar en diferentes tamaños**:
   - Móvil: 375px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1280px (Laptop)

## ⚠️ Reglas Importantes

1. ✅ **SIEMPRE** comenzar sin prefijo (móvil primero)
2. ✅ **NUNCA** eliminar funcionalidad existente
3. ✅ **MANTENER** todos los nombres de variables, props y funciones
4. ✅ **USAR** `gap-*` en lugar de `space-x-*` con `flex-wrap`
5. ✅ **AGREGAR** `flex-shrink-0` a elementos que no deben encogerse
6. ✅ **PREFERIR** `w-full` + breakpoints sobre anchos fijos

## 📐 Ejemplos Completos

### Ejemplo: Card Component
```jsx
// ❌ Antes
<div className="bg-surface rounded-xl overflow-hidden shadow-lg p-4">
  <h3 className="text-lg font-bold mb-2">Título</h3>
  <p className="text-sm text-gray-400">Descripción</p>
</div>

// ✅ Después
<div className="bg-surface rounded-lg sm:rounded-xl overflow-hidden shadow-lg p-3 sm:p-4">
  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2">Título</h3>
  <p className="text-xs sm:text-sm text-gray-400">Descripción</p>
</div>
```

### Ejemplo: Header Component
```jsx
// ❌ Antes
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-4xl font-bold mb-4">Título Principal</h1>
  <div className="md:flex space-y-6 md:space-y-0 md:space-x-8">
    <div className="md:w-1/3">Sidebar</div>
    <div className="md:w-2/3">Content</div>
  </div>
</div>

// ✅ Después
<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Título Principal</h1>
  <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
    <div className="w-full md:w-1/3">Sidebar</div>
    <div className="w-full md:w-2/3">Content</div>
  </div>
</div>
```

## 🎨 Utilidades Adicionales

### Flex-shrink para evitar aplastamiento
```jsx
className="flex-shrink-0"  // Para logos, iconos, avatares
```

### Active states para móvil
```jsx
className="active:scale-95 transform duration-150"  // Feedback táctil
```

### Texto truncado responsive
```jsx
className="line-clamp-2 sm:line-clamp-3"  // Más líneas en pantallas grandes
```

### Max-width responsive
```jsx
className="w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
```

---

## 🎯 Estado Actual

**Archivos Actualizados**: 6/150+ archivos
**Progreso Estimado**: 4%
**Siguiente paso**: Continuar con componentes de CourseDetail y Events

**Recomendación**: Aplicar estos patrones sistemáticamente a cada archivo siguiendo el orden de prioridad establecido.
