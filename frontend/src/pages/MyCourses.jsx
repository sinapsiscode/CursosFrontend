import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useProgressStore, useCourseStore } from '../store'
import { LoadingSpinner } from '../components/common'
import { apiService } from '../services/api'

const MyCourses = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { courseProgress } = useProgressStore()
  const { courses, setCourses } = useCourseStore()
  const [loading, setLoading] = useState(true)
  const [myCourses, setMyCourses] = useState([])
  const [filter, setFilter] = useState('all') // all, in-progress, completed, not-started
  const [sortBy, setSortBy] = useState('recent') // recent, progress, alphabetical

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/area-selection')
      return
    }
    loadMyCourses()
  }, [isAuthenticated])

  const loadMyCourses = async () => {
    try {
      setLoading(true)
      
      // Cargar todos los cursos del área del usuario
      const allCourses = await apiService.getCourses(user?.selectedArea)
      setCourses(allCourses)
      
      // Filtrar cursos en los que el usuario tiene progreso o favoritos
      const userCourses = allCourses.filter(course => {
        const hasProgress = courseProgress[course.id] && courseProgress[course.id].percentage > 0
        const isFavorite = user?.favorites?.includes(course.id)
        const isDemo = course.isDemo || course.price === 0
        return hasProgress || isFavorite || isDemo
      })
      
      // Agregar información de progreso a cada curso
      const coursesWithProgress = userCourses.map(course => ({
        ...course,
        progress: courseProgress[course.id] || { percentage: 0, lastWatched: null, timeSpent: 0 },
        isFavorite: user?.favorites?.includes(course.id) || false,
        enrolledAt: courseProgress[course.id]?.enrolledAt || new Date().toISOString()
      }))
      
      setMyCourses(coursesWithProgress)
      
    } catch (error) {
      console.error('Error loading my courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCourses = () => {
    let filtered = [...myCourses]
    
    // Aplicar filtro
    switch (filter) {
      case 'in-progress':
        filtered = filtered.filter(course => 
          course.progress.percentage > 0 && course.progress.percentage < 100
        )
        break
      case 'completed':
        filtered = filtered.filter(course => course.progress.percentage >= 100)
        break
      case 'not-started':
        filtered = filtered.filter(course => course.progress.percentage === 0)
        break
      default:
        // 'all' - no filtrar
        break
    }
    
    // Aplicar ordenamiento
    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => b.progress.percentage - a.progress.percentage)
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'recent':
      default:
        filtered.sort((a, b) => 
          new Date(b.progress.lastWatched || b.enrolledAt) - 
          new Date(a.progress.lastWatched || a.enrolledAt)
        )
        break
    }
    
    return filtered
  }

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-600'
    if (percentage < 30) return 'bg-red-500'
    if (percentage < 70) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getProgressText = (percentage) => {
    if (percentage === 0) return 'No iniciado'
    if (percentage < 100) return 'En progreso'
    return 'Completado'
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const handleContinueCourse = (course) => {
    navigate(`/course/${course.id}`)
  }

  const handleDownloadCertificate = async (course) => {
    if (course.progress.percentage >= 100) {
      try {
        const response = await apiService.generateCertificate(user.id, course.id)
        if (response.success) {
          // Simular descarga de certificado
          const link = document.createElement('a')
          link.href = response.downloadUrl
          link.download = `certificado-${course.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
          link.click()
        }
      } catch (error) {
        console.error('Error generating certificate:', error)
      }
    }
  }

  const CourseCard = ({ course }) => (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Imagen del curso */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {course.isFavorite && (
          <div className="absolute top-3 right-3 bg-red-500 rounded-full p-2">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
        {course.progress.percentage >= 100 && (
          <div className="absolute top-3 left-3 bg-green-500 rounded-full p-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-accent bg-accent bg-opacity-20 px-2 py-1 rounded">
              {course.level.toUpperCase()}
            </span>
            <span className="text-xs text-text-secondary">
              {formatDuration(course.duration)}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
          <p className="text-text-secondary text-xs">
            Instructor: {course.instructor}
          </p>
        </div>

        {/* Progreso */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              {getProgressText(course.progress.percentage)}
            </span>
            <span className="text-sm text-text-secondary">
              {course.progress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress.percentage)}`}
              style={{ width: `${course.progress.percentage}%` }}
            ></div>
          </div>
          {course.progress.timeSpent > 0 && (
            <p className="text-xs text-text-secondary mt-2">
              Tiempo dedicado: {formatDuration(course.progress.timeSpent)}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleContinueCourse(course)}
            className="flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            {course.progress.percentage === 0 ? 'Comenzar' : 'Continuar'}
          </button>
          
          {course.progress.percentage >= 100 && (
            <button
              onClick={() => handleDownloadCertificate(course)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              title="Descargar Certificado"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const filteredCourses = getFilteredCourses()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Mis Cursos
          </h1>
          <p className="text-text-secondary text-lg">
            Continúa tu aprendizaje donde lo dejaste
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {myCourses.length}
            </div>
            <div className="text-text-secondary text-sm">Total Cursos</div>
          </div>
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {myCourses.filter(c => c.progress.percentage >= 100).length}
            </div>
            <div className="text-text-secondary text-sm">Completados</div>
          </div>
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {myCourses.filter(c => c.progress.percentage > 0 && c.progress.percentage < 100).length}
            </div>
            <div className="text-text-secondary text-sm">En Progreso</div>
          </div>
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {Math.round(myCourses.reduce((sum, course) => sum + course.progress.percentage, 0) / (myCourses.length || 1))}%
            </div>
            <div className="text-text-secondary text-sm">Progreso Promedio</div>
          </div>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'in-progress', label: 'En Progreso' },
                { key: 'completed', label: 'Completados' },
                { key: 'not-started', label: 'No Iniciados' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-accent text-background'
                      : 'bg-surface text-white hover:bg-gray-600'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="recent">Más Recientes</option>
              <option value="progress">Por Progreso</option>
              <option value="alphabetical">Alfabético</option>
            </select>
          </div>
        </div>

        {/* Lista de cursos */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {filter === 'all' ? 'No tienes cursos' : `No hay cursos ${filter === 'in-progress' ? 'en progreso' : filter === 'completed' ? 'completados' : 'sin iniciar'}`}
            </h3>
            <p className="text-text-secondary mb-6">
              {filter === 'all' 
                ? 'Explora nuestro catálogo y comienza tu aprendizaje'
                : 'Prueba con otro filtro para ver más cursos'
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/courses')}
                className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Explorar Cursos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses