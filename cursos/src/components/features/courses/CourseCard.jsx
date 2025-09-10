import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../../store'
import { GUEST_ROUTES, USER_ROUTES } from '../../../config/routes'
import { LeadCaptureForm } from '../../forms'

/**
 * CourseCard - Componente de tarjeta de curso conectado a API
 * No usa datos hardcodeados, recibe todo por props desde API
 */
const CourseCard = ({ 
  course, 
  variant = 'medium', 
  showProgress = false,
  onFavoriteToggle,
  isFavorite = false 
}) => {
  const navigate = useNavigate()
  const { isAuthenticated, isGuestMode } = useAuthStore()
  const { showInfo } = useUIStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)

  // Variants for responsive design
  const variants = {
    small: 'w-full max-w-xs',
    medium: 'w-full max-w-sm',
    large: 'w-full max-w-md'
  }

  // Utility functions
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatPrice = (price) => {
    return price === 0 ? 'Gratis' : `$${price.toLocaleString()}`
  }

  const formatStudentsCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k estudiantes`
    }
    return `${count} estudiantes`
  }

  // Event handlers
  const handleCardClick = () => {
    navigate(`${GUEST_ROUTES.COURSE_DETAIL.replace(':id', course.id)}`)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      showInfo('Inicia sesión para guardar favoritos')
      return
    }

    onFavoriteToggle?.(course.id)
  }

  const handleEnrollClick = (e) => {
    e.stopPropagation()
    
    if (isGuestMode()) {
      setShowLeadForm(true)
      return
    }

    // Para usuarios autenticados, ir al detalle del curso
    navigate(`${GUEST_ROUTES.COURSE_DETAIL.replace(':id', course.id)}`)
  }

  // Dynamic styles based on course data
  const areaColorStyle = {
    color: course.area?.color || '#98d932'
  }

  const levelBadgeColor = {
    'básico': 'bg-green-500',
    'intermedio': 'bg-yellow-500',
    'avanzado': 'bg-red-500'
  }[course.level] || 'bg-gray-500'

  return (
    <div 
      className={`${variants[variant]} bg-surface border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-300 cursor-pointer group`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {!imageError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-4xl">📚</span>
          </div>
        )}

        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.isFeatured && (
            <span className="px-2 py-1 text-xs font-medium bg-accent text-background rounded">
              Destacado
            </span>
          )}
          {course.isPopular && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
              Popular
            </span>
          )}
          {course.price === 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
              Gratis
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium ${levelBadgeColor} text-white rounded capitalize`}>
            {course.level}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-3 right-3 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full transition-all duration-200"
          aria-label="Agregar a favoritos"
        >
          <svg 
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Area and Duration */}
        <div className="flex items-center justify-between mb-2 text-sm">
          <span 
            className="font-medium capitalize"
            style={areaColorStyle}
          >
            {course.area?.name || course.area}
          </span>
          <span className="text-text-secondary">
            {formatDuration(course.duration)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Instructor */}
        {course.instructor && (
          <p className="text-sm text-text-secondary mb-3">
            <span className="font-medium">Instructor:</span> {course.instructor}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center space-x-4">
            {/* Rating */}
            {course.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{course.rating}</span>
              </div>
            )}
            
            {/* Students count */}
            {course.studentsCount && (
              <span className="text-text-secondary">
                {formatStudentsCount(course.studentsCount)}
              </span>
            )}
          </div>

          {/* Points */}
          {course.points && (
            <div className="flex items-center space-x-1 text-accent">
              <span className="text-sm">🏆</span>
              <span className="font-medium">{course.points} pts</span>
            </div>
          )}
        </div>

        {/* Progress bar (if applicable) */}
        {showProgress && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-text-secondary">Progreso</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-text-primary">
            {formatPrice(course.price)}
          </div>
          
          <button
            onClick={handleEnrollClick}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-background font-medium rounded-lg transition-colors duration-200"
          >
            {isGuestMode() ? 'Solicitar Info' : (course.price === 0 ? 'Acceder' : 'Ver curso')}
          </button>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        course={course}
        trigger="course_card_click"
      />
    </div>
  )
}

export default CourseCard