import {
  SORT_OPTIONS,
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS
} from '../../../constants/courseEnrollmentManagementConstants'
import TableHeader from './TableHeader'
import CourseRow from './CourseRow'

const EnrollmentTable = ({
  filteredAndSortedCourses,
  sortBy,
  editingCourse,
  newEnrollmentValue,
  updating,
  handleSort,
  getSortIndicator,
  getAreaColor,
  getEnrollmentRateColor,
  formatNumber,
  startEditingEnrollment,
  saveEnrollmentEdit,
  cancelEnrollmentEdit,
  updateNewEnrollmentValue,
  handleQuickChange,
  canDecrease,
  canIncrease,
  canEdit,
  handleViewEnrolledStudents
}) => {
  return (
    <div className={ENROLLMENT_STYLES.tableContainer}>
      <table className={ENROLLMENT_STYLES.table}>
        <TableHeader
          sortBy={sortBy}
          onSort={handleSort}
          getSortIndicator={getSortIndicator}
        />
        <tbody>
          {filteredAndSortedCourses.map(course => (
            <CourseRow
              key={course.id}
              course={course}
              editingCourse={editingCourse}
              newEnrollmentValue={newEnrollmentValue}
              updating={updating}
              getAreaColor={getAreaColor}
              getEnrollmentRateColor={getEnrollmentRateColor}
              formatNumber={formatNumber}
              onStartEditing={startEditingEnrollment}
              onSaveEdit={saveEnrollmentEdit}
              onCancelEdit={cancelEnrollmentEdit}
              onUpdateValue={updateNewEnrollmentValue}
              onQuickChange={handleQuickChange}
              canDecrease={canDecrease}
              canIncrease={canIncrease}
              canEdit={canEdit}
              onViewStudents={handleViewEnrolledStudents}
            />
          ))}
        </tbody>
      </table>

      {filteredAndSortedCourses.length === 0 && (
        <div className={ENROLLMENT_STYLES.emptyState}>
          <p>{ENROLLMENT_LABELS.emptyStates.noCourses}</p>
        </div>
      )}
    </div>
  )
}

export default EnrollmentTable