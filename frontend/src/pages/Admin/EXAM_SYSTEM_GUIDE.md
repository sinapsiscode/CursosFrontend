# Guía del Sistema de Exámenes Mejorado

## Características Principales

### 1. **Gestión Completa de Exámenes (CRUD)**
- **Crear** exámenes desde cero
- **Editar** exámenes existentes
- **Duplicar** exámenes para crear variantes
- **Eliminar** exámenes
- **Activar/Desactivar** exámenes

### 2. **Tipos de Exámenes**
- **Examen Inicial**: Para nuevos estudiantes
- **Examen de Curso**: Asociado a un curso específico
- **Certificación**: Para obtener certificados

### 3. **Asociación con Cursos**
- Los exámenes pueden vincularse a cursos específicos
- Filtrado por curso en la lista de exámenes
- Un curso puede tener múltiples exámenes

### 4. **Configuración Avanzada**
- **Duración**: 5 a 180 minutos
- **Puntaje de aprobación**: Configurable (0-100%)
- **Intentos permitidos**: 1 a 10 intentos
- **Área temática**: Metalurgia, Minería, Geología o Todas
- **Estado**: Activo/Inactivo

### 5. **Sistema de Preguntas Mejorado**
- Puntos por pregunta (configurable)
- Imágenes en preguntas y opciones
- Vista previa de imágenes
- Reordenamiento de preguntas (próximamente)

## Cómo Usar el Sistema

### Crear un Nuevo Examen

1. **Ir a la pestaña "Exámenes"** en el panel de administración
2. **Click en "Crear Examen"**
3. **Completar información básica**:
   - Título (obligatorio)
   - Tipo de examen
   - Descripción
   - Curso asociado (si es examen de curso)
4. **Configurar parámetros**:
   - Duración
   - Puntaje de aprobación
   - Intentos permitidos
   - Área temática
5. **Agregar preguntas**:
   - Click en "Agregar Pregunta"
   - Escribir pregunta y opciones
   - Marcar respuesta correcta
   - Asignar puntos
   - (Opcional) Agregar imágenes
6. **Guardar el examen**

### Filtrar y Buscar Exámenes

- **Por tipo**: Inicial, Curso, Certificación
- **Por curso**: Seleccionar curso específico
- Los filtros se aplican en tiempo real

### Estados del Examen

- **Activo** (verde): Los estudiantes pueden tomar el examen
- **Inactivo** (rojo): El examen no está disponible

### Acciones Rápidas

- **👁️ Ver**: Previsualizar el examen (próximamente)
- **✏️ Editar**: Modificar cualquier aspecto
- **📋 Duplicar**: Crear copia del examen
- **🗑️ Eliminar**: Eliminar permanentemente
- **✅/❌ Activar/Desactivar**: Cambiar disponibilidad

## Estructura de Datos

```javascript
{
  id: "1234567890",
  title: "Examen Final de Metalurgia",
  description: "Evaluación completa del módulo",
  type: "course", // initial, course, certification
  courseId: "course123",
  area: "metalurgia",
  duration: 60, // minutos
  passingScore: 70, // %
  attempts: 3,
  isActive: true,
  questions: [
    {
      id: "q1",
      question: "¿Cuál es...?",
      questionImage: "url",
      options: ["A", "B", "C", "D"],
      optionImages: ["", "", "", ""],
      correct: 0,
      points: 10
    }
  ],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

## Próximas Mejoras

1. **Vista previa del examen** como lo verían los estudiantes
2. **Importar/Exportar** exámenes (JSON, Excel)
3. **Banco de preguntas** reutilizable
4. **Estadísticas** de rendimiento por examen
5. **Preguntas de diferentes tipos**:
   - Opción múltiple (actual)
   - Verdadero/Falso
   - Respuesta corta
   - Ensayo
6. **Aleatorización** de preguntas y opciones
7. **Categorías de preguntas** dentro del examen

## Tips y Mejores Prácticas

1. **Organización**:
   - Usar títulos descriptivos
   - Incluir el nivel en el título (Básico, Intermedio, Avanzado)
   - Agregar descripciones claras

2. **Preguntas**:
   - Redactar de forma clara y concisa
   - Evitar ambigüedades
   - Usar imágenes cuando agreguen valor
   - Balancear la dificultad

3. **Configuración**:
   - 60-90 minutos para exámenes completos
   - 70-80% para aprobación estándar
   - 2-3 intentos para exámenes de práctica
   - 1 intento para certificaciones

4. **Imágenes**:
   - Usar servicios confiables (Imgur, Cloudinary)
   - Optimizar tamaño (max 1MB)
   - Verificar que carguen correctamente