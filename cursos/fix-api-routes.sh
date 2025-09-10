#!/bin/bash

# Script para corregir todas las rutas de API incorrectas
# Corrige las rutas para que coincidan con el backend JSON Server

echo "Corrigiendo rutas de API..."

# Buscar y corregir archivos con rutas incorrectas
echo "Corrigiendo rutas de cursos y áreas..."
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l "apiClient\.get('/courses')" {} \; | while read file; do
  echo "  Procesando: $file"
  sed -i "s|apiClient\.get('/courses')|apiClient.get('/content/courses')|g" "$file"
done

find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l "apiClient\.get('/areas')" {} \; | while read file; do
  echo "  Procesando: $file"
  sed -i "s|apiClient\.get('/areas')|apiClient.get('/content/areas')|g" "$file"
done

# Corregir rutas de config
echo "Corrigiendo rutas de configuración..."
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l "apiClient\.get('/config" {} \; | while read file; do
  echo "  Procesando: $file"
  sed -i "s|apiClient\.get('/config/1')|apiClient.get('/config/general')|g" "$file"
  sed -i "s|apiClient\.get('/config')|apiClient.get('/config/general')|g" "$file"
done

# Corregir rutas POST incorrectas
echo "Corrigiendo rutas POST..."
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l "apiClient\.post('/api/" {} \; | while read file; do
  echo "  Procesando: $file"
  # Eliminar el prefijo /api/ ya que el proxy lo agrega automáticamente
  sed -i "s|apiClient\.post('/api/|apiClient.post('/|g" "$file"
done

echo "✅ Rutas corregidas exitosamente"