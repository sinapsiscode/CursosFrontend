import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore, useProgressStore, useReviewStore } from '../store'
import { LoadingSpinner, Modal } from '../components/common'
import CourseEnrollButton from '../components/courses/CourseEnrollButton'
import ReviewForm from '../components/courses/ReviewForm'
import { apiService } from '../services/api'
import { whatsappService } from '../services/whatsappService'
import { loyaltyService } from '../services/loyaltyService'
import { eventService } from '../services/eventService'
import { examService } from '../services/examService'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, selectedArea, user } = useAuthStore()
  const { toggleFavorite, favorites } = useCourseStore()
  const { getCourseProgress, updateLessonProgress } = useProgressStore()
  const { canReview, loadCourseReviews, reviews, getCourseStats, generateTestData } = useReviewStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('temario')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [whatsappTriggered, setWhatsappTriggered] = useState(false)
  const [courseExam, setCourseExam] = useState(null)
  const [showExamInfo, setShowExamInfo] = useState(false)
  const [isUserEnrolled, setIsUserEnrolled] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [courseReviewStats, setCourseReviewStats] = useState(null)

  const isFavorite = course && favorites && favorites.includes(course.id)
  const progress = course ? getCourseProgress(course.id) : { completedLessons: [], percentage: 0 }
  
  // Asegurar que las propiedades del progreso tengan valores por defecto seguros
  const safeProgress = {
    completedLessons: [],
    percentage: 0,
    lastWatched: null,
    timeSpent: 0,
    ...progress
  }
  // Asegurar que completedLessons sea un array
  if (!Array.isArray(safeProgress.completedLessons)) {
    safeProgress.completedLessons = []
  }

  useEffect(() => {
    loadCourseDetail()
  }, [id])

  useEffect(() => {
    // Cargar examen del curso si existe
    if (course?.id) {
      const exam = examService.getExamByCourse(course.id)
      setCourseExam(exam)
      
      // Cargar reseñas del curso
      console.log('Cargando reseñas para curso:', course.id)
      const result = loadCourseReviews(course.id)
      console.log('Resultado de reseñas:', result)
      if (result?.stats) {
        setCourseReviewStats(result.stats)
      }
    }
  }, [course, loadCourseReviews])

  useEffect(() => {
    // Verificar si el usuario está inscrito en el curso
    const checkEnrollment = async () => {
      if (isAuthenticated && course?.id) {
        try {
          const { isEnrolled } = await apiService.isUserEnrolledInCourse(user?.id, course.id)
          setIsUserEnrolled(isEnrolled)
        } catch (error) {
          console.error('Error checking enrollment:', error)
          setIsUserEnrolled(false)
        }
      } else {
        setIsUserEnrolled(false)
      }
    }
    
    checkEnrollment()
  }, [isAuthenticated, course?.id, user?.id])

  const loadCourseDetail = async () => {
    try {
      setLoading(true)
      const courseData = await apiService.getCourseById(id)
      if (courseData) {
        setCourse(courseData)
        
        // Registrar interés del usuario en este curso
        eventService.trackUserInterest('course_view', {
          courseId: courseData.id,
          courseTitle: courseData.title,
          area: courseData.area || selectedArea,
          tags: courseData.tags || []
        })
        
        // Verificar y notificar eventos relacionados
        setTimeout(() => {
          eventService.checkAndNotifyRelatedEvents(courseData)
        }, 3000) // Esperar 3 segundos para no ser intrusivo
        
        // WhatsApp Lead Generation: Trigger cuando usuario ve un curso específico
        if (!whatsappTriggered) {
          whatsappService.triggerCourseView(courseData)
          setWhatsappTriggered(true)
          
          // Tracking de intereses para eventos personalizados
          eventService.trackUserInterest('course_view', {
            courseId: courseData.id,
            area: courseData.area
          })
        }
      } else {
        navigate('/courses')
      }
    } catch (error) {
      console.error('Error loading course:', error)
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson) => {
    if (lesson.isFree || isAuthenticated) {
      // Simular reproducción de lección
      updateLessonProgress(course.id, lesson.id)
      navigate(`/course/${course.id}/lesson/${lesson.id}`)
    } else {
      setShowSubscriptionModal(true)
    }
  }

  const handleFavoriteToggle = () => {
    toggleFavorite(course.id)
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setShowThankYouModal(true)
    // Recargar reseñas
    if (course?.id) {
      const result = loadCourseReviews(course.id)
      if (result?.stats) {
        setCourseReviewStats(result.stats)
      }
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ))
  }

  const areaColors = {
    metalurgia: {
      bg: 'bg-primary-metalurgia',
      text: 'text-primary-metalurgia',
      border: 'border-primary-metalurgia'
    },
    mineria: {
      bg: 'bg-primary-mineria',
      text: 'text-primary-mineria',
      border: 'border-primary-mineria'
    },
    geologia: {
      bg: 'bg-primary-geologia',
      text: 'text-primary-geologia',
      border: 'border-primary-geologia'
    }
  }

  const levelColors = {
    básico: 'bg-green-500',
    intermedio: 'bg-yellow-500',
    avanzado: 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Curso no encontrado</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    )
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header del curso */}
      <div className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="md:flex items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Imagen */}
            <div className="md:w-1/3">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full aspect-video object-cover rounded-xl"
              />
            </div>

            {/* Info */}
            <div className="md:w-2/3">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`${areaColors[course.area].bg} text-white text-sm px-3 py-1 rounded-full`}>
                  {course.area.charAt(0).toUpperCase() + course.area.slice(1)}
                </span>
                <span className={`${levelColors[course.level]} text-white text-sm px-3 py-1 rounded-full`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                {course.isNew && (
                  <span className="bg-accent text-background text-sm px-3 py-1 rounded-full font-bold">
                    NUEVO
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              <p className="text-text-secondary text-lg mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span className="text-white font-medium">{course.rating}</span>
                  <span className="text-text-secondary">({course.students?.toLocaleString()} estudiantes)</span>
                </div>
                <div className="text-text-secondary">
                  {formatDuration(course.duration)}
                </div>
                <div className="text-text-secondary">
                  {course.lessons?.length} clases
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-white">
                  {course.price === 0 ? (
                    <span className="text-accent">Gratis</span>
                  ) : (
                    <span>S/ {course.price}</span>
                  )}
                </div>
                
                {/* Puntos de fidelización */}
                {course.points && (
                  <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-2 rounded-lg">
                    <span className="text-purple-400 text-lg">🏆</span>
                    <div>
                      <span className="text-purple-400 text-sm block">Gana</span>
                      <span className="text-purple-300 font-bold">
                        {course.points || 100} puntos
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isFavorite
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-gray-600 text-white hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {isAuthenticated && isUserEnrolled ? (
                  <button
                    onClick={() => {
                      // Navegar a la primera lección del curso
                      if (course.lessons && course.lessons.length > 0) {
                        navigate(`/course/${course.id}/lesson/${course.lessons[0].id}`)
                      } else {
                        navigate(`/course/${course.id}/lesson/1`)
                      }
                    }}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Acceder al Curso</span>
                  </button>
                ) : (
                  <CourseEnrollButton 
                    course={course} 
                    onEnroll={async () => {
                      // Recargar curso
                      await loadCourseDetail()
                      
                      // Forzar actualización del estado de inscripción
                      if (isAuthenticated && course?.id && user?.id) {
                        try {
                          const { isEnrolled } = await apiService.isUserEnrolledInCourse(user.id, course.id)
                          console.log('🔄 Estado de inscripción actualizado:', isEnrolled)
                          setIsUserEnrolled(isEnrolled)
                        } catch (error) {
                          console.error('Error actualizando estado de inscripción:', error)
                        }
                      }
                    }}
                  />
                )}
              </div>

              {/* Botón de Examen - Solo para usuarios inscritos */}
              {courseExam && isAuthenticated && isUserEnrolled && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowExamInfo(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Rendir Examen</span>
                  </button>
                  <div className="mt-3 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <p className="text-sm text-purple-300 text-center">
                      <span className="font-semibold">¡Obtén un descuento!</span> Inscríbete y rinde el examen para obtener hasta un 
                      <span className="text-purple-400 font-bold"> 20% de descuento</span> en este curso según tu calificación.
                    </p>
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      • 18-20 puntos: 20% descuento<br/>
                      • 15-17 puntos: 15% descuento<br/>
                      • 11-14 puntos: 10% descuento
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje informativo para usuarios no inscritos */}
              {courseExam && isAuthenticated && !isUserEnrolled && (
                <div className="mt-6 bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <p className="font-medium text-white">Examen Disponible</p>
                      <p className="text-sm text-gray-400">
                        Inscríbete en este curso para rendir el examen inmediatamente y obtener descuentos.
                      </p>
                    </div>
                  </div>
                </div>
              )}


              {/* Progreso si está en curso */}
              {safeProgress.percentage > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Tu progreso</span>
                    <span className="text-accent font-medium">{safeProgress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full transition-all"
                      style={{ width: `${safeProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'temario', label: 'Temario' },
              { id: 'sobre', label: 'Sobre el curso' },
              { id: 'reseñas', label: 'Reseñas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `${areaColors[course.area].border} ${areaColors[course.area].text}`
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de tabs */}
        <div className="py-8">
          {activeTab === 'temario' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-6">
                Contenido del curso ({course.lessons?.length} clases)
              </h3>
              
              {course.lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`bg-surface rounded-lg p-4 cursor-pointer transition-colors ${
                    lesson.isFree || isAuthenticated
                      ? 'hover:bg-gray-700'
                      : 'opacity-60'
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        safeProgress.completedLessons.includes(lesson.id)
                          ? 'bg-accent text-background'
                          : 'bg-gray-700 text-white'
                      }`}>
                        {safeProgress.completedLessons.includes(lesson.id) ? '✓' : index + 1}
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium">{lesson.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <span>{formatDuration(lesson.duration)}</span>
                          {lesson.isFree && (
                            <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                              GRATIS
                            </span>
                          )}
                          {lesson.materials && lesson.materials.length > 0 && (
                            <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>{lesson.materials.length} materiales</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!lesson.isFree && !isAuthenticated && (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sobre' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Sobre este curso</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  {course.description}
                </p>
                
                <h4 className="text-lg font-semibold text-white mb-4">Lo que aprenderás</h4>
                <ul className="text-text-secondary space-y-2 mb-6">
                  <li>• Fundamentos teóricos y prácticos de {course.area}</li>
                  <li>• Aplicación de conceptos en casos reales</li>
                  <li>• Mejores prácticas de la industria</li>
                  <li>• Herramientas y tecnologías actuales</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-4">Instructor</h4>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{course.instructor}</h5>
                    <p className="text-text-secondary">Especialista en {course.area}</p>
                  </div>
                </div>

                {course.materials && course.materials.length > 0 && isAuthenticated && (
                  <>
                    <h4 className="text-lg font-semibold text-white mb-4">Materiales incluidos</h4>
                    <div className="space-y-3">
                      {course.materials.map((material, index) => (
                        <a
                          key={index}
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              material.type === 'pdf' ? 'bg-red-500' :
                              material.type === 'document' ? 'bg-blue-500' :
                              material.type === 'excel' ? 'bg-green-500' :
                              material.type === 'presentation' ? 'bg-orange-500' :
                              material.type === 'video' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}>
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {material.type === 'pdf' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                ) : material.type === 'video' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <p className="text-white font-medium">{material.name || `Material ${index + 1}`}</p>
                              <p className="text-xs text-gray-400 uppercase">{material.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-accent group-hover:text-accent-light">
                            <span className="text-sm font-medium">Descargar</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {course.materials && course.materials.length > 0 && !isAuthenticated && (
                  <>
                    <h4 className="text-lg font-semibold text-white mb-4">Materiales incluidos</h4>
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h5 className="text-white font-medium mb-2">Materiales Disponibles</h5>
                      <p className="text-text-secondary text-sm mb-4">
                        Este curso incluye {course.materials.length} {course.materials.length === 1 ? 'material adicional' : 'materiales adicionales'} que podrás descargar una vez que inicies sesión.
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Iniciar Sesión para Ver Materiales
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reseñas' && (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Reseñas de estudiantes</h3>
                  {courseReviewStats && courseReviewStats.totalReviews > 0 && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.round(courseReviewStats.averageRating))}
                        <span className="text-white font-medium ml-2">
                          {courseReviewStats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-text-secondary">
                        ({courseReviewStats.totalReviews} {courseReviewStats.totalReviews === 1 ? 'reseña' : 'reseñas'})
                      </span>
                    </div>
                  )}
                </div>
                
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Escribir Reseña</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Mostrar modal de login o redirigir
                      const { showLoginModal } = useUIStore.getState()
                      showLoginModal()
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Escribir Reseña</span>
                  </button>
                )}
              </div>

              {/* Rating Distribution */}
              {courseReviewStats && courseReviewStats.totalReviews > 0 && (
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                          {courseReviewStats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {renderStars(Math.round(courseReviewStats.averageRating))}
                        </div>
                        <p className="text-text-secondary text-sm">
                          Promedio de {courseReviewStats.totalReviews} reseñas
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = courseReviewStats.ratingDistribution[stars] || 0
                        const percentage = courseReviewStats.totalReviews > 0 
                          ? (count / courseReviewStats.totalReviews) * 100 
                          : 0
                        return (
                          <div key={stars} className="flex items-center space-x-3">
                            <span className="text-sm text-white w-4">{stars}</span>
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-yellow-400 h-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-text-secondary w-12 text-right">
                              {count}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Test Data Button - Solo para desarrollo */}
              {(!reviews || reviews.length === 0) && (
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 font-medium">Modo Desarrollo</p>
                      <p className="text-blue-200 text-sm">Carga datos de prueba para ver cómo se verán las reseñas</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          generateTestData()
                          const result = loadCourseReviews(course.id)
                          if (result?.stats) {
                            setCourseReviewStats(result.stats)
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cargar Datos de Prueba
                      </button>
                      {isAuthenticated && (
                        <button
                          onClick={() => {
                            // Inscribir al usuario actual en el curso y marcarlo como completado
                            const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')
                            const newEnrollment = {
                              id: `enrollment_${Date.now()}`,
                              userId: user.id,
                              courseId: course.id,
                              status: 'completed',
                              enrolledAt: new Date().toISOString(),
                              completedAt: new Date().toISOString(),
                              canReview: true,
                              hasReviewed: false
                            }
                            enrollments.push(newEnrollment)
                            localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
                            
                            // Recargar página para actualizar el estado
                            window.location.reload()
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Completar Curso
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {review.userName?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">
                                {review.userName || 'Usuario'}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-xs text-text-secondary">
                                  {new Date(review.createdAt).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {review.status === 'approved' && (
                          <span className="bg-green-900/30 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded">
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <div className="text-6xl mb-4">💬</div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Aún no hay reseñas
                  </h4>
                  <p className="text-text-secondary mb-6">
                    Sé el primero en compartir tu experiencia con este curso
                  </p>
                  {isAuthenticated && isUserEnrolled && canReview(user?.id, course.id) && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-accent hover:bg-accent-hover text-background px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Escribir la primera reseña
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de suscripción */}
      <Modal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        title="Acceso Premium Requerido"
        size="medium"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-text-secondary">
            Este contenido requiere una suscripción premium para acceder.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="px-6 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Ver planes
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de información del examen */}
      {showExamInfo && courseExam && (
        <Modal 
          isOpen={showExamInfo} 
          onClose={() => setShowExamInfo(false)}
          size="medium"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Examen: {courseExam.title}
            </h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">{courseExam.description}</p>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Sistema de Descuentos por Calificación
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Puntaje 18-20:</span>
                    <span className="text-green-400 font-bold">20% de descuento</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Puntaje 15-17:</span>
                    <span className="text-yellow-400 font-bold">15% de descuento</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Puntaje 11-14:</span>
                    <span className="text-orange-400 font-bold">10% de descuento</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Puntaje 0-10:</span>
                    <span className="text-gray-400">Sin descuento</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Duración</p>
                  <p className="text-white font-semibold">{courseExam.duration} minutos</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Preguntas</p>
                  <p className="text-white font-semibold">{courseExam.questions.length} preguntas</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Intentos</p>
                  <p className="text-white font-semibold">{courseExam.attempts} intentos</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Aprobación</p>
                  <p className="text-white font-semibold">{courseExam.passingScore}%</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowExamInfo(false)
                  navigate(`/course/${course.id}/exam/${courseExam.id}`)
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Comenzar Examen
              </button>
              <button
                onClick={() => setShowExamInfo(false)}
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Formulario de Reseña */}
      <Modal
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title=""
        size="medium"
      >
        <ReviewForm
          course={course}
          onClose={() => setShowReviewForm(false)}
          onSuccess={handleReviewSuccess}
        />
      </Modal>

      {/* Modal de Agradecimiento */}
      <Modal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        title=""
        size="medium"
      >
        <div className="text-center py-8 px-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            ¡Gracias por tu comentario!
          </h3>
          
          <p className="text-text-secondary text-lg mb-6 leading-relaxed">
            Tu opinión nos ayuda a seguir mejorando. Tu reseña será revisada y publicada pronto.
          </p>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-blue-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Las reseñas son moderadas para garantizar su calidad
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setShowThankYouModal(false)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default CourseDetail