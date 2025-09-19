// ===================================
// STUDENT ENROLLMENT MANAGEMENT - MAIN COMPONENT
// ===================================

import React from 'react'
import { useStudentEnrollmentManagement } from '../../hooks/useStudentEnrollmentManagement'
import { ENROLLMENT_STYLES, MESSAGES } from '../../constants/studentEnrollmentManagementConstants'
import EnrollmentHeader from './EnrollmentHeader'
import EnrollmentStats from './EnrollmentStats'
import StudentsGrid from './StudentsGrid'
import EnrollmentModal from './EnrollmentModal'
import NotificationToast from './NotificationToast'

// ===================================
// COMPONENTE PRINCIPAL
// ===================================

const StudentEnrollmentManagement = ({ setActiveTab }) => {
  const {
    loading,
    notification,
    filteredStudents,
    stats,
    searchTerm,
    selectedArea,
    enrollmentModal,
    updateSearchTerm,
    updateSelectedArea,
    handleEnrollToggle,
    handleValidateCoupon,
    handleConfirmEnrollment,
    handleCancelEnrollment,
    setCouponCode,
    getStudentEnrollments,
    isStudentEnrolledInCourse,
    getAreaColor,
    getStudentInitials,
    formatPrice,
    getStudentById,
    getCourseById,
    allCourses
  } = useStudentEnrollmentManagement()

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className={ENROLLMENT_STYLES.MAIN_CONTAINER}>
      {/* Header con búsqueda y filtros */}
      <EnrollmentHeader
        searchTerm={searchTerm}
        selectedArea={selectedArea}
        onSearchChange={updateSearchTerm}
        onAreaChange={updateSelectedArea}
      />

      {/* Estadísticas */}
      <EnrollmentStats stats={stats} />

      {/* Grid de estudiantes */}
      <StudentsGrid
        students={filteredStudents}
        courses={allCourses}
        onEnrollToggle={handleEnrollToggle}
        getStudentEnrollments={getStudentEnrollments}
        isStudentEnrolledInCourse={isStudentEnrolledInCourse}
        getAreaColor={getAreaColor}
        getStudentInitials={getStudentInitials}
        formatPrice={formatPrice}
        searchTerm={searchTerm}
        selectedArea={selectedArea}
        setActiveTab={setActiveTab}
      />

      {/* Modal de inscripción */}
      {enrollmentModal.show && (
        <EnrollmentModal
          enrollmentModal={enrollmentModal}
          student={getStudentById(enrollmentModal.studentId)}
          course={getCourseById(enrollmentModal.courseId)}
          onValidateCoupon={handleValidateCoupon}
          onConfirmEnrollment={handleConfirmEnrollment}
          onCancel={handleCancelEnrollment}
          onCouponCodeChange={setCouponCode}
        />
      )}

      {/* Notificación */}
      {notification && (
        <NotificationToast notification={notification} />
      )}
    </div>
  )
}

export default StudentEnrollmentManagement