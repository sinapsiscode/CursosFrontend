import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useProgressStore } from '../store'
import { LoadingSpinner } from '../components/common'
import VideoPlayer from '../components/courses/VideoPlayer'
import { apiService } from '../services/api'

const LessonView = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { updateLessonProgress, markLessonComplete } = useProgressStore()
  
  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('video')

  useEffect(() => {
    loadLessonData()
  }, [courseId, lessonId])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      const courseData = await apiService.getCourseById(courseId)
      if (courseData) {
        setCourse(courseData)
        const lessonData = courseData.lessons?.find(l => l.id.toString() === lessonId)
        if (lessonData) {
          setLesson(lessonData)
          // Registrar progreso
          updateLessonProgress(courseId, lessonId)
        } else {
          navigate(`/course/${courseId}`)
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
      navigate(`/course/${courseId}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = () => {
    markLessonComplete(courseId, lessonId)
    // Ir a la siguiente lección si existe
    const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId)
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }

  const handleNextLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId)
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }

  const handlePreviousLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId)
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1]
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!lesson || (!lesson.isFree && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Contenido Premium</h2>
          <p className="text-text-secondary mb-4">Esta lección requiere una suscripción activa</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            Volver al curso
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId)
  const hasNext = currentIndex < course.lessons.length - 1
  const hasPrevious = currentIndex > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver al curso</span>
          </button>
          
          <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-text-secondary">
            Lección {currentIndex + 1} de {course.lessons.length} • {course.title}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player - Columna principal */}
          <div className="lg:col-span-2">
            <VideoPlayer
              course={course}
              lesson={lesson}
              onLessonComplete={handleLessonComplete}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />

            {/* Tabs de contenido */}
            <div className="mt-8">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: 'descripcion', label: 'Descripción' },
                    { id: 'materiales', label: 'Materiales' },
                    { id: 'notas', label: 'Notas' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-6">
                {activeTab === 'descripcion' && (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-secondary">
                      {lesson.description || 'Sin descripción disponible'}
                    </p>
                  </div>
                )}

                {activeTab === 'materiales' && (
                  <div>
                    {lesson.materials && lesson.materials.length > 0 ? (
                      <div className="space-y-3">
                        {lesson.materials.map((material, index) => (
                          <a
                            key={index}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                material.type === 'pdf' ? 'bg-red-500' :
                                material.type === 'document' ? 'bg-blue-500' :
                                material.type === 'excel' ? 'bg-green-500' :
                                'bg-gray-500'
                              }`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-white font-medium">{material.name}</p>
                                <p className="text-xs text-gray-400 uppercase">{material.type}</p>
                              </div>
                            </div>
                            <span className="text-accent group-hover:text-accent-light flex items-center space-x-2">
                              <span className="text-sm">Descargar</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-secondary text-center py-8">
                        No hay materiales disponibles para esta lección
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'notas' && (
                  <div>
                    <textarea
                      className="w-full h-40 px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Toma notas sobre esta lección..."
                    />
                    <button className="mt-4 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90">
                      Guardar notas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Lista de lecciones */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Contenido del curso
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.lessons.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() => navigate(`/course/${courseId}/lesson/${l.id}`)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      l.id.toString() === lessonId
                        ? 'bg-accent text-background'
                        : 'hover:bg-gray-700 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        l.id.toString() === lessonId
                          ? 'bg-background text-accent'
                          : 'bg-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{l.title}</p>
                        <p className="text-xs opacity-75">
                          {Math.floor(l.duration / 60)}:{(l.duration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                      {!l.isFree && !isAuthenticated && (
                        <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonView