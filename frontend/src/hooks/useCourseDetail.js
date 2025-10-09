import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore, useProgressStore, useReviewStore } from '../store'
import { apiService } from '../services/api'
import { whatsappService } from '../services/whatsappService'
import { eventService } from '../services/eventService'
import { examenesService as examService } from '../services/examenesService'

export const useCourseDetail = (courseId) => {
  const navigate = useNavigate()
  const { isAuthenticated, selectedArea, user } = useAuthStore()
  const { toggleFavorite, favorites } = useCourseStore()
  const { getCourseProgress, updateLessonProgress } = useProgressStore()
  const { canReview, loadCourseReviews, reviews } = useReviewStore()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [whatsappTriggered, setWhatsappTriggered] = useState(false)
  const [courseExam, setCourseExam] = useState(null)
  const [isUserEnrolled, setIsUserEnrolled] = useState(false)
  const [courseReviewStats, setCourseReviewStats] = useState(null)

  const isFavorite = course && favorites && favorites.includes(course.id)
  const progress = course ? getCourseProgress(course.id) : { completedLessons: [], percentage: 0 }

  // Asegurar que las propiedades del progreso tengan valores por defecto seguros
  const safeProgress = {
    completedLessons: [],
    percentage: 0,
    lastWatched: null,
    timeSpent: 0,
    ...progress
  }

  // Asegurar que completedLessons sea un array
  if (!Array.isArray(safeProgress.completedLessons)) {
    safeProgress.completedLessons = []
  }

  useEffect(() => {
    if (courseId) {
      loadCourseDetail()
    }
  }, [courseId])

  useEffect(() => {
    // Cargar examen del curso si existe
    if (course?.id) {
      const exam = examService.getExamByCourse(course.id)
      setCourseExam(exam)

      // Cargar reseñas del curso
      const result = loadCourseReviews(course.id)
      if (result?.stats) {
        setCourseReviewStats(result.stats)
      }
    }
  }, [course, loadCourseReviews])

  // No hay sistema de inscripciones - isUserEnrolled siempre false
  useEffect(() => {
    setIsUserEnrolled(false)
  }, [isAuthenticated, course?.id, user?.id])

  const loadCourseDetail = async () => {
    try {
      setLoading(true)
      const courseData = await apiService.getCourseById(courseId)
      if (courseData) {
        setCourse(courseData)

        // Registrar interés del usuario en este curso
        eventService.trackUserInterest('course_view', {
          courseId: courseData.id,
          courseTitle: courseData.title,
          area: courseData.area || selectedArea,
          tags: courseData.tags || []
        })

        // Verificar y notificar eventos relacionados
        setTimeout(() => {
          eventService.checkAndNotifyRelatedEvents(courseData)
        }, 3000)

        // WhatsApp Lead Generation
        if (!whatsappTriggered) {
          whatsappService.triggerCourseView(courseData)
          setWhatsappTriggered(true)

          eventService.trackUserInterest('course_view', {
            courseId: courseData.id,
            area: courseData.area
          })
        }
      } else {
        navigate('/courses')
      }
    } catch (error) {
      console.error('Error loading course:', error)
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson) => {
    if (lesson.isFree || isAuthenticated) {
      updateLessonProgress(course.id, lesson.id)
      navigate(`/course/${course.id}/lesson/${lesson.id}`)
      return true
    }
    return false
  }

  const handleFavoriteToggle = () => {
    toggleFavorite(course.id)
  }

  const reloadCourseReviews = () => {
    if (course?.id) {
      const result = loadCourseReviews(course.id)
      if (result?.stats) {
        setCourseReviewStats(result.stats)
      }
    }
  }

  // No hay sistema de inscripciones
  const updateEnrollmentStatus = () => {
    setIsUserEnrolled(false)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return {
    // Data
    course,
    loading,
    courseExam,
    isUserEnrolled,
    isFavorite,
    safeProgress,
    courseReviewStats,
    reviews,

    // Methods
    handleLessonClick,
    handleFavoriteToggle,
    reloadCourseReviews,
    updateEnrollmentStatus,
    formatDuration,
    canReview: (userId, courseId) => canReview(userId, courseId),

    // Navigation
    navigate,

    // User state
    isAuthenticated,
    user
  }
}