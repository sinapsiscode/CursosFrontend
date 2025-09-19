import { useCourseNotifications } from '../../hooks/useCourseNotifications'

const CourseNotifications = ({ course }) => {
  const { handleLessonComplete } = useCourseNotifications(course)

  // Exponer handleLessonComplete para uso externo si es necesario
  // Este componente actúa como un bridge entre el hook y componentes padre
  if (typeof window !== 'undefined') {
    window.courseNotificationHandler = { handleLessonComplete }
  }

  return null // Este componente no renderiza nada, solo maneja notificaciones
}

export default CourseNotifications