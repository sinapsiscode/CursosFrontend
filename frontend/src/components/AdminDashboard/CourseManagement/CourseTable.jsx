import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS
} from '../../../constants/courseManagementConstants.jsx'
import CourseTableHeader from './CourseTableHeader'
import CourseTableRow from './CourseTableRow'

const CourseTable = ({
  courses,
  getAreaColor,
  getLevelColor,
  formatPrice,
  formatDuration,
  onPreview,
  onEdit,
  onDelete
}) => {
  if (courses.length === 0) {
    return (
      <div className={COURSE_MANAGEMENT_STYLES.emptyState}>
        <p>{COURSE_MANAGEMENT_LABELS.emptyState}</p>
      </div>
    )
  }

  return (
    <div className={COURSE_MANAGEMENT_STYLES.tableContainer}>
      <table className={COURSE_MANAGEMENT_STYLES.table}>
        <CourseTableHeader />
        <tbody>
          {courses.map((course, index) => (
            <CourseTableRow
              key={course.id}
              course={course}
              index={index}
              getAreaColor={getAreaColor}
              getLevelColor={getLevelColor}
              formatPrice={formatPrice}
              formatDuration={formatDuration}
              onPreview={onPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CourseTable