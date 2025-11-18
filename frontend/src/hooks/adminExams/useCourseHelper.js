import { useAdminStore } from '../../store'

/**
 * Hook helper para obtener información de cursos
 */
export const useCourseHelper = () => {
  const { courses } = useAdminStore()

  // Obtener nombre del curso por ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : 'Curso no encontrado'
  }

  return {
    courses,
    getCourseName
  }
}
