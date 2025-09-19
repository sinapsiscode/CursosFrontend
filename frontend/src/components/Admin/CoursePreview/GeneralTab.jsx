import { formatDuration, formatStatus } from '../../../utils/formatters'

const GeneralTab = ({ course }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Detalles del Curso</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Área:</span>
              <span className="text-white capitalize">{course.area}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nivel:</span>
              <span className="text-white capitalize">{course.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duración:</span>
              <span className="text-white">{formatDuration(course.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lecciones:</span>
              <span className="text-white">{course.lessons?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado:</span>
              <span className={`${course.published ? 'text-green-400' : 'text-yellow-400'}`}>
                {formatStatus(course.published)}
              </span>
            </div>
          </div>
        </div>

        {course.thumbnail && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Vista Previa</h3>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
        <p className="text-gray-300 whitespace-pre-line">
          {course.description || 'Sin descripción disponible'}
        </p>
      </div>

      {course.objectives && course.objectives.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Objetivos de Aprendizaje</h3>
          <ul className="list-disc list-inside space-y-1">
            {course.objectives.map((objective, index) => (
              <li key={index} className="text-gray-300">{objective}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default GeneralTab