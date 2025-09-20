import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import AdminPhotos from '../../../AdminPhotos'

const PhotosPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Fotos">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Administración de imágenes y recursos visuales de la plataforma
        </p>

        {/* Usar el componente existente */}
        <AdminPhotos />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total de fotos:</span>
                <span className="text-blue-400">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Subidas hoy:</span>
                <span className="text-green-400">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Espacio usado:</span>
                <span className="text-yellow-400">2.3 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">⚡ Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                📤 Subir Fotos
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                🗂️ Organizar Galería
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                🗑️ Limpiar Duplicados
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default PhotosPage