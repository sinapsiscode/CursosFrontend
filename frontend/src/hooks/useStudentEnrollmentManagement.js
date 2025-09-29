// ===================================
// STUDENT ENROLLMENT MANAGEMENT HOOK
// ===================================
// Hook personalizado para manejar la lógica de inscripción de estudiantes
// Sigue el patrón SOLID: Single Responsibility Principle

import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiService } from '../services/api'
import {
  ENROLLMENT_MODAL_INITIAL_STATE,
  NOTIFICATION_TYPES,
  NOTIFICATION_CONFIG,
  AREAS,
  FILTER_CONFIG,
  SEARCH_CONFIG,
  MESSAGES,
  DEBUG_CONFIG,
  COUPON_VALIDATION_STATES
} from '../constants/studentEnrollmentManagementConstants'

// ===================================
// HOOK PRINCIPAL
// ===================================

export const useStudentEnrollmentManagement = () => {
  // ===================================
  // ESTADOS PRINCIPALES
  // ===================================

  const [allStudents, setAllStudents] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const [enrollmentModal, setEnrollmentModal] = useState(ENROLLMENT_MODAL_INITIAL_STATE)

  // Estados de filtrado y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState(FILTER_CONFIG.DEFAULT_AREA)

  // ===================================
  // FUNCIONES DE CARGA DE DATOS
  // ===================================

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true)
      console.log(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.INFO} Cargando datos...`)

      // Cargar estudiantes y cursos en paralelo
      const [studentsData, coursesData] = await Promise.all([
        apiService.getStudents(),
        apiService.getCourses()
      ])

      setAllStudents(studentsData)
      setAllCourses(coursesData)

      // Debug logs
      if (DEBUG_CONFIG.ENABLED) {
        console.log(`${DEBUG_CONFIG.PREFIX} - Students loaded:`, studentsData.length)
        console.log(`${DEBUG_CONFIG.PREFIX} - Courses loaded:`, coursesData.length)
        console.log(`${DEBUG_CONFIG.PREFIX} - First student area:`, studentsData[0]?.selectedArea)
        console.log(`${DEBUG_CONFIG.PREFIX} - First course area:`, coursesData[0]?.area)
      }

      // Cargar todas las inscripciones
      const enrollmentPromises = coursesData.map(course =>
        apiService.getCourseStudents(course.id).then(students => ({
          courseId: course.id,
          students: students
        }))
      )

      const enrollmentResults = await Promise.all(enrollmentPromises)
      const flatEnrollments = enrollmentResults.flatMap(result =>
        result.students.map(student => ({
          ...student,
          courseId: result.courseId
        }))
      )

      setEnrollments(flatEnrollments)
      console.log(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.SUCCESS} Datos cargados correctamente`)

    } catch (error) {
      console.error(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.ERROR} Error loading data:`, error)
      showNotification(MESSAGES.ERROR.DATA_LOAD_FAILED, NOTIFICATION_TYPES.ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // ===================================
  // FUNCIONES DE NOTIFICACIÓN
  // ===================================

  const showNotification = useCallback((message, type = NOTIFICATION_TYPES.SUCCESS) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), NOTIFICATION_CONFIG.DURATION)
  }, [])

  // ===================================
  // FUNCIONES DE INSCRIPCIÓN
  // ===================================

  const handleEnrollToggle = useCallback(async (studentId, courseId, isEnrolled) => {
    try {
      if (isEnrolled) {
        // Remover inscripción directamente
        await apiService.removeStudentFromCourse(courseId, studentId)
        showNotification(MESSAGES.SUCCESS.STUDENT_REMOVED, NOTIFICATION_TYPES.SUCCESS)
        await loadAllData()
      } else {
        // Mostrar modal de inscripción con opción de cupón
        setEnrollmentModal({
          show: true,
          studentId,
          courseId,
          couponCode: '',
          validatingCoupon: false,
          couponResult: null
        })
      }
    } catch (error) {
      console.error(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.ERROR} Error toggling enrollment:`, error)
      showNotification(`${MESSAGES.ERROR.ENROLLMENT_FAILED}: ${error.message}`, NOTIFICATION_TYPES.ERROR)
    }
  }, [loadAllData, showNotification])

  // ===================================
  // FUNCIONES DE VALIDACIÓN DE CUPONES
  // ===================================

  const handleValidateCoupon = useCallback(async () => {
    if (!enrollmentModal.couponCode.trim()) {
      return
    }

    setEnrollmentModal(prev => ({
      ...prev,
      validatingCoupon: true,
      couponResult: null
    }))

    try {
      const result = await apiService.validateCoupon(
        enrollmentModal.couponCode,
        enrollmentModal.courseId
      )

      setEnrollmentModal(prev => ({
        ...prev,
        couponResult: result,
        validatingCoupon: false
      }))

      console.log(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.SUCCESS} Cupón validado:`, result)

    } catch (error) {
      console.error(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.ERROR} Error validating coupon:`, error)
      setEnrollmentModal(prev => ({
        ...prev,
        couponResult: {
          valid: false,
          message: MESSAGES.ERROR.COUPON_VALIDATION_FAILED
        },
        validatingCoupon: false
      }))
    }
  }, [enrollmentModal.couponCode, enrollmentModal.courseId])

  const handleConfirmEnrollment = useCallback(async () => {
    try {
      // Inscribir al estudiante
      await apiService.enrollStudentInCourse(
        enrollmentModal.courseId,
        enrollmentModal.studentId
      )

      // Si hay un cupón válido, marcarlo como usado
      if (enrollmentModal.couponResult?.valid && enrollmentModal.couponCode) {
        await apiService.useCoupon(enrollmentModal.couponCode)
        showNotification(
          MESSAGES.SUCCESS.STUDENT_ENROLLED_WITH_COUPON(
            enrollmentModal.couponResult.coupon.discountPercentage
          ),
          NOTIFICATION_TYPES.SUCCESS
        )
      } else {
        showNotification(MESSAGES.SUCCESS.STUDENT_ENROLLED, NOTIFICATION_TYPES.SUCCESS)
      }

      // Cerrar modal y recargar datos
      setEnrollmentModal(ENROLLMENT_MODAL_INITIAL_STATE)
      await loadAllData()

    } catch (error) {
      console.error(`${DEBUG_CONFIG.PREFIX} ${DEBUG_CONFIG.COLORS.ERROR} Error confirming enrollment:`, error)
      showNotification(`${MESSAGES.ERROR.ENROLLMENT_FAILED}: ${error.message}`, NOTIFICATION_TYPES.ERROR)
    }
  }, [enrollmentModal, loadAllData, showNotification])

  const handleCancelEnrollment = useCallback(() => {
    setEnrollmentModal(ENROLLMENT_MODAL_INITIAL_STATE)
  }, [])

  // ===================================
  // FUNCIONES DE CONSULTA DE DATOS
  // ===================================

  const getStudentEnrollments = useCallback((studentId) => {
    return enrollments.filter(e => e.userId === studentId)
  }, [enrollments])

  const isStudentEnrolledInCourse = useCallback((studentId, courseId) => {
    return enrollments.some(e => e.userId === studentId && e.courseId === courseId)
  }, [enrollments])

  // ===================================
  // FUNCIONES DE FILTRADO Y BÚSQUEDA
  // ===================================

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchesSearch = FILTER_CONFIG.SEARCH_FIELDS.some(field =>
        student[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const matchesArea = selectedArea === AREAS.ALL || student.selectedArea === selectedArea
      return matchesSearch && matchesArea
    })
  }, [allStudents, searchTerm, selectedArea])

  // ===================================
  // FUNCIONES DE UTILIDAD
  // ===================================

  const getAreaColor = useCallback((area) => {
    switch(area) {
      case AREAS.METALURGIA: return 'bg-blue-500'
      case AREAS.MINERIA: return 'bg-green-500'
      case AREAS.GEOLOGIA: return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }, [])

  const getStudentInitials = useCallback((name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2)
  }, [])

  const formatPrice = useCallback((price) => {
    return 'Gratis'
  }, [])

  // ===================================
  // ESTADÍSTICAS COMPUTADAS
  // ===================================

  const stats = useMemo(() => ({
    totalStudents: allStudents.length,
    totalCourses: allCourses.length,
    totalEnrollments: enrollments.length,
    averageEnrollments: allStudents.length > 0
      ? Math.round((enrollments.length / allStudents.length) * 10) / 10
      : 0
  }), [allStudents.length, allCourses.length, enrollments.length])

  // ===================================
  // FUNCIONES DE MODAL
  // ===================================

  const updateEnrollmentModal = useCallback((updates) => {
    setEnrollmentModal(prev => ({ ...prev, ...updates }))
  }, [])

  const resetEnrollmentModal = useCallback(() => {
    setEnrollmentModal(ENROLLMENT_MODAL_INITIAL_STATE)
  }, [])

  // ===================================
  // FUNCIONES DE BÚSQUEDA Y FILTROS
  // ===================================

  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  const updateSelectedArea = useCallback((area) => {
    setSelectedArea(area)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedArea(FILTER_CONFIG.DEFAULT_AREA)
  }, [])

  // ===================================
  // FUNCIONES DE OBTENCIÓN DE DATOS ESPECÍFICOS
  // ===================================

  const getStudentById = useCallback((studentId) => {
    return allStudents.find(s => s.id === studentId)
  }, [allStudents])

  const getCourseById = useCallback((courseId) => {
    return allCourses.find(c => c.id === courseId)
  }, [allCourses])

  const getCoursesByArea = useCallback((area) => {
    return allCourses.filter(course => course.area === area)
  }, [allCourses])

  const getStudentsByArea = useCallback((area) => {
    return allStudents.filter(student => student.selectedArea === area)
  }, [allStudents])

  // ===================================
  // FUNCIONES DE VALIDACIÓN
  // ===================================

  const isValidCouponCode = useCallback((code) => {
    return code && code.trim().length >= 3
  }, [])

  const canEnrollStudent = useCallback((studentId, courseId) => {
    return !isStudentEnrolledInCourse(studentId, courseId)
  }, [isStudentEnrolledInCourse])

  // ===================================
  // FUNCIONES DE MANIPULACIÓN DE CUPONES
  // ===================================

  const setCouponCode = useCallback((code) => {
    setEnrollmentModal(prev => ({
      ...prev,
      couponCode: code.toUpperCase(),
      couponResult: null
    }))
  }, [])

  const getCouponValidationState = useCallback(() => {
    if (enrollmentModal.validatingCoupon) return COUPON_VALIDATION_STATES.VALIDATING
    if (enrollmentModal.couponResult?.valid) return COUPON_VALIDATION_STATES.VALID
    if (enrollmentModal.couponResult && !enrollmentModal.couponResult.valid) return COUPON_VALIDATION_STATES.INVALID
    return COUPON_VALIDATION_STATES.IDLE
  }, [enrollmentModal])

  // ===================================
  // RETURN DEL HOOK
  // ===================================

  return {
    // Estados principales
    allStudents,
    allCourses,
    enrollments,
    loading,
    notification,
    enrollmentModal,
    searchTerm,
    selectedArea,

    // Datos computados
    filteredStudents,
    stats,

    // Funciones de carga
    loadAllData,

    // Funciones de inscripción
    handleEnrollToggle,
    handleConfirmEnrollment,
    handleCancelEnrollment,

    // Funciones de cupones
    handleValidateCoupon,
    setCouponCode,
    getCouponValidationState,
    isValidCouponCode,

    // Funciones de modal
    updateEnrollmentModal,
    resetEnrollmentModal,

    // Funciones de filtrado
    updateSearchTerm,
    updateSelectedArea,
    clearFilters,

    // Funciones de consulta
    getStudentEnrollments,
    isStudentEnrolledInCourse,
    getStudentById,
    getCourseById,
    getCoursesByArea,
    getStudentsByArea,

    // Funciones de utilidad
    getAreaColor,
    getStudentInitials,
    formatPrice,
    canEnrollStudent,

    // Funciones de notificación
    showNotification
  }
}

// ===================================
// HOOK AUXILIAR PARA ESTADÍSTICAS
// ===================================

export const useStudentEnrollmentStats = (students, courses, enrollments) => {
  return useMemo(() => {
    const totalStudents = students.length
    const totalCourses = courses.length
    const totalEnrollments = enrollments.length

    // Estadísticas por área
    const statsByArea = Object.values(AREAS)
      .filter(area => area !== AREAS.ALL)
      .reduce((acc, area) => {
        const areaStudents = students.filter(s => s.selectedArea === area)
        const areaCourses = courses.filter(c => c.area === area)
        const areaEnrollments = enrollments.filter(e => {
          const student = students.find(s => s.id === e.userId)
          return student?.selectedArea === area
        })

        acc[area] = {
          students: areaStudents.length,
          courses: areaCourses.length,
          enrollments: areaEnrollments.length,
          averageEnrollments: areaStudents.length > 0
            ? Math.round((areaEnrollments.length / areaStudents.length) * 10) / 10
            : 0
        }
        return acc
      }, {})

    // Cursos más populares
    const coursePopularity = courses.map(course => ({
      ...course,
      enrollmentCount: enrollments.filter(e => e.courseId === course.id).length
    })).sort((a, b) => b.enrollmentCount - a.enrollmentCount)

    // Estudiantes más activos
    const studentActivity = students.map(student => ({
      ...student,
      enrollmentCount: enrollments.filter(e => e.userId === student.id).length
    })).sort((a, b) => b.enrollmentCount - a.enrollmentCount)

    return {
      totals: {
        students: totalStudents,
        courses: totalCourses,
        enrollments: totalEnrollments,
        averageEnrollments: totalStudents > 0
          ? Math.round((totalEnrollments / totalStudents) * 10) / 10
          : 0
      },
      byArea: statsByArea,
      coursePopularity,
      studentActivity
    }
  }, [students, courses, enrollments])
}

// ===================================
// HOOK AUXILIAR PARA FILTROS AVANZADOS
// ===================================

export const useAdvancedFilters = (students, courses, enrollments) => {
  const [filters, setFilters] = useState({
    area: AREAS.ALL,
    enrollmentStatus: 'all', // all, enrolled, not_enrolled
    courseCount: 'all', // all, none, low, medium, high
    searchTerm: ''
  })

  const filteredData = useMemo(() => {
    let filtered = students

    // Filtro por área
    if (filters.area !== AREAS.ALL) {
      filtered = filtered.filter(student => student.selectedArea === filters.area)
    }

    // Filtro por búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Filtro por estado de inscripción
    if (filters.enrollmentStatus !== 'all') {
      filtered = filtered.filter(student => {
        const studentEnrollments = enrollments.filter(e => e.userId === student.id)
        if (filters.enrollmentStatus === 'enrolled') {
          return studentEnrollments.length > 0
        } else if (filters.enrollmentStatus === 'not_enrolled') {
          return studentEnrollments.length === 0
        }
        return true
      })
    }

    // Filtro por cantidad de cursos
    if (filters.courseCount !== 'all') {
      filtered = filtered.filter(student => {
        const enrollmentCount = enrollments.filter(e => e.userId === student.id).length
        switch (filters.courseCount) {
          case 'none': return enrollmentCount === 0
          case 'low': return enrollmentCount > 0 && enrollmentCount <= 2
          case 'medium': return enrollmentCount > 2 && enrollmentCount <= 5
          case 'high': return enrollmentCount > 5
          default: return true
        }
      })
    }

    return filtered
  }, [students, courses, enrollments, filters])

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      area: AREAS.ALL,
      enrollmentStatus: 'all',
      courseCount: 'all',
      searchTerm: ''
    })
  }, [])

  return {
    filters,
    filteredData,
    updateFilter,
    resetFilters
  }
}