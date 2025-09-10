# Guía de Integración: Sistema de Exámenes

## Flujo del Sistema

### 1. **Creación de Exámenes (Admin)**
- El administrador crea exámenes desde el panel en la pestaña "Exámenes"
- Puede crear 3 tipos: Inicial, Por Curso, Certificación
- Agrega preguntas con imágenes opcionales

### 2. **Almacenamiento**
- Los exámenes se guardan en `localStorage` con la clave `course_exams`
- Estructura compatible con el sistema existente

### 3. **Visualización (Estudiantes)**

#### Para Examen Inicial:
- El componente `InitialExam.jsx` busca automáticamente:
  1. Primero en `course_exams` un examen tipo "initial" activo
  2. Si no encuentra, busca en `exam_questions` (formato antiguo)
  3. Si no hay nada, usa las preguntas predeterminadas

#### Para Exámenes de Curso:
- Se mostrarán en la página del curso (próximamente)
- Usarán el mismo componente de visualización

## Estructura de Datos (IMPORTANTE)

### Formato de Pregunta:
```javascript
{
  id: "1" o 1,                    // ID único
  question: "¿Cuál es...?",       // Texto de la pregunta
  questionImage: "https://...",    // URL de imagen o null
  options: [                       // Exactamente 4 opciones
    "Opción A",
    "Opción B", 
    "Opción C",
    "Opción D"
  ],
  optionImages: [                  // URLs para cada opción o null
    null,
    "https://imagen-b.jpg",
    null,
    null
  ],
  correct: 0,                      // Índice (0-3) de la respuesta correcta
  area: "metalurgia",              // metalurgia, mineria o geologia
  points: 10                       // Puntos (solo en sistema nuevo)
}
```

## Cómo se Muestran las Imágenes

### En la Pregunta:
- Se muestra debajo del texto de la pregunta
- Tamaño máximo: 300px de alto
- Se centra automáticamente
- Si falla la carga, se oculta

### En las Opciones:
- Se muestra a la derecha de cada opción
- Tamaño: 64x64px (miniatura)
- Si falla la carga, se oculta

## Compatibilidad

El sistema nuevo es 100% compatible con el componente `InitialExam.jsx` existente:

1. **Misma estructura de datos** ✓
2. **Mismo manejo de imágenes** ✓
3. **Mismo sistema de respuestas** ✓
4. **Misma lógica de puntuación** ✓

## Ejemplo de Uso

### 1. Crear Examen Inicial con Imágenes:
```javascript
// En el panel admin
1. Ir a Exámenes
2. Crear Examen
3. Tipo: "Examen Inicial"
4. Agregar preguntas:
   - Texto de la pregunta
   - URL de imagen (opcional)
   - 4 opciones de respuesta
   - URLs de imágenes para opciones (opcional)
   - Marcar respuesta correcta
```

### 2. El estudiante verá:
- La pregunta con su imagen (si tiene)
- Las 4 opciones con sus imágenes (si tienen)
- Podrá seleccionar y navegar igual que antes

## Servicios de Imágenes Recomendados

Para subir imágenes usa:
1. **Imgur.com** - Gratis, fácil
2. **ImgBB.com** - Gratis hasta 32MB
3. **Cloudinary** - Gratis hasta 25GB/mes

### Formato de URL correcto:
```
https://i.imgur.com/abc123.jpg ✓
https://ejemplo.com/imagen.png ✓
/imagenes/local.jpg ✗ (no funcionará)
```

## Notas Importantes

1. **No cambiar la estructura**: El formato debe ser exactamente como se muestra
2. **Siempre 4 opciones**: No más, no menos
3. **URLs completas**: Las imágenes deben ser URLs públicas accesibles
4. **Validar imágenes**: Probar que las URLs funcionen antes de guardar

El sistema mantiene toda la funcionalidad original y agrega la capacidad de gestionar múltiples exámenes.