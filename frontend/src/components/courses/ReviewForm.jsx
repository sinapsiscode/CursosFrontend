import { useState } from 'react'
import { useAuthStore, useReviewStore } from '../../store'

const ReviewForm = ({ course, onClose, onSuccess }) => {
  const { user } = useAuthStore()
  const { submitReview, loading } = useReviewStore()
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación'
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Por favor escribe un comentario'
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const reviewData = {
      courseId: course.id,
      userId: user.id,
      userName: user.name || user.email,
      rating: formData.rating,
      comment: formData.comment.trim()
    }
    
    const result = await submitReview(reviewData)
    
    if (result.success) {
      onSuccess()
    }
  }

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
    setErrors(prev => ({ ...prev, rating: null }))
  }

  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }))
    setErrors(prev => ({ ...prev, comment: null }))
  }

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return '😞 Muy malo'
      case 2: return '😕 Malo'
      case 3: return '😐 Regular'
      case 4: return '😊 Bueno'
      case 5: return '😍 Excelente'
      default: return 'Selecciona una calificación'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-surface rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Reseña del Curso
        </h3>
        <p className="text-text-secondary text-sm">
          {course.title}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Calificación *
          </label>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <svg 
                  className={`w-8 h-8 ${
                    rating <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400' 
                      : 'text-gray-600'
                  }`}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-accent font-medium">
            {getRatingText(hoveredRating || formData.rating)}
          </p>
          {errors.rating && (
            <p className="text-red-400 text-sm text-center">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Tu opinión *
          </label>
          <textarea
            value={formData.comment}
            onChange={handleCommentChange}
            placeholder="Comparte tu experiencia con este curso..."
            rows={4}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none resize-none"
          />
          <div className="flex justify-between items-center text-xs">
            <span className={`${
              formData.comment.length < 10 
                ? 'text-red-400' 
                : 'text-green-400'
            }`}>
              {formData.comment.length}/500 caracteres (mínimo 10)
            </span>
          </div>
          {errors.comment && (
            <p className="text-red-400 text-sm">{errors.comment}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading.submitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading.submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enviando...</span>
              </>
            ) : (
              <span>Enviar Reseña</span>
            )}
          </button>
        </div>
      </form>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">¡Tu opinión es importante!</p>
            <p>Compartir tu experiencia ayuda a otros estudiantes a elegir los mejores cursos. Tu reseña aparecerá pronto en la página del curso.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewForm