import React, { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { Button } from '../ui'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import apiClient from '../../api/client'

const ReviewsList = ({ courseId, course, showAddReview = true }) => {
  const { showError } = useUIStore()
  
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filters, setFilters] = useState({
    rating: 'all',
    sortBy: 'newest'
  })
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })

  useEffect(() => {
    loadReviews()
  }, [courseId, filters])

  const loadReviews = async () => {
    try {
      // Cargar solo reseñas aprobadas para usuarios normales
      const reviewsData = await apiClient.get(`/api/reviews?courseId=${courseId}&status=approved`)
      
      // Aplicar filtros
      let filteredReviews = reviewsData

      if (filters.rating !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filters.rating))
      }

      // Aplicar ordenamiento
      filteredReviews.sort((a, b) => {
        switch (filters.sortBy) {
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'highest':
            return b.rating - a.rating
          case 'lowest':
            return a.rating - b.rating
          case 'helpful':
            return (b.helpful || 0) - (a.helpful || 0)
          default: // newest
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })

      setReviews(filteredReviews)
      calculateStats(reviewsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
      showError('Error al cargar las reseñas')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsData) => {
    if (reviewsData.length === 0) {
      setReviewStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      })
      return
    }

    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviewsData.length

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviewsData.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })

    setReviewStats({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviewsData.length,
      ratingDistribution: distribution
    })
  }

  const handleReviewSubmitted = (newReview) => {
    // La nueva reseña no aparecerá inmediatamente ya que necesita aprobación
    // Solo recargamos las stats si es necesario
    loadReviews()
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
        }`}
      >
        ★
      </span>
    ))
  }

  const renderRatingBar = (rating, count) => {
    const percentage = reviewStats.totalReviews > 0 
      ? (count / reviewStats.totalReviews) * 100 
      : 0

    return (
      <div className="flex items-center space-x-2 text-sm">
        <span className="w-8 text-text-secondary">{rating}★</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-8 text-text-secondary text-right">{count}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-surface rounded-lg p-6 border border-gray-700">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rating overview */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
              <div className="text-4xl font-bold text-text-primary">
                {reviewStats.averageRating}
              </div>
              <div>
                <div className="flex mb-1">
                  {renderStars(reviewStats.averageRating)}
                </div>
                <div className="text-sm text-text-secondary">
                  {reviewStats.totalReviews} reseña{reviewStats.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {showAddReview && (
              <Button onClick={() => setShowReviewForm(true)}>
                Escribir Reseña
              </Button>
            )}
          </div>

          {/* Rating distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating}>
                {renderRatingBar(rating, reviewStats.ratingDistribution[rating] || 0)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary">Filtrar:</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="px-3 py-1 bg-surface border border-gray-600 rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas las estrellas</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary">Ordenar:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-1 bg-surface border border-gray-600 rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="highest">Mejor calificados</option>
              <option value="lowest">Peor calificados</option>
              <option value="helpful">Más útiles</option>
            </select>
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Aún no hay reseñas
            </h3>
            <p className="text-text-secondary mb-4">
              Sé el primero en compartir tu experiencia con este curso
            </p>
            {showAddReview && (
              <Button onClick={() => setShowReviewForm(true)}>
                Escribir la Primera Reseña
              </Button>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              showCourse={false}
            />
          ))
        )}
      </div>

      {/* Load more button si hay muchas reseñas */}
      {reviews.length >= 10 && (
        <div className="text-center">
          <Button variant="secondary">
            Cargar Más Reseñas
          </Button>
        </div>
      )}

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        course={course}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  )
}

export default ReviewsList