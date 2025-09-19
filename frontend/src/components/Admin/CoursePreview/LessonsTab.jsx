import { PlayIcon, DocumentIcon } from '../../common/Icons'
import { formatTime } from '../../../utils/formatters'

const LessonsTab = ({ course }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Contenido del Curso ({course.lessons?.length || 0} lecciones)
      </h3>

      {course.lessons && course.lessons.length > 0 ? (
        course.lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-background rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white font-medium">{lesson.title}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                    <span>{formatTime(lesson.duration)}</span>
                    {lesson.videoUrl && (
                      <span className="flex items-center space-x-1">
                        <PlayIcon />
                        <span>Video</span>
                      </span>
                    )}
                    {lesson.materials && lesson.materials.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <DocumentIcon />
                        <span>{lesson.materials.length} materiales</span>
                      </span>
                    )}
                  </div>
                  {lesson.description && (
                    <p className="text-sm text-gray-500 mt-2">{lesson.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {lesson.isFree && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">GRATIS</span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-400">
          No hay lecciones agregadas aún
        </div>
      )}
    </div>
  )
}

export default LessonsTab