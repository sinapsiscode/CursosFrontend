# Guía: Imágenes en Exámenes

## Estructura de Preguntas con Imágenes

Cada pregunta del examen ahora soporta imágenes tanto en la pregunta como en las opciones de respuesta.

### Formato de Pregunta:

```javascript
{
  id: 1,
  question: "¿Cuál es el mineral mostrado en la imagen?",
  questionImage: "https://ejemplo.com/mineral.jpg", // URL de la imagen de la pregunta
  options: ["Cuarzo", "Pirita", "Galena", "Calcita"],
  optionImages: [
    null,                                         // Sin imagen para opción A
    "https://ejemplo.com/pirita.jpg",            // Imagen para opción B
    null,                                        // Sin imagen para opción C
    "https://ejemplo.com/calcita.jpg"            // Imagen para opción D
  ],
  correct: 1,
  area: "geologia"
}
```

## Cómo Agregar Imágenes

### 1. Para la Pregunta:
- Agrega la URL de la imagen en el campo `questionImage`
- Usa `null` si no quieres imagen
- La imagen se mostrará debajo del texto de la pregunta

### 2. Para las Opciones:
- El array `optionImages` debe tener 4 elementos (uno por cada opción)
- Usa `null` para opciones sin imagen
- Las imágenes aparecerán a la derecha del texto de la opción

## Recomendaciones:

### Tamaño de Imágenes:
- **Preguntas**: Máximo 800x600px (se ajustará automáticamente)
- **Opciones**: Idealmente 100x100px (se mostrará como miniatura)

### Formatos Soportados:
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

### URLs de Imágenes:
1. **Servicios gratuitos recomendados:**
   - Imgur: https://imgur.com
   - ImgBB: https://imgbb.com
   - Cloudinary (gratis hasta 25GB): https://cloudinary.com

2. **Para desarrollo/pruebas:**
   - Unsplash: https://unsplash.com (fotos stock)
   - Lorem Picsum: https://picsum.photos (imágenes aleatorias)

### Ejemplo de Pregunta Visual:

```javascript
{
  id: 11,
  question: "Identifica el tipo de estructura cristalina mostrada:",
  questionImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/NaCl_crystal_structure.png/400px-NaCl_crystal_structure.png",
  options: [
    "Cúbica simple",
    "Cúbica centrada en las caras",
    "Cúbica centrada en el cuerpo",
    "Hexagonal"
  ],
  optionImages: [
    "https://ejemplo.com/cubica-simple.png",
    "https://ejemplo.com/cubica-caras.png",
    "https://ejemplo.com/cubica-cuerpo.png",
    "https://ejemplo.com/hexagonal.png"
  ],
  correct: 1,
  area: "metalurgia"
}
```

## Manejo de Errores:
- Si una imagen no carga, se ocultará automáticamente
- El examen funcionará normalmente sin las imágenes
- Se recomienda probar todas las URLs antes de usarlas

## Próximas Mejoras Posibles:
1. Panel de administración para subir imágenes
2. Zoom en imágenes al hacer clic
3. Soporte para videos explicativos
4. Galería de imágenes predefinidas