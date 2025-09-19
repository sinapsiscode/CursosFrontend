import {
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS,
  ENROLLMENT_CONFIG
} from '../../../constants/courseEnrollmentManagementConstants'

const StudentsTable = ({ students }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(ENROLLMENT_CONFIG.dateLocale)
  }

  const generateStudentInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, ENROLLMENT_CONFIG.maxInitials)
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return ENROLLMENT_STYLES.progressFillHigh
    if (progress >= 50) return ENROLLMENT_STYLES.progressFillMedium
    return ENROLLMENT_STYLES.progressFillLow
  }

  const getStatusStyle = (suspended) => {
    return suspended
      ? ENROLLMENT_STYLES.statusBadgeSuspended
      : ENROLLMENT_STYLES.statusBadgeActive
  }

  const getStatusLabel = (suspended) => {
    return suspended
      ? ENROLLMENT_LABELS.studentStatus.suspended
      : ENROLLMENT_LABELS.studentStatus.active
  }

  return (
    <div className={ENROLLMENT_STYLES.studentsTableContainer}>
      <table className={ENROLLMENT_STYLES.studentsTable}>
        <thead>
          <tr className={ENROLLMENT_STYLES.studentsTableHeader}>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCell}>
              {ENROLLMENT_LABELS.studentsTable.student}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.email}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.area}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.progress}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.enrollment}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.lastActivity}
            </th>
            <th className={ENROLLMENT_STYLES.studentsTableHeaderCellCenter}>
              {ENROLLMENT_LABELS.studentsTable.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className={ENROLLMENT_STYLES.studentsTableRow}>
              {/* Student Info */}
              <td className={ENROLLMENT_STYLES.studentsTableCell}>
                <div className={ENROLLMENT_STYLES.studentContainer}>
                  <div className={ENROLLMENT_STYLES.studentAvatar}>
                    <span className={ENROLLMENT_STYLES.studentAvatarText}>
                      {generateStudentInitials(student.name)}
                    </span>
                  </div>
                  <div>
                    <p className={ENROLLMENT_STYLES.studentName}>
                      {student.name}
                    </p>
                    <p className={ENROLLMENT_STYLES.studentPhone}>
                      {student.phone || ENROLLMENT_LABELS.common.notAvailable}
                    </p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className={ENROLLMENT_STYLES.studentsTableCellCenter}>
                <p className={ENROLLMENT_STYLES.studentEmail}>
                  {student.email}
                </p>
              </td>

              {/* Area */}
              <td className={ENROLLMENT_STYLES.studentsTableCellCenter}>
                <span className={ENROLLMENT_STYLES.areaBadge}>
                  {student.selectedArea?.charAt(0).toUpperCase() + student.selectedArea?.slice(1) || ENROLLMENT_LABELS.common.notAvailable}
                </span>
              </td>

              {/* Progress */}
              <td className={ENROLLMENT_STYLES.studentsTableCellCenter}>
                <div className={ENROLLMENT_STYLES.progressContainer}>
                  <div className={ENROLLMENT_STYLES.progressBar}>
                    <div
                      className={getProgressColor(student.progress)}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <span className={ENROLLMENT_STYLES.progressText}>
                    {student.progress}%
                  </span>
                </div>
              </td>

              {/* Enrollment Date */}
              <td className={`${ENROLLMENT_STYLES.studentsTableCellCenter} ${ENROLLMENT_STYLES.studentEmail}`}>
                {formatDate(student.enrollmentDate)}
              </td>

              {/* Last Activity */}
              <td className={`${ENROLLMENT_STYLES.studentsTableCellCenter} ${ENROLLMENT_STYLES.studentEmail}`}>
                {student.lastActivity ? formatDate(student.lastActivity) : ENROLLMENT_LABELS.common.notAvailable}
              </td>

              {/* Status */}
              <td className={ENROLLMENT_STYLES.studentsTableCellCenter}>
                <span className={getStatusStyle(student.suspended)}>
                  {getStatusLabel(student.suspended)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentsTable