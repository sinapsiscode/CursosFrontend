const DeleteCourseModal = ({ course, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Eliminar Curso</h3>
            <p className="text-sm text-secondary">Esta acción no se puede deshacer</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-background/50 rounded-lg p-4 mb-6">
          <p className="text-white mb-2">¿Estás seguro de que deseas eliminar este curso?</p>
          <div className="flex items-center gap-3 mt-3 p-3 bg-surface rounded-lg">
            {(course.imagen || course.thumbnail) && (
              <img
                src={course.imagen || course.thumbnail}
                alt={course.titulo || course.title}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{course.titulo || course.title}</p>
              <p className="text-secondary text-sm truncate">{course.instructor}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">
              <strong>⚠️ Advertencia:</strong> Se eliminarán permanentemente:
            </p>
            <ul className="text-red-300 text-xs mt-2 ml-4 space-y-1">
              <li>• El curso y todo su contenido</li>
              <li>• Progreso de estudiantes inscritos</li>
              <li>• Estadísticas y calificaciones</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-background hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(course)}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCourseModal
