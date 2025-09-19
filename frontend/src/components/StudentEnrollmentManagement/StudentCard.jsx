// ===================================
// STUDENT CARD COMPONENT
// ===================================

import React from 'react'
import { ENROLLMENT_STYLES } from '../../constants/studentEnrollmentManagementConstants'
import CourseGrid from './CourseGrid'

const StudentCard = ({
  student,
  courses,
  enrollments,
  onEnrollToggle,
  isStudentEnrolledInCourse,
  getAreaColor,
  getStudentInitials,
  formatPrice
}) => {
  return (
    <div className={ENROLLMENT_STYLES.STUDENT_CARD}>
      <div className={ENROLLMENT_STYLES.STUDENT_LAYOUT}>

        {/* Información del estudiante */}
        <div className={ENROLLMENT_STYLES.STUDENT_INFO_SECTION}>
          <div className={ENROLLMENT_STYLES.STUDENT_HEADER}>
            <div className={ENROLLMENT_STYLES.STUDENT_AVATAR}>
              <span className={ENROLLMENT_STYLES.STUDENT_AVATAR_TEXT}>
                {getStudentInitials(student.name)}
              </span>
            </div>
            <div>
              <h4 className={ENROLLMENT_STYLES.STUDENT_NAME}>{student.name}</h4>
              <p className={ENROLLMENT_STYLES.STUDENT_EMAIL}>{student.email}</p>
            </div>
          </div>

          <div className={ENROLLMENT_STYLES.STUDENT_DETAILS}>
            <div className={ENROLLMENT_STYLES.STUDENT_DETAIL_ROW}>
              <span className={ENROLLMENT_STYLES.STUDENT_DETAIL_LABEL}>Área:</span>
              <span className={`${getAreaColor(student.selectedArea)} text-white text-xs px-2 py-1 rounded-full`}>
                {student.selectedArea?.charAt(0).toUpperCase() + student.selectedArea?.slice(1)}
              </span>
            </div>
            {student.university && (
              <div className={ENROLLMENT_STYLES.STUDENT_DETAIL_ROW}>
                <span className={ENROLLMENT_STYLES.STUDENT_DETAIL_LABEL}>Universidad:</span>
                <span className={ENROLLMENT_STYLES.STUDENT_DETAIL_VALUE}>{student.university}</span>
              </div>
            )}
            <div className={ENROLLMENT_STYLES.STUDENT_DETAIL_ROW}>
              <span className={ENROLLMENT_STYLES.STUDENT_DETAIL_LABEL}>Inscripciones:</span>
              <span className={ENROLLMENT_STYLES.ENROLLMENT_COUNT}>{enrollments.length}</span>
            </div>
          </div>
        </div>

        {/* Grid de cursos */}
        <div className={ENROLLMENT_STYLES.STUDENT_COURSES_SECTION}>
          <h5 className="text-white font-medium mb-3">Cursos Disponibles</h5>
          <CourseGrid
            courses={courses.filter(course => course.area === student.selectedArea)}
            student={student}
            onEnrollToggle={onEnrollToggle}
            isStudentEnrolledInCourse={isStudentEnrolledInCourse}
            formatPrice={formatPrice}
          />
        </div>
      </div>
    </div>
  )
}

export default StudentCard