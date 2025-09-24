import { useState, useEffect, useCallback } from 'react'
import { useAdminStore } from '../store'
import { apiService } from '../services/api'
import Swal from 'sweetalert2'
import {
  VIEW_MODES,
  STUDENT_STATUS,
  STUDENT_LOG_MESSAGES,
  STUDENT_CONFIRMATION_CONFIG,
  STUDENT_CONFIG
} from '../constants/studentManagementConstants.jsx'

export const useStudentManagement = () => {
  const { courses, setCourses } = useAdminStore()

  // Estados principales
  const [allStudents, setAllStudents] = useState([])
  const [courseStudents, setCourseStudents] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState(STUDENT_STATUS.ALL)
  const [viewMode, setViewMode] = useState(VIEW_MODES.ALL)
  const [loading, setLoading] = useState(false)

  // Cargar cursos y estudiantes inicialmente
  useEffect(() => {
    loadCoursesAndStudents()
  }, [])

  // Log de cursos disponibles
  useEffect(() => {
    console.log(STUDENT_LOG_MESSAGES.COURSES_AVAILABLE, courses.length)
    console.log(STUDENT_LOG_MESSAGES.FIRST_COURSE, courses[0]?.title)
  }, [courses])

  // Cargar estudiantes del curso cuando cambie la selección
  useEffect(() => {
    if (selectedCourseId && viewMode === VIEW_MODES.COURSE) {
      loadCourseStudents(selectedCourseId)
    }
  }, [selectedCourseId, viewMode])

  // Cargar cursos y estudiantes
  const loadCoursesAndStudents = useCallback(async () => {
    try {
      // Cargar cursos si no están cargados
      if (courses.length === 0) {
        console.log(STUDENT_LOG_MESSAGES.LOADING_COURSES)
        const coursesData = await apiService.getCourses()
        setCourses(coursesData)
        console.log(STUDENT_LOG_MESSAGES.COURSES_LOADED, coursesData.length)
      }

      // Cargar todos los estudiantes
      await loadAllStudents()
    } catch (error) {
      console.error(STUDENT_LOG_MESSAGES.ERROR_LOADING_DATA, error)
    }
  }, [courses.length, setCourses])

  // Cargar estudiantes de un curso específico
  const loadCourseStudents = useCallback(async (courseId) => {
    try {
      setLoading(true)
      const students = await apiService.getCourseStudents(courseId)
      console.log(STUDENT_LOG_MESSAGES.COURSE_STUDENTS_LOADED, students.length)
      setCourseStudents(students)
    } catch (error) {
      console.error(STUDENT_LOG_MESSAGES.ERROR_LOADING_COURSE_STUDENTS, error)
      setCourseStudents([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar todos los estudiantes del sistema
  const loadAllStudents = useCallback(async () => {
    try {
      console.log(STUDENT_LOG_MESSAGES.LOADING_STUDENTS)
      const students = await apiService.getStudents()
      console.log(STUDENT_LOG_MESSAGES.STUDENTS_LOADED, students.length)

      // Enriquecer con información de cursos inscritos
      const currentCourses = courses.length > 0 ? courses : await apiService.getCourses()
      const enrichedStudents = students.map(student => {
        const enrolledCourses = currentCourses.filter(course =>
          apiService.isUserEnrolledInCourse(student.id, course.id).isEnrolled
        )
        return {
          ...student,
          enrolledCourses,
          totalCourses: enrolledCourses.length,
          status: enrolledCourses.some(c => c.completed) ? STUDENT_STATUS.COMPLETED : STUDENT_STATUS.ACTIVE
        }
      })
      console.log(STUDENT_LOG_MESSAGES.ENRICHED_STUDENTS, enrichedStudents.length)
      setAllStudents(enrichedStudents)
    } catch (error) {
      console.error(STUDENT_LOG_MESSAGES.ERROR_LOADING_STUDENTS, error)
      setAllStudents([])
    }
  }, [courses])

  // Filtrar estudiantes según criterios
  const getFilteredStudents = useCallback(() => {
    let students = viewMode === VIEW_MODES.ALL ? allStudents : courseStudents

    // Filtro por búsqueda
    if (searchTerm && searchTerm.length >= STUDENT_CONFIG.searchMinLength) {
      const searchLower = searchTerm.toLowerCase()
      students = students.filter(student =>
        student.userName?.toLowerCase().includes(searchLower) ||
        student.userEmail?.toLowerCase().includes(searchLower) ||
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.dni?.includes(searchTerm)
      )
    }

    // Filtro por estado
    if (filterStatus !== STUDENT_STATUS.ALL) {
      students = students.filter(student => student.status === filterStatus)
    }

    return students
  }, [allStudents, courseStudents, viewMode, searchTerm, filterStatus])

  // Marcar estudiante como completado
  const handleMarkCompleted = useCallback(async (student, courseId = selectedCourseId) => {
    const course = courses.find(c => c.id === courseId)
    const courseTitle = course?.title || 'Curso seleccionado'
    const coursePoints = course?.points || 100

    // Crear HTML para el modal de confirmación
    const confirmationHtml = `
      <div class="text-left">
        <p><strong>Estudiante:</strong> ${student.userName || student.userId}</p>
        <p><strong>Curso:</strong> ${courseTitle}</p>
        <p><strong>Puntos a otorgar:</strong> <span class="text-purple-400">🏆 ${coursePoints} puntos</span></p>
        <br>
        <p class="text-sm text-gray-600">
          El estudiante podrá dar una reseña del curso después de esta acción.
        </p>
      </div>
    `

    const result = await Swal.fire({
      ...STUDENT_CONFIRMATION_CONFIG.markCompleted,
      html: confirmationHtml
    })

    if (result.isConfirmed) {
      try {
        console.log(STUDENT_LOG_MESSAGES.MARKING_COMPLETED, {
          studentId: student.userId || student.id,
          courseId,
          courseTitle,
          coursePoints
        })

        // Recargar datos según el modo de vista
        if (viewMode === VIEW_MODES.COURSE && selectedCourseId) {
          await loadCourseStudents(selectedCourseId)
        } else {
          await loadAllStudents()
        }

        // Mostrar confirmación de éxito
        Swal.fire(STUDENT_CONFIRMATION_CONFIG.success)
      } catch (error) {
        console.error(STUDENT_LOG_MESSAGES.ERROR_MARKING_COMPLETED, error)
        Swal.fire({
          ...STUDENT_CONFIRMATION_CONFIG.error,
          text: 'Error al marcar como completado'
        })
      }
    }
  }, [courses, selectedCourseId, viewMode, loadCourseStudents, loadAllStudents])

  // Obtener color de estado
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case STUDENT_STATUS.ACTIVE:
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case STUDENT_STATUS.COMPLETED:
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }, [])

  // Obtener label de estado
  const getStatusLabel = useCallback((student) => {
    if (student.status === STUDENT_STATUS.COMPLETED) {
      if (student.hasReviewed) {
        return '✅ Completado + Reseñado'
      } else {
        return '🎓 Completado'
      }
    }
    return '📚 En curso'
  }, [])

  // Manejar acciones de estudiante
  const handleStudentAction = useCallback((action, student) => {
    switch (action) {
      case 'view':
        console.log('Ver detalles:', student)
        // Implementar vista de detalles
        break
      case 'edit':
        console.log('Editar:', student)
        // Implementar edición
        break
      case 'suspend':
        console.log('Suspender:', student)
        // Implementar suspensión
        break
      default:
        console.log('Acción no reconocida:', action)
    }
  }, [])

  // Cambiar modo de vista
  const changeViewMode = useCallback((mode) => {
    setViewMode(mode)
    if (mode === VIEW_MODES.ALL) {
      setSelectedCourseId('')
    }
  }, [])

  // Cambiar curso seleccionado
  const changeCourse = useCallback((courseId) => {
    setSelectedCourseId(courseId)
  }, [])

  // Cambiar término de búsqueda
  const changeSearchTerm = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  // Cambiar filtro de estado
  const changeFilterStatus = useCallback((status) => {
    setFilterStatus(status)
  }, [])

  // Obtener estudiantes filtrados
  const filteredStudents = getFilteredStudents()

  return {
    // Estado
    allStudents,
    courseStudents,
    selectedCourseId,
    searchTerm,
    filterStatus,
    viewMode,
    loading,
    courses,

    // Datos computados
    filteredStudents,

    // Acciones de carga
    loadCoursesAndStudents,
    loadCourseStudents,
    loadAllStudents,

    // Acciones de estudiante
    handleMarkCompleted,
    handleStudentAction,

    // Cambios de estado
    changeViewMode,
    changeCourse,
    changeSearchTerm,
    changeFilterStatus,

    // Utilidades
    getStatusColor,
    getStatusLabel
  }
}