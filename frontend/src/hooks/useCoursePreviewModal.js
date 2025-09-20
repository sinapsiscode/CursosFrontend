import { useState, useCallback, useEffect, useRef } from 'react'
import { COURSE_PREVIEW_MODAL } from '../constants/coursePreviewConstants'
import { coursePreviewUtils, previewAnalytics } from '../utils/coursePreviewUtils'

export const useCoursePreviewModal = () => {
  const [isOpen, setIsOpen] = useState(COURSE_PREVIEW_MODAL.INITIAL_STATE.isOpen)
  const [course, setCourse] = useState(COURSE_PREVIEW_MODAL.INITIAL_STATE.course)
  const [loading, setLoading] = useState(false)
  const openTimeRef = useRef(null)

  const openModal = useCallback((courseData) => {
    if (!coursePreviewUtils.validateCourse(courseData)) {
      console.error('❌ CoursePreviewModal: Datos de curso inválidos')
      return
    }

    const formattedCourse = coursePreviewUtils.formatCourseData(courseData)
    coursePreviewUtils.logPreviewAction('OPEN', formattedCourse)
    previewAnalytics.trackOpen(courseData.id)

    setCourse(formattedCourse)
    setIsOpen(true)
    openTimeRef.current = Date.now()
  }, [])

  const closeModal = useCallback(() => {
    if (course?.id && openTimeRef.current) {
      const timeSpent = Date.now() - openTimeRef.current
      previewAnalytics.trackClose(course.id, timeSpent)
    }

    coursePreviewUtils.logPreviewAction('CLOSE', course)
    setIsOpen(false)
    setCourse(null)
    setLoading(false)
    openTimeRef.current = null
  }, [course])

  const updateCourse = useCallback((newCourseData) => {
    console.log('🔄 CoursePreviewModal: Actualizando datos del curso')
    setCourse(newCourseData)
  }, [])

  // Manejo de tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && COURSE_PREVIEW_MODAL.MODAL_CONFIG.closeOnEscape) {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent scroll on background
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeModal])

  // Cleanup cuando se desmonta
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const modalState = {
    isOpen,
    course,
    loading,
    hasData: Boolean(course)
  }

  const modalActions = {
    open: openModal,
    close: closeModal,
    update: updateCourse,
    setLoading
  }

  return {
    ...modalState,
    ...modalActions
  }
}