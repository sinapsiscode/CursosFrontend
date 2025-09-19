import { LoadingSpinner } from '../../common'
import {
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS,
  ENROLLMENT_ICONS
} from '../../../constants/courseEnrollmentManagementConstants'
import StudentsTable from './StudentsTable'

const StudentsModal = ({
  selectedCourseForStudents,
  enrolledStudents,
  loading,
  closeStudentsModal
}) => {
  if (!selectedCourseForStudents) return null

  return (
    <div className={ENROLLMENT_STYLES.modalOverlay}>
      <div className={ENROLLMENT_STYLES.modalContainer}>
        <div className={ENROLLMENT_STYLES.modalHeader}>
          <div>
            <h3 className={ENROLLMENT_STYLES.modalTitle}>
              {ENROLLMENT_LABELS.modal.studentsTitle}
            </h3>
            <p className={ENROLLMENT_STYLES.modalSubtitle}>
              {selectedCourseForStudents.title} • {enrolledStudents.length} {ENROLLMENT_LABELS.modal.studentsCount}
            </p>
          </div>
          <button
            onClick={closeStudentsModal}
            className={ENROLLMENT_STYLES.modalCloseButton}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox={ENROLLMENT_ICONS.closeIcon.viewBox}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ENROLLMENT_ICONS.closeIcon.path} />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : enrolledStudents.length > 0 ? (
          <StudentsTable students={enrolledStudents} />
        ) : (
          <div className={ENROLLMENT_STYLES.emptyStudentsContainer}>
            <div className={ENROLLMENT_STYLES.emptyStudentsIcon}>
              <svg className={ENROLLMENT_STYLES.emptyStudentsIconSvg} fill="none" stroke="currentColor" viewBox={ENROLLMENT_ICONS.usersIcon.viewBox}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ENROLLMENT_ICONS.usersIcon.path} />
              </svg>
            </div>
            <p className={ENROLLMENT_STYLES.emptyStudentsTitle}>
              {ENROLLMENT_LABELS.emptyStates.noStudents}
            </p>
            <p className={ENROLLMENT_STYLES.emptyStudentsSubtitle}>
              {ENROLLMENT_LABELS.emptyStates.noStudentsDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentsModal