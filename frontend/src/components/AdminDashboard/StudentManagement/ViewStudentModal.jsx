const ViewStudentModal = ({ student, onClose }) => {
  if (!student) return null

  const displayName = student.nombre || student.userName || student.name || student.userId || student.id
  const displayEmail = student.email || student.userEmail || 'No especificado'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <h3 className="text-xl font-bold text-white">Detalles del Estudiante</h3>
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
          <div className="p-6 space-y-6">
            {/* Información básica */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{displayName}</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-xs text-secondary mb-1">Email</div>
                  <div className="text-white font-medium">{displayEmail}</div>
                </div>

                {student.dni && (
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="text-xs text-secondary mb-1">DNI</div>
                    <div className="text-white font-medium">{student.dni}</div>
                  </div>
                )}

                {student.telefono && (
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="text-xs text-secondary mb-1">Teléfono</div>
                    <div className="text-white font-medium">{student.telefono}</div>
                  </div>
                )}

                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-xs text-secondary mb-1">Estado</div>
                  <div className={student.activo ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                    {student.activo ? '✓ Activo' : '✗ Suspendido'}
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">📊 Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Cursos inscritos:</span>
                    <span className="text-white font-medium">{student.enrolledCourses?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Puntos:</span>
                    <span className="text-accent font-medium">{student.puntos || 0}</span>
                  </div>
                  {student.subscription && (
                    <div className="flex justify-between">
                      <span className="text-secondary">Suscripción:</span>
                      <span className="text-white font-medium capitalize">{student.subscription.type || 'Free'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">📅 Registro</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Fecha de creación:</span>
                    <span className="text-white font-medium">
                      {student.fechaCreacion
                        ? new Date(student.fechaCreacion).toLocaleDateString('es-ES')
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">ID:</span>
                    <span className="text-white font-mono text-xs">#{student.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cursos inscritos */}
            {student.enrolledCourses && student.enrolledCourses.length > 0 && (
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">📚 Cursos Inscritos</h4>
                <div className="space-y-2">
                  {student.enrolledCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-white">{course.title || course.titulo || 'Curso sin título'}</span>
                      {course.progress !== undefined && (
                        <span className="text-accent text-sm">{course.progress}% completado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progreso en cursos */}
            {student.progress && Object.keys(student.progress).length > 0 && (
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">📈 Progreso</h4>
                <div className="space-y-3">
                  {Object.entries(student.progress).map(([courseId, progress]) => (
                    <div key={courseId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary">Curso #{courseId}</span>
                        <span className="text-accent font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent rounded-full h-2 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-gray-700/50 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewStudentModal
