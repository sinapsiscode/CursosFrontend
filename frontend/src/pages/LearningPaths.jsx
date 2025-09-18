import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore } from '../store'
import { CourseCard, LoadingSpinner } from '../components/common'
import { apiService } from '../services/api'

const LearningPaths = () => {
  const navigate = useNavigate()
  const { selectedArea, isAuthenticated } = useAuthStore()
  const { courses, favorites, setCourses } = useCourseStore()
  const [loading, setLoading] = useState(true)
  const [filterArea, setFilterArea] = useState('todas')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  const areaColors = {
    metalurgia: {
      bg: 'bg-primary-metalurgia',
      text: 'text-primary-metalurgia',
      border: 'border-primary-metalurgia',
      gradient: 'from-primary-metalurgia to-red-600'
    },
    mineria: {
      bg: 'bg-primary-mineria',
      text: 'text-primary-mineria',
      border: 'border-primary-mineria',
      gradient: 'from-primary-mineria to-teal-600'
    },
    geologia: {
      bg: 'bg-primary-geologia',
      text: 'text-primary-geologia',
      border: 'border-primary-geologia',
      gradient: 'from-primary-geologia to-blue-600'
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCoursesData()
    } else {
      setLoading(false)
    }
  }, [selectedArea, isAuthenticated])

  const loadCoursesData = async () => {
    try {
      setLoading(true)
      const coursesData = await apiService.getCourses(selectedArea)
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const areaMatch = filterArea === 'todas' || course.area === filterArea
    const favoriteMatch = !showOnlyFavorites || favorites.includes(course.id)
    return areaMatch && favoriteMatch
  })

  const areas = [
    { id: 'todas', label: 'Todas las áreas', color: 'bg-accent' },
    { id: 'metalurgia', label: 'Metalurgia', color: 'bg-primary-metalurgia' },
    { id: 'mineria', label: 'Minería', color: 'bg-primary-mineria' },
    { id: 'geologia', label: 'Geología', color: 'bg-primary-geologia' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Mostrar mensaje para usuarios no autenticados
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-surface rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Acceso Restringido
          </h2>
          <p className="text-text-secondary mb-6">
            Loguéate para tener acceso a esta sección
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis Rutas
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explora todos nuestros cursos y marca tus favoritos. 
            Los cursos que agregues a favoritos se guardarán en tu lista de deseos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{courses.length}</div>
            <div className="text-text-secondary">Cursos disponibles</div>
          </div>
          <div className="bg-surface rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => navigate('/favorites')}>
            <div className="text-3xl font-bold text-red-500 mb-2">{favorites.length}</div>
            <div className="text-text-secondary">En tu lista de deseos</div>
            <div className="text-xs text-red-400 mt-1">Click para ver →</div>
          </div>
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{filteredCourses.length}</div>
            <div className="text-text-secondary">Cursos mostrados</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Area Filters */}
            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setFilterArea(area.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterArea === area.id
                      ? `${area.color} text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {/* Favorites Toggle */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showOnlyFavorites
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill={showOnlyFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{showOnlyFavorites ? 'Solo favoritos' : 'Mostrar favoritos'}</span>
              </button>

              {/* My Favorites Button */}
              {favorites.length > 0 && (
                <button
                  onClick={() => navigate('/favorites')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Mi Lista ({favorites.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="medium"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {showOnlyFavorites ? 'No tienes favoritos aún' : 'No se encontraron cursos'}
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              {showOnlyFavorites 
                ? 'Haz clic en el corazón de los cursos que te interesen para agregarlos a tu lista de deseos.'
                : 'Intenta cambiar los filtros para ver más cursos disponibles.'
              }
            </p>
            {showOnlyFavorites && (
              <button
                onClick={() => setShowOnlyFavorites(false)}
                className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                Ver todos los cursos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningPaths