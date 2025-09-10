import { useMemo, useState } from 'react'
import { useCourseStore } from '../store'
import { CourseCard } from '../components/common'

const MyFavorites = () => {
  const { courses, favorites } = useCourseStore()
  const [sortBy, setSortBy] = useState('dateAdded') // dateAdded, difficulty, duration, area
  const [selectedArea, setSelectedArea] = useState('all')

  const favoriteCourses = useMemo(() => {
    return courses.filter(course => favorites.includes(course.id))
  }, [courses, favorites])

  const sortedFavorites = useMemo(() => {
    let sorted = [...favoriteCourses]
    
    switch (sortBy) {
      case 'dateAdded':
        // Los más recientes primero (por defecto)
        return sorted.reverse()
      
      case 'difficulty':
        const difficultyOrder = { 'básico': 1, 'intermedio': 2, 'avanzado': 3 }
        return sorted.sort((a, b) => difficultyOrder[a.level] - difficultyOrder[b.level])
      
      case 'duration':
        return sorted.sort((a, b) => a.duration - b.duration) // Más cortos primero
      
      case 'area':
        return sorted.sort((a, b) => a.area.localeCompare(b.area))
      
      case 'popularity':
        return sorted.sort((a, b) => (b.students || 0) - (a.students || 0))
      
      default:
        return sorted
    }
  }, [favoriteCourses, sortBy])

  const filteredFavorites = useMemo(() => {
    if (selectedArea === 'all') return sortedFavorites
    return sortedFavorites.filter(course => course.area === selectedArea)
  }, [sortedFavorites, selectedArea])

  const favoritesByArea = useMemo(() => {
    const grouped = {
      metalurgia: [],
      mineria: [],
      geologia: []
    }

    favoriteCourses.forEach(course => {
      if (grouped[course.area]) {
        grouped[course.area].push(course)
      }
    })

    return grouped
  }, [favoriteCourses])

  const areas = [
    { id: 'all', label: 'Todas las áreas', color: 'bg-accent' },
    { id: 'metalurgia', label: 'Metalurgia', color: 'bg-primary-metalurgia' },
    { id: 'mineria', label: 'Minería', color: 'bg-primary-mineria' },
    { id: 'geologia', label: 'Geología', color: 'bg-primary-geologia' }
  ]

  const sortOptions = [
    { id: 'dateAdded', label: 'Recién agregados', icon: '🕒' },
    { id: 'difficulty', label: 'Por dificultad', icon: '📊' },
    { id: 'duration', label: 'Por duración', icon: '⏱️' },
    { id: 'area', label: 'Por área', icon: '🏷️' },
    { id: 'popularity', label: 'Más populares', icon: '⭐' }
  ]

  const getSuggestion = () => {
    if (filteredFavorites.length === 0) return null
    
    // Sugerir curso más fácil y corto para empezar
    const basicCourses = filteredFavorites.filter(course => course.level === 'básico')
    if (basicCourses.length > 0) {
      return basicCourses.sort((a, b) => a.duration - b.duration)[0]
    }
    
    return filteredFavorites.sort((a, b) => a.duration - b.duration)[0]
  }

  const suggestedCourse = getSuggestion()

  if (favoriteCourses.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Tu lista de favoritos está vacía
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Ve a "Mis rutas" y marca los cursos que te interesen haciendo clic en el ícono de corazón.
            </p>
            <button
              onClick={() => window.location.href = '/learning-paths'}
              className="bg-accent hover:bg-accent-hover text-background font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Explorar Cursos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Mis Cursos Favoritos</h1>
          </div>
          <p className="text-text-secondary">
            {favoriteCourses.length} {favoriteCourses.length === 1 ? 'curso' : 'cursos'} en tu lista de deseos
          </p>
        </div>

        {/* Suggestion Card */}
        {suggestedCourse && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-bold text-white">Recomendación para empezar</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h4 className="text-lg font-semibold text-white mb-2">{suggestedCourse.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-green-100">
                  <span>📊 {suggestedCourse.level}</span>
                  <span>⏱️ {suggestedCourse.duration}m</span>
                  <span>🏷️ {suggestedCourse.area}</span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = `/course/${suggestedCourse.id}`}
                className="bg-white text-green-500 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Ver Curso
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">{favoriteCourses.length}</div>
            <div className="text-text-secondary text-sm">Total favoritos</div>
          </div>
          {Object.entries(favoritesByArea).map(([area, areaCourses]) => {
            const areaConfig = areas.find(a => a.id === area)
            return (
              <div key={area} className="bg-surface rounded-lg p-6 text-center">
                <div className={`text-2xl font-bold mb-2 ${areaConfig?.color.replace('bg-', 'text-')}`}>
                  {areaCourses.length}
                </div>
                <div className="text-text-secondary text-sm capitalize">{area}</div>
              </div>
            )
          })}
        </div>

        {/* Filters and Sort */}
        <div className="bg-surface rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Area Filters */}
            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedArea === area.id
                      ? `${area.color} text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary text-sm">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((course, index) => (
              <div key={course.id} className="relative">
                {/* Priority Badge */}
                {index === 0 && sortBy === 'dateAdded' && (
                  <div className="absolute -top-2 -left-2 bg-accent text-background text-xs font-bold px-2 py-1 rounded-full z-10">
                    NUEVO
                  </div>
                )}
                {index === 0 && sortBy === 'difficulty' && (
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    FÁCIL
                  </div>
                )}
                {index === 0 && sortBy === 'duration' && (
                  <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    RÁPIDO
                  </div>
                )}
                
                <CourseCard
                  course={course}
                  variant="medium"
                  showProgress={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              No hay cursos en esta área
            </h3>
            <p className="text-text-secondary mb-6">
              Intenta cambiar el filtro de área para ver más cursos.
            </p>
            <button
              onClick={() => setSelectedArea('all')}
              className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Ver todos los favoritos
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-surface border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.href = '/learning-paths'}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-background font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar más cursos</span>
            </button>
            <button
              onClick={() => window.location.href = '/my-courses'}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Mis cursos inscritos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyFavorites