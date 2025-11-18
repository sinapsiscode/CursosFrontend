import { useState, useMemo } from 'react'
import { DEFAULT_FILTERS } from '../../data/adminExams'

/**
 * Hook para manejar filtros de exámenes
 */
export const useExamFilters = (exams) => {
  const [filterType, setFilterType] = useState(DEFAULT_FILTERS.type)
  const [filterCourse, setFilterCourse] = useState(DEFAULT_FILTERS.course)

  // Filtrar exámenes basado en los filtros activos
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      if (filterCourse !== 'all' && exam.courseId !== filterCourse) return false
      if (filterType !== 'all' && exam.type !== filterType) return false
      return true
    })
  }, [exams, filterType, filterCourse])

  return {
    filterType,
    setFilterType,
    filterCourse,
    setFilterCourse,
    filteredExams
  }
}
