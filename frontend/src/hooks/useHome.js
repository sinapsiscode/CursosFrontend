import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { carouselService } from '../services/carouselService'
import { useAuthStore } from '../store'
import { AREA_NAMES } from '../constants/homeConstants.jsx'

export const useHome = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const [courses, setCourses] = useState([])
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [continueCourse, setContinueCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselSlides, setCarouselSlides] = useState([])

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true)

      const [coursesData, featuredData, slidesData] = await Promise.all([
        apiService.get('/courses'),
        apiService.get('/courses/featured'),
        carouselService.getActiveSlides()
      ])

      setCourses(coursesData)
      setFeaturedCourses(featuredData)
      setCarouselSlides(slidesData)

      if (isAuthenticated) {
        const [recommendedData, continueData] = await Promise.all([
          apiService.get('/courses/recommended'),
          apiService.get('/courses/continue')
        ])

        setRecommendedCourses(recommendedData)
        setContinueCourse(continueData)
      }
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % carouselSlides.length)
  }, [carouselSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    )
  }, [carouselSlides.length])

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index)
  }, [])

  const navigateToArea = useCallback((area) => {
    navigate(`/courses?area=${area}`)
  }, [navigate])

  const navigateToCourse = useCallback((courseId) => {
    navigate(`/course/${courseId}`)
  }, [navigate])

  const navigateToContinueCourse = useCallback(() => {
    if (continueCourse?.id) {
      navigate(`/course/${continueCourse.id}`)
    }
  }, [navigate, continueCourse])

  const areas = Object.keys(AREA_NAMES).map(key => ({
    id: key,
    name: AREA_NAMES[key]
  }))

  return {
    courses,
    featuredCourses,
    recommendedCourses,
    continueCourse,
    loading,
    currentSlide,
    carouselSlides,
    areas,
    isAuthenticated,
    user,
    nextSlide,
    prevSlide,
    goToSlide,
    navigateToArea,
    navigateToCourse,
    navigateToContinueCourse
  }
}