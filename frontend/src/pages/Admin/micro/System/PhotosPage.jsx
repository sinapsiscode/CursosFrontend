import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import AdminPhotos from '../../AdminPhotos'

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
      </div>
    </PageLayout>
  )
}

export default PhotosPage