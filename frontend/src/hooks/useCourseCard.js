import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseStore, useProgressStore, useAuthStore } from '../store'

export const useCourseCard = (course) => {
  const navigate = useNavigate()
  const { toggleFavorite, favorites } = useCourseStore()
  const { getCourseProgress } = useProgressStore()
  const { isAuthenticated } = useAuthStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  const isFavorite = favorites.includes(course.id)
  const progress = getCourseProgress(course.id)

  const handleCardClick = useCallback(() => {
    navigate(`/course/${course.id}`)
  }, [navigate, course.id])

  const handleFavoriteClick = useCallback((e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleFavorite(course.id)
  }, [isAuthenticated, navigate, toggleFavorite, course.id])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageLoaded(true)
  }, [])

  return {
    imageLoaded,
    isFavorite,
    progress,
    isAuthenticated,
    handleCardClick,
    handleFavoriteClick,
    handleImageLoad,
    handleImageError
  }
}