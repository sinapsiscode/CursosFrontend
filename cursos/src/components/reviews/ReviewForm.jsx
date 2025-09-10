import React, { useState } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Input, Modal } from '../ui'
import apiClient from '../../api/client'

const ReviewForm = ({ isOpen, onClose, course, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: '',
    wouldRecommend: true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación'
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es requerido'
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const reviewData = {
        ...formData,
        courseId: course.id,
        courseTitle: course.title,
        userId: user?.id,
        userName: user?.name || 'Usuario Anónimo',
        status: 'pending',
        verified: user?.enrolledCourses?.includes(course.id) || false,
        helpful: 0,
        createdAt: new Date().toISOString()
      }

      const newReview = await apiClient.post('/api/reviews', reviewData)
      
      showSuccess('¡Reseña enviada! Será revisada antes de publicarse.')
      
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        pros: '',
        cons: '',
        wouldRecommend: true
      })
      
      onClose()
      onReviewSubmitted?.(newReview)
      
    } catch (error) {
      console.error('Error submitting review:', error)
      showError('Error al enviar la reseña. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= (hoverRating || formData.rating)
      
      return (
        <button
          key={index}
          type="button"
          className={`text-3xl transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-200'
          }`}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleInputChange('rating', starValue)}
        >
          ★
        </button>
      )
    })
  }

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Muy malo',
      2: 'Malo', 
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    }
    return labels[rating] || ''
  }

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión Requerido">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Debes iniciar sesión
          </h3>
          <p className="text-text-secondary mb-4">
            Para escribir una reseña necesitas tener una cuenta y estar inscrito en el curso.
          </p>
          <Button onClick={onClose}>
            Entendido
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reseña: ${course?.title}`}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="text-center">
          <label className="block text-lg font-medium text-text-primary mb-4">
            ¿Cómo calificarías este curso?
          </label>
          <div className="flex justify-center space-x-1 mb-2">
            {renderStars()}
          </div>
          {(hoverRating || formData.rating) > 0 && (
            <p className="text-accent font-medium">
              {getRatingLabel(hoverRating || formData.rating)}
            </p>
          )}
          {errors.rating && (
            <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
          )}
        </div>

        {/* Title (optional) */}
        <Input
          label="Título de tu reseña (opcional)"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Resume tu experiencia en pocas palabras..."
        />

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tu opinión <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            className={`w-full px-3 py-2 bg-surface border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.comment ? 'border-red-500' : 'border-gray-600'
            }`}
            rows={4}
            placeholder="Comparte tu experiencia detallada con este curso..."
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}
          <p className="text-xs text-text-secondary mt-1">
            {formData.comment.length}/500 caracteres
          </p>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              👍 Lo que más te gustó
            </label>
            <textarea
              value={formData.pros}
              onChange={(e) => handleInputChange('pros', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={3}
              placeholder="Aspectos positivos del curso..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              👎 Qué podría mejorar
            </label>
            <textarea
              value={formData.cons}
              onChange={(e) => handleInputChange('cons', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={3}
              placeholder="Aspectos que podrían mejorar..."
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="wouldRecommend"
            checked={formData.wouldRecommend}
            onChange={(e) => handleInputChange('wouldRecommend', e.target.checked)}
            className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
          />
          <label htmlFor="wouldRecommend" className="text-sm text-text-primary">
            Recomendaría este curso a otros estudiantes
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
          </Button>
        </div>
      </form>

      {/* Guidelines */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="font-medium text-text-primary mb-2">Pautas para reseñas:</h4>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Sé honesto y constructivo en tus comentarios</li>
          <li>• Enfócate en tu experiencia de aprendizaje</li>
          <li>• Evita contenido ofensivo o spam</li>
          <li>• Las reseñas son revisadas antes de publicarse</li>
        </ul>
      </div>
    </Modal>
  )
}

export default ReviewForm