import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS
} from '../../../constants/courseManagementConstants.jsx'
import CourseActions from './CourseActions'

const CourseTableRow = ({
  course,
  index,
  getAreaColor,
  getLevelColor,
  formatPrice,
  formatDuration,
  onPreview,
  onEdit,
  onDelete
}) => {
  const rowClass = `${COURSE_MANAGEMENT_STYLES.tableRow} ${
    index % 2 === 0 ? COURSE_MANAGEMENT_STYLES.tableRowEven : ''
  }`

  return (
    <tr className={rowClass}>
      {/* Columna del curso */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCell}>
        <div className={COURSE_MANAGEMENT_STYLES.courseItem}>
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className={COURSE_MANAGEMENT_STYLES.courseThumbnail}
            />
          )}
          <div>
            <p className={COURSE_MANAGEMENT_STYLES.courseTitle}>
              {course.title}
            </p>
            {course.isNew && (
              <span className={COURSE_MANAGEMENT_STYLES.courseNewBadge}>
                {COURSE_MANAGEMENT_LABELS.badges.new}
              </span>
            )}
            {course.featured && (
              <span className={COURSE_MANAGEMENT_STYLES.courseFeaturedBadge}>
                {COURSE_MANAGEMENT_LABELS.badges.featured}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Instructor */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCell}>
        <p className={COURSE_MANAGEMENT_STYLES.courseInstructor}>
          {course.instructor}
        </p>
      </td>

      {/* Área */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCellCenter}>
        <span className={`${COURSE_MANAGEMENT_STYLES.areaTag} ${getAreaColor(course.area)}`}>
          {course.area}
        </span>
      </td>

      {/* Nivel */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCellCenter}>
        <span className={`${COURSE_MANAGEMENT_STYLES.levelTag} ${getLevelColor(course.level)}`}>
          {course.level}
        </span>
      </td>

      {/* Duración */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCellCenter}>
        <p className={COURSE_MANAGEMENT_STYLES.courseDuration}>
          {formatDuration(course.duration)}
        </p>
      </td>

      {/* Precio */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCellCenter}>
        <p className={COURSE_MANAGEMENT_STYLES.coursePrice}>
          {formatPrice(course.price)}
        </p>
      </td>

      {/* Acciones */}
      <td className={COURSE_MANAGEMENT_STYLES.tableCellCenter}>
        <CourseActions
          course={course}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  )
}

export default CourseTableRow