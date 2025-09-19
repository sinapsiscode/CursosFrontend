export const NOTIFICATION_TIMERS = {
  coursePromotion: 30000,
  webinarInvitation: 45000,
  groupInvitation: 2000,
  courseRecommendations: 3000
}

export const PROGRESS_THRESHOLDS = {
  groupInvitation: 25,
  courseRecommendations: 50,
  courseCompletion: 100
}

export const NOTIFICATION_TYPES = {
  lessonComplete: 'lesson_complete',
  courseComplete: 'course_complete',
  groupInvitation: 'group_invitation',
  courseRecommendations: 'course_recommendations',
  webinarInvitation: 'webinar_invitation'
}

export const LESSON_COMPLETE_NOTIFICATION = {
  type: 'success',
  title: '¡Lección Completada!',
  icon: '✅',
  persistent: true
}

export const COURSE_RECOMMENDATIONS_NOTIFICATION = {
  type: 'info',
  title: '🎯 Cursos Recomendados',
  message: 'Basado en tu progreso, te recomendamos estos cursos',
  icon: '💡',
  persistent: true
}

export const COURSE_COMPLETION_ACHIEVEMENT = {
  title: '¡Curso Completado!',
  icon: '🎓'
}

export const NOTIFICATION_ACTIONS = {
  nextLesson: {
    label: 'Siguiente Lección',
    icon: '➡️'
  },
  viewProgress: {
    label: 'Ver Progreso',
    icon: '📊'
  },
  viewRecommendations: {
    label: 'Ver Recomendaciones',
    icon: '🔍'
  }
}

export const URL_TEMPLATES = {
  nextLesson: '/course/{courseId}/lesson/{lessonId}',
  courseProgress: '/my-courses/{courseId}',
  recommendations: '/recommendations?course={courseId}',
  groupChat: 'https://chat.whatsapp.com/{area}-students'
}