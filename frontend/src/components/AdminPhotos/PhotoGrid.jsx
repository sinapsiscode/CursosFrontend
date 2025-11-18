import PhotoCard from './PhotoCard'

/**
 * PhotoGrid component - Grid layout for photos
 */
const PhotoGrid = ({ photos, onEdit, onDelete, onToggleStatus, onAddPhoto }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-xl">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold text-white mb-2">No hay fotos configuradas</h3>
        <p className="text-secondary mb-6">
          Comienza agregando fotos que aparecerán en el perfil de los estudiantes
        </p>
        <button
          onClick={onAddPhoto}
          className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Agregar primera foto
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}

export default PhotoGrid
