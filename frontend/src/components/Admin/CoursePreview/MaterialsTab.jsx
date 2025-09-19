import { getTypeIcon, ExternalLinkIcon } from '../../common/Icons'
import { MATERIAL_COLORS } from '../../../constants/formConstants'

const MaterialsTab = ({ course }) => {
  const getMaterialColor = (type) => {
    return MATERIAL_COLORS[type] || MATERIAL_COLORS.default
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Materiales del Curso
      </h3>

      {course.materials && course.materials.length > 0 ? (
        <div className="space-y-3">
          {course.materials.map((material, index) => (
            <div key={index} className="bg-background rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getMaterialColor(material.type)}`}>
                  {getTypeIcon(material.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{material.name || `Material ${index + 1}`}</p>
                  <p className="text-xs text-gray-400 uppercase">{material.type}</p>
                </div>
              </div>
              {material.url && (
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light transition-colors flex items-center space-x-2"
                >
                  <span className="text-sm">Ver</span>
                  <ExternalLinkIcon />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No hay materiales agregados aún
        </div>
      )}

      {/* Materials by Lesson */}
      {course.lessons && course.lessons.some(l => l.materials?.length > 0) && (
        <div className="mt-8">
          <h4 className="text-md font-semibold text-white mb-3">Materiales por Lección</h4>
          <div className="space-y-3">
            {course.lessons.filter(l => l.materials?.length > 0).map((lesson) => (
              <div key={lesson.id} className="bg-background rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">{lesson.title}</h5>
                <div className="space-y-2 pl-4">
                  {lesson.materials.map((material, materialIndex) => (
                    <div key={materialIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                      {getTypeIcon(material.type)}
                      <span>{material.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialsTab