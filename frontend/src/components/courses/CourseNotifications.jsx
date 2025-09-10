import { useEffect } from 'react'
import { notificationService } from '../../services/notificationService'
import { useAuthStore } from '../../store'

const CourseNotifications = ({ course }) => {
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !course) return

    // Enviar notificaciones basadas en el comportamiento del usuario
    const timer = setTimeout(() => {
      // Si el usuario pasa más de 30 segundos en un curso, mostrar promoción
      if (course.price && course.price > 0) {
        notificationService.showCoursePromotion(course, 20)
      }
    }, 30000)

    // Si el curso tiene webinar asociado
    if (course.nextWebinar) {
      const webinarTimer = setTimeout(() => {
        notificationService.showWebinarInvitation({
          id: course.nextWebinar.id,
          title: course.nextWebinar.title,
          date: course.nextWebinar.date,
          registrationUrl: course.nextWebinar.url
        })
      }, 45000)

      return () => {
        clearTimeout(timer)
        clearTimeout(webinarTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [course, isAuthenticated])

  // Notificación cuando completa una lección
  const handleLessonComplete = (lesson) => {
    notificationService.createNotification({
      type: 'success',
      title: '¡Lección Completada!',
      message: `Has completado "${lesson.title}"`,
      icon: '✅',
      actions: [
        {
          label: 'Siguiente Lección',
          url: `/course/${course.id}/lesson/${lesson.nextId}`,
          icon: '➡️'
        },
        {
          label: 'Ver Progreso',
          url: `/my-courses/${course.id}`,
          icon: '📊'
        }
      ],
      persistent: true
    })

    // Si completa el 25% del curso, invitar al grupo
    if (lesson.progress >= 25 && !user.joinedGroups?.includes(course.area)) {
      setTimeout(() => {
        notificationService.showGroupInvitation({
          name: `${course.area} Pro`,
          description: `Comunidad exclusiva de estudiantes de ${course.title}`,
          whatsappLink: `https://chat.whatsapp.com/${course.area}-students`
        })
      }, 2000)
    }

    // Si completa el 50%, mostrar cursos relacionados
    if (lesson.progress >= 50) {
      setTimeout(() => {
        notificationService.createNotification({
          type: 'info',
          title: '🎯 Cursos Recomendados',
          message: 'Basado en tu progreso, te recomendamos estos cursos',
          icon: '💡',
          actions: [
            {
              label: 'Ver Recomendaciones',
              url: `/recommendations?course=${course.id}`,
              icon: '🔍'
            }
          ],
          persistent: true
        })
      }, 3000)
    }

    // Si completa el 100%, celebrar logro
    if (lesson.progress >= 100) {
      notificationService.showAchievement({
        title: `¡Curso Completado!`,
        description: `Has completado exitosamente el curso ${course.title}`,
        icon: '🎓'
      })
    }
  }

  return null // Este componente no renderiza nada, solo maneja notificaciones
}

export default CourseNotifications