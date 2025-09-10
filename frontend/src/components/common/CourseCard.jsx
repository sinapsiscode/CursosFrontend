import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseStore, useProgressStore, useAuthStore } from '../../store'

const CourseCard = ({ course, variant = 'medium', showProgress = false }) => {
  const navigate = useNavigate()
  const { toggleFavorite, favorites } = useCourseStore()
  const { getCourseProgress } = useProgressStore()
  const { isAuthenticated } = useAuthStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  const isFavorite = favorites.includes(course.id)
  const progress = getCourseProgress(course.id)

  const variants = {
    small: 'w-full max-w-xs',
    medium: 'w-full max-w-sm',
    large: 'w-full max-w-md'
  }

  const areaColors = {
    metalurgia: 'bg-primary-metalurgia',
    mineria: 'bg-primary-mineria',
    geologia: 'bg-primary-geologia'
  }

  const levelColors = {
    básico: 'bg-green-500',
    intermedio: 'bg-yellow-500', 
    avanzado: 'bg-red-500'
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const handleCardClick = () => {
    navigate(`/course/${course.id}`)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleFavorite(course.id)
  }

  return (
    <div className={`${variants[variant]} bg-surface rounded-xl overflow-hidden shadow-lg card-hover cursor-pointer`}>
      <div onClick={handleCardClick}>
        {/* Imagen del curso */}
        <div className="relative aspect-video bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          )}
          <img
            src={course.thumbnail}
            alt={course.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {course.isNew && (
              <span className="bg-accent text-background text-xs font-bold px-2 py-1 rounded">
                NUEVO
              </span>
            )}
            {course.price === 0 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                GRATIS
              </span>
            )}
            {course.popular && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                POPULAR
              </span>
            )}
          </div>

          {/* Botón de favorito */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ${
              !isAuthenticated ? 'opacity-70' : ''
            }`}
            title={!isAuthenticated ? 'Inicia sesión para agregar a favoritos' : ''}
          >
            {!isAuthenticated ? (
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          {/* Duración */}
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(course.duration)}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Título */}
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-text-secondary text-sm mb-3">
            {course.instructor}
          </p>

          {/* Área y nivel */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`${areaColors[course.area]} text-white text-xs px-2 py-1 rounded-full`}>
              {course.area.charAt(0).toUpperCase() + course.area.slice(1)}
            </span>
            <span className={`${levelColors[course.level]} text-white text-xs px-2 py-1 rounded-full`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>

          {/* Rating y estudiantes */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-white text-sm ml-1">{course.rating}</span>
              </div>
              <span className="text-text-secondary text-sm">
                ({course.students?.toLocaleString()} estudiantes)
              </span>
            </div>
          </div>

          {/* Progreso (si se muestra) */}
          {showProgress && progress.percentage > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Progreso</span>
                <span className="text-accent">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Precio y Puntos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-white font-bold">
                {course.price === 0 ? (
                  <span className="text-accent">Gratis</span>
                ) : (
                  <span>S/ {course.price}</span>
                )}
              </div>
              
              {/* Puntos de fidelización */}
              {course.points && (
                <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded">
                  <span className="text-purple-400 text-sm">🏆</span>
                  <span className="text-purple-400 text-sm font-medium">
                    +{course.points || 100} pts
                  </span>
                </div>
              )}
            </div>
            
            {course.isDemo && (
              <span className="text-xs text-accent bg-accent bg-opacity-20 px-2 py-1 rounded">
                Vista previa
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard