const SuspendStudentModal = ({ student, onConfirm, onCancel }) => {
  const displayName = student.nombre || student.userName || student.name || student.userId || student.id
  const isSuspended = !student.activo
  const action = isSuspended ? 'reactivar' : 'suspender'
  const actionTitle = isSuspended ? 'Reactivar Estudiante' : 'Suspender Estudiante'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSuspended ? 'bg-green-500/20' : 'bg-orange-500/20'
          }`}>
            <span className="text-2xl">{isSuspended ? '✓' : '⚠️'}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{actionTitle}</h3>
            <p className="text-sm text-secondary">
              {isSuspended ? 'El estudiante podrá acceder nuevamente' : 'El estudiante no podrá acceder'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-background/50 rounded-lg p-4 mb-6">
          <p className="text-white mb-2">
            ¿Estás seguro de que deseas {action} a este estudiante?
          </p>

          <div className="flex items-center gap-3 mt-3 p-3 bg-surface rounded-lg">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{displayName}</p>
              <p className="text-secondary text-sm truncate">{student.email || student.userEmail || 'Sin email'}</p>
            </div>
          </div>

          {!isSuspended && (
            <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 text-sm">
                <strong>⚠️ Advertencia:</strong> Al suspender el estudiante:
              </p>
              <ul className="text-orange-300 text-xs mt-2 ml-4 space-y-1">
                <li>• No podrá acceder a la plataforma</li>
                <li>• Se mantendrá su progreso guardado</li>
                <li>• Podrá ser reactivado en cualquier momento</li>
              </ul>
            </div>
          )}

          {isSuspended && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">
                <strong>✓ Información:</strong> Al reactivar el estudiante:
              </p>
              <ul className="text-green-300 text-xs mt-2 ml-4 space-y-1">
                <li>• Podrá acceder nuevamente a la plataforma</li>
                <li>• Conservará todo su progreso anterior</li>
                <li>• Podrá continuar sus cursos</li>
              </ul>
            </div>
          )}
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
            onClick={() => onConfirm(student)}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium ${
              isSuspended
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isSuspended ? 'Sí, reactivar' : 'Sí, suspender'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuspendStudentModal
