import { UsersIcon, StarIcon } from '../../common/Icons'
import { formatDuration } from '../../../utils/formatters'

const StatsTab = ({ course }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Estadísticas del Curso
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Estudiantes Inscritos</p>
              <p className="text-3xl font-bold text-white mt-1">{course.students || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <UsersIcon className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Calificación</p>
              <p className="text-3xl font-bold text-white mt-1">
                {course.rating || 0} ⭐
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <StarIcon className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg p-6">
        <h4 className="text-md font-semibold text-white mb-3">Desglose de Contenido</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Total de Lecciones:</span>
            <span className="text-white">{course.lessons?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duración Total:</span>
            <span className="text-white">{formatDuration(course.duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Materiales:</span>
            <span className="text-white">{course.materials?.length || 0} archivos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lecciones Gratuitas:</span>
            <span className="text-white">
              {course.lessons?.filter(l => l.isFree).length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsTab