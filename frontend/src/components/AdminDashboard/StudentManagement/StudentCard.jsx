import {
  VIEW_MODES,
  STUDENT_STYLES,
  STUDENT_LABELS,
  STUDENT_ICONS,
  STUDENT_CONFIG,
  STUDENT_STATUS
} from '../../../constants/studentManagementConstants.jsx'

const StudentCard = ({
  student,
  viewMode,
  selectedCourseId,
  getStatusColor,
  getStatusLabel,
  onMarkCompleted,
  onStudentAction
}) => {
  const displayName = student.userName || student.name || student.userId || student.id

  return (
    <div className={STUDENT_STYLES.studentItem}>
      <div className={STUDENT_STYLES.studentContent}>
        <div className={STUDENT_STYLES.studentInfo}>
          {/* Student Header */}
          <div className={STUDENT_STYLES.studentHeader}>
            <h4 className={STUDENT_STYLES.studentName}>
              {displayName}
            </h4>
            <span className={`${STUDENT_STYLES.statusBadge} ${getStatusColor(student.status)}`}>
              {getStatusLabel(student)}
            </span>
          </div>

          {/* Student Details */}
          <div className={STUDENT_STYLES.studentDetails}>
            {/* Contact Information */}
            <div className={STUDENT_STYLES.studentContactInfo}>
              {student.email && (
                <span>
                  {STUDENT_LABELS.infoFields.email} {student.email || student.userEmail}
                </span>
              )}
              {student.dni && (
                <span>
                  {STUDENT_LABELS.infoFields.dni} {student.dni}
                </span>
              )}
              {student.phone && (
                <span>
                  {STUDENT_LABELS.infoFields.phone} {student.phone}
                </span>
              )}
            </div>

            {/* Course Information - Show based on view mode */}
            {viewMode === VIEW_MODES.ALL && student.enrolledCourses && (
              <div className={STUDENT_STYLES.studentCourses}>
                {student.enrolledCourses.slice(0, STUDENT_CONFIG.maxDisplayedCourses).map(course => (
                  <span key={course.id} className={STUDENT_STYLES.courseTag}>
                    {course.title}
                  </span>
                ))}
                {student.enrolledCourses.length > STUDENT_CONFIG.maxDisplayedCourses && (
                  <span className={STUDENT_STYLES.courseMore}>
                    +{student.enrolledCourses.length - STUDENT_CONFIG.maxDisplayedCourses} más
                  </span>
                )}
              </div>
            )}

            {/* Course-specific Information */}
            {viewMode === VIEW_MODES.COURSE && (
              <div className={STUDENT_STYLES.studentEnrollmentInfo}>
                <span>
                  {STUDENT_LABELS.infoFields.enrolled} {
                    student.enrolledAt
                      ? new Date(student.enrolledAt).toLocaleDateString('es-ES')
                      : 'N/A'
                  }
                </span>
                {student.completedAt && (
                  <span>
                    {STUDENT_LABELS.infoFields.completedAt} {
                      new Date(student.completedAt).toLocaleDateString('es-ES')
                    }
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={STUDENT_STYLES.actionButtons}>
          <div className={STUDENT_STYLES.actionButtonsGroup}>
            {viewMode === VIEW_MODES.ALL ? (
              // Actions for "All Students" view
              <>
                <button
                  onClick={() => onStudentAction('view', student)}
                  className={`${STUDENT_STYLES.actionButton} ${STUDENT_STYLES.viewButton}`}
                  title={STUDENT_LABELS.actions.viewDetails}
                >
                  {STUDENT_ICONS.view}
                </button>
                <button
                  onClick={() => onStudentAction('edit', student)}
                  className={`${STUDENT_STYLES.actionButton} ${STUDENT_STYLES.editButton}`}
                  title={STUDENT_LABELS.actions.edit}
                >
                  {STUDENT_ICONS.edit}
                </button>
                <button
                  onClick={() => onStudentAction('suspend', student)}
                  className={`${STUDENT_STYLES.actionButton} ${STUDENT_STYLES.suspendButton}`}
                  title={STUDENT_LABELS.actions.suspend}
                >
                  {STUDENT_ICONS.suspend}
                </button>
              </>
            ) : (
              // Actions for "By Course" view
              <>
                {student.status === STUDENT_STATUS.COMPLETED ? (
                  <div className={STUDENT_STYLES.completedIndicator}>
                    {STUDENT_ICONS.completed}
                    <span className={STUDENT_STYLES.completedText}>
                      {STUDENT_LABELS.actions.completed}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onMarkCompleted(student, selectedCourseId)}
                    className={STUDENT_STYLES.markCompleteButton}
                  >
                    {STUDENT_ICONS.markComplete}
                    <span>{STUDENT_LABELS.actions.markCompleted}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCard