import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useProgressStore } from '../store'
import { apiService } from '../services/api'

export const useLessonView = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { updateLessonProgress, markLessonComplete } = useProgressStore()

  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('descripcion')

  const loadLessonData = useCallback(async () => {
    try {
      setLoading(true)
      const courseData = await apiService.getCourseById(courseId)
      if (courseData) {
        setCourse(courseData)
        const lessonData = courseData.lessons?.find(l => l.id.toString() === lessonId)
        if (lessonData) {
          setLesson(lessonData)
          updateLessonProgress(courseId, lessonId)
        } else {
          navigate(`/course/${courseId}`)
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
      navigate(`/course/${courseId}`)
    } finally {
      setLoading(false)
    }
  }, [courseId, lessonId, navigate, updateLessonProgress])

  useEffect(() => {
    loadLessonData()
  }, [loadLessonData])

  const getCurrentLessonIndex = useCallback(() => {
    if (!course || !lesson) return -1
    return course.lessons.findIndex(l => l.id.toString() === lessonId)
  }, [course, lesson, lessonId])

  const handleLessonComplete = useCallback(() => {
    markLessonComplete(courseId, lessonId)
    const currentIndex = getCurrentLessonIndex()
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }, [courseId, lessonId, course, getCurrentLessonIndex, markLessonComplete, navigate])

  const handleNextLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex()
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }, [courseId, course, getCurrentLessonIndex, navigate])

  const handlePreviousLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex()
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1]
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`)
    }
  }, [courseId, course, getCurrentLessonIndex, navigate])

  const navigateToLesson = useCallback((targetLessonId) => {
    navigate(`/course/${courseId}/lesson/${targetLessonId}`)
  }, [courseId, navigate])

  const navigateToCourse = useCallback(() => {
    navigate(`/course/${courseId}`)
  }, [courseId, navigate])

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  const currentIndex = getCurrentLessonIndex()
  const hasNext = currentIndex < (course?.lessons.length - 1 || 0)
  const hasPrevious = currentIndex > 0
  const isPremiumContent = lesson && !lesson.isFree && !isAuthenticated

  return {
    course,
    lesson,
    loading,
    activeTab,
    courseId,
    lessonId,
    isAuthenticated,
    currentIndex,
    hasNext,
    hasPrevious,
    isPremiumContent,
    handleLessonComplete,
    handleNextLesson,
    handlePreviousLesson,
    navigateToLesson,
    navigateToCourse,
    handleTabChange
  }
}