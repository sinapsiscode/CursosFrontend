import {
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS
} from '../../../constants/courseEnrollmentManagementConstants'

const CourseRow = ({
  course,
  editingCourse,
  newEnrollmentValue,
  updating,
  getAreaColor,
  getEnrollmentRateColor,
  formatNumber,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onUpdateValue,
  onQuickChange,
  canDecrease,
  canIncrease,
  canEdit,
  onViewStudents
}) => {
  const isEditing = editingCourse === course.id

  return (
    <tr className={ENROLLMENT_STYLES.tableRow}>
      {/* Course Info */}
      <td className={ENROLLMENT_STYLES.tableCell}>
        <div className={ENROLLMENT_STYLES.courseInfo}>
          <p className={ENROLLMENT_STYLES.courseTitle} title={course.title}>
            {course.title}
          </p>
          <p className={ENROLLMENT_STYLES.courseInstructor}>
            {course.instructor}
          </p>
        </div>
      </td>

      {/* Area */}
      <td className={ENROLLMENT_STYLES.tableCell}>
        <span className={`${ENROLLMENT_STYLES.areaLabel} ${getAreaColor(course.area)}`}>
          {course.area}
        </span>
      </td>

      {/* Enrolled Students */}
      <td className={ENROLLMENT_STYLES.tableCellCenter}>
        {isEditing ? (
          <div className={ENROLLMENT_STYLES.editingContainer}>
            <input
              type="number"
              value={newEnrollmentValue}
              onChange={(e) => onUpdateValue(e.target.value)}
              className={ENROLLMENT_STYLES.editingInput}
              min="0"
              disabled={updating}
            />
            <button
              onClick={onSaveEdit}
              className={ENROLLMENT_STYLES.editingButtonSave}
              title={ENROLLMENT_LABELS.tooltips.save}
              disabled={updating}
            >
              {ENROLLMENT_LABELS.actions.save}
            </button>
            <button
              onClick={onCancelEdit}
              className={ENROLLMENT_STYLES.editingButtonCancel}
              title={ENROLLMENT_LABELS.tooltips.cancel}
              disabled={updating}
            >
              {ENROLLMENT_LABELS.actions.cancel}
            </button>
          </div>
        ) : (
          <span className={ENROLLMENT_STYLES.enrollmentValue}>
            {formatNumber(course.enrolledStudents)}
          </span>
        )}
      </td>

      {/* Views */}
      <td className={ENROLLMENT_STYLES.tableCellCenter}>
        <span className={ENROLLMENT_STYLES.viewsValue}>
          {formatNumber(course.views)}
        </span>
      </td>

      {/* Enrollment Rate */}
      <td className={ENROLLMENT_STYLES.tableCellCenter}>
        <span className={`font-bold ${getEnrollmentRateColor(course.enrollmentData?.enrollmentRate || 0)}`}>
          {course.enrollmentData?.enrollmentRate || 0}%
        </span>
      </td>

      {/* Real Students */}
      <td className={ENROLLMENT_STYLES.tableCellCenter}>
        <span className={ENROLLMENT_STYLES.studentsValue}>
          {formatNumber(course.students)}
        </span>
      </td>

      {/* Actions */}
      <td className={ENROLLMENT_STYLES.tableCellCenter}>
        <div className={ENROLLMENT_STYLES.actionButtonsContainer}>
          <button
            onClick={() => onQuickChange(course.id, false)}
            className={ENROLLMENT_STYLES.actionButtonDecrease}
            title={ENROLLMENT_LABELS.tooltips.decrease}
            disabled={!canDecrease(course) || updating}
          >
            {ENROLLMENT_LABELS.actions.decrease}
          </button>
          <button
            onClick={() => onStartEditing(course)}
            className={ENROLLMENT_STYLES.actionButtonEdit}
            title={ENROLLMENT_LABELS.tooltips.edit}
            disabled={!canEdit(course) || updating}
          >
            {ENROLLMENT_LABELS.actions.edit}
          </button>
          <button
            onClick={() => onQuickChange(course.id, true)}
            className={ENROLLMENT_STYLES.actionButtonIncrease}
            title={ENROLLMENT_LABELS.tooltips.increase}
            disabled={!canIncrease(course) || updating}
          >
            {ENROLLMENT_LABELS.actions.increase}
          </button>
          <button
            onClick={() => onViewStudents(course)}
            className={ENROLLMENT_STYLES.actionButtonView}
            title={ENROLLMENT_LABELS.tooltips.view}
            disabled={updating}
          >
            {ENROLLMENT_LABELS.actions.view}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CourseRow