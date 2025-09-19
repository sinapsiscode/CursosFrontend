import { useState, useCallback, useMemo } from 'react'
import { useAdminStore } from '../store'
import { apiService } from '../services/api'
import {
  SORT_OPTIONS,
  SORT_ORDERS,
  FILTER_OPTIONS,
  QUICK_CHANGE,
  ENROLLMENT_THRESHOLDS,
  PROGRESS_THRESHOLDS,
  STUDENT_STATUS,
  ENROLLMENT_CONFIG,
  ENROLLMENT_LABELS,
  ENROLLMENT_STYLES,
  DEFAULT_ENROLLMENT_DATA
} from '../constants/courseEnrollmentManagementConstants'

export const useCourseEnrollmentManagement = () => {
  // ==========================================
  // STORE ACCESS
  // ==========================================

  const {
    coursesWithEnrollment,
    areas,
    users,
    updateCourseEnrollment,
    getActiveAreas
  } = useAdminStore()

  // ==========================================
  // ESTADO LOCAL
  // ==========================================

  // Sort and Filter State
  const [sortBy, setSortBy] = useState(ENROLLMENT_CONFIG.defaultSort)
  const [sortOrder, setSortOrder] = useState(ENROLLMENT_CONFIG.defaultOrder)
  const [filterArea, setFilterArea] = useState(ENROLLMENT_CONFIG.defaultFilter)

  // Editing State
  const [editingCourse, setEditingCourse] = useState(null)
  const [newEnrollmentValue, setNewEnrollmentValue] = useState('')

  // Modal State
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState(null)
  const [enrolledStudents, setEnrolledStudents] = useState([])

  // Loading State
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  // Filtered and Sorted Courses
  const filteredAndSortedCourses = useMemo(() => {
    return coursesWithEnrollment
      .filter(course => filterArea === FILTER_OPTIONS.ALL_AREAS || course.area === filterArea)
      .sort((a, b) => {
        let aVal, bVal

        switch (sortBy) {
          case SORT_OPTIONS.TITLE:
            aVal = a.title
            bVal = b.title
            break
          case SORT_OPTIONS.AREA:
            aVal = a.area
            bVal = b.area
            break
          case SORT_OPTIONS.VIEWS:
            aVal = a.views || 0
            bVal = b.views || 0
            break
          case SORT_OPTIONS.ENROLLMENT_RATE:
            aVal = a.enrollmentData?.enrollmentRate || 0
            bVal = b.enrollmentData?.enrollmentRate || 0
            break
          default:
            aVal = a.enrolledStudents || 0
            bVal = b.enrolledStudents || 0
        }

        if (typeof aVal === 'string') {
          return sortOrder === SORT_ORDERS.DESC ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
        }

        return sortOrder === SORT_ORDERS.DESC ? bVal - aVal : aVal - bVal
      })
  }, [coursesWithEnrollment, filterArea, sortBy, sortOrder])

  // Enrollment Summary Data
  const enrollmentData = useMemo(() => {
    if (!filteredAndSortedCourses.length) {
      return DEFAULT_ENROLLMENT_DATA
    }

    const totalEnrolled = filteredAndSortedCourses.reduce((sum, course) =>
      sum + (course.enrolledStudents || 0), 0
    )

    const totalRates = filteredAndSortedCourses.reduce((sum, course) =>
      sum + (course.enrollmentData?.enrollmentRate || 0), 0
    )

    const averageEnrollmentRate = Math.round(totalRates / filteredAndSortedCourses.length)

    return {
      totalEnrolled,
      averageEnrollmentRate,
      coursesCount: filteredAndSortedCourses.length
    }
  }, [filteredAndSortedCourses])

  // ==========================================
  // SORTING FUNCTIONS
  // ==========================================

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === SORT_ORDERS.DESC ? SORT_ORDERS.ASC : SORT_ORDERS.DESC)
    } else {
      setSortBy(field)
      setSortOrder(SORT_ORDERS.DESC)
    }
  }, [sortBy, sortOrder])

  // ==========================================
  // FILTER FUNCTIONS
  // ==========================================

  const handleFilterChange = useCallback((newFilter) => {
    setFilterArea(newFilter)
  }, [])

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  const getAreaColor = useCallback((areaKey) => {
    const area = areas.find(a => a.key === areaKey)
    if (area) {
      return area.primaryColor || area.textColor
    }
    return 'text-white'
  }, [areas])

  const getEnrollmentRateColor = useCallback((rate) => {
    if (rate >= ENROLLMENT_THRESHOLDS.HIGH) return ENROLLMENT_STYLES.enrollmentRateHigh
    if (rate >= ENROLLMENT_THRESHOLDS.MEDIUM) return ENROLLMENT_STYLES.enrollmentRateMedium
    return ENROLLMENT_STYLES.enrollmentRateLow
  }, [])

  const getProgressColor = useCallback((progress) => {
    if (progress >= PROGRESS_THRESHOLDS.HIGH) return ENROLLMENT_STYLES.progressFillHigh
    if (progress >= PROGRESS_THRESHOLDS.MEDIUM) return ENROLLMENT_STYLES.progressFillMedium
    return ENROLLMENT_STYLES.progressFillLow
  }, [])

  const getStudentStatusStyle = useCallback((suspended) => {
    return suspended
      ? ENROLLMENT_STYLES.statusBadgeSuspended
      : ENROLLMENT_STYLES.statusBadgeActive
  }, [])

  const getStudentStatusLabel = useCallback((suspended) => {
    return suspended
      ? ENROLLMENT_LABELS.studentStatus.suspended
      : ENROLLMENT_LABELS.studentStatus.active
  }, [])

  // ==========================================
  // ENROLLMENT MANAGEMENT FUNCTIONS
  // ==========================================

  const handleEnrollmentChange = useCallback(async (courseId, change) => {
    const course = coursesWithEnrollment.find(c => c.id === courseId)
    if (!course) return

    const currentEnrolled = course.enrolledStudents || 0
    const newEnrolled = Math.max(ENROLLMENT_CONFIG.minEnrollment, currentEnrolled + change)

    setUpdating(true)
    try {
      // Call API to persist the change
      await apiService.updateCourseEnrollment(courseId, newEnrolled)

      // Update local store
      updateCourseEnrollment(courseId, newEnrolled)

      console.log(`${ENROLLMENT_LABELS.success.enrollmentUpdated} ${courseId}: ${newEnrolled}`)
    } catch (error) {
      console.error('Error updating enrollment:', error)
      alert(ENROLLMENT_LABELS.validation.updateError)
    } finally {
      setUpdating(false)
    }
  }, [coursesWithEnrollment, updateCourseEnrollment])

  const handleQuickChange = useCallback((courseId, increment) => {
    const quickChangeAmount = increment ? QUICK_CHANGE.INCREMENT : QUICK_CHANGE.DECREMENT
    handleEnrollmentChange(courseId, quickChangeAmount)
  }, [handleEnrollmentChange])

  // ==========================================
  // EDITING FUNCTIONS
  // ==========================================

  const startEditingEnrollment = useCallback((course) => {
    setEditingCourse(course.id)
    setNewEnrollmentValue(course.enrolledStudents || 0)
  }, [])

  const saveEnrollmentEdit = useCallback(async () => {
    if (!editingCourse) return

    const course = coursesWithEnrollment.find(c => c.id === editingCourse)
    if (!course) return

    const newValue = parseInt(newEnrollmentValue, 10)
    if (isNaN(newValue) || newValue < ENROLLMENT_CONFIG.minEnrollment) {
      alert(ENROLLMENT_LABELS.validation.invalidNumber)
      return
    }

    const currentEnrolled = course.enrolledStudents || 0
    const change = newValue - currentEnrolled

    setUpdating(true)
    try {
      await apiService.updateCourseEnrollment(editingCourse, newValue)
      updateCourseEnrollment(editingCourse, newValue)

      setEditingCourse(null)
      setNewEnrollmentValue('')
      console.log(`${ENROLLMENT_LABELS.success.enrollmentSet} ${newValue} para curso ${editingCourse}`)
    } catch (error) {
      console.error('Error updating enrollment:', error)
      alert(ENROLLMENT_LABELS.validation.updateError)
    } finally {
      setUpdating(false)
    }
  }, [editingCourse, newEnrollmentValue, coursesWithEnrollment, updateCourseEnrollment])

  const cancelEnrollmentEdit = useCallback(() => {
    setEditingCourse(null)
    setNewEnrollmentValue('')
  }, [])

  const updateNewEnrollmentValue = useCallback((value) => {
    setNewEnrollmentValue(value)
  }, [])

  // ==========================================
  // STUDENTS MODAL FUNCTIONS
  // ==========================================

  const getEnrolledStudents = useCallback(async (courseId) => {
    try {
      const course = coursesWithEnrollment.find(c => c.id === courseId)

      // First check if course has JSON student data
      if (course && course.enrolledStudentsData && course.enrolledStudentsData.length > 0) {
        return course.enrolledStudentsData
      }

      // Fallback: use previous logic for courses without JSON data
      const allUsers = users || []
      const enrolledStudentsData = allUsers.filter(user => {
        return user.progress && user.progress[courseId] !== undefined
      }).map(user => ({
        ...user,
        progress: user.progress[courseId] || 0,
        enrollmentDate: user.createdAt || new Date().toISOString().split('T')[0]
      }))

      // If no students with progress, generate some examples based on enrolledStudents
      if (enrolledStudentsData.length === 0 && course && (course.enrolledStudents || 0) > 0) {
        const sampleStudents = allUsers.slice(0, Math.min(course.enrolledStudents, allUsers.length))
        return sampleStudents.map(user => ({
          ...user,
          progress: Math.floor(Math.random() * 100),
          enrollmentDate: user.createdAt || new Date().toISOString().split('T')[0]
        }))
      }

      return enrolledStudentsData
    } catch (error) {
      console.error('Error fetching enrolled students:', error)
      return []
    }
  }, [coursesWithEnrollment, users])

  const handleViewEnrolledStudents = useCallback(async (course) => {
    setSelectedCourseForStudents(course)
    setLoading(true)
    try {
      const students = await getEnrolledStudents(course.id)
      setEnrolledStudents(students)
    } catch (error) {
      console.error('Error loading enrolled students:', error)
      setEnrolledStudents([])
    } finally {
      setLoading(false)
    }
  }, [getEnrolledStudents])

  const closeStudentsModal = useCallback(() => {
    setSelectedCourseForStudents(null)
    setEnrolledStudents([])
  }, [])

  // ==========================================
  // BULK ACTIONS
  // ==========================================

  const handleRevertChanges = useCallback(async (loadDashboardData) => {
    const confirmed = confirm(ENROLLMENT_LABELS.revertConfirmation)
    if (confirmed) {
      try {
        apiService.clearSessionEnrollmentChanges()
        await loadDashboardData() // Reload data
      } catch (error) {
        console.error('Error reverting changes:', error)
      }
    }
  }, [])

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const formatNumber = useCallback((number) => {
    return (number || 0).toLocaleString()
  }, [])

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString(ENROLLMENT_CONFIG.dateLocale)
  }, [])

  const generateStudentInitials = useCallback((name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, ENROLLMENT_CONFIG.maxInitials)
  }, [])

  const getSortIndicator = useCallback((field) => {
    if (sortBy !== field) return ''
    return sortOrder === SORT_ORDERS.DESC
      ? ENROLLMENT_LABELS.sortIndicators.desc
      : ENROLLMENT_LABELS.sortIndicators.asc
  }, [sortBy, sortOrder])

  // ==========================================
  // VALIDATION FUNCTIONS
  // ==========================================

  const canDecrease = useCallback((course) => {
    return !editingCourse && (course.enrolledStudents || 0) > ENROLLMENT_CONFIG.minEnrollment
  }, [editingCourse])

  const canIncrease = useCallback((course) => {
    return !editingCourse && (course.enrolledStudents || 0) < (course.students || Infinity)
  }, [editingCourse])

  const canEdit = useCallback((course) => {
    return editingCourse !== course.id
  }, [editingCourse])

  // ==========================================
  // RETURN HOOK VALUES
  // ==========================================

  return {
    // State
    sortBy,
    sortOrder,
    filterArea,
    editingCourse,
    newEnrollmentValue,
    selectedCourseForStudents,
    enrolledStudents,
    loading,
    updating,

    // Computed Data
    filteredAndSortedCourses,
    enrollmentData,

    // Store Access
    areas: getActiveAreas(),

    // Sort Functions
    handleSort,
    getSortIndicator,

    // Filter Functions
    handleFilterChange,

    // Utility Functions
    getAreaColor,
    getEnrollmentRateColor,
    getProgressColor,
    getStudentStatusStyle,
    getStudentStatusLabel,
    formatNumber,
    formatDate,
    generateStudentInitials,

    // Enrollment Management
    handleEnrollmentChange,
    handleQuickChange,

    // Editing Functions
    startEditingEnrollment,
    saveEnrollmentEdit,
    cancelEnrollmentEdit,
    updateNewEnrollmentValue,

    // Validation Functions
    canDecrease,
    canIncrease,
    canEdit,

    // Students Modal
    handleViewEnrolledStudents,
    closeStudentsModal,

    // Bulk Actions
    handleRevertChanges
  }
}