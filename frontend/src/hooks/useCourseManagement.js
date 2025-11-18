import { useState, useCallback, useRef } from 'react'
import { useAdminStore } from '../store'
import { apiService } from '../services/api'
import {
  COURSE_MANAGEMENT_LOG_MESSAGES,
  COURSE_MANAGEMENT_CONFIRMATIONS,
  DEFAULT_COLORS
} from '../constants/courseManagementConstants.jsx'

export const useCourseManagement = () => {
  const {
    courses,
    areas,
    levels,
    getActiveAreas
  } = useAdminStore()

  // Estados del modal/formulario
  const modalStateRef = useRef({
    showCreateForm: false,
    editingCourse: null
  })
  const [modalState, setModalState] = useState(modalStateRef.current)
  const [previewCourse, setPreviewCourse] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, course: null })

  // Funciones de utilidad para colores
  const getAreaColor = useCallback((areaKey) => {
    const area = areas.find(a => a.key === areaKey)
    if (area) {
      return `${area.textColor} ${area.bgColor} bg-opacity-20`
    }
    return DEFAULT_COLORS.area
  }, [areas])

  const getLevelColor = useCallback((levelKey) => {
    const level = levels.find(l => l.key === levelKey)
    if (level) {
      return `${level.textColor} ${level.bgColor} bg-opacity-20`
    }
    return DEFAULT_COLORS.level
  }, [levels])

  // Manejo del formulario de creación/edición
  const handleToggleCreateForm = useCallback(() => {
    const newState = {
      showCreateForm: !modalStateRef.current.showCreateForm,
      editingCourse: null
    }
    modalStateRef.current = newState
    setModalState(newState)
  }, [])

  const handleCloseForm = useCallback(() => {
    const newState = {
      showCreateForm: false,
      editingCourse: null
    }
    modalStateRef.current = newState
    setModalState(newState)
  }, [])

  // CRUD Operations
  const handleSaveCourse = useCallback(async (courseData) => {
    try {
      console.log(COURSE_MANAGEMENT_LOG_MESSAGES.SAVING_COURSE, courseData.title)

      if (modalStateRef.current.editingCourse) {
        console.log(COURSE_MANAGEMENT_LOG_MESSAGES.UPDATING_COURSE)
        const updatedCourse = await apiService.updateCourse(modalStateRef.current.editingCourse.id, courseData)
        useAdminStore.getState().updateCourse(modalStateRef.current.editingCourse.id, updatedCourse)
      } else {
        console.log(COURSE_MANAGEMENT_LOG_MESSAGES.CREATING_COURSE)
        const newCourse = await apiService.createCourse(courseData)
        console.log('📚 Curso creado con ID:', newCourse.id)
        useAdminStore.getState().addCourse(newCourse)
      }

      handleCloseForm()
      console.log(COURSE_MANAGEMENT_LOG_MESSAGES.COURSE_SAVED)
    } catch (error) {
      console.error(COURSE_MANAGEMENT_LOG_MESSAGES.COURSE_SAVE_ERROR, error)
      alert('Error al guardar el curso: ' + (error.message || 'Error desconocido'))
    }
  }, [handleCloseForm])

  const handleEditCourse = useCallback((course) => {
    const newState = {
      showCreateForm: true,
      editingCourse: course
    }
    modalStateRef.current = newState
    setModalState(newState)
  }, [])

  const handleDeleteCourse = useCallback((course) => {
    setDeleteConfirmation({ show: true, course })
  }, [])

  const confirmDelete = useCallback(async (course) => {
    try {
      await apiService.deleteCourse(course.id)
      useAdminStore.getState().deleteCourse(course.id)
      setDeleteConfirmation({ show: false, course: null })
      console.log(COURSE_MANAGEMENT_LOG_MESSAGES.COURSE_DELETED)
    } catch (error) {
      console.error(COURSE_MANAGEMENT_LOG_MESSAGES.COURSE_DELETE_ERROR, error)
      setDeleteConfirmation({ show: false, course: null })
    }
  }, [])

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ show: false, course: null })
  }, [])

  const handlePreviewCourse = useCallback((course) => {
    setPreviewCourse(course)
    setShowPreviewModal(true)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewCourse(null)
    setShowPreviewModal(false)
  }, [])

  // Funciones de formato
  const formatPrice = useCallback((price) => {
    return 'Gratis'
  }, [])

  const formatDuration = useCallback((duration) => {
    return `${duration} min`
  }, [])

  // Validaciones
  const isFormReady = useCallback(() => {
    const activeAreas = getActiveAreas()
    return activeAreas.length > 0 && levels.length > 0
  }, [getActiveAreas, levels])

  return {
    // Estado
    modalState,
    previewCourse,
    showPreviewModal,
    deleteConfirmation,
    courses,
    areas,
    levels,

    // Funciones de modal/formulario
    handleToggleCreateForm,
    handleCloseForm,

    // CRUD operations
    handleSaveCourse,
    handleEditCourse,
    handleDeleteCourse,
    confirmDelete,
    cancelDelete,
    handlePreviewCourse,
    handleClosePreview,

    // Utilidades
    getAreaColor,
    getLevelColor,
    formatPrice,
    formatDuration,
    isFormReady,
    getActiveAreas
  }
}