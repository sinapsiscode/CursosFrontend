import { useState, useEffect } from 'react'
import { useReviewStore, useCourseStore } from '../../store'
import { LoadingSpinner } from '../../components/common'
import { apiService } from '../../services/api'
import Swal from 'sweetalert2'

const ReviewModeration = () => {
  const {
    pendingReviews,
    loadPendingReviews,
    approveReview,
    rejectReview,
    loading
  } = useReviewStore()

  const { courses, setCourses } = useCourseStore()
  const [selectedReview, setSelectedReview] = useState(null)
  const [filterCourse, setFilterCourse] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPendingReviews()
    // Cargar cursos si no están cargados
    if (courses.length === 0) {
      apiService.getCourses().then(coursesData => {
        setCourses(coursesData)
      }).catch(err => console.error('Error loading courses:', err))
    }
  }, [])

  const filteredReviews = pendingReviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCourse = filterCourse === 'all' || review.courseId === filterCourse
    
    return matchesSearch && matchesCourse
  })

  const handleApprove = async (review) => {
    const result = await Swal.fire({
      title: '¿Aprobar reseña?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Usuario:</strong> ${review.userName}</p>
          <p class="mb-2"><strong>Calificación:</strong> ${review.rating} ⭐</p>
          <p><strong>Comentario:</strong> ${review.comment}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      }
    })

    if (result.isConfirmed) {
      const approveResult = await approveReview(review.id, 'admin')
      
      if (approveResult.success) {
        Swal.fire({
          title: '¡Aprobada!',
          text: 'La reseña ha sido aprobada y es visible públicamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
    }
  }

  const handleReject = async (review) => {
    const result = await Swal.fire({
      title: '¿Rechazar reseña?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Usuario:</strong> ${review.userName}</p>
          <p class="mb-2"><strong>Comentario:</strong> ${review.comment}</p>
          <div class="mt-4">
            <label class="text-sm text-gray-400">Razón del rechazo (opcional):</label>
            <textarea id="rejection-reason" class="w-full mt-2 p-2 bg-gray-700 text-white rounded border border-gray-600" rows="3" placeholder="Ej: Contenido inapropiado, spam, etc."></textarea>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      },
      preConfirm: () => {
        return document.getElementById('rejection-reason').value
      }
    })

    if (result.isConfirmed) {
      const rejectResult = await rejectReview(review.id, 'admin', result.value)
      
      if (rejectResult.success) {
        Swal.fire({
          title: '¡Rechazada!',
          text: 'La reseña ha sido rechazada',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ))
  }

  // Obtener cursos únicos de las reseñas pendientes
  const coursesWithReviews = [...new Set(pendingReviews.map(r => r.courseId))]

  // Función para obtener el nombre del curso por ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : `Curso ${courseId}`
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Reseñas</h1>
        <p className="text-secondary">
          Controla qué reseñas se muestran públicamente en la plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {pendingReviews.length}
          </div>
          <div className="text-secondary text-sm">
            Reseñas Pendientes
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {pendingReviews.filter(r => r.rating >= 4).length}
          </div>
          <div className="text-secondary text-sm">
            Calificaciones Positivas
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {pendingReviews.filter(r => r.rating <= 2).length}
          </div>
          <div className="text-secondary text-sm">
            Calificaciones Negativas
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {coursesWithReviews.length}
          </div>
          <div className="text-secondary text-sm">
            Cursos con Reseñas
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por usuario o comentario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
          >
            <option value="all">Todos los cursos</option>
            {coursesWithReviews.map(courseId => (
              <option key={courseId} value={courseId}>
                {getCourseName(courseId)}
              </option>
            ))}
          </select>

          <div className="text-white font-medium">
            {filteredReviews.length} reseña{filteredReviews.length !== 1 ? 's' : ''} pendiente{filteredReviews.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading.reviews ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-lg">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay reseñas pendientes
          </h3>
          <p className="text-secondary">
            Todas las reseñas han sido moderadas
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface rounded-lg p-6 border border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {review.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">
                          {review.userName}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-secondary text-sm">
                          {new Date(review.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      
                      {/* Course Info */}
                      <div className="mb-3">
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {getCourseName(review.courseId)}
                        </span>
                      </div>
                      
                      {/* Review Comment */}
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-secondary leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex lg:flex-col gap-2 lg:w-auto">
                  <button
                    onClick={() => handleApprove(review)}
                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Aprobar</span>
                  </button>
                  <button
                    onClick={() => handleReject(review)}
                    className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewModeration