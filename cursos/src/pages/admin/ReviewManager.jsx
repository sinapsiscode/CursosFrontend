import React, { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { Button, Input, Modal } from '../../components/ui'
import { ReviewCard } from '../../components/reviews'
import apiClient from '../../api/client'

const ReviewManager = () => {
  const { showSuccess, showError } = useUIStore()
  
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    course: '',
    search: '',
    dateRange: 'all'
  })
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  })

  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500', count: 0 },
    { value: 'approved', label: 'Aprobado', color: 'bg-green-500', count: 0 },
    { value: 'rejected', label: 'Rechazado', color: 'bg-red-500', count: 0 }
  ]

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const reviewsData = await apiClient.get('/reviews')
      setReviews(reviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      calculateStats(reviewsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
      showError('Error al cargar las reseñas')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length
    const pending = reviewsData.filter(r => r.status === 'pending').length
    const approved = reviewsData.filter(r => r.status === 'approved').length
    const rejected = reviewsData.filter(r => r.status === 'rejected').length
    
    const approvedReviews = reviewsData.filter(r => r.status === 'approved')
    const averageRating = approvedReviews.length > 0 
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
      : 0

    setStats({
      total,
      pending,
      approved,
      rejected,
      averageRating: parseFloat(averageRating.toFixed(1))
    })
  }

  const handleStatusChange = async (reviewId, newStatus, reason = '') => {
    try {
      const updatedReview = await apiClient.put(`/api/reviews/${reviewId}`, {
        ...reviews.find(r => r.id === reviewId),
        status: newStatus,
        moderatedAt: new Date().toISOString(),
        moderationReason: reason || undefined
      })
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? updatedReview : review
      ))
      
      calculateStats(reviews.map(r => r.id === reviewId ? updatedReview : r))
      showSuccess(`Reseña ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} correctamente`)
    } catch (error) {
      console.error('Error updating review status:', error)
      showError('Error al actualizar el estado de la reseña')
    }
  }

  const handleApprove = (review) => {
    handleStatusChange(review.id, 'approved')
  }

  const handleReject = (review) => {
    setSelectedReview(review)
    setIsRejectModalOpen(true)
  }

  const confirmReject = () => {
    if (selectedReview) {
      handleStatusChange(selectedReview.id, 'rejected', rejectionReason)
      setIsRejectModalOpen(false)
      setRejectionReason('')
      setSelectedReview(null)
    }
  }

  const handleDelete = async (review) => {
    if (!confirm(`¿Estás seguro de eliminar la reseña de ${review.userName}?`)) return

    try {
      await apiClient.delete(`/api/reviews/${review.id}`)
      setReviews(prev => prev.filter(r => r.id !== review.id))
      calculateStats(reviews.filter(r => r.id !== review.id))
      showSuccess('Reseña eliminada correctamente')
    } catch (error) {
      console.error('Error deleting review:', error)
      showError('Error al eliminar la reseña')
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = !filters.status || review.status === filters.status
    const matchesRating = !filters.rating || review.rating === parseInt(filters.rating)
    const matchesCourse = !filters.course || 
      review.courseTitle?.toLowerCase().includes(filters.course.toLowerCase())
    const matchesSearch = !filters.search || 
      review.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
      review.comment.toLowerCase().includes(filters.search.toLowerCase()) ||
      (review.title && review.title.toLowerCase().includes(filters.search.toLowerCase()))
    
    let matchesDate = true
    if (filters.dateRange !== 'all') {
      const reviewDate = new Date(review.createdAt)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = reviewDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = reviewDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = reviewDate >= monthAgo
          break
      }
    }

    return matchesStatus && matchesRating && matchesCourse && matchesSearch && matchesDate
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-500'
  }

  const getStatusLabel = (status) => {
    return statusOptions.find(s => s.value === status)?.label || status
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
      >
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Gestión de Reseñas
          </h1>
          <p className="text-text-secondary">
            Modera y administra todas las reseñas de cursos ({filteredReviews.length} reseñas)
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex space-x-4">
          <div className="bg-surface rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-xs text-text-secondary">Pendientes</div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-xs text-text-secondary">Aprobadas</div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-xl font-bold text-text-primary">{stats.averageRating}</div>
            <div className="text-xs text-text-secondary">Rating Promedio</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface rounded-lg p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Filtros</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Todos los estados</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Todos los ratings</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Fecha</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          <Input
            placeholder="Buscar curso..."
            value={filters.course}
            onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
          />

          <Input
            placeholder="Buscar por usuario o comentario..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No hay reseñas que mostrar
            </h3>
            <p className="text-text-secondary">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-surface rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-black font-bold">
                    {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-text-primary">{review.userName}</h4>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getStatusColor(review.status)}`}>
                        {getStatusLabel(review.status)}
                      </span>
                      {review.verified && (
                        <span className="text-green-400 text-xs">✓ Verificado</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-text-secondary mb-2">
                      📚 {review.courseTitle} • {formatDate(review.createdAt)}
                    </div>

                    {review.title && (
                      <h5 className="font-semibold text-text-primary mb-2">
                        {review.title}
                      </h5>
                    )}
                    
                    <p className="text-text-secondary mb-3 leading-relaxed">
                      {review.comment}
                    </p>

                    {(review.pros || review.cons) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        {review.pros && (
                          <div>
                            <h6 className="text-sm font-medium text-green-400 mb-1">
                              👍 Lo que más le gustó:
                            </h6>
                            <p className="text-sm text-text-secondary">
                              {review.pros}
                            </p>
                          </div>
                        )}
                        {review.cons && (
                          <div>
                            <h6 className="text-sm font-medium text-yellow-400 mb-1">
                              👎 Podría mejorar:
                            </h6>
                            <p className="text-sm text-text-secondary">
                              {review.cons}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {review.moderationReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-3">
                        <h6 className="text-sm font-medium text-red-400 mb-1">
                          Razón de rechazo:
                        </h6>
                        <p className="text-sm text-text-secondary">
                          {review.moderationReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span>👍 {review.helpful || 0} útiles</span>
                  {review.wouldRecommend && (
                    <span>• ✅ Recomendaría</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      setSelectedReview(review)
                      setIsDetailModalOpen(true)
                    }}
                  >
                    Ver Detalles
                  </Button>
                  
                  {review.status === 'pending' && (
                    <>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleApprove(review)}
                        className="text-green-400 hover:bg-green-500/20"
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleReject(review)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(review)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalles */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles de la Reseña"
        size="large"
      >
        {selectedReview && (
          <ReviewCard 
            review={selectedReview} 
            showCourse={true}
            variant="featured"
          />
        )}
      </Modal>

      {/* Modal de Rechazo */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Rechazar Reseña"
        size="medium"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            ¿Por qué rechazas esta reseña? Esta información se enviará al usuario.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Razón del rechazo
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
              placeholder="Explica por qué esta reseña no cumple con nuestras políticas..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              Rechazar Reseña
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ReviewManager