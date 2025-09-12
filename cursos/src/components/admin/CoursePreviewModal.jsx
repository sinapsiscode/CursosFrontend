import { useState } from 'react'
import { Modal } from '../common'

const CoursePreviewModal = ({ course, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general')
  
  // Validación temprana para evitar errores
  if (!isOpen || !course) return null
  
  try {

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xlarge">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{course?.title || 'Sin título'}</h2>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>Por {course?.instructor || 'Sin instructor'}</span>
                <span>•</span>
                <span>{formatDuration(course?.duration)}</span>
                <span>•</span>
                <span className={course?.price === 0 ? 'text-green-400' : 'text-accent'}>
                  {course?.price === 0 ? 'Gratis' : `$${course?.price || 0}`}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8 -mb-px">
            {[
              { id: 'general', label: 'Información General', icon: '📋' },
              { id: 'lessons', label: 'Lecciones', icon: '🎥' },
              { id: 'materials', label: 'Materiales', icon: '📄' },
              { id: 'stats', label: 'Estadísticas', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* General Tab */}
          {activeTab === 'general' && (
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
                        {course.published ? 'Publicado' : 'Borrador'}
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
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
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
                            <span>{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}</span>
                            {lesson.videoUrl && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Video</span>
                              </span>
                            )}
                            {lesson.materials && lesson.materials.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
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
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Materiales del Curso
              </h3>
              
              {course.materials && course.materials.length > 0 ? (
                <div className="space-y-3">
                  {course.materials.map((material, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          material.type === 'pdf' ? 'bg-red-500' :
                          material.type === 'document' ? 'bg-blue-500' :
                          material.type === 'excel' ? 'bg-green-500' :
                          material.type === 'presentation' ? 'bg-orange-500' :
                          material.type === 'video' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}>
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
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
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
                    {course.lessons.filter(l => l.materials?.length > 0).map((lesson, lessonIndex) => (
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
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
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
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
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
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
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
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={() => window.open(`/course/${course.id}`, '_blank')}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Abrir en Nueva Pestaña</span>
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
  } catch (error) {
    console.error('Error in CoursePreviewModal:', error)
    return null
  }
}

export default CoursePreviewModal