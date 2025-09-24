import { LoadingSpinner } from '../../common'
import {
  VIEW_MODES,
  STUDENT_STYLES,
  STUDENT_LABELS,
  STUDENT_ICONS
} from '../../../constants/studentManagementConstants.jsx'
import StudentCard from './StudentCard'

const StudentsList = ({
  viewMode,
  selectedCourseId,
  filteredStudents,
  loading,
  searchTerm,
  getStatusColor,
  getStatusLabel,
  onMarkCompleted,
  onStudentAction
}) => {
  // Solo mostrar si estamos en modo "todos" o hay un curso seleccionado
  if (viewMode === VIEW_MODES.COURSE && !selectedCourseId) {
    return null
  }

  return (
    <div className={STUDENT_STYLES.studentsCard}>
      {loading ? (
        <div className={STUDENT_STYLES.loadingCenter}>
          <LoadingSpinner size="large" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className={STUDENT_STYLES.emptyState}>
          {STUDENT_ICONS.emptyUsers}
          <h3 className={STUDENT_STYLES.emptyStateTitle}>
            {searchTerm
              ? STUDENT_LABELS.emptyStates.noStudentsFound
              : STUDENT_LABELS.emptyStates.noStudentsInCourse
            }
          </h3>
          <p className={STUDENT_STYLES.emptyStateText}>
            {searchTerm
              ? STUDENT_LABELS.emptyStates.tryOtherTerms
              : STUDENT_LABELS.emptyStates.noCourseStudents
            }
          </p>
        </div>
      ) : (
        <div className={STUDENT_STYLES.studentsList}>
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id || `${student.userId}-${student.courseId}`}
              student={student}
              viewMode={viewMode}
              selectedCourseId={selectedCourseId}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              onMarkCompleted={onMarkCompleted}
              onStudentAction={onStudentAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentsList