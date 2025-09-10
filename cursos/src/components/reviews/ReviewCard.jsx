import React from 'react'

const ReviewCard = ({ review, showCourse = false, variant = 'default' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
      >
        ★
      </span>
    ))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Pendiente' },
      approved: { color: 'bg-green-500/20 text-green-400', label: 'Aprobado' },
      rejected: { color: 'bg-red-500/20 text-red-400', label: 'Rechazado' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const cardVariants = {
    default: 'bg-surface border border-gray-700 rounded-lg p-6',
    compact: 'bg-surface border border-gray-700 rounded-lg p-4',
    featured: 'bg-surface border-2 border-accent rounded-lg p-6'
  }

  return (
    <div className={cardVariants[variant]}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-black font-bold">
            {review.userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-medium text-text-primary">{review.userName}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-text-secondary">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Status badge para admin */}
        {review.status && review.status !== 'approved' && (
          <div>
            {getStatusBadge(review.status)}
          </div>
        )}
      </div>

      {/* Course info si se muestra */}
      {showCourse && review.courseTitle && (
        <div className="mb-3">
          <span className="text-sm text-accent font-medium">
            📚 {review.courseTitle}
          </span>
        </div>
      )}

      {/* Review content */}
      <div className="space-y-3">
        {review.title && (
          <h5 className="font-semibold text-text-primary">
            {review.title}
          </h5>
        )}
        
        <p className="text-text-secondary leading-relaxed">
          {review.comment}
        </p>

        {/* Pros y Cons si están disponibles */}
        {(review.pros || review.cons) && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {review.pros && (
              <div>
                <h6 className="text-sm font-medium text-green-400 mb-2">
                  👍 Lo que más me gustó:
                </h6>
                <p className="text-sm text-text-secondary">
                  {review.pros}
                </p>
              </div>
            )}
            {review.cons && (
              <div>
                <h6 className="text-sm font-medium text-yellow-400 mb-2">
                  👎 Podría mejorar:
                </h6>
                <p className="text-sm text-text-secondary">
                  {review.cons}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer con métricas */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          {review.helpful !== undefined && (
            <div className="flex items-center space-x-1">
              <span>👍</span>
              <span>{review.helpful} útil</span>
            </div>
          )}
          {review.verified && (
            <div className="flex items-center space-x-1">
              <span className="text-green-400">✓</span>
              <span>Compra verificada</span>
            </div>
          )}
        </div>
        
        {review.status === 'approved' && (
          <div className="flex items-center space-x-2">
            <button className="text-text-secondary hover:text-accent text-sm transition-colors">
              👍 Útil
            </button>
            <button className="text-text-secondary hover:text-accent text-sm transition-colors">
              💬 Responder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewCard