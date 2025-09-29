import { POINTS_CONFIG } from '../constants/enrollmentConstants'

export const calculatePointsToEarn = (finalPrice) => {
  return Math.floor(finalPrice * POINTS_CONFIG.purchaseMultiplier)
}

export const formatPrice = (price) => {
  return 'Gratis'
}

export const formatCourseDetails = (course) => {
  const lessonCount = course.lessons?.length || 0
  return `${lessonCount} lecciones • ${course.duration}`
}

export const createEnrollmentRecord = (course, user, type, status, amount = 0) => {
  return {
    id: `enrollment_${Date.now()}`,
    courseId: course.id,
    userId: user.id,
    enrolledAt: new Date().toISOString(),
    status,
    type,
    amount
  }
}

export const saveEnrollment = (enrollment) => {
  const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')

  const existing = enrollments.find(e =>
    e.courseId === enrollment.courseId && e.userId === enrollment.userId
  )

  if (!existing) {
    enrollments.push(enrollment)
    localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
  }

  return !existing
}

export const checkExistingEnrollment = (courseId, userId) => {
  const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')
  return enrollments.find(e => e.courseId === courseId && e.userId === userId)
}