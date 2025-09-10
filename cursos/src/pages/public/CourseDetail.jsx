import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Modal } from '../../components/ui'
import { LeadCaptureForm } from '../../components/forms'
import { ReviewCard } from '../../components/reviews'
import apiClient from '../../api/client'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [course, setCourse] = useState(null)
  const [relatedCourses, setRelatedCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [lessons, setLessons] = useState([])
  const [expandedModules, setExpandedModules] = useState({})

  useEffect(() => {
    loadCourseData()
  }, [id])

  const loadCourseData = async () => {
    setLoading(true)
    try {
      const [coursesData, reviewsData] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/reviews')
      ])
      
      const currentCourse = coursesData.find(c => c.id === id)
      if (!currentCourse) {
        showError('Curso no encontrado')
        navigate('/courses')
        return
      }
      
      setCourse(currentCourse)
      
      // Generate lessons structure
      const courseLessons = [
        {
          moduleId: 1,
          moduleName: 'Introducción',
          lessons: [
            { id: '1', title: 'Bienvenida al curso', duration: '5:30', isFree: true },
            { id: '2', title: 'Configuración del entorno', duration: '12:45', isFree: true },
            { id: '3', title: 'Estructura del curso', duration: '8:20', isFree: false }
          ]
        },
        {
          moduleId: 2,
          moduleName: 'Fundamentos',
          lessons: [
            { id: '4', title: 'Conceptos básicos', duration: '15:00', isFree: false },
            { id: '5', title: 'Primeros pasos', duration: '20:30', isFree: false },
            { id: '6', title: 'Ejercicios prácticos', duration: '25:15', isFree: false }
          ]
        },
        {
          moduleId: 3,
          moduleName: 'Nivel Intermedio',
          lessons: [
            { id: '7', title: 'Técnicas avanzadas', duration: '30:00', isFree: false },
            { id: '8', title: 'Casos de uso reales', duration: '35:45', isFree: false },
            { id: '9', title: 'Proyecto práctico', duration: '45:00', isFree: false }
          ]
        }
      ]
      setLessons(courseLessons)
      
      // Get related courses
      const related = coursesData
        .filter(c => c.area === currentCourse.area && c.id !== id)
        .slice(0, 3)
      setRelatedCourses(related)
      
      // Get course reviews
      const courseReviews = reviewsData
        .filter(r => r.courseId === id && r.status === 'approved')
      setReviews(courseReviews)
      
      // Check enrollment status
      if (user?.enrolledCourses?.includes(id)) {
        setIsEnrolled(true)
      }
      
      // Check favorite status
      if (user?.favorites?.includes(id)) {
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error loading course:', error)
      showError('Error al cargar el curso')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      setShowLeadForm(true)
      return
    }
    
    // Simulate enrollment
    showSuccess('¡Te has inscrito exitosamente en el curso!')
    setIsEnrolled(true)
    navigate('/my-courses')
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      showError('Debes iniciar sesión para guardar favoritos')
      return
    }
    
    setIsFavorite(!isFavorite)
    showSuccess(isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Mira este curso increíble: ${course.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showSuccess('Enlace copiado al portapapeles')
    }
  }

  const calculateDiscount = () => {
    if (!course.originalPrice || course.originalPrice <= course.price) return 0
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
  }
  
  const handleStartCourse = () => {
    if (!isEnrolled) {
      handleEnroll()
      return
    }
    // Navigate to first lesson
    navigate(`/course/${id}/lesson/1`)
  }
  
  const handleLessonClick = (lessonId, isFree) => {
    if (!isEnrolled && !isFree) {
      showError('Debes inscribirte para acceder a esta lección')
      return
    }
    if (isEnrolled || isFree) {
      navigate(`/course/${id}/lesson/${lessonId}`)
    }
  }
  
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }
  
  const getTotalDuration = () => {
    let totalMinutes = 0
    lessons.forEach(module => {
      module.lessons.forEach(lesson => {
        const [minutes, seconds] = lesson.duration.split(':').map(Number)
        totalMinutes += minutes + (seconds / 60)
      })
    })
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    return `${hours}h ${minutes}m`
  }
  
  const getTotalLessons = () => {
    return lessons.reduce((total, module) => total + module.lessons.length, 0)
  }

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando curso...</p>
        </div>
      </div>
    )
  }

  const discount = calculateDiscount()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-surface to-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <nav className="flex text-sm text-text-secondary">
                  <button onClick={() => navigate('/')} className="hover:text-text-primary">
                    Inicio
                  </button>
                  <span className="mx-2">/</span>
                  <button onClick={() => navigate('/courses')} className="hover:text-text-primary">
                    Cursos
                  </button>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">{course.title}</span>
                </nav>
              </div>

              <h1 className="text-4xl font-bold text-text-primary mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-text-secondary mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="font-semibold text-text-primary">{course.rating || 4.5}</span>
                  <span className="text-text-secondary ml-1">({reviews.length} reviews)</span>
                </div>
                
                <div className="text-text-secondary">
                  👥 {course.students || 0} estudiantes
                </div>
                
                <div className="text-text-secondary">
                  🕒 Última actualización: {new Date(course.updatedAt || Date.now()).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {course.instructor?.charAt(0) || 'I'}
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Instructor</p>
                    <p className="font-semibold text-text-primary">{course.instructor}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Duración</p>
                  <p className="font-semibold text-text-primary">{course.duration}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Nivel</p>
                  <p className="font-semibold text-text-primary capitalize">{course.level}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Certificado</p>
                  <p className="font-semibold text-text-primary">✓ Incluido</p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                {/* Video Preview */}
                <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 relative group cursor-pointer"
                     onClick={() => setShowPreviewModal(true)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Vista previa
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {discount > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 line-through text-lg">
                        ${course.originalPrice}
                      </span>
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <div className="text-4xl font-bold text-text-primary">
                    ${course.price}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    Precio en USD • Pago único
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {isEnrolled ? (
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/my-courses')}
                    >
                      Ir al Curso
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="w-full"
                        onClick={handleEnroll}
                      >
                        Inscribirse Ahora
                      </Button>
                      <Button 
                        variant="secondary"
                        className="w-full"
                        onClick={() => navigate('/cart')}
                      >
                        Agregar al Carrito
                      </Button>
                    </>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      className="flex-1"
                      onClick={handleToggleFavorite}
                    >
                      {isFavorite ? '❤️ Guardado' : '🤍 Guardar'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      📤 Compartir
                    </Button>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-sm text-text-secondary">
                      30 días de garantía de devolución
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-sm text-text-secondary">
                      Acceso de por vida
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-sm text-text-secondary">
                      Certificado de finalización
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-sm text-text-secondary">
                      Acceso en dispositivos móviles y TV
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab === 'overview' && 'Descripción'}
                {tab === 'curriculum' && 'Contenido'}
                {tab === 'instructor' && 'Instructor'}
                {tab === 'reviews' && `Reviews (${reviews.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    Lo que aprenderás
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learningPoints?.map((point, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-text-secondary">{point}</span>
                      </div>
                    )) || [
                      'Fundamentos sólidos del tema',
                      'Práctica con proyectos reales',
                      'Mejores prácticas de la industria',
                      'Tips y trucos profesionales',
                      'Soporte de la comunidad',
                      'Actualizaciones constantes'
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-text-secondary">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    Requisitos
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements?.map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span className="text-text-secondary">{req}</span>
                      </li>
                    )) || (
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span className="text-text-secondary">
                          No se requieren conocimientos previos
                        </span>
                      </li>
                    )}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    Descripción
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-secondary">
                      {course.fullDescription || course.description}
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  Contenido del Curso
                </h2>
                
                {/* Course Stats */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-text-secondary">{getTotalLessons()} lecciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-text-secondary">{getTotalDuration()} de contenido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-text-secondary">Certificado de finalización</span>
                  </div>
                </div>
                
                {/* Modules and Lessons */}
                <div className="space-y-4">
                  {lessons.map((module) => (
                    <div key={module.moduleId} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => toggleModule(module.moduleId)}
                        className="w-full p-4 flex items-center justify-between hover:bg-surface transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="text-accent font-semibold mr-3">
                            Módulo {module.moduleId}
                          </span>
                          <span className="font-semibold text-text-primary">
                            {module.moduleName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-text-secondary text-sm">
                            <span>{module.lessons.length} lecciones</span>
                            <span className="mx-2">•</span>
                            <span>
                              {module.lessons.reduce((acc, l) => {
                                const [m, s] = l.duration.split(':').map(Number)
                                return acc + m + s/60
                              }, 0).toFixed(0)} min
                            </span>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-text-secondary transition-transform ${
                              expandedModules[module.moduleId] ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Lessons List */}
                      {(expandedModules[module.moduleId] || module.moduleId === 1) && (
                        <div className="border-t border-gray-700">
                          {module.lessons.map((lesson, lessonIdx) => (
                            <div 
                              key={lesson.id}
                              className="flex items-center justify-between p-4 hover:bg-surface/50 cursor-pointer transition-colors"
                              onClick={() => handleLessonClick(lesson.id, lesson.isFree)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                  isEnrolled || lesson.isFree 
                                    ? 'bg-accent/20 text-accent' 
                                    : 'bg-gray-700 text-text-secondary'
                                }`}>
                                  {isEnrolled || lesson.isFree ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-text-primary font-medium">
                                    {lessonIdx + 1}. {lesson.title}
                                  </p>
                                  {lesson.isFree && (
                                    <span className="text-xs text-green-400">Vista previa gratuita</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-text-secondary">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Start/Continue Button */}
                <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <p className="text-accent font-semibold">
                    Total: {course.totalLessons || 20} lecciones • {course.duration}
                  </p>
                </div>
              </Card>
            )}

            {activeTab === 'instructor' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Sobre el Instructor
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {course.instructor?.charAt(0) || 'I'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {course.instructor}
                    </h3>
                    <p className="text-text-secondary mt-1">
                      {course.instructorTitle || 'Experto en ' + course.area}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                      <span>⭐ 4.7 Rating</span>
                      <span>👥 15,000 estudiantes</span>
                      <span>📚 8 cursos</span>
                    </div>
                    <p className="text-text-secondary mt-4">
                      {course.instructorBio || 
                        'Profesional con más de 10 años de experiencia en la industria. Apasionado por compartir conocimiento y ayudar a otros a alcanzar sus metas profesionales.'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Sin reviews aún
                    </h3>
                    <p className="text-text-secondary">
                      Sé el primero en dejar una review
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-4">
                  Cursos Relacionados
                </h3>
                <div className="space-y-3">
                  {relatedCourses.map(related => (
                    <div 
                      key={related.id}
                      className="flex items-start space-x-3 cursor-pointer hover:bg-surface p-2 rounded"
                      onClick={() => navigate(`/courses/${related.id}`)}
                    >
                      <div className="w-16 h-12 bg-accent/20 rounded flex items-center justify-center text-xl flex-shrink-0">
                        {related.icon || '📚'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-text-primary line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1">
                          ${related.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        course={course}
        trigger="course_detail"
      />

      {/* Video Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Vista Previa del Curso"
        size="large"
      >
        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-text-secondary">
            Video de vista previa no disponible en demo
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default CourseDetail