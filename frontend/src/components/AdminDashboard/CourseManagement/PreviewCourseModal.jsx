const PreviewCourseModal = ({ course, onClose }) => {
  if (!course) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">👁️</span>
            </div>
            <h3 className="text-xl font-bold text-white">Vista Previa del Curso</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center text-secondary hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Imagen destacada */}
          {(course.imagen || course.thumbnail) && (
            <div className="relative h-64 bg-background">
              <img
                src={course.imagen || course.thumbnail}
                alt={course.titulo || course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          )}

          {/* Información del curso */}
          <div className="p-6 space-y-6">
            {/* Título y badges */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <h2 className="text-2xl font-bold text-white flex-1">{course.titulo || course.title}</h2>
                {course.isNew && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    Nuevo
                  </span>
                )}
                {course.destacado && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                    ⭐ Destacado
                  </span>
                )}
              </div>
              <p className="text-secondary">{course.descripcion || course.description || 'Sin descripción'}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <div className="text-xs text-secondary mb-1">Instructor</div>
                <div className="text-white font-semibold">{course.instructor}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <div className="text-xs text-secondary mb-1">Área</div>
                <div className="text-white font-semibold">{course.area}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <div className="text-xs text-secondary mb-1">Nivel</div>
                <div className="text-white font-semibold">{course.level}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <div className="text-xs text-secondary mb-1">Duración</div>
                <div className="text-white font-semibold">{course.duracion || course.duration} min</div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">📊 Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Estudiantes:</span>
                    <span className="text-white font-medium">{course.estudiantesInscritos || course.students || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Calificación:</span>
                    <span className="text-white font-medium">
                      {(course.calificacion || course.rating) ? `${(course.calificacion || course.rating).toFixed(1)} ⭐` : 'Sin calificar'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Precio:</span>
                    <span className="text-accent font-medium">Gratis</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">⚙️ Estado</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Visible:</span>
                    <span className={(course.activo ?? course.active) ? 'text-green-400' : 'text-red-400'}>
                      {(course.activo ?? course.active) ? '✓ Activo' : '✗ Inactivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Destacado:</span>
                    <span className={(course.destacado ?? course.featured) ? 'text-green-400' : 'text-gray-400'}>
                      {(course.destacado ?? course.featured) ? '✓ Sí' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">ID:</span>
                    <span className="text-white font-mono text-xs">#{course.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del curso */}
            {course.content && course.content.length > 0 && (
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">📚 Contenido del curso</h4>
                <div className="space-y-2">
                  {course.content.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-accent">{index + 1}.</span>
                      <span className="text-white">{item.title || item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-gray-700/50 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-background hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.open(`/course/${course.id}`, '_blank')}
            className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium"
          >
            🔗 Abrir en nueva pestaña
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewCourseModal
