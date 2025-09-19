import { PROGRESS_THRESHOLDS } from '../constants/courseNotificationConstants'

export const shouldShowGroupInvitation = (progress, userGroups, courseArea) => {
  return progress >= PROGRESS_THRESHOLDS.groupInvitation &&
         !userGroups?.includes(courseArea)
}

export const shouldShowRecommendations = (progress) => {
  return progress >= PROGRESS_THRESHOLDS.courseRecommendations
}

export const shouldShowCompletion = (progress) => {
  return progress >= PROGRESS_THRESHOLDS.courseCompletion
}

export const formatGroupName = (area) => {
  return `${area} Pro`
}

export const formatGroupDescription = (courseTitle) => {
  return `Comunidad exclusiva de estudiantes de ${courseTitle}`
}

export const createLessonCompleteMessage = (lessonTitle) => {
  return `Has completado "${lessonTitle}"`
}

export const createCourseCompleteDescription = (courseTitle) => {
  return `Has completado exitosamente el curso ${courseTitle}`
}