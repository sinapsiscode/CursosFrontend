import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card } from '../../components/ui'
import VideoPlayer from '../../components/video/VideoPlayer'
import apiClient from '../../api/client'

const LessonView = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState({})
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [materials, setMaterials] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  
  useEffect(() => {
    loadCourseData()
  }, [courseId, lessonId])
  
  const loadCourseData = async () => {
    setLoading(true)
    try {
      // Simulated API calls
      const courseData = {
        id: courseId,
        title: 'Curso de React Avanzado',
        instructor: 'Juan Pérez',
        totalLessons: 15,
        completedLessons: 7,
        progress: 47
      }
      
      const lessonsData = [
        {
          id: '1',
          title: 'Introducción al curso',
          duration: '10:30',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          completed: true,
          order: 1
        },
        {
          id: '2',
          title: 'Configuración del entorno',
          duration: '15:45',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          completed: true,
          order: 2
        },
        {
          id: '3',
          title: 'Componentes y Props',
          duration: '20:15',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          completed: false,
          order: 3,
          description: 'En esta lección aprenderás sobre componentes de React y cómo pasar datos mediante props.',
          objectives: [
            'Entender qué son los componentes',
            'Crear componentes funcionales',
            'Pasar y recibir props',
            'Validación de props con PropTypes'
          ]
        },
        {
          id: '4',
          title: 'Estado y Ciclo de Vida',
          duration: '25:00',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          completed: false,
          order: 4
        },
        {
          id: '5',
          title: 'Hooks en React',
          duration: '30:00',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          completed: false,
          order: 5
        }
      ]
      
      const materialsData = [
        {
          id: '1',
          title: 'Slides de la presentación',
          type: 'pdf',
          size: '2.5 MB',
          url: '/materials/slides.pdf'
        },
        {
          id: '2',
          title: 'Código de ejemplo',
          type: 'zip',
          size: '1.2 MB',
          url: '/materials/code.zip'
        },
        {
          id: '3',
          title: 'Recursos adicionales',
          type: 'pdf',
          size: '500 KB',
          url: '/materials/resources.pdf'
        }
      ]
      
      const lesson = lessonsData.find(l => l.id === lessonId) || lessonsData[0]
      
      setCourse(courseData)
      setLessons(lessonsData)
      setCurrentLesson(lesson)
      setMaterials(materialsData)
      setIsCompleted(lesson.completed)
      
      // Load saved notes
      const savedNotes = localStorage.getItem(`notes_${courseId}_${lessonId}`) || ''
      setNotes(savedNotes)
      
    } catch (error) {
      console.error('Error loading course data:', error)
      showError('Error al cargar la lección')
    } finally {
      setLoading(false)
    }
  }
  
  const handleLessonComplete = async () => {
    try {
      // Mark lesson as completed
      setIsCompleted(true)
      
      // Update progress
      const completedCount = lessons.filter(l => l.completed || l.id === lessonId).length
      const newProgress = (completedCount / lessons.length) * 100
      
      showSuccess('¡Lección completada! 🎉')
      
      // Auto-advance to next lesson after 2 seconds
      const currentIndex = lessons.findIndex(l => l.id === lessonId)
      if (currentIndex < lessons.length - 1) {
        setTimeout(() => {
          handleNextLesson()
        }, 2000)
      }
    } catch (error) {
      showError('Error al marcar la lección como completada')
    }
  }
  
  const handleVideoProgress = (progress) => {
    // Update watch progress
    setProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }))
  }
  
  const handleTimeUpdate = (time) => {
    setWatchTime(time)
  }
  
  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    // Auto-save notes
    localStorage.setItem(`notes_${courseId}_${lessonId}`, newNotes)
  }
  
  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }
  
  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1]
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`)
    }
  }
  
  const handleLessonClick = (lesson) => {
    navigate(`/course/${courseId}/lesson/${lesson.id}`)
  }
  
  const downloadMaterial = (material) => {
    // Simulate download
    window.open(material.url, '_blank')
    showSuccess(`Descargando ${material.title}`)
  }
  
  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      zip: '📦',
      doc: '📝',
      xls: '📊',
      ppt: '📊',
      video: '🎥',
      image: '🖼️'
    }
    return icons[type] || '📎'
  }
  
  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const hasNext = currentIndex < lessons.length - 1
  const hasPrevious = currentIndex > 0
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando lección...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="text-text-secondary hover:text-text-primary"
            >
              ← Volver al curso
            </button>
            <span className="text-text-secondary">|</span>
            <h1 className="text-lg font-semibold text-text-primary">
              {course?.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              Lección {currentIndex + 1} de {lessons.length}
            </span>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-accent font-medium">
              {Math.round(((currentIndex + 1) / lessons.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-surface rounded-lg overflow-hidden">
              <VideoPlayer
                src={currentLesson?.videoUrl}
                poster="/video-poster.jpg"
                onProgress={handleVideoProgress}
                onComplete={handleLessonComplete}
                onTimeUpdate={handleTimeUpdate}
                nextLesson={hasNext ? handleNextLesson : null}
                previousLesson={hasPrevious ? handlePreviousLesson : null}
                lessonTitle={currentLesson?.title}
              />
            </div>
            
            {/* Lesson Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  {currentLesson?.title}
                </h2>
                {isCompleted && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Completada
                  </span>
                )}
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-700 mb-4">
                <nav className="flex space-x-8">
                  {['overview', 'materials', 'notes'].map(tab => (
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
                      {tab === 'materials' && 'Materiales'}
                      {tab === 'notes' && 'Mis Notas'}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-text-secondary">
                    {currentLesson?.description || 'Esta lección cubre conceptos importantes del curso.'}
                  </p>
                  
                  {currentLesson?.objectives && (
                    <div>
                      <h3 className="font-semibold text-text-primary mb-2">
                        Objetivos de aprendizaje:
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-text-secondary">
                        {currentLesson.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  {materials.length > 0 ? (
                    materials.map(material => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-surface rounded-lg border border-gray-700 hover:border-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(material.type)}</span>
                          <div>
                            <p className="font-medium text-text-primary">
                              {material.title}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {material.type.toUpperCase()} • {material.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => downloadMaterial(material)}
                        >
                          Descargar
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary text-center py-8">
                      No hay materiales disponibles para esta lección
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Escribe tus notas aquí..."
                    className="w-full h-64 px-4 py-3 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    Las notas se guardan automáticamente
                  </p>
                </div>
              )}
            </Card>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={handlePreviousLesson}
                disabled={!hasPrevious}
              >
                ← Lección Anterior
              </Button>
              
              <Button
                onClick={handleNextLesson}
                disabled={!hasNext}
              >
                Siguiente Lección →
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                Progreso del Curso
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Completado</span>
                  <span className="text-accent font-medium">
                    {course?.completedLessons} / {course?.totalLessons} lecciones
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{ width: `${course?.progress || 0}%` }}
                  />
                </div>
              </div>
            </Card>
            
            {/* Lessons List */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                Contenido del Curso
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      lesson.id === lessonId
                        ? 'bg-accent/20 border-l-4 border-accent'
                        : 'hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          lesson.completed
                            ? 'bg-green-500 text-white'
                            : lesson.id === lessonId
                            ? 'bg-accent text-white'
                            : 'bg-gray-700 text-text-secondary'
                        }`}>
                          {lesson.completed ? '✓' : index + 1}
                        </span>
                        <div>
                          <p className={`text-sm ${
                            lesson.id === lessonId
                              ? 'text-accent font-medium'
                              : 'text-text-primary'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Instructor */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                Instructor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  {course?.instructor?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {course?.instructor}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Experto en React
                  </p>
                </div>
              </div>
              <Button size="small" variant="secondary" className="w-full mt-3">
                Hacer una pregunta
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonView