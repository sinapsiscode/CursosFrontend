import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore } from '../store'
import { apiService } from '../services/api'
import { FILTER_AREAS } from '../constants/learningPathsConstants.jsx'

export const useLearningPaths = () => {
  const navigate = useNavigate()
  const { selectedArea, isAuthenticated } = useAuthStore()
  const { courses, favorites, setCourses } = useCourseStore()

  const [loading, setLoading] = useState(true)
  const [filterArea, setFilterArea] = useState('todas')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  const loadCoursesData = useCallback(async () => {
    try {
      setLoading(true)
      const coursesData = await apiService.getCourses(selectedArea)
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedArea, setCourses])

  useEffect(() => {
    if (isAuthenticated) {
      loadCoursesData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, loadCoursesData])

  const filteredCourses = courses.filter(course => {
    const areaMatch = filterArea === 'todas' || course.area === filterArea
    const favoriteMatch = !showOnlyFavorites || favorites.includes(course.id)
    return areaMatch && favoriteMatch
  })

  const handleAreaFilter = useCallback((areaId) => {
    setFilterArea(areaId)
  }, [])

  const handleFavoritesToggle = useCallback(() => {
    setShowOnlyFavorites(prev => !prev)
  }, [])

  const navigateToLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const navigateToFavorites = useCallback(() => {
    navigate('/favorites')
  }, [navigate])

  const stats = {
    totalCourses: courses.length,
    favoritesCount: favorites.length,
    filteredCount: filteredCourses.length
  }

  return {
    loading,
    isAuthenticated,
    courses: filteredCourses,
    filterArea,
    showOnlyFavorites,
    stats,
    areas: FILTER_AREAS,
    handleAreaFilter,
    handleFavoritesToggle,
    navigateToLogin,
    navigateToFavorites
  }
}