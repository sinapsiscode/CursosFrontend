import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useProgressStore, useCourseStore } from '../store'
import { apiService } from '../services/api'
import { PROGRESS_COLORS, PROGRESS_THRESHOLDS, MY_COURSES_MESSAGES } from '../constants/myCoursesConstants.jsx'

export const useMyCourses = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { courseProgress } = useProgressStore()
  const { courses, setCourses } = useCourseStore()

  const [loading, setLoading] = useState(true)
  const [myCourses, setMyCourses] = useState([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const loadMyCourses = useCallback(async () => {
    try {
      setLoading(true)

      const allCourses = await apiService.getCourses(user?.selectedArea)
      setCourses(allCourses)

      const userCourses = allCourses.filter(course => {
        const hasProgress = courseProgress[course.id] && courseProgress[course.id].percentage > 0
        const isFavorite = user?.favorites?.includes(course.id)
        const isDemo = course.isDemo || course.price === 0
        return hasProgress || isFavorite || isDemo
      })

      const coursesWithProgress = userCourses.map(course => ({
        ...course,
        progress: courseProgress[course.id] || { percentage: 0, lastWatched: null, timeSpent: 0 },
        isFavorite: user?.favorites?.includes(course.id) || false,
        enrolledAt: courseProgress[course.id]?.enrolledAt || new Date().toISOString()
      }))

      setMyCourses(coursesWithProgress)

    } catch (error) {
      console.error('Error loading my courses:', error)
    } finally {
      setLoading(false)
    }
  }, [user, courseProgress, setCourses])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/area-selection')
      return
    }
    loadMyCourses()
  }, [isAuthenticated, navigate, loadMyCourses])

  const getFilteredCourses = useCallback(() => {
    let filtered = [...myCourses]

    switch (filter) {
      case 'in-progress':
        filtered = filtered.filter(course =>
          course.progress.percentage > 0 && course.progress.percentage < 100
        )
        break
      case 'completed':
        filtered = filtered.filter(course => course.progress.percentage >= 100)
        break
      case 'not-started':
        filtered = filtered.filter(course => course.progress.percentage === 0)
        break
      default:
        break
    }

    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => b.progress.percentage - a.progress.percentage)
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'recent':
      default:
        filtered.sort((a, b) =>
          new Date(b.progress.lastWatched || b.enrolledAt) -
          new Date(a.progress.lastWatched || a.enrolledAt)
        )
        break
    }

    return filtered
  }, [myCourses, filter, sortBy])

  const getProgressColor = useCallback((percentage) => {
    if (percentage === 0) return PROGRESS_COLORS.notStarted
    if (percentage < PROGRESS_THRESHOLDS.low) return PROGRESS_COLORS.low
    if (percentage < PROGRESS_THRESHOLDS.medium) return PROGRESS_COLORS.medium
    if (percentage < PROGRESS_THRESHOLDS.completed) return PROGRESS_COLORS.high
    return PROGRESS_COLORS.completed
  }, [])

  const getProgressText = useCallback((percentage) => {
    if (percentage === 0) return MY_COURSES_MESSAGES.progress.notStarted
    if (percentage < 100) return MY_COURSES_MESSAGES.progress.inProgress
    return MY_COURSES_MESSAGES.progress.completed
  }, [])

  const formatDuration = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }, [])

  const handleContinueCourse = useCallback((course) => {
    navigate(`/course/${course.id}`)
  }, [navigate])

  const handleDownloadCertificate = useCallback(async (course) => {
    if (course.progress.percentage >= 100) {
      try {
        const response = await apiService.generateCertificate(user.id, course.id)
        if (response.success) {
          const link = document.createElement('a')
          link.href = response.downloadUrl
          link.download = `certificado-${course.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
          link.click()
        }
      } catch (error) {
        console.error('Error generating certificate:', error)
      }
    }
  }, [user])

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter)
  }, [])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
  }, [])

  const navigateToExplore = useCallback(() => {
    navigate('/courses')
  }, [navigate])

  const getStats = useCallback(() => {
    const total = myCourses.length
    const completed = myCourses.filter(c => c.progress.percentage >= 100).length
    const inProgress = myCourses.filter(c => c.progress.percentage > 0 && c.progress.percentage < 100).length
    const averageProgress = total > 0
      ? Math.round(myCourses.reduce((sum, course) => sum + course.progress.percentage, 0) / total)
      : 0

    return { total, completed, inProgress, averageProgress }
  }, [myCourses])

  const getEmptyMessage = useCallback(() => {
    switch (filter) {
      case 'in-progress':
        return {
          title: MY_COURSES_MESSAGES.empty.noInProgress,
          subtitle: MY_COURSES_MESSAGES.empty.filterMessage
        }
      case 'completed':
        return {
          title: MY_COURSES_MESSAGES.empty.noCompleted,
          subtitle: MY_COURSES_MESSAGES.empty.filterMessage
        }
      case 'not-started':
        return {
          title: MY_COURSES_MESSAGES.empty.noNotStarted,
          subtitle: MY_COURSES_MESSAGES.empty.filterMessage
        }
      default:
        return {
          title: MY_COURSES_MESSAGES.empty.noCourses,
          subtitle: MY_COURSES_MESSAGES.empty.exploreMessage
        }
    }
  }, [filter])

  const filteredCourses = getFilteredCourses()
  const stats = getStats()
  const emptyMessage = getEmptyMessage()

  return {
    loading,
    myCourses,
    filteredCourses,
    filter,
    sortBy,
    stats,
    emptyMessage,
    getProgressColor,
    getProgressText,
    formatDuration,
    handleContinueCourse,
    handleDownloadCertificate,
    handleFilterChange,
    handleSortChange,
    navigateToExplore
  }
}