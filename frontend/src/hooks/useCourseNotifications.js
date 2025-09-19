import { useEffect, useCallback } from 'react'
import { notificationService } from '../services/notificationService'
import { useAuthStore } from '../store'
import {
  NOTIFICATION_TIMERS,
  PROGRESS_THRESHOLDS,
  LESSON_COMPLETE_NOTIFICATION,
  COURSE_RECOMMENDATIONS_NOTIFICATION,
  COURSE_COMPLETION_ACHIEVEMENT,
  NOTIFICATION_ACTIONS,
  URL_TEMPLATES
} from '../constants/courseNotificationConstants'

export const useCourseNotifications = (course) => {
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !course) return

    const timers = []

    // Timer para promoción del curso
    if (course.price && course.price > 0) {
      const promotionTimer = setTimeout(() => {
        notificationService.showCoursePromotion(course, 20)
      }, NOTIFICATION_TIMERS.coursePromotion)
      timers.push(promotionTimer)
    }

    // Timer para invitación a webinar
    if (course.nextWebinar) {
      const webinarTimer = setTimeout(() => {
        notificationService.showWebinarInvitation({
          id: course.nextWebinar.id,
          title: course.nextWebinar.title,
          date: course.nextWebinar.date,
          registrationUrl: course.nextWebinar.url
        })
      }, NOTIFICATION_TIMERS.webinarInvitation)
      timers.push(webinarTimer)
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [course, isAuthenticated])

  const handleLessonComplete = useCallback((lesson) => {
    // Notificación de lección completada
    notificationService.createNotification({
      ...LESSON_COMPLETE_NOTIFICATION,
      message: `Has completado "${lesson.title}"`,
      actions: [
        {
          ...NOTIFICATION_ACTIONS.nextLesson,
          url: URL_TEMPLATES.nextLesson
            .replace('{courseId}', course.id)
            .replace('{lessonId}', lesson.nextId)
        },
        {
          ...NOTIFICATION_ACTIONS.viewProgress,
          url: URL_TEMPLATES.courseProgress.replace('{courseId}', course.id)
        }
      ]
    })

    // Verificar progreso para notificaciones adicionales
    handleProgressNotifications(lesson.progress)
  }, [course, user])

  const handleProgressNotifications = useCallback((progress) => {
    // Invitación al grupo al 25%
    if (progress >= PROGRESS_THRESHOLDS.groupInvitation &&
        !user.joinedGroups?.includes(course.area)) {
      setTimeout(() => {
        notificationService.showGroupInvitation({
          name: `${course.area} Pro`,
          description: `Comunidad exclusiva de estudiantes de ${course.title}`,
          whatsappLink: URL_TEMPLATES.groupChat.replace('{area}', course.area)
        })
      }, NOTIFICATION_TIMERS.groupInvitation)
    }

    // Cursos recomendados al 50%
    if (progress >= PROGRESS_THRESHOLDS.courseRecommendations) {
      setTimeout(() => {
        notificationService.createNotification({
          ...COURSE_RECOMMENDATIONS_NOTIFICATION,
          actions: [
            {
              ...NOTIFICATION_ACTIONS.viewRecommendations,
              url: URL_TEMPLATES.recommendations.replace('{courseId}', course.id)
            }
          ]
        })
      }, NOTIFICATION_TIMERS.courseRecommendations)
    }

    // Celebración al 100%
    if (progress >= PROGRESS_THRESHOLDS.courseCompletion) {
      notificationService.showAchievement({
        ...COURSE_COMPLETION_ACHIEVEMENT,
        description: `Has completado exitosamente el curso ${course.title}`
      })
    }
  }, [course, user])

  return {
    handleLessonComplete
  }
}