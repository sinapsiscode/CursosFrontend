// ===================================
// STUDENTS GRID COMPONENT
// ===================================

import React from 'react'
import { ENROLLMENT_STYLES, AREAS, MESSAGES } from '../../constants/studentEnrollmentManagementConstants'
import StudentCard from './StudentCard'

const StudentsGrid = ({
  students,
  courses,
  onEnrollToggle,
  getStudentEnrollments,
  isStudentEnrolledInCourse,
  getAreaColor,
  getStudentInitials,
  formatPrice,
  searchTerm,
  selectedArea,
  setActiveTab
}) => {
  // Si no hay estudiantes, mostrar estado vacío
  if (students.length === 0) {
    return (
      <div className={ENROLLMENT_STYLES.EMPTY_STATE_CONTAINER}>
        <div className={ENROLLMENT_STYLES.EMPTY_STATE_ICON}>👥</div>
        <h3 className={ENROLLMENT_STYLES.EMPTY_STATE_TITLE}>
          {MESSAGES.EMPTY_STATES.NO_STUDENTS}
        </h3>
        <p className={ENROLLMENT_STYLES.EMPTY_STATE_MESSAGE}>
          {searchTerm || selectedArea !== AREAS.ALL
            ? MESSAGES.EMPTY_STATES.ADJUST_FILTERS
            : MESSAGES.EMPTY_STATES.REGISTER_STUDENTS
          }
        </p>
        {!searchTerm && selectedArea === AREAS.ALL && (
          <button
            onClick={() => setActiveTab('students')}
            className={ENROLLMENT_STYLES.EMPTY_STATE_BUTTON}
          >
            {MESSAGES.EMPTY_STATES.GO_TO_STUDENTS}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={ENROLLMENT_STYLES.STUDENT_GRID}>
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          courses={courses}
          enrollments={getStudentEnrollments(student.id)}
          onEnrollToggle={onEnrollToggle}
          isStudentEnrolledInCourse={isStudentEnrolledInCourse}
          getAreaColor={getAreaColor}
          getStudentInitials={getStudentInitials}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  )
}

export default StudentsGrid