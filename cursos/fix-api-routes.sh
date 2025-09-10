#!/bin/bash

# Script para corregir todas las rutas de API incorrectas
# Elimina el prefijo /api/ de todas las llamadas porque el proxy ya lo maneja

echo "Corrigiendo rutas de API..."

# Archivos a corregir
files=(
  "src/services/whatsappService.js"
  "src/pages/user/MyFavorites.jsx"
  "src/pages/public/CourseDetail.jsx"
  "src/pages/admin/CourseManager.jsx"
  "src/pages/user/MyCourses.jsx"
  "src/pages/public/CourseCatalog.jsx"
  "src/pages/user/Dashboard.jsx"
  "src/pages/public/HomePage.jsx"
  "src/pages/admin/SystemCheck.jsx"
  "src/services/analyticsService.js"
  "src/pages/admin/WhatsAppManager.jsx"
  "src/components/forms/LeadCaptureForm.jsx"
  "src/components/whatsapp/WhatsAppWidget.jsx"
  "src/pages/admin/ReviewManager.jsx"
  "src/components/reviews/ReviewForm.jsx"
  "src/pages/guest/ExamInitial.jsx"
  "src/components/exams/InitialExam.jsx"
  "src/pages/admin/ConfigManager.jsx"
  "src/pages/admin/LeadManager.jsx"
  "src/pages/guest/CourseExplorer.jsx"
  "src/pages/admin/AreaManager.jsx"
  "src/pages/guest/AreaSelection.jsx"
  "src/pages/guest/Home.jsx"
  "src/pages/user/EventsPage.jsx"
  "src/pages/user/CertificatesPage.jsx"
  "src/pages/admin/Dashboard.jsx"
  "src/components/reviews/ReviewsList.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Procesando: $file"
    
    # Reemplazar /api/ con / en todas las llamadas de apiClient
    sed -i "s|apiClient\.get('/api/|apiClient.get('/|g" "$file"
    sed -i "s|apiClient\.post('/api/|apiClient.post('/|g" "$file"
    sed -i "s|apiClient\.put('/api/|apiClient.put('/|g" "$file"
    sed -i "s|apiClient\.patch('/api/|apiClient.patch('/|g" "$file"
    sed -i "s|apiClient\.delete('/api/|apiClient.delete('/|g" "$file"
    
    # También para api. (sin Client)
    sed -i "s|api\.get('/api/|api.get('/|g" "$file"
    sed -i "s|api\.post('/api/|api.post('/|g" "$file"
    sed -i "s|api\.put('/api/|api.put('/|g" "$file"
    sed -i "s|api\.patch('/api/|api.patch('/|g" "$file"
    sed -i "s|api\.delete('/api/|api.delete('/|g" "$file"
  fi
done

echo "✅ Rutas corregidas exitosamente"