// ===================================
// COURSE GRID COMPONENT
// ===================================

import React from 'react'
import { ENROLLMENT_STYLES, ICONS } from '../../constants/studentEnrollmentManagementConstants'

const CourseGrid = ({
  courses,
  student,
  onEnrollToggle,
  isStudentEnrolledInCourse,
  formatPrice
}) => {
  return (
    <div className={ENROLLMENT_STYLES.COURSES_GRID}>
      {courses.map(course => {
        const isEnrolled = isStudentEnrolledInCourse(student.id, course.id)

        return (
          <div
            key={course.id}
            className={`${ENROLLMENT_STYLES.COURSE_CARD_BASE} ${
              isEnrolled
                ? ENROLLMENT_STYLES.COURSE_CARD_ENROLLED
                : ENROLLMENT_STYLES.COURSE_CARD_NOT_ENROLLED
            }`}
            onClick={() => onEnrollToggle(student.id, course.id, isEnrolled)}
          >
            <div className={ENROLLMENT_STYLES.COURSE_CONTENT}>
              <div className={ENROLLMENT_STYLES.COURSE_INFO}>
                <p className={ENROLLMENT_STYLES.COURSE_TITLE}>{course.title}</p>
                <p className={ENROLLMENT_STYLES.COURSE_PRICE}>
                  {formatPrice(course.price)}
                </p>
              </div>
              <div className={`${ENROLLMENT_STYLES.COURSE_CHECKBOX_BASE} ${
                isEnrolled
                  ? ENROLLMENT_STYLES.COURSE_CHECKBOX_CHECKED
                  : ENROLLMENT_STYLES.COURSE_CHECKBOX_UNCHECKED
              }`}>
                {isEnrolled && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.CHECK} />
                  </svg>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CourseGrid