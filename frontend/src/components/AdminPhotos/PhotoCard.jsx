/**
 * PhotoCard component - Individual photo card with actions
 */
const PhotoCard = ({ photo, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-48 object-cover"
        />

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            photo.active !== false
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {photo.active !== false ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => onToggleStatus(photo)}
            className={`p-2 rounded-full transition-colors ${
              photo.active !== false
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={photo.active !== false ? 'Desactivar' : 'Activar'}
          >
            {photo.active !== false ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2">{photo.title}</h3>

        {photo.description && (
          <p className="text-secondary text-sm mb-3 line-clamp-2">
            {photo.description}
          </p>
        )}

        {photo.date && (
          <p className="text-secondary text-xs mb-3">
            📅 {new Date(photo.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}

        <div className="text-secondary text-xs mb-4">
          Creada: {new Date(photo.createdAt).toLocaleDateString('es-ES')}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(photo)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>

          <button
            onClick={() => onDelete(photo.id)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhotoCard
