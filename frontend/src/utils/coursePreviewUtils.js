import { COURSE_PREVIEW_MESSAGES } from '../constants/coursePreviewConstants'

export const coursePreviewUtils = {
  validateCourse: (course) => {
    if (!course) {
      console.warn('⚠️ CoursePreview: Curso no proporcionado')
      return false
    }

    if (!course.id) {
      console.warn('⚠️ CoursePreview: Curso sin ID válido')
      return false
    }

    if (!course.title) {
      console.warn('⚠️ CoursePreview: Curso sin título')
      return false
    }

    return true
  },

  formatCourseData: (course) => {
    if (!coursePreviewUtils.validateCourse(course)) {
      return null
    }

    return {
      ...course,
      displayTitle: course.title || 'Sin título',
      displayInstructor: course.instructor || 'Instructor no especificado',
      displayDuration: course.duration ? `${course.duration} minutos` : 'Duración no especificada',
      displayLevel: course.level || 'Nivel no especificado',
      displayArea: course.area || 'Área no especificada'
    }
  },

  logPreviewAction: (action, courseData) => {
    const courseInfo = courseData ?
      `${courseData.title} (ID: ${courseData.id})` :
      'Curso no especificado'

    console.log(`🎬 CoursePreview ${action}: ${courseInfo}`)
  },

  generatePreviewUrl: (course) => {
    if (!course?.id) return null
    return `/admin/courses/${course.id}/preview`
  },

  canPreview: (course) => {
    return coursePreviewUtils.validateCourse(course) &&
           (course.status === 'published' || course.status === 'draft')
  }
}

export const previewAnalytics = {
  trackOpen: (courseId) => {
    console.log(`📊 Analytics: Vista previa abierta - Curso ${courseId}`)
    // Aquí se podría integrar con un servicio de analytics real
  },

  trackClose: (courseId, timeSpent) => {
    console.log(`📊 Analytics: Vista previa cerrada - Curso ${courseId}, Tiempo: ${timeSpent}ms`)
    // Aquí se podría integrar con un servicio de analytics real
  },

  trackInteraction: (courseId, interaction) => {
    console.log(`📊 Analytics: Interacción en vista previa - Curso ${courseId}, Acción: ${interaction}`)
    // Aquí se podría integrar con un servicio de analytics real
  }
}